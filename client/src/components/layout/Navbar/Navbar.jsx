import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrolled } from '../../../hooks/useScrolled'
import { NAV_LINKS, CTA_LINK } from '../../../utils/constants'
import styles from './Navbar.module.css'
import logo from '../../../assets/Logo.png'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrolled(20)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Authentication & Dropdown States
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)


  // Sync user state on page load/pathname change
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      setUser(null)
    }
  }, [pathname])

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setDropdownOpen(false)
    // Navigate to login cleanly — no reload so React state is fully reset
    navigate('/login', { replace: true })
  }

  const handleCtaClick = (e) => {
    e.preventDefault()
    closeMenu()
    navigate('/open-project-call')
  }

  return (
    <header
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      role="banner"
    >
      <div className={styles.inner}>

        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={closeMenu}
          aria-label="AI Infowave home">
          <img src={logo} alt="AI Infowave Logo" style={{ height: 48, width: 'auto', objectFit: 'contain', maxHeight: '100%' }} />
          <span className={styles.logoText}>
            AI <span>Infowave</span>
          </span>
        </Link>

        {/* Desktop nav + auth — all left-aligned */}
        <div className={styles.navGroup}>
          <nav aria-label="Main navigation">
            <ul className={styles.navLinks} role="list">
              {NAV_LINKS.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`${styles.navLink} ${pathname === path ? styles.active : ''}`}
                    aria-current={pathname === path ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Authentication Section */}
          {user ? (
            <div className={styles.profileWrapper}>
              <button
                className={styles.profileCircle}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Open profile menu"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div className={styles.dropdownOverlay} onClick={() => setDropdownOpen(false)} />
                    <motion.div
                      className={styles.profileDropdown}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className={styles.dropdownHeader}>
                        <span className={styles.dropdownName}>{user.name}</span>
                        <span className={styles.dropdownEmail}>{user.email}</span>
                      </div>
                      <div className={styles.dropdownDivider} />

                      <button
                        className={`${styles.dropdownItem} ${styles.logoutItem}`}
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className={`${styles.navLink} ${styles.desktopLogin} ${pathname === '/login' ? styles.active : ''}`}
            >
              Login
            </Link>
          )}
        </div>

        {/* Desktop CTA — pinned right */}
        <a href={CTA_LINK.path} onClick={handleCtaClick} className={styles.ctaBtn}>
          {CTA_LINK.label}
        </a>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu with animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            className={styles.mobileMenu}
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`${styles.mobileLink} ${pathname === path ? styles.active : ''}`}
                onClick={closeMenu}
                aria-current={pathname === path ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}

            {user ? (
              <>

                <button
                  className={`${styles.mobileLinkButton} ${styles.mobileLogout}`}
                  onClick={() => {
                    closeMenu()
                    handleLogout()
                  }}
                >
                  Log Out ({user.name})
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`${styles.mobileLink} ${pathname === '/login' ? styles.active : ''}`}
                onClick={closeMenu}
              >
                Login
              </Link>
            )}

            <a
              href={CTA_LINK.path}
              className={styles.mobileCta}
              onClick={handleCtaClick}
            >
              {CTA_LINK.label}
            </a>
          </motion.nav>
        )}
      </AnimatePresence>


    </header>
  )
}


