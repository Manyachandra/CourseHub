const Course = require('../models/Course');

// Get all courses with filtering and sorting
const getCourses = async (req, res) => {
  try {
    console.log('🔍 getCourses called with query:', req.query);
    
    // Check if database is connected
    if (!req.dbConnected) {
      console.log('❌ Database not connected');
      return res.status(503).json({ 
        message: 'Database connection unavailable',
        error: 'Service temporarily unavailable. Please try again later.'
      });
    }
    
    console.log('✅ Database is connected, proceeding with query');
    
    const {
      category,
      minPrice,
      maxPrice,
      minRating,
      level,
      sortBy,
      search,
      page = 1,
      limit = 12
    } = req.query;

    // Build filter object - temporarily remove isPublished filter for debugging
    const filter = {}; // Removed isPublished: true temporarily
    console.log('🔍 Initial filter:', filter);
    
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (minRating) filter['rating.average'] = { $gte: parseFloat(minRating) };
    
    // Text search
    if (search) {
      filter.$text = { $search: search };
    }
    
    console.log('🔍 Final filter:', filter);

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'rating':
        sort = { 'rating.average': -1 };
        break;
      case 'popular':
        sort = { enrollmentCount: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    console.log('🔍 Executing database query with filter:', filter);
    console.log('🔍 Sort:', sort);
    console.log('🔍 Skip:', skip, 'Limit:', limit);
    
    // First, let's try a simple query to see if we can get any courses
    const allCourses = await Course.find({}).limit(5);
    console.log('🔍 Simple query test - all courses found:', allCourses.length);
    if (allCourses.length > 0) {
      console.log('🔍 Sample course:', {
        id: allCourses[0]._id,
        title: allCourses[0].title,
        isPublished: allCourses[0].isPublished
      });
    }
    
    const courses = await Course.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('title shortDescription price category instructor rating thumbnail duration level enrollmentCount');

    console.log('✅ Courses found:', courses.length);
    
    // Get total count for pagination
    const total = await Course.countDocuments(filter);
    console.log('✅ Total courses count:', total);

    res.json({
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalCourses: total,
        hasNext: skip + courses.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('❌ Get courses error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Check if it's a database connection error
    if (error.name === 'MongoNetworkError' || error.message.includes('connect')) {
      console.log('❌ Database connection error detected');
      return res.status(503).json({ 
        message: 'Database connection error',
        error: 'Unable to connect to database. Please try again later.'
      });
    }
    
    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      console.log('❌ Validation error detected');
      return res.status(400).json({ 
        message: 'Validation error',
        error: error.message
      });
    }
    
    // Check if it's a cast error (invalid ObjectId)
    if (error.name === 'CastError') {
      console.log('❌ Cast error detected');
      return res.status(400).json({ 
        message: 'Invalid data format',
        error: 'One or more parameters are in invalid format'
      });
    }
    
    console.log('❌ Generic server error');
    res.status(500).json({ message: 'Server error while fetching courses' });
  }
};

// Get single course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (!course.isPublished && req.session.userRole !== 'admin') {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error while fetching course' });
  }
};

// Create new course (admin only)
const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    
    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error while creating course' });
  }
};

// Update course (admin only)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error while updating course' });
  }
};

// Delete course (admin only)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error while deleting course' });
  }
};

// Get course categories
const getCategories = async (req, res) => {
  try {
    const categories = await Course.distinct('category');
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
};

// Get course levels
const getLevels = async (req, res) => {
  try {
    const levels = await Course.distinct('level');
    res.json({ levels });
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({ message: 'Server error while fetching levels' });
  }
};

// Add review to course
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.id;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user already reviewed this course
    const existingReview = course.reviews.find(review => 
      review.userId.toString() === userId
    );
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this course' });
    }

    // Add review
    course.reviews.push({
      userId,
      rating,
      comment
    });

    // Update average rating
    const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    course.rating.average = totalRating / course.reviews.length;
    course.rating.count = course.reviews.length;

    await course.save();

    res.json({
      message: 'Review added successfully',
      course
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error while adding review' });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
  getLevels,
  addReview
};
