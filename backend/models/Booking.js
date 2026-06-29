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
      required: false,
      default: '',
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

// Index to support queries on service and date
bookingSchema.index({ service: 1, date: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
