const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { isAuthenticated } = require('../middleware/auth');

// Most payment routes require authentication
// router.use(isAuthenticated);

// Test endpoint that doesn't require authentication
router.get('/test-public', (req, res) => {
  res.json({ message: 'Payment system is working!', timestamp: new Date() });
});

// All other payment routes require authentication
router.use(isAuthenticated);

// Process payment for an order
router.post('/process', paymentController.processPayment);

// Get payment status for an order
router.get('/status/:orderId', paymentController.getPaymentStatus);

// Refund payment
router.post('/refund/:orderId', paymentController.refundPayment);

// Get available payment methods
router.get('/methods', paymentController.getPaymentMethods);

// Test payment endpoint (for development/testing)
router.post('/test', paymentController.testPayment);

module.exports = router;
