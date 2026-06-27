/**
 * ProjectCall.js
 * ─────────────────────────────────────────────────────────────
 * Mongoose model for AI InfoWave Open Project Call submissions.
 * ─────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');

const projectCallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    researchArea: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    timeline: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ProjectCall', projectCallSchema);
