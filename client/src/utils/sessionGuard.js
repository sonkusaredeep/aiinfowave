/**
 * sessionGuard.js
 * ─────────────────────────────────────────────────────────────
 * Client-side JWT expiry guard.
 *
 * Reads the stored token, decodes its payload (no library needed —
 * JWTs are just base64url-encoded JSON), and checks the `exp` field.
 * If the token is missing or expired, it clears localStorage and
 * redirects the user to /login.
 *
 * Usage:
 *   import { checkSession } from '../utils/sessionGuard'
 *   checkSession()   // call on every app mount / route change
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Decode the JWT payload without verifying the signature.
 * We only trust the payload for UI-side expiry checking;
 * the server still validates the signature on every API call.
 */
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    // Convert base64url → base64 → JSON
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64)
    return JSON.parse(json)
  } catch {
    return null
  }
}

/**
 * Returns true if the token is missing OR has expired.
 */
export function isSessionExpired() {
  const token = localStorage.getItem('token')
  if (!token) return true

  const payload = decodeJwtPayload(token)
  if (!payload || !payload.exp) return true

  // `exp` is in seconds; Date.now() is in ms
  return Date.now() >= payload.exp * 1000
}

/**
 * Returns the number of milliseconds until the session expires.
 * Returns 0 if already expired.
 */
export function msUntilExpiry() {
  const token = localStorage.getItem('token')
  if (!token) return 0
  const payload = decodeJwtPayload(token)
  if (!payload || !payload.exp) return 0
  const remaining = payload.exp * 1000 - Date.now()
  return remaining > 0 ? remaining : 0
}

/**
 * Clear auth data from localStorage and redirect to login.
 */
export function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

/**
 * Check the current session on every call.
 * If expired, clears localStorage and redirects to /login.
 * Call this at app startup and on every navigation event.
 *
 * @param {function} navigate - React Router `navigate` function
 * @param {string} currentPath - current pathname (skip redirect if already on /login)
 * @returns {boolean} true if session is valid, false if expired
 */
export function checkSession(navigate, currentPath = '') {
  const publicPaths = ['/login', '/register', '/verify-email', '/forgot-password', '/auth/google/callback']
  const isPublic = publicPaths.some(p => currentPath.startsWith(p))

  if (isSessionExpired()) {
    clearSession()
    if (!isPublic) {
      navigate('/login', { replace: true })
    }
    return false
  }
  return true
}
