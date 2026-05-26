/**
 * GoogleCallbackPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Handles the redirect from Google OAuth.
 * Extracts the JWT token from URL params, stores it,
 * then redirects the user home.
 * ─────────────────────────────────────────────────────────────
 */

import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    const name  = searchParams.get('name')
    const email = searchParams.get('email')
    const error = searchParams.get('error')

    if (error || !token) {
      // Auth failed — go to login with error message
      navigate('/login?error=google_auth_failed')
      return
    }

    // Store token and basic user info
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify({ name, email }))

    // Redirect to home
    navigate('/', { replace: true })
  }, [searchParams, navigate])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f1f5fe',
      fontFamily: 'DM Sans, sans-serif',
      flexDirection: 'column',
      gap: '16px',
      color: '#475569',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p>Signing you in with Google...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
