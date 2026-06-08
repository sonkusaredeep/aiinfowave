import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './LoginPage.module.css'
import logo from '../../assets/Logo.png'
import authCollab from '../../assets/auth_collaborate.png'
import { isSessionExpired } from '../../utils/sessionGuard'

const API_BASE = 'http://localhost:5000/api/auth'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Show session-expired notice if redirected by SessionGuard
  const sessionExpired = location.state?.sessionExpired === true

  // ── Already logged in? Redirect away ─────────────────────
  // Prevents showing the login form to a user who already has a valid session.
  useEffect(() => {
    if (!isSessionExpired()) {
      navigate('/', { replace: true })
    }
  }, [])

  // Calculate dynamic Mon-Sun week dates around today
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])



  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })

      const data = await res.json()

      if (!res.ok) {
        // If account exists but email not verified, redirect to verify page
        if (data.needsVerification) {
          navigate(`/verify-email?email=${encodeURIComponent(data.email || form.email)}`)
          return
        }
        setError(data.message || 'Login failed. Please try again.')
        return
      }

      // ── Clear any existing session before saving new one ─────
      // Prevents ghost-login where the old account token lingers.
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setError('Unable to connect to the server. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Redirect to backend Google OAuth flow
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/google`
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow1}></div>
      <div className={styles.bgGlow2}></div>

      <motion.div
        className={styles.container}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Left Side: Form */}
        <div className={styles.formSection}>
          <div className={styles.logo}>
            <img src={logo} alt="AI Infowave Logo" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
            <span className={styles.logoText}>
              AI <span>Infowave</span>
            </span>
          </div>

          <h1 className={styles.heading}>Welcome back</h1>

          {/* Session expired notice */}
          {sessionExpired && (
            <div className={styles.errorBanner} style={{
              background: 'linear-gradient(135deg, rgba(234,179,8,0.12), rgba(234,179,8,0.06))',
              border: '1px solid rgba(234,179,8,0.4)',
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Your session has expired. Please log in again.
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                className={styles.errorBanner}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                role="alert"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email Address</label>
              <input
                className={styles.input}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="amelielaurent7622@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className={styles.field}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.label} htmlFor="password">Password</label>
                <Link to="/forgot-password" className={styles.forgot}>
                  Forgot password?
                </Link>
              </div>
              <input
                className={styles.input}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••••••••••••••"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing in…' : 'Submit'}
            </button>
          </form>

          <div className={styles.divider}>or sign in with</div>

          <div className={styles.socialRow}>
            <button
              type="button"
              className={styles.googleBtn}
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
          </div>

          <p className={styles.footer}>
            Don't have an account?{' '}
            <Link to="/register">Create New Account</Link>
          </p>
        </div>

        {/* Right Side: Visual Image */}
        <div className={styles.visualSection}>
          <div className={styles.visualWrapper}>
            <img src={authCollab} alt="Workspace Collaboration" className={styles.visualImg} />
            <div className={styles.imageOverlay}></div>

            {/* Widget 1: Top task badge */}
            <div className={styles.taskBadge} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#ffffff', border: '1px solid rgba(32, 84, 212, 0.15)', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f4ff', width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', padding: '3px', border: '1px solid rgba(32, 84, 212, 0.1)' }}>
                <img src={logo} alt="AI Infowave Logo" style={{ height: '100%', width: '100%', objectFit: 'contain', borderRadius: '50%' }} />
              </div>
              <div className={styles.taskBadgeTitle} style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.3px', color: '#2054D4' }}>Welcome to AI Infowave</div>
            </div>

            {/* Widget 2: Calendar Widget (Today's Date Card at the bottom) */}
            <div className={styles.calendarWidget} style={{ bottom: '28px', padding: '16px 20px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '20px', width: '88%' }}>

              {/* Left Side: Dynamic Calendar Icon Badge */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '60px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                flexShrink: 0
              }}>
                {/* Header of the calendar page (Brand Blue block with stylish Outfit font) */}
                <div style={{
                  backgroundColor: '#2054D4',
                  color: '#ffffff',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '4px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px'
                }}>
                  {currentDate.toLocaleDateString('en-US', { month: 'short' })}
                </div>
                {/* Date display in calendar page */}
                <div style={{
                  color: '#0f172a',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '24px',
                  fontWeight: '800',
                  padding: '5px 0',
                  lineHeight: '1'
                }}>
                  {currentDate.getDate()}
                </div>
              </div>

              {/* Right Side: Text details with stylish typography */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '17px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.3px', lineHeight: '1.2' }}>
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic', fontSize: '12.5px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.95)', display: 'flex', alignItems: 'center', gap: '4px', lineHeight: '1.2' }}>
                  Have a wonderful day! ☀️
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Success Toast */}
      <AnimatePresence>
        {success && (
          <div className={styles.toastContainer}>
            <motion.div
              className={styles.toastSuccess}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              role="status"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              {success}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
