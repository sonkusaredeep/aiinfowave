/**
 * booking.js
 * ─────────────────────────────────────────────────────────────
 * Route configuration for consultation booking endpoints.
 * ─────────────────────────────────────────────────────────────
 */

const express = require('express');
const router = express.Router();
const { createBooking, getBookedSlots } = require('../controllers/bookingController');

// POST /api/bookings/create - Create a consultation booking
router.post('/create', createBooking);

// GET /api/bookings/booked-slots - Retrieve booked slots for a specific date
router.get('/booked-slots', getBookedSlots);

module.exports = router;
