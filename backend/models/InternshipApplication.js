const mongoose = require('mongoose');

const internshipApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  currentYear: { type: String, required: true },
  skills: { type: String, required: true },
  linkedin: { type: String },
  portfolio: { type: String },
  internshipRole: { type: String, required: true },
  hireReason: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  applicationStatus: { 
    type: String, 
    enum: ['Pending', 'Shortlisted', 'Rejected', 'Interview Scheduled'],
    default: 'Pending' 
  },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InternshipApplication', internshipApplicationSchema);
