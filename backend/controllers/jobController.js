/**
 * jobController.js
 * ─────────────────────────────────────────────────────────────
 * Handles job (career page) applications.
 * ─────────────────────────────────────────────────────────────
 */

const JobApplication = require('../models/JobApplication');
const { sendJobConfirmation, sendJobNotification } = require('../services/emailService');

// ─────────────────────────────────────────────────────────────
// @route  POST /api/jobs/apply
// @access Public
// ─────────────────────────────────────────────────────────────
exports.applyJob = async (req, res) => {
  try {
    const { fullName, email, phone, jobTitle, department, linkedin, coverLetter } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume (PDF/DOC/DOCX).' });
    }

    const resumeUrl = req.file.path;

    const application = new JobApplication({
      fullName, email, phone, jobTitle, department, linkedin, coverLetter, resumeUrl
    });

    await application.save();

    // Fire-and-forget emails — don't block the response
    sendJobConfirmation({ email, name: fullName, jobTitle }).catch(console.error);
    sendJobNotification({ fullName, email, phone, jobTitle, department, linkedin, coverLetter, resumeUrl }).catch(console.error);

    res.status(201).json({ message: 'Application submitted successfully!', application });
  } catch (error) {
    console.error('Error in applyJob:', error);
    res.status(500).json({ message: 'Server error while submitting application.', error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────
// @route  GET /api/jobs
// @access Private/Admin
// ─────────────────────────────────────────────────────────────
exports.getAllJobApplications = async (req, res) => {
  try {
    const { jobTitle, status, search } = req.query;

    let query = {};
    if (jobTitle) query.jobTitle = jobTitle;
    if (status) query.applicationStatus = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await JobApplication.find(query).sort({ appliedAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

// ─────────────────────────────────────────────────────────────
// @route  PUT /api/jobs/:id/status
// @access Private/Admin
// ─────────────────────────────────────────────────────────────
exports.updateJobApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Shortlisted', 'Rejected', 'Interview Scheduled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { applicationStatus: status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error('Error updating job application status:', error);
    res.status(500).json({ message: 'Error updating application status' });
  }
};

// ─────────────────────────────────────────────────────────────
// @route  GET /api/jobs/stats
// @access Private/Admin
// ─────────────────────────────────────────────────────────────
exports.getJobStats = async (req, res) => {
  try {
    const total       = await JobApplication.countDocuments();
    const pending     = await JobApplication.countDocuments({ applicationStatus: 'Pending' });
    const shortlisted = await JobApplication.countDocuments({ applicationStatus: 'Shortlisted' });
    const rejected    = await JobApplication.countDocuments({ applicationStatus: 'Rejected' });

    res.status(200).json({ total, pending, shortlisted, rejected });
  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};
