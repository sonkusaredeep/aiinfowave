import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './VerifyEmailPage.module.css'
import logo from '../../assets/Logo.png'

const API_BASE = 'http://localhost:5000/api/auth'
const RESEND_COOLDOWN = 60 // seconds

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const navigate = useNavigate()

  // Six individual OTP digit slots
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0) // seconds remaining before resend allowed

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  // If no email in URL, redirect to register
  useEffect(() => {
    if (!email) navigate('/register')
  }, [email, navigate])

  // Handle input in each OTP box
  const handleDigitChange = (index, value) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = digit
    setDigits(newDigits)
    setError('')

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace — go back to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste — distribute digits across boxes
  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const newDigits = [...digits]
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || ''
    }
    setDigits(newDigits)
    // Focus last filled box or last box
    const lastIdx = Math.min(pasted.length, 5)
    inputRefs.current[lastIdx]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const otp = digits.join('')

    if (otp.length < 6) {
      setError('Please enter all 6 digits of your verification code.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Verification failed. Please try again.')
        // Clear digits on wrong OTP
        setDigits(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        return
      }

      // Store token and user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setSuccess('Email verified! Welcome to AI InfoWaves 🎉')
      setTimeout(() => navigate('/'), 1800)
    } catch {
      setError('Unable to connect to the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || resendLoading) return
    setError('')
    setResendLoading(true)
    try {
      const res = await fetch(`${API_BASE}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Failed to resend code.')
        return
      }
      setSuccess('A new verification code has been sent!')
      setCooldown(RESEND_COOLDOWN)
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Unable to connect to the server.')
    } finally {
      setResendLoading(false)
    }
  }

  // Mask email for display — e.g. pr***@gmail.com
  const maskEmail = (em) => {
    if (!em) return ''
    const [user, domain] = em.split('@')
    const masked = user.slice(0, 2) + '***'
    return `${masked}@${domain}`
  }

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className={styles.logo}>
          <img src={logo} alt="AI Infowaves Logo" style={{ height: 56, width: 'auto', objectFit: 'contain' }} />
          <span className={styles.logoText}>AI <span>Infowaves</span></span>
        </div>

        {/* Icon */}
        <div className={styles.iconWrap}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <h1 className={styles.heading}>Check your email</h1>
        <p className={styles.sub}>
          We sent a 6-digit code to<br />
          <strong className={styles.emailHighlight}>{maskEmail(email)}</strong>
        </p>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div className={styles.errorBanner} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success */}
        <AnimatePresence>
          {success && (
            <motion.div className={styles.successBanner} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status">
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* OTP Input Boxes */}
        <form onSubmit={handleSubmit}>
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

          <p className={styles.hint}>
            Enter the code from your email. It expires in <strong>5 minutes</strong>.
          </p>

          <button type="submit" className={styles.submitBtn} disabled={loading || digits.join('').length < 6}>
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Verify Email
              </>
            )}
          </button>
        </form>

        {/* Resend */}
        <div className={styles.resendRow}>
          <span className={styles.resendText}>Didn&apos;t receive the code?</span>
          <button
            type="button"
            className={styles.resendBtn}
            onClick={handleResend}
            disabled={cooldown > 0 || resendLoading}
          >
            {resendLoading
              ? 'Sending…'
              : cooldown > 0
              ? `Resend in ${cooldown}s`
              : 'Resend code'}
          </button>
        </div>

        <p className={styles.footer}>
          Wrong email?{' '}
          <Link to="/register">Go back to register</Link>
        </p>
      </motion.div>
    </div>
  )
}
