const User = require('../models/User');
const Course = require('../models/Course');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('cart.courseId', 'title price thumbnail instructor duration');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ cart: user.cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
};

// Add course to cart
const addToCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.isPublished) {
      return res.status(400).json({ message: 'Course is not available for purchase' });
    }

    // Check if user already has this course in cart
    const user = await User.findById(userId);
    const existingCartItem = user.cart.find(item => 
      item.courseId.toString() === courseId
    );

    if (existingCartItem) {
      return res.status(400).json({ message: 'Course already in cart' });
    }

    // Check if user already purchased this course
    const existingPurchase = user.purchasedCourses.find(item => 
      item.courseId.toString() === courseId
    );

    if (existingPurchase) {
      return res.status(400).json({ message: 'You already own this course' });
    }

    // Add to cart
    user.cart.push({ courseId });
    await user.save();

    // Populate course details for response
    await user.populate('cart.courseId', 'title price thumbnail instructor duration');

    res.json({
      message: 'Course added to cart successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error while adding to cart' });
  }
};

// Remove course from cart
const removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove course from cart
    user.cart = user.cart.filter(item => 
      item.courseId.toString() !== courseId
    );

    await user.save();

    res.json({
      message: 'Course removed from cart successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error while removing from cart' });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = [];
    await user.save();

    res.json({
      message: 'Cart cleared successfully',
      cart: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error while clearing cart' });
  }
};

// Get cart total
const getCartTotal = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('cart.courseId', 'price');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const total = user.cart.reduce((sum, item) => sum + item.courseId.price, 0);

    res.json({ total });
  } catch (error) {
    console.error('Get cart total error:', error);
    res.status(500).json({ message: 'Server error while calculating cart total' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  getCartTotal
};
