import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Mail, Phone, MapPin, Send, ChevronLeft,
  Clock, MessageSquare, ArrowRight, CheckCircle2,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../../components/layout/Footer/Footer'
import s from './ContactPage.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const CONTACT_INFO = [
  {
    icon: <Mail size={22} />,
    label: 'Email Us',
    value: 'princetandel947@gmail.com',
    sub: 'We reply within 24 hours',
    accent: '#2563eb',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=princetandel947@gmail.com&su=Inquiry%20from%20Website',
  },
  {
    icon: <Phone size={22} />,
    label: 'Call Us',
    value: '+1 (639) 470-1043',
    sub: 'Mon–Fri, 9 AM – 6 PM EST',
    accent: '#7c3aed',
    href: 'tel:+16394701043',
  },
  {
    icon: <MapPin size={22} />,
    label: 'Our Location',
    value: 'Saskatoon, SK',
    sub: 'Canada',
    accent: '#06b6d4',
    href: 'https://www.google.com/maps/place/706+Confederation+Dr,+Saskatoon,+SK+S7L+5R7,+Canada/@52.1352067,-106.7247316,134m/data=!3m1!1e3!4m15!1m8!3m7!1s0x5304f767b4f26015:0xcd1568ef6587b2f8!2s706+Confederation+Dr,+Saskatoon,+SK+S7L+5R7,+Canada!3b1!8m2!3d52.1350998!4d-106.7248186!16s%2Fg%2F11c288_tww!3m5!1s0x5304f767b4f26015:0xcd1568ef6587b2f8!8m2!3d52.1350998!4d-106.7248186!16s%2Fg%2F11c288_tww?hl=en&entry=ttu&g_ep=EgoyMDI2MDUxMS4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    icon: <Clock size={22} />,
    label: 'Response Time',
    value: '< 24 Hours',
    sub: 'Average first response',
    accent: '#059669',
    href: '#',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Auth Check: Redirect to login if user is not authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    setLoading(true)
    setErrorMsg('')
    
    try {
      const response = await fetch('http://localhost:5000/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
      } else {
        setErrorMsg(data.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setErrorMsg('Failed to connect to the server. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.page}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className={s.hero}>
        <div className={`${s.blob} ${s.blob1}`} />
        <div className={`${s.blob} ${s.blob2}`} />

        <div className={s.heroInner}>
          <motion.div
            className={s.heroText}
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp}>
              <Link to="/" className={s.backLink}>
                <ChevronLeft size={16} /> Back to Home
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className={s.pill}>
              <span className={s.pillDot} />
              Get In Touch
            </motion.div>

            <motion.h1 variants={fadeUp} className={s.h1}>
              Connect With Our<br />
              <span className={s.gradientText}>Scientific Experts</span>
            </motion.h1>

            <motion.p variants={fadeUp} className={s.heroLead}>
              Have a project in mind or need expert guidance on bioinformatics analysis?
              Our team of scientists and engineers is ready to help you unlock the full
              potential of your data.
            </motion.p>

            {/* Contact info cards */}
            <motion.div variants={fadeUp} className={s.infoCards}>
              {CONTACT_INFO.map(({ icon, label, value, sub, accent, href }) => (
                <a 
                  key={label} 
                  href={href} 
                  className={s.infoCard} 
                  style={{ '--accent': accent }}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    if (label === 'Email Us') {
                      navigator.clipboard.writeText(value);
                      // Let the link open Gmail in a new tab naturally
                    }
                  }}
                >
                  <div className={s.infoIconWrap}>{icon}</div>
                  <div className={s.infoText}>
                    <span className={s.infoLabel}>{label}</span>
                    <span className={s.infoValue}>{value}</span>
                    <span className={s.infoSub}>{sub}</span>
                  </div>
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── FORM ── */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className={s.formWrap}
          >
            <div className={s.formGlow} />
            <div className={s.formCard}>
              {submitted ? (
                <motion.div
                  className={s.successState}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={s.successIcon}>
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className={s.successH3}>Message Sent!</h3>
                  <p className={s.successP}>
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button className={s.btnPrimary} onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}>
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className={s.formHeader}>
                    <div className={s.formHeaderIcon}>
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h2 className={s.formTitle}>Send Us a Message</h2>
                      <p className={s.formSub}>Fill out the form and we'll be in touch shortly.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className={s.form}>
                    <div className={s.formRow}>
                      <div className={s.fieldGroup}>
                        <label className={s.label} htmlFor="name">Full Name *</label>
                        <input
                          id="name" name="name" type="text" required
                          className={s.input} placeholder="Dr. Jane Smith"
                          value={form.name} onChange={handleChange}
                        />
                      </div>
                      <div className={s.fieldGroup}>
                        <label className={s.label} htmlFor="email">Email Address *</label>
                        <input
                          id="email" name="email" type="email" required
                          className={s.input} placeholder="jane@university.edu"
                          value={form.email} onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className={s.fieldGroup}>
                      <label className={s.label} htmlFor="subject">Subject *</label>
                      <input
                        id="subject" name="subject" type="text" required
                        className={s.input} placeholder="e.g. WGS Analysis for 50 samples"
                        value={form.subject} onChange={handleChange}
                      />
                    </div>

                    <div className={s.fieldGroup} style={{ marginTop: '16px' }}>
                      <label className={s.label} htmlFor="message">Message *</label>
                      <textarea
                        id="message" name="message" required rows={5}
                        className={s.textarea}
                        placeholder="Tell us about your project, dataset size, timeline, and any specific requirements…"
                        value={form.message} onChange={handleChange}
                      />
                    </div>

                    {errorMsg && (
                      <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem' }}>
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      className={s.btnPrimary}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className={s.spinner} />
                      ) : (
                        <>Send Message <Send size={16} /></>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />


    </div>
  )
}
