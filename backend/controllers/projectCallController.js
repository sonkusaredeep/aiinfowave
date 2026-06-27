/**
 * projectCallController.js
 * ─────────────────────────────────────────────────────────────
 * Handles open project call submissions:
 *   - Validate form fields
 *   - Save submission to MongoDB
 *   - Send confirmation email to applicant + admin notification
 * ─────────────────────────────────────────────────────────────
 */

const ProjectCall = require('../models/ProjectCall');
const {
  sendProjectCallConfirmation,
  sendProjectCallNotification,
} = require('../services/emailService');

// ─────────────────────────────────────────────────────────────
// @route  POST /api/project-call/submit
// @access Private (authenticated users only)
// ─────────────────────────────────────────────────────────────
exports.submitProjectCall = async (req, res) => {
  try {
    const { name, email, institution, title, researchArea, summary, timeline } = req.body;

    // Validate fields
    if (!name || !email || !institution || !title || !researchArea || !summary || !timeline) {
      return res.status(400).json({ message: 'All form fields are required.' });
    }

    // Save to database
    const newSubmission = new ProjectCall({
      name,
      email,
      institution,
      title,
      researchArea,
      summary,
      timeline,
    });

    await newSubmission.save();

    // Trigger emails (non-blocking)
    sendProjectCallConfirmation({ email, name, projectTitle: title }).catch(console.error);
    sendProjectCallNotification({ name, email, institution, title, researchArea, summary, timeline }).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Project submission successfully submitted!',
      submission: newSubmission,
    });
  } catch (error) {
    console.error('Error in submitProjectCall:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting project call details.',
      error: error.message,
    });
  }
};
