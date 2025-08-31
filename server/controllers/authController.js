const User = require('../models/User');

// User registration
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Set session
    req.session.userId = user._id;
    req.session.userRole = user.role;
    req.session.userName = user.name;

    // Force session save
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Session creation failed' });
      }
      
      console.log('Session created successfully:', {
        sessionID: req.sessionID,
        userId: req.session.userId,
        userRole: req.session.userRole
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = user._id;
    req.session.userRole = user.role;
    req.session.userName = user.name;
    
    // Force session save
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: 'Session creation failed' });
      }
      
      console.log('Session created successfully:', {
        sessionID: req.sessionID,
        userId: req.session.userId,
        userRole: req.session.userRole
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// User logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error during logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's purchased courses
const getPurchasedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
      .populate('purchasedCourses.courseId', 'title description thumbnail instructor category level duration price rating')
      .select('purchasedCourses');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      purchasedCourses: user.purchasedCourses || []
    });
  } catch (error) {
    console.error('Get purchased courses error:', error);
    res.status(500).json({ message: 'Server error while fetching purchased courses' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  getPurchasedCourses,
  updateProfile
};
