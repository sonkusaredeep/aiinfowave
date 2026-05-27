/**
 * auth.js (routes)
 * ─────────────────────────────────────────────────────────────
 * All authentication routes for AI InfoWave.
 * ─────────────────────────────────────────────────────────────
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  getMe,
  updateProfile,
  forgotPasswordRequest,
  verifyForgotPasswordOTP,
  resetPassword,
  googleCallback,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { otpLimiter, authLimiter } = require('../middleware/rateLimiter');

// ── Registration & OTP ────────────────────────────────────────
router.post('/register', authLimiter, registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', otpLimiter, resendOTP);

// ── Login ─────────────────────────────────────────────────────
router.post('/login', authLimiter, loginUser);

// ── Protected: current user ───────────────────────────────────
router.get('/me', protect, getMe);

// ── Protected: profile ────────────────────────────────────────
router.put('/profile', protect, updateProfile);

// ── Forgot password (3-step OTP flow) ────────────────────────
router.post('/forgot-password/request', otpLimiter, forgotPasswordRequest);
router.post('/forgot-password/verify', verifyForgotPasswordOTP);
router.post('/forgot-password/reset', resetPassword);

// ── Google OAuth ──────────────────────────────────────────────
// Step 1: Redirect user to Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Google redirects back here after user approves
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
    session: false, // We use JWT, not sessions
  }),
  googleCallback
);

module.exports = router;