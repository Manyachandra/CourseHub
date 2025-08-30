import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User store
export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
      
      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
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
      
      addItem: (course) => {
        const { items } = get();
        const existingItem = items.find(item => item.courseId._id === course._id);
        
        if (!existingItem) {
          set({ items: [...items, { courseId: course, addedAt: new Date() }] });
        }
      },
      
      removeItem: (courseId) => {
        const { items } = get();
        set({ items: items.filter(item => item.courseId._id !== courseId) });
      },
      
      clearCart: () => set({ items: [], total: 0 }),
      
      updateTotal: (total) => set({ total }),
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
