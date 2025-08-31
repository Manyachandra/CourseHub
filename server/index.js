const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
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

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000'
  ],
  credentials: true
}));

// Debug middleware for sessions
app.use((req, res, next) => {
  console.log('=== REQUEST DEBUG ===');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Origin:', req.headers.origin);
  console.log('Cookie header:', req.headers.cookie);
  console.log('Session ID:', req.sessionID);
  console.log('Session name:', req.session?.name);
  console.log('User in session:', req.session?.user);
  console.log('Session cookie:', req.session?.cookie);
  console.log('==================');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/course_website',
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: true, // Always use secure in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'none', // Allow cross-site cookies
    // Remove domain restriction to allow cross-origin cookies
    path: '/'
  },
  name: 'coursehub.sid' // Custom session name
}));

// Initialize Passport and restore authentication state
app.use(passport.initialize());
app.use(passport.session());

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
    environment: process.env.NODE_ENV || 'development'
  });
});

// Session test route
app.get('/api/session-test', (req, res) => {
  res.json({
    sessionID: req.sessionID,
    hasSession: !!req.session,
    user: req.session?.user,
    cookies: req.headers.cookie,
    origin: req.headers.origin
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
