import { useState } from 'react'
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
    tagline: 'High Trust, High Value',
    title: 'A. BIO & HEALTH AI SERVICES',
    subtitle_orig: 'High Trust, High Value',
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
        title: 'AI-Based Data Analysis (NO Lab Needed)',
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
        title: 'Grant & Proposal AI Support (🔥 HUGE DEMAND)',
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
    tagline: 'Cash Cow',
    title: 'B. AGRICULTURE AI SERVICES',
    subtitle_orig: 'CASH COW',
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
        title: 'AI Farm Decision Dashboard (Simple Version)',
        target: 'For: Farmers, agri-consultants',
        desc: 'An intelligent dashboard helping farmers make data-driven decisions for higher productivity and lower operational costs.',
        details: [
          'Weather + soil + yield prediction (basic)',
          'Crop rotation advice',
          'Expense optimization'
        ],
      },
      {
        number: '6️⃣',
        id: 'subsidy',
        catColor: '#FFC72C',
        catLight: 'rgba(255, 199, 44, 0.15)',
        emoji: '💰',
        icon: <FileText size={20} />,
        title: 'Agri-Grant & Subsidy Finder (Unbeatable)',
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
    tagline: 'Fastest Cash',
    title: 'C. AI FOR SMALL BUSINESSES',
    subtitle_orig: 'FASTEST CASH',
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
      },
      {
        number: '8️⃣',
        id: 'marketing',
        catColor: '#FFC72C',
        catLight: 'rgba(255, 199, 44, 0.15)',
        emoji: '📱',
        icon: <TrendingUp size={20} />,
        title: 'AI Marketing Content (Subscription)',
        target: 'For: Small businesses, agencies',
        desc: 'AI-driven content generation for continuous engagement and brand building.',
        details: [
          'Social media posts',
          'Email campaigns',
          'Google review responses'
        ],
      }
    ]
  },
  {
    id: 'education',
    letter: 'D',
    subtitle: 'Education & Knowledge',
    tagline: 'Passive Income',
    title: 'D. EDUCATION & KNOWLEDGE PRODUCTS',
    subtitle_orig: 'PASSIVE INCOME',
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

/* ── Category Accordion ─────────────────────────────────── */
function CategoryAccordion({ cat, idx }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={s.catAccordion}>
      <div className={s.catHeaderBig} onClick={() => setIsOpen(!isOpen)}>
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

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={s.catChevron}
        >
          <ChevronDown size={28} />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className={s.treeBranch}>
              <div className={s.detailedServiceList}>
                {cat.services.map((svc, i) => (
                  <DetailedServiceCard key={svc.id} svc={svc} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Detailed Service Card ──────────────────────────────── */
function DetailedServiceCard({ svc, index }) {
  const [isExpanded, setIsExpanded] = useState(false)

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
          <span className={s.dcCategory}>{svc.number}</span>
          <h3 className={s.dcTitle}>{svc.title}</h3>
        </div>
      </div>
      
      {svc.target && <p className={s.dcTarget}><strong>{svc.target}</strong></p>}
      <p className={s.dcDesc}>{svc.desc}</p>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="features"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className={s.dcFeaturesInner}>
              <div className={s.dcFeaturesTitle}>Key Features</div>
              <ul className={s.dcList}>
                {svc.details.map((d, i) => (
                  <li key={i} className={s.dcListItem}>
                    <div className={s.dcListDot}>✓</div>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button 
        className={s.dcViewMoreBtn}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'View less' : 'View more'}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>
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
        <div className={s.inner}>
          <div className={s.sectionHeader}>
            <div className={s.sectionLabel}>What We Offer</div>
            <h2 className={s.h2}>Our AI Services</h2>
          </div>

          <div className={s.categoriesWrap}>
            {SERVICE_CATEGORIES.map((cat, idx) => (
              <CategoryAccordion key={cat.id} cat={cat} idx={idx} />
            ))}
          </div>
        </div>
      </section>

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
