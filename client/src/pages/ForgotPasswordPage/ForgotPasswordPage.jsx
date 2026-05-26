import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ForgotPasswordPage.module.css'
import logo from '../../assets/Logo.png'

const API_BASE = 'http://localhost:5000/api/auth'
const RESEND_COOLDOWN = 60

export default function ForgotPasswordPage() {
  const navigate = useNavigate()

  // Which step we're on: 1 = enter email, 2 = enter OTP, 3 = set new password
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const inputRefs = useRef([])

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const clearMessages = () => { setError(''); setSuccess('') }

  // ── STEP 1: Send OTP to email ─────────────────────────────
  const handleRequestOTP = async (e) => {
    e.preventDefault()
    clearMessages()
    if (!email.trim()) { setError('Please enter your email address.'); return }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/forgot-password/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to send reset code.'); return }
      setSuccess(data.message)
      setCooldown(RESEND_COOLDOWN)
      setStep(2)
    } catch {
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  // ── STEP 1 resend (go back to step 1) ─────────────────────
  const handleResendOTP = async () => {
    if (cooldown > 0) return
    clearMessages()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/forgot-password/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to resend code.'); return }
      setSuccess('A new reset code has been sent!')
      setCooldown(RESEND_COOLDOWN)
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  // OTP box handlers
  const handleDigitChange = (i, val) => {
    const d = val.replace(/\D/g, '').slice(-1)
    const nd = [...digits]; nd[i] = d; setDigits(nd)
    clearMessages()
    if (d && i < 5) inputRefs.current[i + 1]?.focus()
  }
  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputRefs.current[i - 1]?.focus()
  }
  const handlePaste = (e) => {
    e.preventDefault()
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!p) return
    const nd = [...digits]
    for (let i = 0; i < 6; i++) nd[i] = p[i] || ''
    setDigits(nd)
    inputRefs.current[Math.min(p.length, 5)]?.focus()
  }

  // ── STEP 2: Verify OTP ────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    clearMessages()
    const otp = digits.join('')
    if (otp.length < 6) { setError('Please enter all 6 digits.'); return }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/forgot-password/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Invalid code.')
        setDigits(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        return
      }
      setResetToken(data.resetToken)
      setSuccess('Code verified! Now set your new password.')
      setTimeout(() => { setSuccess(''); setStep(3) }, 800)
    } catch {
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  // ── STEP 3: Reset password ────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault()
    clearMessages()
    if (!newPassword || !confirmPassword) { setError('All fields are required.'); return }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return }
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!pwRegex.test(newPassword)) {
      setError('Password must be 8+ chars with uppercase, lowercase, number & special character.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword, confirmNewPassword: confirmPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Failed to reset password.'); return }
      setSuccess('Password reset successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step indicator ─────────────────────────────────────────
  const stepLabels = ['Enter Email', 'Verify Code', 'New Password']

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className={styles.logo}>
          <img src={logo} alt="AI Infowaves Logo" style={{ height: 56, width: 'auto', objectFit: 'contain' }} />
          <span className={styles.logoText}>AI <span>Infowaves</span></span>
        </div>

        {/* Step indicators */}
        <div className={styles.stepRow}>
          {stepLabels.map((label, i) => (
            <div key={i} className={`${styles.stepItem} ${step > i + 1 ? styles.stepDone : ''} ${step === i + 1 ? styles.stepActive : ''}`}>
              <div className={styles.stepDot}>
                {step > i + 1
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  : i + 1
                }
              </div>
              <span className={styles.stepLabel}>{label}</span>
              {i < 2 && <div className={styles.stepLine} />}
            </div>
          ))}
        </div>

        {/* Error/Success */}
        <AnimatePresence>
          {error && (
            <motion.div className={styles.errorBanner} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert">
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div className={styles.successBanner} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status">
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STEP 1 ── */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <h1 className={styles.heading}>Forgot Password?</h1>
              <p className={styles.sub}>Enter your email and we&apos;ll send you a 6-digit reset code.</p>
              <form onSubmit={handleRequestOTP} noValidate>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">Email Address</label>
                  <input
                    className={styles.input}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); clearMessages() }}
                    required
                    disabled={loading}
                  />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <span className={styles.spinner} /> : 'Send Reset Code'}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <h1 className={styles.heading}>Enter Reset Code</h1>
              <p className={styles.sub}>
                We sent a 6-digit code to <strong className={styles.emailHighlight}>{email}</strong>
              </p>
              <form onSubmit={handleVerifyOTP}>
                <div className={styles.otpRow}>
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={el => (inputRefs.current[i] = el)}
                      className={`${styles.otpBox} ${d ? styles.otpBoxFilled : ''}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleDigitChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      onPaste={i === 0 ? handlePaste : undefined}
                      autoFocus={i === 0}
                      disabled={loading}
                      aria-label={`Digit ${i + 1}`}
                    />
                  ))}
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading || digits.join('').length < 6}>
                  {loading ? <span className={styles.spinner} /> : 'Verify Code'}
                </button>
              </form>
              <div className={styles.resendRow}>
                <span className={styles.resendText}>Didn&apos;t receive it?</span>
                <button type="button" className={styles.resendBtn} onClick={handleResendOTP} disabled={cooldown > 0 || loading}>
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </button>
              </div>
              <button type="button" className={styles.backBtn} onClick={() => { setStep(1); setDigits(['','','','','','']); clearMessages() }}>
                ← Change email
              </button>
            </motion.div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <h1 className={styles.heading}>Set New Password</h1>
              <p className={styles.sub}>Choose a strong password for your account.</p>
              <form onSubmit={handleResetPassword} noValidate>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="newPassword">New Password</label>
                  <input
                    className={styles.input}
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Min 8 chars, upper, lower, number, symbol"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); clearMessages() }}
                    required
                    disabled={loading}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    className={styles.input}
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); clearMessages() }}
                    required
                    disabled={loading}
                  />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <span className={styles.spinner} /> : 'Reset Password'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <p className={styles.footer}>
          Remember your password?{' '}
          <Link to="/login">Sign In</Link>
        </p>
      </motion.div>
    </div>
  )
}
