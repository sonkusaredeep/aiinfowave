const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const {
  applyInternship,
  getAllApplications,
  updateApplicationStatus,
  getDashboardStats
} = require('../controllers/internshipController');

// Helper to catch multer errors
const multerErrorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Public Route
router.post('/apply', (req, res, next) => {
  upload.single('resume')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, applyInternship);

// Admin Routes
router.get('/', getAllApplications);
router.get('/stats', getDashboardStats);
router.put('/:id/status', updateApplicationStatus);

module.exports = router;
