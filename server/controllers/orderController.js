const Order = require('../models/Order');
const User = require('../models/User');
const Course = require('../models/Course');

// Create new order
const createOrder = async (req, res) => {
  try {
    const { courseIds, paymentMethod } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ message: 'Course IDs are required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if courses exist and are published
    const courses = await Course.find({ 
      _id: { $in: courseIds },
      isPublished: true 
    });

    if (courses.length !== courseIds.length) {
      return res.status(400).json({ message: 'Some courses are not available' });
    }

    // Check if user already owns any of these courses
    const existingPurchases = user.purchasedCourses.filter(item => 
      courseIds.includes(item.courseId.toString())
    );

    if (existingPurchases.length > 0) {
      return res.status(400).json({ 
        message: 'You already own some of these courses',
        existingCourses: existingPurchases.map(item => item.courseId)
      });
    }

    // Create order with proper course structure
    const order = new Order({
      user: userId,
      courses: courses.map(course => ({
        course: course._id,
        price: course.price
      })),
      totalAmount: courses.reduce((sum, course) => sum + course.price, 0),
      paymentMethod,
      status: 'processing'
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('courses.courseId', 'title price thumbnail instructor');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user can access this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orders = await Order.find({ user: req.user.id })
      .populate('courses.courseId', 'title price thumbnail instructor')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('courses.courseId', 'title price thumbnail instructor')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
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
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is admin or order owner
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};
