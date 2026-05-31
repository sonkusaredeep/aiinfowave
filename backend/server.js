require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session — required by Passport even when using JWT (for OAuth flow)
app.use(session({
  secret: process.env.SESSION_SECRET || 'aiinfowave_session_fallback',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // set to true in production with HTTPS
}));

// ── Passport Setup ────────────────────────────────────────────
// Google OAuth strategy configuration
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already signed in with Google
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Existing Google user — return them
          return done(null, user);
        }

        // Check if email already exists (local account with same email)
        const existingEmail = await User.findOne({ email: profile.emails[0].value });
        if (existingEmail) {
          // Link Google account to existing local account
          existingEmail.googleId = profile.id;
          existingEmail.isEmailVerified = true; // Google accounts are pre-verified
          await existingEmail.save();
          return done(null, existingEmail);
        }

        // Brand new Google user — create account
        user = await User.create({
          name: profile.displayName || profile.emails[0].value.split('@')[0],
          email: profile.emails[0].value,
          googleId: profile.id,
          authProvider: 'google',
          isEmailVerified: true, // Google already verified their email
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Minimal serialize/deserialize (not really used since we use JWT, but Passport needs it)
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.use(passport.initialize());
app.use(passport.session());

// ── Health check ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '✅ AI InfoWave API is running', status: 'OK' });
});

// ── Routes ────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const internshipRoutes = require('./routes/internships');
const jobRoutes = require('./routes/jobs');
const bookingRoutes = require('./routes/booking');

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/bookings', bookingRoutes);

// ── MongoDB Atlas connection ───────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas (ai-infowave)'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔑 Google Client ID loaded: ${process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 15) + '...' : 'NOT FOUND'}`);
});
