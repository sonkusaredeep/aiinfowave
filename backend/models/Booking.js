/**
 * Booking.js
 * ─────────────────────────────────────────────────────────────
 * Mongoose model for AI InfoWave consultation bookings.
 * ─────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    service: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    timeSlot: {
      type: String, // e.g. "10:30 AM"
      required: true,
    },
    details: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent double booking of the exact same slot on the same day for a service
bookingSchema.index({ service: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
