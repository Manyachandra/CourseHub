import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from './api';

// User store
export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      
      // Login method that handles the entire login flow
      login: async (credentials) => {
        try {
          set({ isLoading: true });
          const response = await authAPI.login(credentials);
          if (response.data.user && response.data.token) {
            // Store user with token
            const userWithToken = { ...response.data.user, token: response.data.token };
            set({ user: userWithToken });
            return { success: true, user: userWithToken };
          }
          return { success: false, message: 'Login failed' };
        } catch (error) {
          console.error('Login error:', error);
          return { success: false, message: error.response?.data?.message || 'Login failed' };
        } finally {
          set({ isLoading: false });
        }
      },
      
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ user: null });
          // Clear localStorage manually to ensure cleanup
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user-storage');
          }
        }
      },
      
      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
      
      // Function to check authentication status with backend
      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const response = await authAPI.getCurrentUser();
          if (response.data.user) {
            // Preserve the token when updating user data
            const currentUser = get().user;
            const userWithToken = { ...response.data.user, token: currentUser?.token };
            set({ user: userWithToken });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Auth check error:', error);
          set({ user: null });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Function to check authentication status
      isAuthenticated: () => !!get().user,
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Cart store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      isLoading: false,
      
      setItems: (items) => set({ items }),
      setTotal: (total) => set({ total }),
      setLoading: (isLoading) => set({ isLoading }),
      
      // Sync cart with backend
      syncCart: async () => {
        try {
          set({ isLoading: true });
          // Get JWT token from localStorage
          const userStorage = localStorage.getItem('user-storage');
          if (!userStorage) {
            set({ items: [], isLoading: false });
            return;
          }
          
          const { state } = JSON.parse(userStorage);
          const token = state?.user?.token;
          
          if (!token) {
            set({ items: [], isLoading: false });
            return;
          }
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/cart`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            set({ items: data.cart || [] });
          } else if (response.status === 401) {
            // Token expired or invalid, clear cart
            set({ items: [] });
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
          set({ items: [] });
        } finally {
          set({ isLoading: false });
        }
      },
      
      addItem: async (course) => {
        try {
          // Get JWT token from localStorage
          const userStorage = localStorage.getItem('user-storage');
          if (!userStorage) {
            throw new Error('User not logged in');
          }
          
          const { state } = JSON.parse(userStorage);
          const token = state?.user?.token;
          
          if (!token) {
            throw new Error('Authentication token not found');
          }
          
          // Check if course is already purchased
          const userPurchasedCourses = state?.user?.purchasedCourses || [];
          console.log('=== CART ADD DEBUG ===');
          console.log('Course ID:', course._id);
          console.log('User purchased courses:', userPurchasedCourses);
          console.log('Checking purchase status...');
          
          const isAlreadyPurchased = userPurchasedCourses.some(item => {
            const matches = item.courseId === course._id || item.courseId._id === course._id;
            console.log('Item:', item, 'Matches:', matches);
            return matches;
          });
          
          console.log('Is already purchased:', isAlreadyPurchased);
          console.log('========================');
          
          if (isAlreadyPurchased) {
            throw new Error('Course already purchased');
          }
          
          // Add to backend first
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/cart/add`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId: course._id }),
          });
          
          if (response.ok) {
            // Then update local store
            const { items } = get();
            const existingItem = items.find(item => item.courseId._id === course._id);
            
            if (!existingItem) {
              set({ items: [...items, { courseId: course, addedAt: new Date(), quantity: 1 }] });
            }
          } else {
            throw new Error(`Failed to add to cart: ${response.status}`);
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
          throw error; // Re-throw to let component handle it
        }
      },
      
      removeItem: async (courseId) => {
        try {
          // Get JWT token from localStorage
          const userStorage = localStorage.getItem('user-storage');
          if (!userStorage) return;
          
          const { state } = JSON.parse(userStorage);
          const token = state?.user?.token;
          
          if (!token) return;
          
          // Remove from backend first
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/cart/remove/${courseId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            // Then update local store
            const { items } = get();
            set({ items: items.filter(item => item.courseId._id !== courseId) });
          }
        } catch (error) {
          console.error('Error removing from cart:', error);
        }
      },
      
      updateQuantity: async (courseId, quantity) => {
        try {
          // Update quantity in backend (if backend supports it)
          // For now, just update local store
          const { items } = get();
          set({ 
            items: items.map(item => 
              item.courseId._id === courseId 
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
            )
          });
        } catch (error) {
          console.error('Error updating quantity:', error);
        }
      },
      
      clearCart: async () => {
        try {
          // Get JWT token from localStorage
          const userStorage = localStorage.getItem('user-storage');
          if (!userStorage) return;
          
          const { state } = JSON.parse(userStorage);
          const token = state?.user?.token;
          
          if (!token) return;
          
          // Clear from backend first
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/cart/clear`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            // Then clear local store
            set({ items: [], total: 0 });
          }
        } catch (error) {
          console.error('Error clearing cart:', error);
        }
      },
      
      updateTotal: (total) => set({ total }),
      
      // Check if course is already in cart
      isInCart: (courseId) => {
        const { items } = get();
        return items.some(item => item.courseId._id === courseId);
      },
      
      // Remove course from cart after purchase
      removeAfterPurchase: (courseId) => {
        const { items } = get();
        set({ items: items.filter(item => item.courseId._id !== courseId) });
      },
      
      // Check if course is already purchased (to be called from other components)
      isCoursePurchased: (courseId, userPurchasedCourses) => {
        if (!userPurchasedCourses) return false;
        return userPurchasedCourses.some(item => item.courseId === courseId);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items, total: state.total }),
    }
  )
);

// Courses store
export const useCoursesStore = create((set, get) => ({
  courses: [],
  filteredCourses: [],
  categories: [],
  levels: [],
  filters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    level: '',
    sortBy: 'newest',
    search: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    hasNext: false,
    hasPrev: false,
  },
  isLoading: false,
  selectedCourse: null,
  
  setCourses: (courses) => set({ courses, filteredCourses: courses }),
  setCategories: (categories) => set({ categories }),
  setLevels: (levels) => set({ levels }),
  setLoading: (isLoading) => set({ isLoading }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  
  setFilters: (newFilters) => {
    const { filters } = get();
    const updatedFilters = { ...filters, ...newFilters };
    set({ filters: updatedFilters });
  },
  
  setPagination: (pagination) => set({ pagination }),
  
  resetFilters: () => {
    set({
      filters: {
        category: '',
        minPrice: '',
        maxPrice: '',
        minRating: '',
        level: '',
        sortBy: 'newest',
        search: '',
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCourses: 0,
        hasNext: false,
        hasPrev: false,
      },
    });
  },
}));

// UI store
export const useUIStore = create((set) => ({
  sidebarOpen: false,
  modalOpen: false,
  modalType: null,
  modalData: null,
  
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  
  openModal: (type, data = null) => set({ modalOpen: true, modalType: type, modalData: data }),
  closeModal: () => set({ modalOpen: false, modalType: null, modalData: null }),
}));

// Theme store
export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // 'light' or 'dark'
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        
        // Apply theme to document
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
      },
      
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
      
      isDark: () => get().theme === 'dark',
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
