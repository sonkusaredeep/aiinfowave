import { Link } from 'react-router-dom'
import logo from '../../../assets/Logo.png'
import s from './Footer.module.css'

const Ico = {
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  ),
}

export default function Footer() {
  return (
    <footer className={s.footer} role="contentinfo">
      <div className={s.footerGrid}>
        <div className={s.footerBrand}>
          <Link to="/" className={s.footerLogoRow} aria-label="AI Infowave home">
            <img src={logo} alt="AI Infowave Logo" style={{ height: 34, width: 'auto' }} />
            <span className={s.footerLogoText}>AI <span>Infowave</span></span>
          </Link>
          <p className={s.footerDesc}>
            AI Solutions for Healthcare, Agriculture & Modern Businesses.
            Empowering organizations to transform research, operations, and decision-making for real-world impact.
          </p>
          <div className={s.footerSocRow}>
            {[['globe', Ico.globe], ['linkedin', Ico.linkedin], ['twitter', Ico.twitter]].map(([key, icon]) => (
              <a key={key} href="#" className={s.footerSoc} aria-label={key}>{icon}</a>
            ))}
          </div>
        </div>

        {[
          { head: 'Platform', links: [['Home', '/'], ['Services', '/services'], ['Open Projects', '/open-project-call']] },
          { head: 'Company', links: [['About', '/about'], ['Internships', '/internship'], ['Careers', '/career'], ['Contact', '/contact']] },
          { head: 'Legal', links: [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Cookies', '/cookies']] },
        ].map(col => (
          <div key={col.head} className={s.footerCol}>
            <div className={s.footerColHead}>{col.head}</div>
            {col.links.map(([label, path]) => (
              <Link key={label} to={path} className={s.footerLink}>{label}</Link>
            ))}
          </div>
        ))}
      </div>

      <div className={s.footerBottom}>
        <span className={s.footerCopy}>© 2024 AI Infowave.</span>
        <div className={s.footerBottomLinks}>
          <a href="/privacy" className={s.footerBottomLink}>Privacy</a>
          <a href="/terms" className={s.footerBottomLink}>Terms</a>
          <a href="/cookies" className={s.footerBottomLink}>Cookies</a>
        </div>
      </div>
    </footer>
  )
}
