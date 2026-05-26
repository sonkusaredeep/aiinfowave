/**
 * authMiddleware.js
 * ─────────────────────────────────────────────────────────────
 * JWT authentication middleware.
 * Usage: import { protect } from '../middleware/authMiddleware'
 *        then add it to any route that needs authentication.
 * ─────────────────────────────────────────────────────────────
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — Verifies the JWT Bearer token in the Authorization header.
 * Attaches the user document to req.user on success.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Extract token from "Authorization: Bearer <token>" header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorised — no token provided' });
    }

    // 2. Verify the token (throws if invalid or expired)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Fetch the user (exclude password from result)
    const user = await User.findById(decoded.id).select('-password -otp -otpExpiry');
    if (!user) {
      return res.status(401).json({ message: 'User not found — token invalid' });
    }

    // 4. Attach user to request for downstream handlers
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired — please log in again' });
    }
    return res.status(401).json({ message: 'Not authorised — invalid token' });
  }
};

module.exports = { protect };
