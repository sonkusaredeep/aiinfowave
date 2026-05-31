import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Clock, Calendar } from 'lucide-react'
import logo from '../../assets/Logo.png'
import authCollaborate from '../../assets/auth_collaborate.png'
import Footer from '../../components/layout/Footer/Footer'
import s from './BookingPage.module.css'

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
  const [bookedSlots, setBookedSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  
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
  
  // ── Fetch Booked Slots when date changes ────────────────────
  useEffect(() => {
    if (!form.date) return
    
    const fetchBookedSlots = async () => {
      setLoadingSlots(true)
      try {
        const response = await fetch(`http://localhost:5000/api/bookings/booked-slots?date=${form.date}`)
        const data = await response.json()
        if (response.ok && data.success) {
          setBookedSlots(data.bookedSlots || [])
        } else {
          setBookedSlots([])
        }
      } catch (err) {
        console.error('Failed to load booked slots', err)
        setBookedSlots([])
      } finally {
        setLoadingSlots(false)
      }
    }
    
    fetchBookedSlots()
  }, [form.date])

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
      text: form.timeSlot ? `Consultation scheduled at ${form.timeSlot} ☀️` : 'Have a wonderful day! ☀️'
    }
  }
  
  const selectedDetails = getSelectedDayDetails()

  // ── Handlers ────────────────────────────────────────────────
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  
  const handleStepNext = () => {
    if (step === 1 && form.service) setStep(2)
    else if (step === 2 && form.date && form.timeSlot) setStep(3)
  }
  
  const handleStepBack = () => {
    if (step > 1) setStep(step - 1)
  }
  
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    
    // Auth Check: Redirect to login if user is not authenticated (consistent with other features)
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { state: { from: '/book' } })
      return
    }

    setSubmitLoading(true)
    setErrorMsg('')
    
    try {
      const response = await fetch('http://localhost:5000/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      
      {/* Premium Animated Background */}
      <div className={s.bgAnimations}>
        <div className={s.blob1} />
        <div className={s.blob2} />
        <div className={s.blob3} />
        <div className={s.bgGridPattern} />
      </div>
      
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
                  <span>Date & time</span>
                </button>
                <button 
                  className={`${s.stepButton} ${step === 3 ? s.stepButtonActive : ''}`}
                  onClick={() => form.service && form.date && form.timeSlot && setStep(3)}
                  disabled={!form.service || !form.date || !form.timeSlot}
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
                        <div className={s.stepHeader}>Step 2 · Date & Time</div>
                        
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

                        {/* Time Slot Picker */}
                        {form.date && (
                          <div className={s.slotsSection}>
                            <div className={s.slotsTitle}>Available time slots</div>
                            
                            {loadingSlots ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 0' }}>
                                <span className={s.loadingSpinner} />
                                <span style={{ fontSize: '13px', color: '#64748B' }}>Loading free slots...</span>
                              </div>
                            ) : (
                              <div className={s.slotsGrid}>
                                {TIME_SLOTS.map(slot => {
                                  const isBooked = bookedSlots.includes(slot)
                                  const isSelected = form.timeSlot === slot
                                  return (
                                    <button
                                      key={slot}
                                      className={`${s.slotBtn} ${isSelected ? s.slotBtnSelected : ''} ${isBooked ? s.slotBtnBooked : ''}`}
                                      disabled={isBooked}
                                      onClick={() => setForm(prev => ({ ...prev, timeSlot: slot }))}
                                      type="button"
                                    >
                                      {slot}
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )}
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
                          <label className={s.label} htmlFor="phone">Phone Number *</label>
                          <input
                            id="phone" name="phone" type="tel" required
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
                        disabled={step === 1 ? !form.service : (!form.date || !form.timeSlot)}
                        type="button"
                      >
                        Next Step <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button 
                        className={s.btnNext} 
                        onClick={handleFormSubmit}
                        disabled={submitLoading || !form.name || !form.email || !form.phone}
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
