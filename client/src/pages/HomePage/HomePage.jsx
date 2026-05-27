import { useRef, useCallback, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useInView } from 'framer-motion'
import {
  ArrowRight, Microscope, Leaf, Store, GraduationCap,
  Brain, Zap, ShieldCheck, Users, Rocket, ChevronRight, BookOpen
} from 'lucide-react'
import logo from '../../assets/Logo.png'
import Footer from '../../components/layout/Footer/Footer'
import s from './HomePage.module.css'

/* ── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  const end = parseInt(value)
  const isNumber = !isNaN(end)

  useEffect(() => {
    if (!isInView || !isNumber) return
    const duration = 2000
    const startTime = performance.now()
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))
      if (progress < 1) requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }, [isInView, end, isNumber])

  return <span ref={ref}>{isNumber ? count : value}{suffix}</span>
}

/* ── The Ultimate Hyper-Advanced Sci-Fi AI Hub ────────────────
   Features 3D perspective mouse parallax, PCB circuit traces, 
   radar sweeps, floating hex codes, DNA ribbons, and 
   a complex glowing polygonal core.
──────────────────────────────────────────────────────────── */
function AdvancedHeroAnimation() {
  const NODES = [
    { Icon: Microscope, color: '#38BDF8', angle: -90, r: 175, delay: 0 },
    { Icon: Leaf, color: '#4ADE80', angle: -18, r: 175, delay: 0.15 },
    { Icon: Store, color: '#FBBF24', angle: 54, r: 175, delay: 0.3 },
    { Icon: BookOpen, color: '#A78BFA', angle: 126, r: 175, delay: 0.45 },
    { Icon: Zap, color: '#F87171', angle: 198, r: 175, delay: 0.6 },
  ]
  const cx = 250, cy = 250

  const toXY = (angleDeg, radius) => {
    const a = (angleDeg * Math.PI) / 180
    return { x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius }
  }

  // Floating ambient particles removed as requested

  return (
    <div 
      className={s.hubWrap} 
      style={{ 
        width: '100%', maxWidth: '640px', margin: '0 auto', 
        aspectRatio: '1/1', position: 'relative'
      }}
    >
      <motion.div
        style={{
          width: '100%', height: '100%'
        }}
      >
        <svg viewBox="0 0 500 500" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFC72C" stopOpacity="0.4" />
              <stop offset="30%" stopColor="#3B82F6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
            <filter id="blurExt" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
            </filter>
            <filter id="glowLight" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
              <feComponentTransfer><feFuncA type="linear" slope="2" /></feComponentTransfer>
              <feBlend mode="screen" in="SourceGraphic" />
            </filter>
          </defs>

          {/* BACKGROUND LAYER */}
          <motion.g style={{ translateZ: -50 }}>
            {/* Ambient core glow */}
            <motion.circle 
              cx={cx} cy={cy} r="250" 
              fill="url(#coreGlow)" filter="url(#blurExt)" 
              animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Hexagonal Grid Pattern overlay */}
            <pattern id="hexGrid" width="40" height="69.282" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
              <path d="M40 17.32l-20 11.547L0 17.32V-5.774l20-11.547L40-5.774V17.32zm0 46.188l-20 11.548-20-11.548V40.414L20 28.867l20 11.547v23.094z" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </pattern>
            <circle cx={cx} cy={cy} r="240" fill="url(#hexGrid)" />
          </motion.g>

          {/* MIDDLE LAYER (Rings and Data Codes) */}
          <motion.g style={{ translateZ: 0 }}>
            {/* Massive Outer Orbital Rings */}
            <motion.circle
              cx={cx} cy={cy} r="235"
              fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="1 12" strokeLinecap="round"
              animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <motion.circle
              cx={cx} cy={cy} r="185"
              fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeDasharray="20 60 4 60"
              animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
          </motion.g>

          {/* FOREGROUND LAYER (Circuit Traces, DNA Ribbons, Core, Nodes) */}
          <motion.g style={{ translateZ: 50 }}>
            
            {/* PCB Circuit Trace Connections */}
            {NODES.map((node, i) => {
              const pt = toXY(node.angle, node.r)
              // Create a stepped circuit path instead of a straight line
              const midX = (cx + pt.x) / 2
              const path = `M ${cx} ${cy} L ${midX} ${cy} L ${midX} ${pt.y} L ${pt.x} ${pt.y}`
              
              return (
                <g key={`circuit-${i}`}>
                  {/* Circuit trace background */}
                  <motion.path
                    d={path} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: node.delay, ease: "easeOut" }}
                  />
                  {/* Glowing data packet traveling along circuit */}
                  <motion.circle r="3" fill={node.color} filter="url(#glowLight)">
                    <animateMotion dur="4s" repeatCount="indefinite" begin={`${node.delay}s`} path={path} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                  </motion.circle>
                </g>
              )
            })}

            {/* Rotating DNA Data Ribbons (Sine waves mapped to circles) */}
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: `${cx}px ${cy}px` }}>
              <path d={`M ${cx-80} ${cy} Q ${cx-40} ${cy-40} ${cx} ${cy} T ${cx+80} ${cy}`} fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 4" />
              <path d={`M ${cx-80} ${cy} Q ${cx-40} ${cy+40} ${cx} ${cy} T ${cx+80} ${cy}`} fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 4" />
            </motion.g>

            {/* Central Hyper-Core */}
            <g>
              {/* Outer Energy Shield */}
              <motion.circle 
                cx={cx} cy={cy} r="65" fill="none" stroke="#38BDF8" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="2 10"
                animate={{ scale: [1, 1.2], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
              {/* Inner Dark Sphere */}
              <circle cx={cx} cy={cy} r="58" fill="rgba(15,23,42,0.95)" stroke="rgba(255,199,44,0.8)" strokeWidth="2" filter="url(#glowLight)" />
              {/* Spinning Octagon wireframes */}
              <motion.polygon
                points={`${cx},${cy-50} ${cx+35},${cy-35} ${cx+50},${cy} ${cx+35},${cy+35} ${cx},${cy+50} ${cx-35},${cy+35} ${cx-50},${cy} ${cx-35},${cy-35}`}
                fill="none" stroke="#FFC72C" strokeWidth="1" strokeDasharray="8 4"
                animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
              <motion.polygon
                points={`${cx},${cy-50} ${cx+35},${cy-35} ${cx+50},${cy} ${cx+35},${cy+35} ${cx},${cy+50} ${cx-35},${cy+35} ${cx-50},${cy} ${cx-35},${cy-35}`}
                fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 8"
                animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
              {/* Glowing Brain Center */}
              <g transform={`translate(${cx - 26}, ${cy - 26})`}>
                <Brain size={52} color="#FFC72C" strokeWidth={1} filter="url(#glowLight)" />
              </g>
            </g>

            {/* Orbiting Interactive Nodes */}
            {NODES.map((node, i) => {
              const pt = toXY(node.angle, node.r)
              return (
                <motion.g
                  key={`node-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: node.delay + 0.2, type: "spring", bounce: 0.5 }}
                >
                  <g>
                    {/* Node glow aura */}
                    <circle cx={pt.x} cy={pt.y} r="48" fill={`${node.color}20`} filter="url(#blurExt)" />
                    {/* Outer Target Lock Ring */}
                    <motion.circle
                      cx={pt.x} cy={pt.y} r="40" fill="none" stroke={`${node.color}60`} strokeWidth="1.5" strokeDasharray="10 10"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10 + i*2, repeat: Infinity, ease: 'linear' }}
                      style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                    />
                    <motion.circle
                      cx={pt.x} cy={pt.y} r="34" fill="none" stroke={`${node.color}30`} strokeWidth="2" strokeDasharray="4 4"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 8 + i*2, repeat: Infinity, ease: 'linear' }}
                      style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                    />
                    {/* Inner glass background */}
                    <circle cx={pt.x} cy={pt.y} r="30" fill="rgba(2,6,23,0.9)" stroke={`${node.color}90`} strokeWidth="1.5" />
                    {/* Node Icon */}
                    <g transform={`translate(${pt.x - 16}, ${pt.y - 16})`}>
                      <node.Icon size={32} color={node.color} strokeWidth={1.5} filter="url(#glowLight)" />
                    </g>
                  </g>
                </motion.g>
              )
            })}
          </motion.g>

        </svg>
      </motion.div>
    </div>
  )
}

/* ── Service area cards for homepage ──────────────────────── */
const SERVICE_AREAS = [
  {
    emoji: '🏥',
    color: '#FFC72C',
    colorLight: 'rgba(255,199,44,0.12)',
    label: 'Bio & Health AI',
    desc: 'AI-powered research intelligence, data analysis, and grant support for researchers, clinics, and biotech startups.',
    bullets: ['Literature & Research AI', 'Gene Expression Analysis', 'Grant & Proposal Support'],
    link: '/services',
  },
  {
    emoji: '🌱',
    color: '#FFC72C',
    colorLight: 'rgba(255,199,44,0.12)',
    label: 'Agriculture AI',
    desc: 'Smart crop and soil insights, AI farm decision dashboards, and government subsidy discovery for farmers.',
    bullets: ['Soil & Crop Insight Reports', 'AI Farm Dashboard', 'Agri-Grant Finder'],
    link: '/services',
  },
  {
    emoji: '🤖',
    color: '#FFC72C',
    colorLight: 'rgba(255,199,44,0.12)',
    label: 'AI for Businesses',
    desc: 'Custom AI chatbots and automation tools that help local clinics, salons, realtors, and restaurants scale faster.',
    bullets: ['WhatsApp & Web Chatbots', 'Appointment Booking AI', 'Customer Support Automation'],
    link: '/services',
  },
  {
    emoji: '🎓',
    color: '#FFC72C',
    colorLight: 'rgba(255,199,44,0.12)',
    label: 'AI Education & Training',
    desc: 'Practical AI literacy workshops for farmers, healthcare workers, and small business owners.',
    bullets: ['AI for Farmers', 'AI for Healthcare Workers', 'AI for Small Business Owners'],
    link: '/services',
  },
]

/* ── Why us pillars ─────────────────────────────────────── */
const CLOCK_PILLARS = [
  {
    icon: <Brain size={32} />,
    title: 'Practical AI',
    desc: 'We build AI that works in the real world — no fluff, no jargon. Solutions designed for actual workflows and outcomes.',
    color: '#FFC72C'
  },
  {
    icon: <Leaf size={32} />,
    title: 'Multi-Domain Expertise',
    desc: 'From hospitals to farms to high-street shops, our team understands the unique data and challenges of every sector.',
    color: '#FFC72C'
  },
  {
    icon: <Zap size={32} />,
    title: 'Fast & Affordable',
    desc: 'We deliver enterprise-grade AI at accessible price points, so small teams and startups can compete with big organisations.',
    color: '#FFC72C'
  },
  {
    icon: <ShieldCheck size={32} />,
    title: 'Data Security',
    desc: 'Your privacy is our priority. We deploy secure, compliant models that protect your sensitive information at all times.',
    color: '#FFC72C'
  },
  {
    icon: <Rocket size={32} />,
    title: 'Continuous Innovation',
    desc: 'We constantly upgrade our systems with the latest AI breakthroughs, ensuring your solutions never become obsolete.',
    color: '#FFC72C'
  },
  {
    icon: <Users size={32} />,
    title: 'End-to-End Support',
    desc: 'From data analysis to deployment and training, we stay with you through every stage of your AI journey.',
    color: '#FFC72C'
  },
]

function WhyUsClock() {
  const [active, setActive] = useState(0)
  const cx = 200, cy = 200, r = 110

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % CLOCK_PILLARS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nodes = CLOCK_PILLARS.map((p, i) => {
    const angle = (i * 60) - 90
    const aRad = (angle * Math.PI) / 180
    return { ...p, x: cx + Math.cos(aRad) * r, y: cy + Math.sin(aRad) * r, angle }
  })

  // Generate 12 hour points only for the clock face
  const ticks = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i * 30) - 90
    const rad = (angle * Math.PI) / 180
    const r1 = 175
    const r2 = 158
    return {
      x1: cx + Math.cos(rad) * r1, y1: cy + Math.sin(rad) * r1,
      x2: cx + Math.cos(rad) * r2, y2: cy + Math.sin(rad) * r2,
    }
  })

  // Jigsaw Puzzle Grid Paths (2x3) - Interlocking with gaps
  const puzzlePaths = [
    { px: 0, py: 0, gapX: 0, gapY: 0, path: "M 0 0 l 400 0 l 0 110 a 40 40 0 0 0 0 80 l 0 110 l -160 0 a 40 40 0 0 1 -80 0 l -160 0 l 0 -300 Z" },
    { px: 400, py: 0, gapX: 20, gapY: 0, path: "M 400 0 l 400 0 l 0 300 l -160 0 a 40 40 0 0 0 -80 0 l -160 0 l 0 -110 a 40 40 0 0 1 0 -80 l 0 -110 Z" },
    { px: 0, py: 300, gapX: 0, gapY: 20, path: "M 0 300 l 160 0 a 40 40 0 0 0 80 0 l 160 0 l 0 110 a 40 40 0 0 1 0 80 l 0 110 l -160 0 a 40 40 0 0 0 -80 0 l -160 0 l 0 -300 Z" },
    { px: 400, py: 300, gapX: 20, gapY: 20, path: "M 400 300 l 160 0 a 40 40 0 0 1 80 0 l 160 0 l 0 300 l -160 0 a 40 40 0 0 1 -80 0 l -160 0 l 0 -110 a 40 40 0 0 0 0 -80 l 0 -110 Z" },
    { px: 0, py: 600, gapX: 0, gapY: 40, path: "M 0 600 l 160 0 a 40 40 0 0 1 80 0 l 160 0 l 0 110 a 40 40 0 0 0 0 80 l 0 110 l -400 0 l 0 -300 Z" },
    { px: 400, py: 600, gapX: 20, gapY: 40, path: "M 400 600 l 160 0 a 40 40 0 0 0 80 0 l 160 0 l 0 300 l -400 0 l 0 -110 a 40 40 0 0 1 0 -80 l 0 -110 Z" }
  ]

  // Render active node last so its SVG stroke/shadow overlaps others
  const sortedNodes = CLOCK_PILLARS.map((p, i) => ({
    ...p,
    originalIndex: i,
    ...puzzlePaths[i]
  })).sort((a, b) => {
    if (a.originalIndex === active) return 1
    if (b.originalIndex === active) return -1
    return 0
  })

  return (
    <div className={s.clockWrap}>
      <div className={s.clockLeft}>
        <svg viewBox="0 0 400 400" style={{width:'100%', height:'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))'}}>
          <defs>
            <radialGradient id="clockGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={nodes[active].color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={nodes[active].color} stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Clock Face / Bezel */}
          <circle cx={cx} cy={cy} r="185" fill="rgba(15,23,42,0.9)" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx={cx} cy={cy} r="185" fill="url(#clockGlow)" />
          <circle cx={cx} cy={cy} r="178" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* Clock Ticks (Hour points only) */}
          {ticks.map((t, i) => (
             <line 
               key={`tick-${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} 
               stroke="rgba(255,255,255,0.6)" 
               strokeWidth="3" 
               strokeLinecap="round"
             />
          ))}

          {/* Realistic Clock Hands */}
          <g transform={`translate(${cx}, ${cy})`}>
            {/* Hour Hand (Points to Active Node) */}
            <motion.g
              animate={{ rotate: nodes[active].angle + 90 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
            >
              <rect x="-150" y="-150" width="300" height="300" fill="transparent" />
              <polygon points="-5,12 5,12 2.5,-90 -2.5,-90" fill="#FFC72C" />
              {/* Inner accent line for 3D feel */}
              <line x1="0" y1="8" x2="0" y2="-85" stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
            </motion.g>

            {/* Ambient Sweeping Second Hand */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              <rect x="-150" y="-150" width="300" height="300" fill="transparent" />
              <rect x="-1" y="-150" width="2" height="185" fill="#3B82F6" rx="1" />
              {/* Second hand counterbalance tail loop */}
              <circle cx="0" cy="20" r="4" fill="none" stroke="#3B82F6" strokeWidth="2" />
            </motion.g>
          </g>

          {/* Center Pin Hub */}
          <circle cx={cx} cy={cy} r="14" fill="#FFC72C" />
          <circle cx={cx} cy={cy} r="6" fill="#1e3a8a" />

          {/* Node Icons */}
          {nodes.map((node, i) => {
            const isActive = i === active
            return (
              <g key={i} onClick={() => setActive(i)} style={{cursor: 'pointer'}}>
                {/* Background base for every icon so they are always visible */}
                <circle 
                  cx={node.x} cy={node.y} r="26" 
                  fill={isActive ? "rgba(30,58,138,0.9)" : "rgba(15,23,42,0.95)"} 
                  stroke={isActive ? "#FFC72C" : "rgba(255,255,255,0.15)"} 
                  strokeWidth={isActive ? "2" : "1"} 
                />
                
                {/* Expanding Ripple for Active Node */}
                {isActive && (
                  <motion.circle
                    cx={node.x} cy={node.y} r="26"
                    fill="none" stroke="#FFC72C" strokeWidth="2"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                )}

                {/* Invisible hit area for easier clicking */}
                <circle cx={node.x} cy={node.y} r="35" fill="transparent" />
                
                {/* Icon rendering dynamically with color */}
                <g 
                  transform={`translate(${node.x - 14}, ${node.y - 14})`} 
                  style={{ filter: isActive ? 'drop-shadow(0 0 6px #FFC72C)' : 'none' }}
                >
                  <node.icon.type size={28} color={isActive ? "#FFC72C" : "#94a3b8"} strokeWidth={isActive ? 2 : 1.5} />
                </g>
              </g>
            )
          })}
        </svg>
      </div>

      <div className={s.clockRight}>
        <svg viewBox="-20 -20 860 960" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))' }}>
          {sortedNodes.map((node) => {
            const isActive = node.originalIndex === active
            return (
              <motion.g
                key={node.originalIndex}
                onClick={() => setActive(node.originalIndex)}
                style={{ cursor: 'pointer', transformOrigin: `${node.px + 200}px ${node.py + 150}px` }}
                animate={{
                  x: node.gapX,
                  y: node.gapY,
                  scale: isActive ? 1.05 : 1,
                  filter: isActive ? 'drop-shadow(0 15px 30px rgba(0,0,0,0.6))' : 'none',
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Puzzle Piece Shape */}
                <path 
                  d={node.path} 
                  fill={isActive ? "#1e3a8a" : "#ffffff"} 
                  stroke={isActive ? "#FFC72C" : "#cbd5e1"} 
                  strokeWidth={isActive ? "4" : "2"} 
                />
                
                {/* Card Content using foreignObject */}
                <foreignObject x={node.px} y={node.py} width="400" height="300">
                  <div style={{ 
                    padding: '40px 60px', 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ color: isActive ? '#FFC72C' : '#3b82f6', marginBottom: '1rem', transition: 'color 0.3s ease' }}>
                      <node.icon.type size={42} strokeWidth={isActive ? 2 : 1.5} />
                    </div>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 600, color: isActive ? '#FFC72C' : '#0f172a', marginBottom: '0.75rem', transition: 'color 0.3s ease' }}>
                      {node.title}
                    </h3>
                    <p style={{ color: isActive ? '#fff' : '#475569', fontSize: '1.05rem', lineHeight: 1.5, margin: 0, transition: 'color 0.3s ease' }}>
                      {node.desc}
                    </p>
                  </div>
                </foreignObject>
              </motion.g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

/* ── INTERNSHIP DATA ────────────────────────────────────── */
const INTERNSHIP_MODULES = [
  {
    icon: <BookOpen size={22} />,
    title: 'Advanced Methodology',
    desc: 'Master industry-standard pipelines including GATK, Nextflow, and customized Python/R frameworks.'
  },
  {
    icon: <Rocket size={22} />,
    title: 'Real-World Scale',
    desc: 'Work on actual client datasets ranging from single samples to terabyte-scale population studies.'
  },
  {
    icon: <Users size={22} />,
    title: 'Expert Mentorship',
    desc: 'Weekly sessions with PhD scientists and senior engineers to refine your research and technical skills.'
  },
  {
    icon: <GraduationCap size={22} />,
    title: 'Career Pathway',
    desc: 'Top-performing interns receive priority consideration for full-time research and engineering roles.'
  }
]

/* ── Component ───────────────────────────────────────────── */
export default function HomePage() {
  const navigate = useNavigate()

  const handleOpenProjectCallClick = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
    else navigate('/open-project-call')
  }

  return (
    <div className={s.page}>

      {/* ══ HERO ══════════════════════════════════════════ */}
      <section className={s.hero} aria-label="Hero">
        <div className={s.inner}>
          <div className={s.heroGrid}>

            {/* Left copy */}
            <motion.div
              className={s.heroLeft}
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp} className={s.pill}>
                <span className={s.pillDot} />
                Practical AI · Real-World Impact
              </motion.div>

              <motion.h1 variants={fadeUp} className={s.heroH1}>
                AI Solutions for<br />
                <span className={s.goldText}>Healthcare, Agriculture</span><br />
                &amp; Modern Business
              </motion.h1>

              <motion.p variants={fadeUp} className={s.heroP}>
                We help organisations transform research, operations, and
                decision-making using tailored AI — built for the people who
                actually need it most.
              </motion.p>

              <motion.div variants={fadeUp} className={s.heroCtas}>
                <Link to="/services" className={s.btnGold}>
                  Explore Our Services <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className={s.btnGhost}>
                  Talk to Us
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className={s.heroTrust}>
                <div className={s.trustAvatars}>
                  {['A', 'B', 'C', 'D'].map(l => (
                    <div key={l} className={s.trustAvatar}>{l}</div>
                  ))}
                </div>
                <p className={s.trustText}>
                  <strong>50+ projects</strong> delivered across healthcare, agriculture &amp; business
                </p>
              </motion.div>
            </motion.div>

            {/* Right — Advanced Hero Animation */}
            <motion.div
              className={s.heroRight}
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <AdvancedHeroAnimation />
            </motion.div>

          </div>
        </div>
      </section>



      {/* ══ ABOUT ═════════════════════════════════════════ */}
      <section className={s.sectionBlue} id="about-section" aria-labelledby="about-h">
        <div className={s.inner}>
          <div className={s.aboutGrid}>

            {/* Left */}
            <div>
              <div className={s.sectionLabel}>About AI Infowave</div>
              <h2 id="about-h" className={s.sectionH2}>
                Making AI Accessible to <span className={s.goldText}>Everyone</span>
              </h2>
              <p className={s.sectionP}>
                AI Infowave was built on a simple belief: transformative AI shouldn't
                be limited to tech giants. We bring practical, affordable AI solutions
                to farmers, clinicians, researchers, and small business owners — helping
                them make smarter decisions and unlock new opportunities.
              </p>
              <ul className={s.checkList} role="list">
                {[
                  'AI-powered insights for Bio & Health research',
                  'Smart agriculture tools for crop and soil optimisation',
                  'Custom chatbots and automation for local businesses',
                  'Practical AI workshops and internship programmes',
                ].map(item => (
                  <li key={item} className={s.checkItem}>
                    <span className={s.checkDot}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/about" className={s.aboutCta}>
                Learn about our mission <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right — stat cards */}
            <motion.div 
              className={s.aboutRight}
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={fadeUp} className={s.aboutBigCard}>
                <div className={s.aboutBigNum}><AnimatedCounter value="50" suffix="+" /></div>
                <div className={s.aboutBigLabel}>AI projects delivered</div>
                <div className={s.aboutBigSub}>across healthcare, agri &amp; business sectors</div>
              </motion.div>
              <div className={s.aboutSmallCards}>
                {[
                  { num: '3', suffix: '', label: 'AI domains' },
                  { num: '12', suffix: 'wk', label: 'Internship' },
                  { num: '1:1', suffix: '', label: 'Mentorship' },
                  { num: '100', suffix: '%', label: 'Real use cases' },
                ].map(({ num, suffix, label }) => (
                  <motion.div variants={fadeUp} key={label} className={s.aboutSmCard}>
                    <div className={s.aboutSmNum}><AnimatedCounter value={num} suffix={suffix} /></div>
                    <div className={s.aboutSmLabel}>{label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══ SERVICE AREAS ═════════════════════════════════ */}
      <section className={s.sectionWhite} aria-labelledby="services-h">
        <div className={s.inner}>
          <div className={s.sectionHeader}>
            <div className={s.sectionLabelDark}>What We Do</div>
            <h2 id="services-h" className={s.h2Dark}>Our Four AI Service Areas</h2>
            <p className={s.sectionPDark}>
              Every solution is built around real problems faced by real people.
              No one-size-fits-all tech — just targeted AI that delivers results.
            </p>
          </div>

          <div className={s.serviceGrid}>
            {SERVICE_AREAS.map((svc, i) => (
              <motion.div
                key={svc.label}
                className={s.serviceCard}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ '--accent': svc.color, '--accent-light': svc.colorLight }}
              >
                <div className={s.scIconWrap}>
                  <span style={{ fontSize: 28 }}>{svc.emoji}</span>
                </div>
                <h3 className={s.scTitle}>{svc.label}</h3>
                <p className={s.scDesc}>{svc.desc}</p>
                <ul className={s.scList}>
                  {svc.bullets.map(b => (
                    <li key={b} className={s.scListItem}>
                      <span className={s.scDot}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link to={svc.link} className={s.scLink}>
                  View services <ChevronRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY US ════════════════════════════════════════ */}
      <section className={s.sectionBlue} aria-labelledby="why-h">
        <div className={s.inner}>
          <div className={s.sectionHeaderCenter}>
            <div className={s.sectionLabel}>Why AI Infowave</div>
            <h2 id="why-h" className={s.sectionH2}>Built for Impact, Not Just Innovation</h2>
            <p className={s.sectionP}>
              We believe the best AI is the kind that solves real problems for real people —
              regardless of budget, technical background, or industry.
            </p>
          </div>
          <WhyUsClock />
        </div>
      </section>

      {/* ══ CTA BANNER ════════════════════════════════════ */}
      <div className={s.ctaBanner} aria-label="Call to action">
        <div className={s.ctaBannerInner}>
          <h2 className={s.ctaBannerH2}>Ready to Bring AI Into Your Work?</h2>
          <p className={s.ctaBannerP}>
            Whether you run a clinic, farm, or small business — or you're a researcher
            chasing a breakthrough — we have an AI solution built for you.
          </p>
          <div className={s.ctaBtns}>
            <a
              href="/open-project-call"
              onClick={handleOpenProjectCallClick}
              className={s.btnWhite}
              id="cta-project-btn"
            >
              Open Project Call →
            </a>
            <Link to="/contact" className={s.btnWhiteOutline} id="cta-contact-btn">
              Contact Our Team
            </Link>
          </div>
        </div>
      </div>

      {/* ── INTERNSHIP (THE GROWTH LAB) ──────────────── */}
      <section className={s.internshipSection}>
        <div className={s.inner}>
          <div className={s.growthLab}>
            <div className={s.labLeft}>
              <div className={s.sectionLabel}>Education & Training</div>
              <h2 className={s.labH2}>Internship <span className={s.goldText}>Excellence</span> Program</h2>
              <p className={s.labLead}>
                Empowering the next generation of bioinformatics experts through immersion
                in high-impact research and clinical data pipelines.
              </p>

              <div className={s.pathway}>
                {INTERNSHIP_MODULES.map((m, i) => (
                  <motion.div
                    key={m.title}
                    className={s.pathItem}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={s.pathNode}>
                      <div className={s.nodeLine} />
                      <div className={s.nodeCircle}>{i + 1}</div>
                    </div>
                    <div className={s.pathContent}>
                      <h3 className={s.pathTitle}>{m.title}</h3>
                      <p className={s.pathDesc}>{m.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className={s.labRight}>
              <div className={s.labGlass}>
                <div className={s.glassHead}>
                  <Rocket className={s.glassIcon} />
                  <div>
                    <h3 className={s.glassH3}>Ready to start?</h3>
                    <p className={s.glassP}>Applications are now open for the exclusive 2026 internship program.</p>
                  </div>
                </div>
                <div className={s.labStats}>
                  <div className={s.labStat}>
                     <span className={s.labStatVal}>12</span>
                     <span className={s.labStatLabel}>Weeks Duration</span>
                  </div>
                  <div className={s.labStat}>
                     <span className={s.labStatVal}>1:1</span>
                     <span className={s.labStatLabel}>Expert Mentorship</span>
                  </div>
                </div>
                <Link to="/internship" className={s.labBtn}>
                  Apply for Internship <ArrowRight size={18} />
                </Link>
              </div>

              <div className={s.labBlob} />
              <div className={s.labGrid} />
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  )
}