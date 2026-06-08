import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { checkSession, msUntilExpiry, clearSession } from '../utils/sessionGuard'

/**
 * SessionGuard
 * ─────────────────────────────────────────────────────────────
 * Drop this component once inside your app tree (e.g., in Layout).
 * It does two things:
 *
 * 1. On every navigation (route change) it checks whether the
 *    stored JWT has expired.  If yes → clear storage → /login.
 *
 * 2. It schedules a precise timer to auto-logout the user exactly
 *    when the token expires, even if they sit idle on a page.
 * ─────────────────────────────────────────────────────────────
 */
export default function SessionGuard() {
  const navigate = useNavigate()
  const location = useLocation()
  const timerRef = useRef(null)

  // ── Helper: set/reset the auto-logout timer ────────────────
  const scheduleAutoLogout = () => {
    // Clear any existing timer
    if (timerRef.current) clearTimeout(timerRef.current)

    const ms = msUntilExpiry()
    if (ms <= 0) return // already expired — route-change check handles it

    timerRef.current = setTimeout(() => {
      clearSession()
      navigate('/login', {
        replace: true,
        state: { sessionExpired: true },
      })
    }, ms)
  }

  // ── Check session on every route change ───────────────────
  useEffect(() => {
    const valid = checkSession(navigate, location.pathname)
    if (valid) {
      scheduleAutoLogout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // ── Also check when the tab regains focus ─────────────────
  // (covers the case where the user leaves the tab open for hours)
  useEffect(() => {
    const handleFocus = () => {
      const valid = checkSession(navigate, location.pathname)
      if (valid) scheduleAutoLogout()
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
