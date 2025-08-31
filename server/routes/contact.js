const express = require('express');
const router = express.Router();
const { validateContactForm, submitContactForm } = require('../controllers/contactController');

// POST /api/contact - Submit contact form
router.post('/', validateContactForm, submitContactForm);

module.exports = router;
