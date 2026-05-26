const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  fullName:    { type: String, required: true },
  email:       { type: String, required: true },
  phone:       { type: String, required: true },
  jobTitle:    { type: String, required: true },
  department:  { type: String, required: true },
  linkedin:    { type: String },
  coverLetter: { type: String, required: true },
  resumeUrl:   { type: String, required: true },
  applicationStatus: {
    type: String,
    enum: ['Pending', 'Shortlisted', 'Rejected', 'Interview Scheduled'],
    default: 'Pending'
  },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
