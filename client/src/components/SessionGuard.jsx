import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { isSessionExpired, msUntilExpiry, clearSession } from '../utils/sessionGuard'

/**
 * SessionGuard
 * ─────────────────────────────────────────────────────────────
 * Drop this component once inside your app tree (e.g., in Layout).
 *
 * Behaviour:
 * - ALL pages are publicly accessible without login.
 * - If a user IS logged in and their token expires, they are
 *   auto-logged out and redirected to /login.
 * - Unauthenticated visitors can browse freely; login is only
 *   required when they attempt a protected ACTION (booking,
 *   applying, etc.) — enforced inside those individual pages.
 * ─────────────────────────────────────────────────────────────
 */
export default function SessionGuard() {
  const navigate = useNavigate()
  const location = useLocation()
  const timerRef = useRef(null)

  // ── Helper: schedule auto-logout when token will expire ───
  const scheduleAutoLogout = () => {
    if (timerRef.current) clearTimeout(timerRef.current)

    const ms = msUntilExpiry()
    if (ms <= 0) return

    timerRef.current = setTimeout(() => {
      clearSession()
      navigate('/login', {
        replace: true,
        state: { sessionExpired: true },
      })
    }, ms)
  }

  // ── On every route change: only act if user IS logged in ──
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return // no session → nothing to guard

    if (isSessionExpired()) {
      // Session was active but has now expired
      clearSession()
      const authPaths = ['/login', '/register', '/verify-email', '/forgot-password', '/auth/google/callback']
      const isAuthPage = authPaths.some(p => location.pathname.startsWith(p))
      if (!isAuthPage) {
        navigate('/login', { replace: true, state: { sessionExpired: true } })
      }
    } else {
      scheduleAutoLogout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // ── Also check when the tab regains focus ─────────────────
  useEffect(() => {
    const handleFocus = () => {
      const token = localStorage.getItem('token')
      if (!token) return

      if (isSessionExpired()) {
        clearSession()
        navigate('/login', { replace: true, state: { sessionExpired: true } })
      } else {
        scheduleAutoLogout()
      }
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // ── Cleanup timer on unmount ───────────────────────────────
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return null // renders nothing
}
