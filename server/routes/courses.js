const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { validateCourse, validateReview } = require('../middleware/validation');

// Public routes
router.get('/', courseController.getCourses);
router.get('/categories', courseController.getCategories);
router.get('/levels', courseController.getLevels);
router.get('/:id', courseController.getCourseById);

// Protected routes
router.post('/:id/reviews', isAuthenticated, validateReview, courseController.addReview);

// Admin routes
router.post('/', isAdmin, validateCourse, courseController.createCourse);
router.put('/:id', isAdmin, validateCourse, courseController.updateCourse);
router.delete('/:id', isAdmin, courseController.deleteCourse);

module.exports = router;
