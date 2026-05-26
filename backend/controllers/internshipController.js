/**
 * internshipController.js
 * ─────────────────────────────────────────────────────────────
 * Handles internship applications:
 *   - Upload resume to Cloudinary
 *   - Save to MongoDB
 *   - Send confirmation to applicant + notification to admin
 * ─────────────────────────────────────────────────────────────
 */

const InternshipApplication = require('../models/InternshipApplication');
const {
  sendInternshipConfirmation,
  sendInternshipNotification,
} = require('../services/emailService');

// ─────────────────────────────────────────────────────────────
// @route  POST /api/internships/apply
// @access Public
// ─────────────────────────────────────────────────────────────
exports.applyInternship = async (req, res) => {
  try {
    const {
      fullName, email, phone, college, currentYear,
      skills, linkedin, portfolio, internshipRole, hireReason
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume (PDF/DOC/DOCX).' });
    }

    const resumeUrl = req.file.path; // Cloudinary secure URL

    const application = new InternshipApplication({
      fullName, email, phone, college, currentYear,
      skills, linkedin, portfolio, internshipRole, hireReason, resumeUrl
    });

    await application.save();

    // Send emails via Resend (non-blocking — don't fail the response if email fails)
    sendInternshipConfirmation({ email, name: fullName, role: internshipRole }).catch(console.error);
    sendInternshipNotification({ fullName, email, phone, internshipRole, resumeUrl }).catch(console.error);

    res.status(201).json({
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    console.error('Error in applyInternship:', error);
    res.status(500).json({ message: 'Server error while submitting application.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// @route  GET /api/internships
// @access Private/Admin
// ─────────────────────────────────────────────────────────────
exports.getAllApplications = async (req, res) => {
  try {
    const { role, status, search } = req.query;

    let query = {};
    if (role) query.internshipRole = role;
    if (status) query.applicationStatus = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await InternshipApplication.find(query).sort({ appliedAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

// ─────────────────────────────────────────────────────────────
// @route  PUT /api/internships/:id/status
// @access Private/Admin
// ─────────────────────────────────────────────────────────────
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Shortlisted', 'Rejected', 'Interview Scheduled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await InternshipApplication.findByIdAndUpdate(
      req.params.id,
      { applicationStatus: status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status' });
  }
};

// ─────────────────────────────────────────────────────────────
// @route  GET /api/internships/stats
// @access Private/Admin
// ─────────────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const total       = await InternshipApplication.countDocuments();
    const pending     = await InternshipApplication.countDocuments({ applicationStatus: 'Pending' });
    const shortlisted = await InternshipApplication.countDocuments({ applicationStatus: 'Shortlisted' });
    const rejected    = await InternshipApplication.countDocuments({ applicationStatus: 'Rejected' });

    res.status(200).json({ total, pending, shortlisted, rejected });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};
