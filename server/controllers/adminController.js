const User = require('../models/User');
const Course = require('../models/Course');
const Order = require('../models/Order');

// Get admin dashboard statistics
exports.getStats = async (req, res) => {
  try {
    // Get total courses
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const draftCourses = await Course.countDocuments({ isPublished: false });
    
    // Get total users (excluding admins)
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    // Get total orders
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    
    // Calculate total revenue from completed orders
    const revenueData = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOrders = await Order.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({
      totalCourses,
      publishedCourses,
      draftCourses,
      totalUsers,
      adminUsers,
      totalOrders,
      completedOrders,
      processingOrders,
      totalRevenue,
      recentOrders,
      recentUsers
    });
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ message: 'Error fetching admin statistics' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .populate('purchasedCourses', 'title')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate('instructor', 'name bio avatar')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error('Error getting all courses:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('courses.course', 'title price instructor')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value. Must be processing, completed, or cancelled' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      price,
      category,
      instructor,
      duration,
      level,
      thumbnail,
      language,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !description || !shortDescription || !price || !category || !instructor || !instructor.name) {
      return res.status(400).json({ message: 'All required fields must be provided including instructor name' });
    }

    // Set default values for optional fields
    const courseData = {
      title,
      description,
      shortDescription,
      price: parseFloat(price),
      category,
      instructor: {
        name: instructor.name,
        bio: instructor.bio || '',
        avatar: instructor.avatar || ''
      },
      duration: duration || '',
      level: level || 'Beginner',
      thumbnail: thumbnail || '',
      language: language || 'English',
      tags: tags || [],
      isPublished: false, // Default to draft
      rating: { average: 0, count: 0 },
      reviews: [],
      enrollmentCount: 0,
      featured: false,
      createdAt: new Date()
    };

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({ 
      message: 'Course created successfully', 
      course 
    });
  } catch (error) {
    console.error('Error creating course:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Error creating course' });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;

    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ 
      message: 'Course updated successfully', 
      course 
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Error updating course' });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Remove course from users' purchased courses
    await User.updateMany(
      { purchasedCourses: courseId },
      { $pull: { purchasedCourses: courseId } }
    );

    // Remove course from orders
    await Order.updateMany(
      { courses: courseId },
      { $pull: { courses: courseId } }
    );

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
};

// Toggle course publish status
exports.toggleCourseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.json({ 
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      course 
    });
  } catch (error) {
    console.error('Error toggling course status:', error);
    res.status(500).json({ message: 'Error updating course status' });
  }
};
