const express = require('express');
const router = express.Router();
const { submitContactMessage } = require('../controllers/contactController');

// POST /api/contact/submit
router.post('/submit', submitContactMessage);

module.exports = router;
