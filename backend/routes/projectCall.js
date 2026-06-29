const express = require('express');
const router = express.Router();
const { submitProjectCall } = require('../controllers/projectCallController');

// POST /api/project-call/submit (public endpoint)
router.post('/submit', submitProjectCall);

module.exports = router;
