const { body, validationResult } = require('express-validator');
const { sendContactEmail, sendAutoReply } = require('../services/emailService');

// Validation rules for contact form
const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject must be less than 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

// Handle contact form submission
const submitContactForm = async (req, res) => {
  try {
    // Check if database is connected
    if (!req.dbConnected) {
      return res.status(503).json({ 
        message: 'Service temporarily unavailable',
        error: 'Database connection unavailable. Please try again later.'
      });
    }

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Send email to admin
    const adminEmailResult = await sendContactEmail({
      name,
      email,
      subject,
      message
    });

    // Send auto-reply to user
    const autoReplyResult = await sendAutoReply(email, name);

    // Log the results
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      adminEmailSent: adminEmailResult.success,
      autoReplySent: autoReplyResult.success
    });

    res.status(200).json({
      message: 'Message sent successfully!',
      details: {
        adminEmailSent: adminEmailResult.success,
        autoReplySent: autoReplyResult.success
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    res.status(500).json({
      message: 'Failed to send message',
      error: 'An error occurred while sending your message. Please try again later.'
    });
  }
};

module.exports = {
  validateContactForm,
  submitContactForm
};
