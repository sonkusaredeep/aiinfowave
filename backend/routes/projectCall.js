const express = require('express');
const router = express.Router();
const { submitProjectCall } = require('../controllers/projectCallController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/project-call/submit (requires login)
router.post('/submit', protect, submitProjectCall);

module.exports = router;
