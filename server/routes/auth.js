const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');

// Public routes
router.post('/register', isNotAuthenticated, validateUserRegistration, authController.register);
router.post('/login', isNotAuthenticated, validateUserLogin, authController.login);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    failureFlash: 'Google authentication failed'
  }),
  (req, res) => {
    // Successful authentication, redirect to dashboard or home
    res.redirect('/');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error during logout' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error destroying session' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Protected routes
router.get('/me', isAuthenticated, authController.getCurrentUser);
router.get('/purchased-courses', isAuthenticated, authController.getPurchasedCourses);
router.put('/profile', isAuthenticated, authController.updateProfile);

module.exports = router;
