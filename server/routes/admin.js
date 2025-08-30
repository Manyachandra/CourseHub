const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(isAuthenticated, isAdmin);

// Get admin dashboard statistics
router.get('/stats', adminController.getStats);

// Get all users
router.get('/users', adminController.getAllUsers);

// Get all orders
router.get('/orders', adminController.getAllOrders);

// Get all courses
router.get('/courses', adminController.getAllCourses);

// Update order status
router.patch('/orders/:orderId/status', adminController.updateOrderStatus);

// Create new course
router.post('/courses', adminController.createCourse);

// Update course
router.put('/courses/:courseId', adminController.updateCourse);

// Delete course
router.delete('/courses/:courseId', adminController.deleteCourse);

// Toggle course publish status
router.patch('/courses/:courseId/toggle-status', adminController.toggleCourseStatus);

module.exports = router;
