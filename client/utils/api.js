import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://course-hub-pfrb.vercel.app/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't automatically redirect on 401 errors to prevent redirect loops
    // Let individual components handle authentication errors
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

export default api;
