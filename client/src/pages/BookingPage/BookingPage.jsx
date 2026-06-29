import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Clock, Calendar } from 'lucide-react'
import logo from '../../assets/Logo.png'
import authCollaborate from '../../assets/auth_collaborate.png'
import Footer from '../../components/layout/Footer/Footer'
import s from './BookingPage.module.css'
import { API_BASE_URL } from '../../config'

const SERVICES = [
  'Bio & Health AI Consultation',
  'Agriculture AI Consultation',
  'AI for Small Business Consultation',
  'AI Training & Literacy Consultation'
]

const TIME_SLOTS = [
  '09:30 AM',
  '10:30 AM',
  '11:30 AM',
  '01:30 PM',
  '02:30 PM',
  '03:30 PM',
  '04:30 PM'
]

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function BookingPage() {
  const navigate = useNavigate()
  
  // ── States ──────────────────────────────────────────────────
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    service: '',
    date: '', // YYYY-MM-DD
    timeSlot: '',
    name: '',
    email: '',
    phone: '',
    details: ''
  })
  
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date())
  
  const [submitLoading, setSubmitLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  // ── Sync User Data ──────────────────────────────────────────
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setForm(prev => ({
        ...prev,
        name: parsed.name || '',
        email: parsed.email || ''
      }))
    }
  }, [])

  // ── Calendar Helpers ────────────────────────────────────────
  const year = currentMonthDate.getFullYear()
  const month = currentMonthDate.getMonth()
  
  const firstDayIndex = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()
  
  const handlePrevMonth = () => {
    const today = new Date()
    if (year === today.getFullYear() && month === today.getMonth()) return
    setCurrentMonthDate(new Date(year, month - 1, 1))
  }
  
  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1))
  }
  
  const handleSelectDay = (day) => {
    const selectedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setForm(prev => ({ ...prev, date: selectedDateStr, timeSlot: '' })) // Reset time slot on date change
  }
  
  const getSelectedDayDetails = () => {
    if (!form.date) {
      const d = new Date()
      return {
        dayNum: String(d.getDate()).padStart(2, '0'),
        monthName: MONTH_NAMES[d.getMonth()].substring(0, 3).toUpperCase(),
        dayName: d.toLocaleDateString('en-US', { weekday: 'long' }),
        fullString: d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        text: 'Select your date above! 🗓'
      }
    }
    const [y, m, d] = form.date.split('-').map(Number)
    const dateObj = new Date(y, m - 1, d)
    return {
      dayNum: String(d).padStart(2, '0'),
      monthName: MONTH_NAMES[m - 1].substring(0, 3).toUpperCase(),
      dayName: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
      fullString: dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      text: 'Have a wonderful day! ☀️'
    }
  }
  
  const selectedDetails = getSelectedDayDetails()

  // ── Handlers ────────────────────────────────────────────────
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  
  const handleStepNext = () => {
    if (step === 1 && form.service) setStep(2)
    else if (step === 2 && form.date) setStep(3)
  }
  
  const handleStepBack = () => {
    if (step > 1) setStep(step - 1)
  }
  
  const handleFormSubmit = async (e) => {
    e.preventDefault()

    setSubmitLoading(true)
    setErrorMsg('')
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setSuccess(true)
      } else {
        setErrorMsg(data.message || 'Booking conflict or server error. Please try again.')
      }
    } catch (err) {
      setErrorMsg('Failed to connect to the server. Please try again later.')
    } finally {
      setSubmitLoading(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className={s.page}>
      
      {/* Premium Jigsaw Puzzle Background */}
      <PuzzleBackground />
      
      <section className={s.hero} aria-label="Booking Consultation Page">
        <div className={s.inner}>
          
          <div className={s.bookingGrid}>
            
            {/* Left Column: Interactive Booking Widget */}
            <div className={s.bookingCard}>
              
              <div className={s.cardLabel}>Booking Window</div>
              <h1 className={s.cardTitle}>Book your free consultation</h1>
              <p className={s.cardSubtitle}>Select service, choose a slot, then add your details.</p>
              
              {/* Stepper Buttons */}
              <div className={s.stepper} role="navigation" aria-label="Progress Stepper">
                <button 
                  className={`${s.stepButton} ${step === 1 ? s.stepButtonActive : s.stepButtonDone}`}
                  onClick={() => setStep(1)}
                  type="button"
                >
                  <span className={s.stepNum}>Step 1</span>
                  <span>Service</span>
                </button>
                <button 
                  className={`${s.stepButton} ${step === 2 ? s.stepButtonActive : (step > 2 ? s.stepButtonDone : '')}`}
                  onClick={() => form.service && setStep(2)}
                  disabled={!form.service}
                  type="button"
                >
                  <span className={s.stepNum}>Step 2</span>
                  <span>Date</span>
                </button>
                <button 
                  className={`${s.stepButton} ${step === 3 ? s.stepButtonActive : ''}`}
                  onClick={() => form.service && form.date && setStep(3)}
                  disabled={!form.service || !form.date}
                  type="button"
                >
                  <span className={s.stepNum}>Step 3</span>
                  <span>Details</span>
                </button>
              </div>

              {success ? (
                <div className={s.successState}>
                  <div className={s.successIcon}>
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className={s.successTitle}>Booking Confirmed!</h2>
                  <p className={s.successText}>
                    Thank you for booking a consultation. A confirmation email has been sent to <strong>{form.email}</strong>. We look forward to talking to you!
                  </p>
                  <button className={s.btnHome} onClick={() => navigate('/')}>
                    Return to Home
                  </button>
                </div>
              ) : (
                <>
                  {/* Step Contents */}
                  <div className={s.stepContainer}>
                    {step === 1 && (
                      <div>
                        <div className={s.stepHeader}>Step 1 · Service</div>
                        <div className={s.selectWrapper}>
                          <select 
                            className={s.select}
                            value={form.service}
                            onChange={(e) => setForm(prev => ({ ...prev, service: e.target.value }))}
                            aria-label="Choose a service"
                          >
                            <option value="">Choose a service</option>
                            {SERVICES.map(svc => (
                              <option key={svc} value={svc}>{svc}</option>
                            ))}
                          </select>
                          <ChevronRight className={s.selectIcon} size={18} style={{ transform: 'rotate(90deg)' }} />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className={s.calendarContainer}>
                        <div className={s.stepHeader}>Step 2 · Select Date</div>
                        
                        {/* Monthly Calendar View */}
                        <div>
                          <div className={s.calendarHeader}>
                            <span className={s.calendarTitle}>
                              {MONTH_NAMES[month]} {year}
                            </span>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button 
                                className={s.calNavBtn}
                                onClick={handlePrevMonth}
                                type="button"
                                aria-label="Previous month"
                                disabled={year === new Date().getFullYear() && month === new Date().getMonth()}
                              >
                                &lt;
                              </button>
                              <button 
                                className={s.calNavBtn}
                                onClick={handleNextMonth}
                                type="button"
                                aria-label="Next month"
                              >
                                &gt;
                              </button>
                            </div>
                          </div>

                          <div className={s.calGrid}>
                            {WEEK_DAYS.map(day => (
                              <div key={day} className={s.dayLabel}>{day}</div>
                            ))}
                            
                            {/* Empty days at start */}
                            {Array.from({ length: firstDayIndex }).map((_, i) => (
                              <div key={`empty-${i}`} />
                            ))}
                            
                            {/* Calendar Days */}
                            {Array.from({ length: totalDays }).map((_, i) => {
                              const d = i + 1
                              const dayObj = new Date(year, month, d)
                              const today = new Date()
                              today.setHours(0,0,0,0)
                              
                              const isPast = dayObj < today
                              const isToday = dayObj.getTime() === today.getTime()
                              const isWeekend = dayObj.getDay() === 0 || dayObj.getDay() === 6
                              
                              // We only allow booking Mon-Fri (consistent with consultant availability)
                              const isDisabled = isPast || isWeekend
                              
                              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                              const isSelected = form.date === dateStr

                              return (
                                <button
                                  key={`day-${d}`}
                                  className={`${s.calDay} ${isDisabled ? s.calDayDisabled : ''} ${isSelected ? s.calDaySelected : ''} ${isToday ? s.calDayToday : ''}`}
                                  onClick={() => !isDisabled && handleSelectDay(d)}
                                  disabled={isDisabled}
                                  type="button"
                                >
                                  {d}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <form onSubmit={handleFormSubmit} className={s.form}>
                        <div className={s.stepHeader}>Step 3 · Add Your Details</div>
                        
                        <div className={s.formRow}>
                          <div className={s.fieldGroup}>
                            <label className={s.label} htmlFor="name">Full Name *</label>
                            <input
                              id="name" name="name" type="text" required
                              className={s.input} placeholder="Jane Smith"
                              value={form.name} onChange={handleInputChange}
                            />
                          </div>
                          
                          <div className={s.fieldGroup}>
                            <label className={s.label} htmlFor="email">Email Address *</label>
                            <input
                              id="email" name="email" type="email" required
                              className={s.input} placeholder="jane@company.com"
                              value={form.email} onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className={s.fieldGroup}>
                          <label className={s.label} htmlFor="phone">Phone Number</label>
                          <input
                            id="phone" name="phone" type="tel"
                            className={s.input} placeholder="+1 (555) 019-2834"
                            value={form.phone} onChange={handleInputChange}
                          />
                        </div>

                        <div className={s.fieldGroup}>
                          <label className={s.label} htmlFor="details">Project Details / Questions</label>
                          <textarea
                            id="details" name="details" rows={3}
                            className={s.textarea} placeholder="Tell us briefly about your project dataset, goals, or questions..."
                            value={form.details} onChange={handleInputChange}
                          />
                        </div>
                      </form>
                    )}
                  </div>

                  {errorMsg && (
                    <div className={s.errorMsg}>
                      <AlertCircle size={16} />
                      {errorMsg}
                    </div>
                  )}

                  {/* Navigation Actions */}
                  <div className={s.actions}>
                    {step > 1 && (
                      <button 
                        className={s.btnBack} 
                        onClick={handleStepBack}
                        type="button"
                      >
                        Back
                      </button>
                    )}

                    {step < 3 ? (
                      <button 
                        className={s.btnNext} 
                        onClick={handleStepNext}
                        disabled={step === 1 ? !form.service : !form.date}
                        type="button"
                      >
                        Next Step <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button 
                        className={s.btnNext} 
                        onClick={handleFormSubmit}
                        disabled={submitLoading || !form.name || !form.email}
                        type="button"
                      >
                        {submitLoading ? 'Scheduling...' : 'Confirm Booking'}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Visual Side Panel Card */}
            <div className={s.sidebarCard}>
              <img 
                src={authCollaborate} 
                alt="AI Infowave Team Collaboration" 
                className={s.sidebarBgImage}
              />
              <div className={s.sidebarOverlay} />
              
              {/* Header Badge */}
              <div className={s.sidebarTop}>
                <div className={s.logoBadge}>
                  <img src={logo} alt="AI Infowave Logo" className={s.logoImg} />
                  <span className={s.logoText}>Welcome to AI Infowave</span>
                </div>
              </div>

              {/* Bottom Details Card Overlay */}
              <div className={s.sidebarBottom}>
                <div className={s.calDetailsCard}>
                  
                  {/* Calendar Sheet Icon */}
                  <div className={s.sheetCal}>
                    <div className={s.sheetCalHeader}>
                      {selectedDetails.monthName}
                    </div>
                    <div className={s.sheetCalBody}>
                      {selectedDetails.dayNum}
                    </div>
                  </div>

                  {/* Calendar sheet text */}
                  <div className={s.calDetailsText}>
                    <h3 className={s.calDetailsTitle}>
                      {selectedDetails.dayName}, {selectedDetails.monthName} {selectedDetails.dayNum}, {year}
                    </h3>
                    <p className={s.calDetailsSub}>
                      {selectedDetails.text}
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}

/* ── Puzzle Background Component ────────────────────────── */
function PuzzleBackground() {
  const cols = 50
  const rows = 35

  // Generate stable, interlocking vertical and horizontal edges
  const horizontalEdges = useMemo(() => {
    const edges = []
    for (let r = 0; r < rows - 1; r++) {
      const row = []
      for (let c = 0; c < cols; c++) {
        row.push(Math.random() > 0.5 ? 1 : -1)
      }
      edges.push(row)
    }
    return edges
  }, [])

  const verticalEdges = useMemo(() => {
    const edges = []
    for (let r = 0; r < rows; r++) {
      const row = []
      for (let c = 0; c < cols - 1; c++) {
        row.push(Math.random() > 0.5 ? 1 : -1)
      }
      edges.push(row)
    }
    return edges
  }, [])

  // Dynamic royal blue palette variations to match the multicolored visual puzzle grid
  const pieceShades = useMemo(() => {
    const shades = []
    const palette = [
      { start: "#ffffff", end: "#fafafa" }, // Pure white to very light gray
      { start: "#ffffff", end: "#fcfdfd" }, // Solid soft white
      { start: "#fcfdfd", end: "#f8fafc" }, // Faint off-white
      { start: "#ffffff", end: "#fafbfb" }, // Clear white glow
      { start: "#fafafa", end: "#f5f5f5" }  // Very soft gray
    ]
    for (let r = 0; r < rows; r++) {
      const row = []
      for (let c = 0; c < cols; c++) {
        const index = Math.floor(Math.random() * palette.length)
        row.push(palette[index])
      }
      shades.push(row)
    }
    return shades
  }, [])

  // Build all the interlocking puzzle paths
  const pieces = useMemo(() => {
    const list = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const top = r === 0 ? 0 : -horizontalEdges[r - 1][c]
        const right = c === cols - 1 ? 0 : verticalEdges[r][c]
        const bottom = r === rows - 1 ? 0 : horizontalEdges[r][c]
        const left = c === 0 ? 0 : -verticalEdges[r][c - 1]

        const x = c * 100
        const y = r * 100

        let d = `M ${x} ${y} `

        // 1. Top Edge (left to right)
        if (top === 0) {
          d += `L ${x + 100} ${y} `
        } else if (top === 1) {
          d += `L ${x + 38} ${y} C ${x + 34} ${y - 15}, ${x + 42} ${y - 22}, ${x + 50} ${y - 22} C ${x + 58} ${y - 22}, ${x + 66} ${y - 15}, ${x + 62} ${y} L ${x + 100} ${y} `
        } else if (top === -1) {
          d += `L ${x + 38} ${y} C ${x + 34} ${y + 15}, ${x + 42} ${y + 22}, ${x + 50} ${y + 22} C ${x + 58} ${y + 22}, ${x + 66} ${y + 15}, ${x + 62} ${y} L ${x + 100} ${y} `
        }

        // 2. Right Edge (top to bottom)
        if (right === 0) {
          d += `L ${x + 100} ${y + 100} `
        } else if (right === 1) {
          d += `L ${x + 100} ${y + 38} C ${x + 115} ${y + 34}, ${x + 122} ${y + 42}, ${x + 122} ${y + 50} C ${x + 122} ${y + 58}, ${x + 115} ${y + 66}, ${x + 100} ${y + 62} L ${x + 100} ${y + 100} `
        } else if (right === -1) {
          d += `L ${x + 100} ${y + 38} C ${x + 85} ${y + 34}, ${x + 78} ${y + 42}, ${x + 78} ${y + 50} C ${x + 78} ${y + 58}, ${x + 85} ${y + 66}, ${x + 100} ${y + 62} L ${x + 100} ${y + 100} `
        }

        // 3. Bottom Edge (right to left)
        if (bottom === 0) {
          d += `L ${x} ${y + 100} `
        } else if (bottom === 1) {
          d += `L ${x + 62} ${y + 100} C ${x + 66} ${y + 115}, ${x + 58} ${y + 122}, ${x + 50} ${y + 122} C ${x + 42} ${y + 122}, ${x + 34} ${y + 115}, ${x + 38} ${y + 100} L ${x} ${y + 100} `
        } else if (bottom === -1) {
          d += `L ${x + 62} ${y + 100} C ${x + 66} ${y + 85}, ${x + 58} ${y + 78}, ${x + 50} ${y + 78} C ${x + 42} ${y + 78}, ${x + 34} ${y + 85}, ${x + 38} ${y + 100} L ${x} ${y + 100} `
        }

        // 4. Left Edge (bottom to top)
        if (left === 0) {
          d += `L ${x} ${y} `
        } else if (left === 1) {
          d += `L ${x} ${y + 62} C ${x - 15} ${y + 66}, ${x - 22} ${y + 58}, ${x - 22} ${y + 50} C ${x - 22} ${y + 42}, ${x - 15} ${y + 34}, ${x} ${y + 38} L ${x} ${y} `
        } else if (left === -1) {
          d += `L ${x} ${y + 62} C ${x + 15} ${y + 66}, ${x + 22} ${y + 58}, ${x + 22} ${y + 50} C ${x + 22} ${y + 42}, ${x + 15} ${y + 34}, ${x} ${y + 38} L ${x} ${y} `
        }

        d += "Z"

        list.push({
          id: `${r}-${c}`,
          d,
          color: pieceShades[r][c]
        })
      }
    }
    return list
  }, [horizontalEdges, verticalEdges, pieceShades])

  return (
    <div className={s.puzzleBackgroundContainer}>
      <svg
        className={s.puzzleWallSvg}
        viewBox={`0 0 ${cols * 100} ${rows * 100}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {pieces.map((p) => (
            <linearGradient key={`grad-${p.id}`} id={`pieceGrad-${p.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={p.color.start} stopOpacity="0.92" />
              <stop offset="100%" stopColor={p.color.end} stopOpacity="0.98" />
            </linearGradient>
          ))}
        </defs>
        {pieces.map((p) => (
          <path
            key={p.id}
            d={p.d}
            fill={`url(#pieceGrad-${p.id})`}
            stroke="#FFC72C"
            strokeWidth="1.2"
            strokeOpacity="0.45"
            strokeLinejoin="round"
            style={{ transition: 'fill 0.3s ease' }}
          />
        ))}
      </svg>
    </div>
  )
}
