import axios from 'axios';

// Use environment variable for API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Debug logging
console.log('=== API CONFIGURATION DEBUG ===');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('NEXT_PUBLIC_API_URL env var:', process.env.NEXT_PUBLIC_API_URL);
console.log('Current window location:', typeof window !== 'undefined' ? window.location.href : 'Server side');
console.log('================================');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to log all API calls
api.interceptors.request.use(
  (config) => {
    console.log('=== API REQUEST ===');
    console.log('Method:', config.method?.toUpperCase());
    console.log('URL:', config.baseURL + config.url);
    console.log('With credentials:', config.withCredentials);
    console.log('Headers:', config.headers);
    console.log('==================');
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors specifically
    if (error.response?.status === 401) {
      console.error('Authentication failed:', error.response.data);
      // Clear any stored user data on authentication failure
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user-storage');
        // Don't redirect automatically to prevent loops
        // Let components handle this based on their needs
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.get('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  getPurchasedCourses: () => api.get('/auth/purchased-courses'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Courses API
export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  getCategories: () => api.get('/courses/categories'),
  getLevels: () => api.get('/courses/levels'),
  create: (courseData) => api.post('/courses', courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: (id) => api.delete(`/courses/${id}`),
  addReview: (id, reviewData) => api.post(`/courses/${id}/reviews`, reviewData),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (courseId) => api.post('/cart/add', { courseId }),
  remove: (courseId) => api.delete(`/cart/remove/${courseId}`),
  clear: () => api.delete('/cart/clear'),
  getTotal: () => api.get('/cart/total'),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  processPayment: (orderId, paymentData) => api.post(`/orders/${orderId}/payment`, paymentData),
  getUserOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Payment API
export const paymentAPI = {
  process: (paymentData) => api.post('/payments/process', paymentData),
  getStatus: (paymentId) => api.get(`/payments/status/${paymentId}`),
  refund: (paymentId, refundData) => api.post(`/payments/${paymentId}/refund`, refundData),
  getMethods: () => api.get('/payments/methods'),
  test: () => api.get('/payments/test'),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllCourses: () => api.get('/admin/courses'),
  getAllUsers: () => api.get('/admin/users'),
  getAllOrders: () => api.get('/admin/orders'),
  createCourse: (courseData) => api.post('/admin/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/admin/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}`),
  toggleCourseStatus: (id, status) => api.patch(`/admin/courses/${id}/toggle-status`, { status }),
  updateOrderStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
  bulkPublishCourses: (courseIds) => api.patch('/admin/courses/bulk-publish', { courseIds }),
  bulkDeleteCourses: (courseIds) => api.delete('/admin/courses/bulk-delete', { courseIds }),
};

export default api;
