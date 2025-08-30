const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// User routes (require authentication)
router.use(isAuthenticated);

router.post('/', orderController.createOrder);
router.post('/:orderId/payment', orderController.processPayment);
router.get('/my-orders', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);

// Admin routes
router.get('/', isAdmin, orderController.getAllOrders);
router.put('/:id/status', isAdmin, orderController.updateOrderStatus);

module.exports = router;
