/**
 * User.js
 * ─────────────────────────────────────────────────────────────
 * Mongoose model for AI InfoWave users.
 * Fields added for OTP verification & Google OAuth.
 * ─────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // ── Core fields ──────────────────────────────────────────
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // Password is optional for Google OAuth users
    password: {
      type: String,
      default: null,
      // Plain-text validation done in controller; stored as bcrypt hash
    },
    // Optional phone number
    phone: {
      type: String,
      default: null,
      trim: true,
    },

    // ── Email verification (OTP) ─────────────────────────────
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    // Tells us what the OTP is for: registration or password reset
    otpType: {
      type: String,
      enum: ['register', 'forgot-password'],
      default: null,
    },

    // ── Google OAuth ─────────────────────────────────────────
    googleId: {
      type: String,
      default: null,
      sparse: true, // allows null for multiple docs but unique when set
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
