const Order = require('../models/Order');
const User = require('../models/User');
const Course = require('../models/Course');
const nodemailer = require('nodemailer');

// Create order from cart
const createOrder = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { paymentMethod, billingAddress, cartItems } = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use cartItems from frontend if provided, otherwise fall back to user's database cart
    let orderCourses = [];
    let totalAmount = 0;

    if (cartItems && cartItems.length > 0) {
      // Use frontend cart data
      orderCourses = cartItems.map(item => ({
        course: item.courseId._id,
        price: item.courseId.price
      }));
      totalAmount = cartItems.reduce((sum, item) => sum + item.courseId.price, 0);
    } else {
      // Fall back to user's database cart
      const userWithCart = await User.findById(userId).populate('cart.courseId');
      if (userWithCart.cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      
      orderCourses = userWithCart.cart.map(item => ({
        course: item.courseId._id,
        price: item.courseId.price
      }));
      totalAmount = userWithCart.cart.reduce((sum, item) => sum + item.courseId.price, 0);
    }

    // Create order
    const order = new Order({
      user: userId,
      courses: orderCourses,
      paymentMethod,
      billingAddress,
      totalAmount
    });

    await order.save();

    // Clear user's database cart after successful order creation
    user.cart = [];
    await user.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      userId: req.session.userId,
      requestBody: req.body
    });
    res.status(500).json({ 
      message: 'Server error while creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Process payment (mock implementation)
const processPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentIntentId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }

    // Mock payment processing
    order.paymentStatus = 'completed';
    order.status = 'completed';
    order.paymentIntentId = paymentIntentId;

    // Add courses to user's purchased courses
    const user = await User.findById(req.session.userId);
    order.courses.forEach(courseItem => {
      user.purchasedCourses.push({
        courseId: courseItem.course,
        purchasedAt: new Date()
      });
    });

    await user.save();
    await order.save();

    // Send confirmation email
    await sendOrderConfirmationEmail(user.email, order);

    res.json({
      message: 'Payment processed successfully',
      order
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ message: 'Server error while processing payment' });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.userId })
      .populate('courses.course', 'title thumbnail instructor')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('courses.course', 'title thumbnail instructor duration')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (order.user._id.toString() !== req.session.userId && req.session.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('courses.course', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (email, order) => {
  try {
    // Configure email transporter (you'll need to set up your email credentials)
    const transporter = nodemailer.createTransporter({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Order Confirmation - Course Purchase',
      html: `
        <h1>Thank you for your purchase!</h1>
        <p>Your order #${order._id} has been confirmed.</p>
        <p>Total Amount: $${order.totalAmount}</p>
        <p>You can now access your purchased courses in your account.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    
    // Mark email as sent
    order.emailSent = true;
    await order.save();
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

module.exports = {
  createOrder,
  processPayment,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
