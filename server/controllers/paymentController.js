const Order = require('../models/Order');
const Course = require('../models/Course');
const User = require('../models/User');

// Mock payment processor for testing
class MockPaymentProcessor {
  constructor() {
    this.paymentMethods = ['card', 'paypal', 'bank_transfer'];
    this.cardTypes = ['visa', 'mastercard', 'amex', 'discover'];
    this.statuses = ['pending', 'processing', 'completed', 'failed', 'refunded'];
  }

  // Generate mock payment data
  generateMockPaymentData() {
    return {
      paymentId: `pay_${Math.random().toString(36).substr(2, 9)}`,
      transactionId: `txn_${Math.random().toString(36).substr(2, 12)}`,
      amount: Math.floor(Math.random() * 1000) + 10,
      currency: 'USD',
      paymentMethod: this.paymentMethods[Math.floor(Math.random() * this.paymentMethods.length)],
      cardType: this.cardTypes[Math.floor(Math.random() * this.cardTypes.length)],
      last4: Math.floor(Math.random() * 9000) + 1000,
      status: this.statuses[Math.floor(Math.random() * this.statuses.length)],
      createdAt: new Date(),
      processedAt: new Date()
    };
  }

  // Process payment (mock)
  async processPayment(paymentData) {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // 95% success rate for testing
    const isSuccess = Math.random() > 0.05;
    
    if (isSuccess) {
      return {
        success: true,
        paymentId: paymentData.paymentId,
        transactionId: paymentData.transactionId,
        status: 'completed',
        message: 'Payment processed successfully',
        processedAt: new Date()
      };
    } else {
      return {
        success: false,
        error: 'Payment failed - insufficient funds',
        status: 'failed',
        processedAt: new Date()
      };
    }
  }

  // Refund payment (mock)
  async refundPayment(paymentId, amount) {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    return {
      success: true,
      refundId: `ref_${Math.random().toString(36).substr(2, 9)}`,
      paymentId,
      amount,
      status: 'refunded',
      processedAt: new Date()
    };
  }
}

const mockPaymentProcessor = new MockPaymentProcessor();

// Process payment for an order
exports.processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, paymentDetails } = req.body;
    
    // Validate order exists
    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('courses.course', 'title price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate payment method
    if (!['card', 'paypal', 'bank_transfer'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Generate mock payment data
    const paymentData = {
      ...mockPaymentProcessor.generateMockPaymentData(),
      orderId,
      amount: order.totalAmount,
      paymentMethod,
      ...paymentDetails
    };

    // Process payment
    const paymentResult = await mockPaymentProcessor.processPayment(paymentData);

    if (paymentResult.success) {
      // Update order with payment info
      order.paymentStatus = 'completed';
      order.paymentMethod = paymentMethod;
      order.paymentDetails = {
        paymentId: paymentResult.paymentId,
        transactionId: paymentResult.transactionId,
        processedAt: paymentResult.processedAt,
        method: paymentMethod
      };
      order.status = 'completed';
      
      await order.save();

      // Add courses to user's purchased courses
      const user = await User.findById(order.user._id);
      for (const courseItem of order.courses) {
        if (!user.purchasedCourses.some(pc => pc.courseId.toString() === courseItem.course._id.toString())) {
          user.purchasedCourses.push({
            courseId: courseItem.course._id,
            purchasedAt: new Date()
          });
        }
      }
      await user.save();

      res.json({
        success: true,
        message: 'Payment processed successfully',
        order: order,
        payment: paymentResult
      });
    } else {
      // Update order with failed payment
      order.paymentStatus = 'failed';
      order.paymentDetails = {
        error: paymentResult.error,
        processedAt: paymentResult.processedAt,
        method: paymentMethod
      };
      await order.save();

      res.status(400).json({
        success: false,
        message: 'Payment failed',
        error: paymentResult.error
      });
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Payment processing failed', error: error.message });
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('courses.course', 'title price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      orderId: order._id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentDetails: order.paymentDetails,
      createdAt: order.createdAt
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Failed to get payment status' });
  }
};

// Refund payment
exports.refundPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amount, reason } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Order payment not completed' });
    }

    const refundAmount = amount || order.totalAmount;
    
    if (refundAmount > order.totalAmount) {
      return res.status(400).json({ message: 'Refund amount cannot exceed order total' });
    }

    // Process refund
    const refundResult = await mockPaymentProcessor.refundPayment(
      order.paymentDetails.paymentId,
      refundAmount
    );

    if (refundResult.success) {
      // Update order
      order.paymentStatus = 'refunded';
      order.refundDetails = {
        refundId: refundResult.refundId,
        amount: refundAmount,
        reason: reason || 'Customer request',
        processedAt: refundResult.processedAt
      };
      await order.save();

      res.json({
        success: true,
        message: 'Refund processed successfully',
        refund: refundResult,
        order: order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Refund failed'
      });
    }

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Refund processing failed' });
  }
};

// Get payment methods
exports.getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Pay with Visa, Mastercard, American Express, or Discover',
        icon: '💳',
        supportedCards: ['visa', 'mastercard', 'amex', 'discover']
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        icon: '🔵',
        supportedCards: []
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct bank transfer (2-3 business days)',
        icon: '🏦',
        supportedCards: []
      }
    ];

    res.json({ paymentMethods });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Failed to get payment methods' });
  }
};

// Test payment endpoint
exports.testPayment = async (req, res) => {
  try {
    const testData = {
      amount: 99.99,
      currency: 'USD',
      paymentMethod: 'card',
      testMode: true
    };

    const paymentResult = await mockPaymentProcessor.processPayment(testData);

    res.json({
      message: 'Test payment processed',
      testData,
      result: paymentResult,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Test payment error:', error);
    res.status(500).json({ message: 'Test payment failed' });
  }
};
