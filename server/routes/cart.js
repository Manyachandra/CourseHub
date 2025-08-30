const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middleware/auth');

// All cart routes require authentication
router.use(isAuthenticated);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.delete('/remove/:courseId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);
router.get('/total', cartController.getCartTotal);

module.exports = router;
