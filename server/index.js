const express = require('express');
const passport = require('passport');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection status
let dbConnected = false;

// Initialize server
const initializeServer = async () => {
  // Connect to MongoDB
  try {
    await connectDB();
    dbConnected = true;
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('⚠️ Server will start but database operations will fail');
    dbConnected = false;
  }

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Database status: ${dbConnected ? 'Connected' : 'Disconnected'}`);
  });
};

// Start the server
initializeServer();

// Database status middleware
app.use((req, res, next) => {
  req.dbConnected = dbConnected;
  next();
});

// Simple request debugging
app.use((req, res, next) => {
  console.log('=== REQUEST ===');
  console.log(`${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Authorization:', req.headers.authorization ? 'Present' : 'None');
  console.log('Database:', dbConnected ? 'Connected' : 'Disconnected');
  console.log('==================');
  next();
});

// Simple headers for cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Passport
app.use(passport.initialize());

// Import and configure Google OAuth (optional)
try {
  require('./config/googleOAuth');
  console.log('✅ Google OAuth configured');
} catch (error) {
  console.log('⚠️ Google OAuth not configured (optional)');
}

// Routes
try {
  console.log('Loading routes...');
  
  // Test each route file individually
  const authRoutes = require('./routes/auth');
  console.log('✅ Auth routes file loaded');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes mounted');
  
  const coursesRoutes = require('./routes/courses');
  console.log('✅ Courses routes file loaded');
  app.use('/api/courses', coursesRoutes);
  console.log('✅ Courses routes mounted');
  
  const cartRoutes = require('./routes/cart');
  console.log('✅ Cart routes file loaded');
  app.use('/api/cart', cartRoutes);
  console.log('✅ Cart routes mounted');
  
  const ordersRoutes = require('./routes/orders');
  console.log('✅ Orders routes file loaded');
  app.use('/api/orders', ordersRoutes);
  console.log('✅ Orders routes mounted');
  
  const paymentRoutes = require('./routes/payment');
  console.log('✅ Payment routes file loaded');
  app.use('/api/payments', paymentRoutes);
  console.log('✅ Payment routes mounted');
  
  const adminRoutes = require('./routes/admin');
  console.log('✅ Admin routes file loaded');
  app.use('/api/admin', adminRoutes);
  console.log('✅ Admin routes mounted');
  
  const contactRoutes = require('./routes/contact');
  console.log('✅ Contact routes file loaded');
  app.use('/api/contact', contactRoutes);
  console.log('✅ Contact routes mounted');
  
  console.log('🎉 All routes loaded and mounted successfully!');
} catch (error) {
  console.error('❌ Error loading routes:', error);
  console.error('Error stack:', error.stack);
}

// Google OAuth routes (keep these separate)
try {
  app.use('/auth', require('./routes/auth'));
} catch (error) {
  console.error('Error loading auth routes:', error);
}

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    origin: req.headers.origin,
    auth: req.headers.authorization ? 'Present' : 'None'
  });
});

// Auth test route
app.get('/api/auth-test', (req, res) => {
  res.json({
    message: 'Auth endpoint working',
    origin: req.headers.origin,
    authorization: req.headers.authorization ? 'Present' : 'None',
    timestamp: new Date().toISOString()
  });
});

// Orders test route
app.get('/api/orders-test', (req, res) => {
  res.json({
    message: 'Orders endpoint working',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Orders debug route
app.get('/api/orders-debug', (req, res) => {
  res.json({
    message: 'Orders debug endpoint',
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    headers: req.headers,
    user: req.user || 'No user in request'
  });
});

// CORS test route
app.get('/api/cors-test', (req, res) => {
  res.json({
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Session test route
app.get('/api/session-test', (req, res) => {
  res.json({
    sessionID: req.sessionID,
    hasSession: !!req.session,
    user: req.session?.user,
    cookies: req.headers.cookie,
    origin: req.headers.origin,
    sessionData: {
      userId: req.session?.userId,
      userRole: req.session?.userRole,
      userName: req.session?.userName
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database status endpoint
app.get('/api/db-status', (req, res) => {
  res.json({ 
    connected: dbConnected,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb_uri: process.env.MONGODB_URI ? 'Set' : 'Not Set',
    jwt_secret: process.env.JWT_SECRET ? 'Set' : 'Not Set'
  });
});

// Simple courses test endpoint
app.get('/api/courses-test', async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(503).json({ 
        message: 'Database not connected',
        connected: false
      });
    }
    
    // Try to get a simple count
    const Course = require('./models/Course');
    const count = await Course.countDocuments({});
    
    res.json({
      message: 'Courses test successful',
      totalCourses: count,
      databaseConnected: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Courses test error:', error);
    res.status(500).json({
      message: 'Courses test failed',
      error: error.message,
      databaseConnected: dbConnected
    });
  }
});

// Fallback for database operations when DB is not connected
app.use('/api/*', (req, res, next) => {
  if (!dbConnected && req.method !== 'GET' && !req.url.includes('/health') && !req.url.includes('/db-status')) {
    return res.status(503).json({
      message: 'Database connection unavailable',
      error: 'Service temporarily unavailable. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Check if it's a database connection error
  if (!req.dbConnected) {
    return res.status(503).json({ 
      message: 'Database connection unavailable',
      error: 'Service temporarily unavailable. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
  
  // Check if it's a JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      message: 'Invalid token',
      error: 'Authentication failed'
    });
  }
  
  // Check if it's a validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation failed',
      error: err.message
    });
  }
  
  // Generic error
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// For Vercel deployment, export the app
module.exports = app;

// Only listen if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}
