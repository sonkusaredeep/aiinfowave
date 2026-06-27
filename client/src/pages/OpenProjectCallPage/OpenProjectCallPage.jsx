import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Footer from '../../components/layout/Footer/Footer'
import s from './OpenProjectCallPage.module.css'
import { API_BASE_URL } from '../../config'

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

/* ── Premium Network / Constellation Animation ── */
function NetworkCanvas() {
  const ref = useRef(null)
  const mouse = useRef({ x: null, y: null })

  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight
    let pts = [], count = Math.min(Math.floor((W * H) / 15000), 100)
    let raf

    const createPts = () => {
      pts = []
      for (let i = 0; i < count; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.5 + 0.6,
          phase: Math.random() * Math.PI * 2
        })
      }
    }

    const handleResize = () => {
      W = c.width = c.offsetWidth; H = c.height = c.offsetHeight
      createPts()
    }

    const handleMouseMove = (e) => {
      const rect = c.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const handleMouseLeave = () => {
      mouse.current = { x: null, y: null }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    createPts()

    function frame() {
      ctx.clearRect(0, 0, W, H)
      
      pts.forEach(p => {
        // Move slowly
        p.x += p.vx
        p.y += p.vy
        p.phase += 0.012

        // Dual-force interaction field (prevents clumping, creates beautiful orbits!)
        if (mouse.current.x !== null) {
          const dx = p.x - mouse.current.x
          const dy = p.y - mouse.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 220 && dist > 0) {
            if (dist < 90) {
              // Strong repulsion inside the core radius to push dots away
              const force = ((90 - dist) / 90) * 1.6
              p.x += (dx / dist) * force
              p.y += (dy / dist) * force
            } else {
              // Gentle attraction in the outer band to pull dots towards the orbit
              const force = ((dist - 90) / 130) * 0.12
              p.x -= (dx / dist) * force
              p.y -= (dy / dist) * force
            }
          }
        }

        // Bounces
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1

        // Organic twinkling size
        const currentR = p.r * (1 + Math.sin(p.phase) * 0.25)

        // Draw breathing node
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(37, 99, 235, ${0.45 + Math.sin(p.phase) * 0.18})`
        ctx.fill()
      })

      // Connections between nearby particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          
          if (d < 150) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(37, 99, 235, ${0.22 * (1 - d / 150)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }

        // Dynamic mouse connection lines with glowing violet aura
        if (mouse.current.x !== null) {
          const dx = mouse.current.x - pts[i].x
          const dy = mouse.current.y - pts[i].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 180 && d > 80) {
            ctx.beginPath()
            ctx.moveTo(mouse.current.x, mouse.current.y)
            ctx.lineTo(pts[i].x, pts[i].y)
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.42 * (1 - d / 180)})`
            ctx.lineWidth = 1.0
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return <canvas ref={ref} className={s.networkCanvas} />
}

export default function OpenProjectCallPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  const [form, setForm] = useState({
    name: '', email: '', institution: '', title: '',
    researchArea: '', summary: '', timeline: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const scrollToForm = () => {
    document.getElementById('application-portal')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { state: { from: '/open-project-call' } })
      return
    }

    setLoading(true)
    setErrorMsg('')
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/project-call/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitted(true)
      } else {
        setErrorMsg(data.message || 'Submission failed. Please contact support.')
      }
    } catch (err) {
      setErrorMsg('Unable to connect to the server. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.page}>

      {/* ── 1. PREMIUM HERO SECTION ── */}
      <section className={s.heroSection}>
        <NetworkCanvas />
        <div className={s.heroOverlay} />
        <div className={s.inner}>
          <motion.div 
            className={s.heroContent}
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className={s.pill}>
              <span className={s.pillDot} />
              Open Innovation Platform
            </motion.div>

            <motion.h1 variants={fadeUp} className={s.h1}>
              Open Call for<br />
              <span className={s.textHighlight}>Biological Breakthroughs</span>
            </motion.h1>

            <motion.p variants={fadeUp} className={s.heroLead}>
              We empower elite research teams with world-class computational infrastructure and proprietary AI models to accelerate global biological discoveries.
            </motion.p>

            <motion.div variants={fadeUp} className={s.heroCtas}>
              <button 
                className={s.btnPrimary}
                onClick={scrollToForm}
              >
                Start Project Submission <ArrowRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* ── 2. APPLICATION PORTAL (PRISTINE WHITE CARD) ── */}
      <section className={s.formSection} id="application-portal">
        <div className={s.formContainer}>
          
          <div className={s.formCard}>
            <div className={s.formCardHeader}>
              <h2 className={s.formCardTitle}>Application Portal</h2>
              <p className={s.formCardSub}>Please provide detailed specifications for your proposed research project. All submissions are processed under strict NDA compliance.</p>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className={s.successState}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className={s.successIcon}>
                    <CheckCircle2 size={56} strokeWidth={1.5} />
                  </div>
                  <h3 className={s.successH3}>Submission Confirmed</h3>
                  <p className={s.successP}>
                    Your project has been securely logged into our system. Our scientific board will review your specifications and contact you via email.
                  </p>
                  <button 
                    className={s.btnPrimary} 
                    onClick={() => { 
                      setSubmitted(false); 
                      setForm({ name: '', email: '', institution: '', title: '', researchArea: '', summary: '', timeline: '' }) 
                    }}
                  >
                    Submit Another Project
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className={s.formGroup}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  
                  {/* BLOCK 1: RESEARCH AREA */}
                  <div className={s.formSectionBlock}>
                    <div className={s.sectionLabel}>1. Analytical Domain</div>
                    <div className={s.fieldGroup}>
                      <label className={s.label} htmlFor="researchArea">Select Service Category / Domain of Interest *</label>
                      <select
                        id="researchArea" name="researchArea" required
                        className={s.selectInput}
                        value={form.researchArea} onChange={handleChange}
                      >
                        <option value="">-- Select a Category --</option>
                        <option value="Bio & Health AI Services">Bio & Health AI Services</option>
                        <option value="Agriculture AI Services">Agriculture AI Services</option>
                        <option value="AI for Small Businesses">AI for Small Businesses</option>
                        <option value="Education & Knowledge Products">Education & Knowledge Products</option>
                      </select>
                    </div>
                  </div>

                  {/* BLOCK 2: INVESTIGATOR DETAILS */}
                  <div className={s.formSectionBlock}>
                    <div className={s.sectionLabel}>2. Principal Investigator</div>
                    <div className={s.formRow}>
                      <div className={s.fieldGroup}>
                        <label className={s.label} htmlFor="name">Full Name *</label>
                        <input
                          id="name" name="name" type="text" required
                          className={s.input} placeholder="Dr. First Last"
                          value={form.name} onChange={handleChange}
                        />
                      </div>
                      <div className={s.fieldGroup}>
                        <label className={s.label} htmlFor="email">Institutional Email *</label>
                        <input
                          id="email" name="email" type="email" required
                          className={s.input} placeholder="investigator@institution.edu"
                          value={form.email} onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className={s.fieldGroup}>
                      <label className={s.label} htmlFor="institution">Institution / Organization *</label>
                      <input
                        id="institution" name="institution" type="text" required
                        className={s.input} placeholder="e.g. Sanger Institute"
                        value={form.institution} onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* BLOCK 3: PROJECT SPECS */}
                  <div className={s.formSectionBlock}>
                    <div className={s.sectionLabel}>3. Project Specifications</div>
                    
                    <div className={s.fieldGroup}>
                      <label className={s.label} htmlFor="title">Project Title *</label>
                      <input
                        id="title" name="title" type="text" required
                        className={s.input} placeholder="Enter a concise title..."
                        value={form.title} onChange={handleChange}
                      />
                    </div>

                    <div className={s.fieldGroup}>
                      <label className={s.label} htmlFor="summary">Executive Summary *</label>
                      <textarea
                        id="summary" name="summary" required rows={4}
                        className={s.textarea}
                        placeholder="Detail the biological context, dataset volume (e.g. 1TB FASTQ), and required computational tools..."
                        value={form.summary} onChange={handleChange}
                      />
                    </div>

                    <div className={s.fieldGroup}>
                      <label className={s.label} htmlFor="timeline">Expected Timeline</label>
                      <input
                        id="timeline" name="timeline" type="text"
                        className={s.input} placeholder="e.g. Commencing Q4 2026"
                        value={form.timeline} onChange={handleChange}
                      />
                      <div className={s.timelineNote}>
                        Submit your project, we will reach you soon within 24 hours.
                      </div>
                    </div>
                  </div>

                  {errorMsg && (
                    <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: 500 }}>
                      {errorMsg}
                    </div>
                  )}

                  <div className={s.submitFooter}>
                    <button
                      type="submit"
                      className={s.btnPrimary}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className={s.spinner} />
                      ) : (
                        'Submit Project'
                      )}
                    </button>
                  </div>

                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  )
}
