/**
 * rateLimiter.js
 * ─────────────────────────────────────────────────────────────
 * Express-rate-limit configurations to protect sensitive routes.
 * ─────────────────────────────────────────────────────────────
 */

const rateLimit = require('express-rate-limit');

/**
 * otpLimiter — Applied to OTP send/resend endpoints.
 * Max 5 OTP requests per IP per 15 minutes.
 */
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    message: 'Too many OTP requests from this IP. Please wait 15 minutes and try again.',
  },
  standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,   // Disable the `X-RateLimit-*` headers
});

/**
 * authLimiter — Applied to login and register endpoints.
 * Max 20 requests per IP per 15 minutes.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    message: 'Too many login attempts from this IP. Please wait and try again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { otpLimiter, authLimiter };
