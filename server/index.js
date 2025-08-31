const express = require('express');
const passport = require('passport');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
try {
  connectDB();
} catch (error) {
  console.error('Database connection failed:', error);
  // Continue without database for now
}

// Simple request debugging
app.use((req, res, next) => {
  console.log('=== REQUEST ===');
  console.log(`${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Authorization:', req.headers.authorization ? 'Present' : 'None');
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

// Import and configure Google OAuth
require('./config/googleOAuth');

// Routes
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/courses', require('./routes/courses'));
  app.use('/api/cart', require('./routes/cart'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/payments', require('./routes/payment')); // Payment routes
  app.use('/api/admin', require('./routes/admin'));
} catch (error) {
  console.error('Error loading routes:', error);
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
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
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
