import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dna, Microscope, Activity,
  Leaf, Store, GraduationCap,
  ChevronDown, Users, FileText, FlaskConical,
  TrendingUp, Bot, BookOpen, Rocket, ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../../components/layout/Footer/Footer'
import s from './ServicesPage.module.css'

/* ── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

/* ── Bio-Digital Pulse Animation ─────────────────────── */
function BioPulseAnimation() {
  return (
    <div className={s.pulseWrap}>
      <svg className={s.pulseSvg} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M100 200 L300 200 M200 100 L200 300 M130 130 L270 270 M130 270 L270 130"
          stroke="rgba(255, 199, 44, 0.15)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {[80, 140, 200].map((r, i) => (
          <motion.circle
            key={r}
            cx="200" cy="200" r={r}
            stroke="rgba(226, 232, 240, 0.5)"
            strokeWidth="1.5"
            strokeDasharray="5 10"
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
        {[
          { x: 200, y: 100 }, { x: 300, y: 200 }, { x: 200, y: 300 }, { x: 100, y: 200 },
          { x: 130, y: 130 }, { x: 270, y: 130 }, { x: 270, y: 270 }, { x: 130, y: 270 }
        ].map((node, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={node.x} cy={node.y} r="4"
              fill="#FFC72C"
              animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            />
            <motion.circle
              cx={node.x} cy={node.y} r="12"
              stroke="#FFC72C"
              strokeWidth="1"
              animate={{ opacity: [0.2, 0, 0.2], scale: [1, 2.5, 1] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            />
          </motion.g>
        ))}
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFC72C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFC72C" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="100" fill="url(#coreGlow)" />
        <motion.circle
          cx="200" cy="200" r="15"
          fill="#FFC72C"
          animate={{ scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  )
}

/* ── Service Data ───────────────────────────────────────── */
const SERVICE_CATEGORIES = [
  {
    id: 'bio',
    letter: 'A',
    subtitle: 'Bio & Health AI',
    tagline: 'Precision & Care',
    title: 'A. BIO & HEALTH AI SERVICES',
    subtitle_orig: 'Precision & Care',
    services: [
      {
        number: '1️⃣',
        id: 'research',
        catColor: '#FFC72C',
        catLight: 'rgba(255, 199, 44, 0.15)',
        emoji: '📚',
        icon: <FileText size={20} />,
        title: 'AI Literature & Research Intelligence',
        target: 'For: Researchers, students, clinics, biotech startups',
        desc: 'Transform complex scientific literature into actionable insights using AI-powered research analysis and knowledge extraction.',
        details: [
          'AI-based paper summaries',
          'Trend analysis',
          'Grant-aligned research mapping'
        ],
      },
      {
        number: '2️⃣',
        id: 'data',
        catColor: '#FFC72C',
        catLight: 'rgba(255, 199, 44, 0.15)',
        emoji: '🧬',
        icon: <FlaskConical size={20} />,
        title: 'AI-Based Data Analysis',
        target: 'For: Small labs, clinics, students',
        desc: 'Advanced biological and healthcare data interpretation without requiring expensive laboratory infrastructure.',
        details: [
          'Gene expression analysis',
          'Microbiome data interpretation',
          'Cancer dataset insights (non-diagnostic)'
        ],
      },
      {
        number: '3️⃣',
        id: 'proposal',
        catColor: '#FFC72C',
        catLight: 'rgba(255, 199, 44, 0.15)',
        emoji: '📝',
        icon: <TrendingUp size={20} />,
        title: 'Grant & Proposal AI Support',
        target: 'For: Startups, professors, nonprofits, farmers',
        desc: 'Increase funding opportunities with AI-assisted proposal generation and impact-focused grant documentation.',
        details: [
          'AI-assisted grant writing',
          'Data justification',
          'Impact modeling'
        ],
      }
    ]
  },
  {
    id: 'agri',
    letter: 'B',
    subtitle: 'Agriculture AI',
    tagline: 'Sustainable Growth',
    title: 'B. AGRICULTURE AI SERVICES',
    subtitle_orig: 'Sustainable Growth',
    services: [
      {
        number: '4️⃣',
        id: 'soil',
        catColor: '#FFC72C',
        catLight: 'rgba(255, 199, 44, 0.15)',
        emoji: '🌱',
        icon: <Leaf size={20} />,
        title: 'AI Soil & Crop Insight Reports',
        target: 'For: Farmers, agri-consultants',
        desc: 'Smart agricultural analytics designed to improve soil health, crop productivity, and farming profitability.',
        details: [
          'AI-generated soil health insights',
          'Fertilizer optimization (cost reduction)',
          'Microbial impact explanation'
        ],
      },
      {
        number: '5️⃣',
        id: 'dashboard',
        catColor: '#FFC72C',
        catLight: 'rgba(255, 199, 44, 0.15)',
        emoji: '📊',
        icon: <TrendingUp size={20} />,
        title: 'AI Farm Decision Dashboard',
        target: 'For: Farmers, agri-consultants',
        desc: 'An intelligent dashboard helping farmers make data-driven decisions for higher productivity and lower operational costs.',
        details: [
          'Weather + soil + yield prediction (basic)',
          'Crop rotation advice'
        ],
      },
      {
        number: '6️⃣',
        id: 'subsidy',
        catColor: '#FFC72C',
        catLight: 'rgba(255, 199, 44, 0.15)',
        emoji: '💰',
        icon: <FileText size={20} />,
        title: 'Agri-Grant & Subsidy Finder',
        target: 'For: Farmers, agricultural businesses',
        desc: 'Helping farmers and agricultural businesses identify and apply for eligible government grants and subsidy programs.',
        details: [
          'AI finds eligible grants for each farmer',
          'Application checklist + draft'
        ],
      }
    ]
  },
  {
    id: 'smallbiz',
    letter: 'C',
    subtitle: 'AI for Small Business',
    tagline: 'Accelerated Scaling',
    title: 'C. AI FOR SMALL BUSINESSES',
    subtitle_orig: 'Accelerated Scaling',
    services: [
      {
        number: '7️⃣',
        id: 'chatbot',
        catColor: '#FFC72C',
        catLight: 'rgba(255, 199, 44, 0.15)',
        emoji: '🤖',
        icon: <Bot size={20} />,
        title: 'AI Chatbots for Local Businesses',
        target: 'For: Clinics, salons, realtors, restaurants',
        desc: 'Custom AI assistants designed for local businesses to automate communication, customer support, and bookings.',
        details: [
          'Website chatbot',
          'WhatsApp / Facebook AI assistant',
          'Appointment booking'
        ],
      }
    ]
  },
  {
    id: 'education',
    letter: 'D',
    subtitle: 'Education & Knowledge',
    tagline: 'Digital Assets',
    title: 'D. EDUCATION & KNOWLEDGE PRODUCTS',
    subtitle_orig: 'Digital Assets',
    services: [
      {
        number: '🔟',
        id: 'training',
        catColor: '#FFC72C',
        catLight: 'rgba(255, 199, 44, 0.15)',
        emoji: '🎓',
        icon: <BookOpen size={20} />,
        title: 'AI Training for Non-Tech People',
        target: 'For: Non-technical professionals and organizations',
        desc: 'Practical AI workshops and training sessions designed for non-technical professionals and organizations.',
        details: [
          'AI for Farmers',
          'AI for Healthcare Workers',
          'AI for Small Business Owners'
        ],
      }
    ]
  }
]

/* ── Category Block ─────────────────────────────────── */
function CategoryBlock({ cat, idx }) {
  return (
    <div className={s.categoryBlock}>
      <div className={s.catHeaderBig}>
        {/* Giant letter badge */}
        <div className={s.catLetterBadge}>
          <span className={s.catBigLetter}>{cat.letter}</span>
        </div>

        {/* Text info */}
        <div className={s.catHeaderLeft}>
          <h2 className={s.catTitleBig}>{cat.subtitle}</h2>
          <span className={s.catTaglineBig}>{cat.tagline}</span>
        </div>

        {/* Service count pill */}
        <div className={s.catCountPill}>
          {cat.services.length} service{cat.services.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className={s.detailedServiceGrid}>
        {cat.services.map((svc, i) => (
          <DetailedServiceCard key={svc.id} svc={svc} index={i} />
        ))}
      </div>
    </div>
  );
}

/* ── Detailed Service Card ──────────────────────────────── */
function DetailedServiceCard({ svc, index }) {
  return (
    <motion.div
      className={s.detailedCard}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ '--accent': svc.catColor, '--accent-light': svc.catLight }}
    >
      <div className={s.dcHeader}>
        <div className={s.dcIconWrap}>
          <span style={{ fontSize: '24px' }}>{svc.emoji}</span>
        </div>
        <div className={s.dcTitleWrap}>
          <h3 className={s.dcTitle}>{svc.title}</h3>
        </div>
      </div>
      
      {svc.target && <p className={s.dcTarget}>{svc.target}</p>}
      <p className={s.dcDesc}>{svc.desc}</p>
      
      <div className={s.dcFeaturesInner}>
        <div className={s.dcFeaturesTitle}>Capabilities</div>
        <ul className={s.dcList}>
          {svc.details.map((d, i) => (
            <li key={i} className={s.dcListItem}>
              <div className={s.dcListDot}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              {d}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
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

/* ── Component ──────────────────────────────────────────── */
export default function ServicesPage() {
  return (
    <div className={s.page}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className={s.hero}>
        <div className={s.inner}>
          <div className={s.heroGrid}>
            <motion.div
              className={s.heroLeft}
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.h1 variants={fadeUp} className={s.h1}>
                AI Solutions Built for<br />
                <span className={s.gradientText}>Healthcare, Agriculture & Modern Businesses</span>
              </motion.h1>
              <motion.p variants={fadeUp} className={s.heroLead}>
                We help organizations transform research, operations, and decision-making using practical AI-powered solutions tailored for real-world impact.
              </motion.p>
            </motion.div>

            <motion.div
              className={s.heroRight}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <BioPulseAnimation />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ALL SERVICES ─────────────────────────────── */}
      <section className={s.sectionNoTop}>
        <PuzzleBackground />
        <div className={s.inner}>
          <div className={s.sectionHeader}>
            <div className={s.sectionLabel}>What We Offer</div>
            <h2 className={s.h2}>Our AI Services</h2>
          </div>

          <div className={s.categoriesWrap}>
            {SERVICE_CATEGORIES.map((cat, idx) => (
              <CategoryBlock key={cat.id} cat={cat} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERNSHIP (THE GROWTH LAB) ──────────────── */}
      <section className={s.internshipSection}>
        <div className={s.inner}>
          <div className={s.growthLab}>
            <div className={s.labLeft}>
              <div className={s.pillLight}>Education & Training</div>
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
