import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ArrowRight, Briefcase, MapPin, Clock,
  Users, Zap, Heart, CheckCircle2, Dna, Cpu, BarChart3, FlaskConical,
  Send, Rocket, GraduationCap, Code, X, TrendingUp, Globe,
  UploadCloud, FileText
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'
import Footer from '../../components/layout/Footer/Footer'
import s from './CareerPage.module.css'

/* ── Atomic Animation Component ────────────────────── */
function AtomicAnimation() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H
    let raf
    let t = 0

    const resize = () => {
      W = canvas.width = 1200
      H = canvas.height = 1200
    }

    const drawNucleus = (cx, cy) => {
      const particles = [
        { x: -12, y: -10, r: 28, col: '#2563eb' },
        { x: 15, y: -5, r: 26, col: '#1e40af' },
        { x: -5, y: 18, r: 28, col: '#1d4ed8' },
        { x: 10, y: 12, r: 24, col: '#1e3a8a' },
        { x: 0, y: 0, r: 32, col: '#60a5fa' }
      ]

      particles.forEach(p => {
        const x = cx + p.x
        const y = cy + p.y
        const grad = ctx.createRadialGradient(x - p.r * 0.3, y - p.r * 0.3, 0, x, y, p.r)
        grad.addColorStop(0, '#fff')
        grad.addColorStop(0.4, p.col)
        grad.addColorStop(1, '#0a0f1e')

        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.shadowBlur = 50
        ctx.shadowColor = p.col
        ctx.fill()
      })
    }

    const drawOrbit = (cx, cy, rx, ry, angle, time, electronCol) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle)

      ctx.beginPath()
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'
      ctx.lineWidth = 3
      ctx.stroke()

      const x = rx * Math.cos(time)
      const y = ry * Math.sin(time)

      const grad = ctx.createRadialGradient(x, y, 0, x, y, 20)
      grad.addColorStop(0, '#fff')
      grad.addColorStop(0.4, electronCol)
      grad.addColorStop(1, 'transparent')

      ctx.beginPath()
      ctx.arc(x, y, 11, 0, Math.PI * 2)
      ctx.fillStyle = electronCol
      ctx.shadowBlur = 30
      ctx.shadowColor = electronCol
      ctx.fill()

      ctx.beginPath()
      ctx.ellipse(0, 0, rx, ry, 0, time - 0.5, time, false)
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 5
      ctx.globalAlpha = 0.55
      ctx.stroke()

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, W, H)
      t += 0.02
      const cx = W / 2
      const cy = H / 2

      drawOrbit(cx, cy, 420, 160, Math.PI / 4, t, '#FFC72C')
      drawOrbit(cx, cy, 420, 160, -Math.PI / 4, t * 1.2, '#FFE082')
      drawOrbit(cx, cy, 420, 160, Math.PI / 2, t * 0.8, '#FFC72C')
      drawOrbit(cx, cy, 480, 180, 0, t * 1.5, '#FFE082')

      drawNucleus(cx, cy)
      raf = requestAnimationFrame(animate)
    }

    resize()
    animate()

    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className={s.atomicWrap}>
      <canvas ref={canvasRef} className={s.atomicCanvas} />
    </div>
  )
}

/* ── Framer variants ──────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

/* ── Data ─────────────────────────────────────────────── */
const STATS = [
  { num: '50+', label: 'Team Members' },
  { num: '12', label: 'Open Roles' },
  { num: '18', label: 'Countries' },
  { num: '100%', label: 'Remote Friendly' },
]

const DEPARTMENTS = ['All', 'Bioinformatics', 'Engineering', 'Research', 'Data Science', 'Operations']

const JOBS = [
  {
    id: 1,
    title: 'Senior Bioinformatics Scientist',
    dept: 'Bioinformatics',
    location: 'Saskatoon, SK',
    type: 'Full-time',
    level: 'Senior',
    accent: '#1e3a8a',
    icon: <Dna size={20} />,
    tags: ['Python', 'GATK', 'NGS', 'R'],
    desc: 'Lead the design and execution of multi-omics data analysis pipelines for genomics clients. You will develop novel approaches to variant calling, annotation, and clinical reporting.',
    eligibility: [
      'PhD in Bioinformatics, Computational Biology, or related field',
      '5+ years of experience in NGS data analysis',
      'Proven track record of publishing in peer-reviewed journals'
    ],
    responsibilities: [
      'Architect and scale multi-omics pipelines',
      'Lead technical discussions with pharmaceutical partners',
      'Mentor junior scientists and engineers'
    ],
    benefits: [
      'Stock options in a fast-growing biotech',
      'Comprehensive health & dental coverage',
      'Annual conference & travel budget'
    ]
  },
  {
    id: 2,
    title: 'Machine Learning Engineer',
    dept: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid-Senior',
    accent: '#d97706',
    icon: <Cpu size={20} />,
    tags: ['PyTorch', 'scikit-learn', 'Docker', 'AWS'],
    desc: 'Build and scale ML models applied to genomic sequence classification, protein folding, and biomarker discovery. Collaborate with scientists on end-to-end model pipelines.',
    eligibility: [
      'MSc or PhD in Computer Science or Machine Learning',
      '3+ years of experience with PyTorch or TensorFlow',
      'Experience with distributed training and MLOps'
    ],
    responsibilities: [
      'Develop novel ML architectures for biology',
      'Optimize model inference for production',
      'Collaborate on data engineering pipelines'
    ],
    benefits: [
      'Remote-first culture',
      'Learning budget for certifications',
      'High-end workstation of choice'
    ]
  },
  {
    id: 3,
    title: 'Computational Genomics Researcher',
    dept: 'Research',
    location: 'Saskatoon, SK',
    type: 'Full-time',
    level: 'Senior',
    accent: '#1e3a8a',
    icon: <FlaskConical size={20} />,
    tags: ['WGS', 'scRNA-Seq', 'QIIME2', 'Seurat'],
    desc: 'Conduct cutting-edge research in single-cell genomics and functional annotation. Publish findings in top-tier journals and drive innovation in our core analysis platform.',
    eligibility: [
      'PhD in Genetics, Genomics, or Molecular Biology',
      'Deep understanding of single-cell technologies',
      'Experience with R/Bioconductor ecosystem'
    ],
    responsibilities: [
      'Design and lead research projects',
      'Present findings at international conferences',
      'Contribute to open-source genomics tools'
    ],
    benefits: [
      'On-site research lab access',
      'Flexible work-life balance',
      'Wellness and fitness stipend'
    ]
  },
  {
    id: 4,
    title: 'Data Scientist — Biostatistics',
    dept: 'Data Science',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid',
    accent: '#d97706',
    icon: <BarChart3 size={20} />,
    tags: ['R', 'Python', 'DESeq2', 'Statistics'],
    desc: 'Apply advanced statistical models to large-scale genomic datasets. Develop robust QC metrics, power analyses, and differential expression frameworks for clinical research teams.',
    eligibility: [
      'MSc in Biostatistics or Statistics',
      'Strong foundation in hypothesis testing and modeling',
      'Proficiency in R and tidyverse'
    ],
    responsibilities: [
      'Perform statistical analysis for clinical trials',
      'Develop internal data visualization tools',
      'Review and validate analysis reports'
    ],
    benefits: [
      'Flexible remote schedule',
      'Paid volunteer time',
      'Competitive salary and bonus'
    ]
  },
  {
    id: 5,
    title: 'Full-Stack Developer',
    dept: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid',
    accent: '#1e3a8a',
    icon: <Cpu size={20} />,
    tags: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    desc: 'Build and improve the platform UI and backend services that researchers rely on. You will own features end-to-end, from interactive dashboards to data ingestion APIs.',
    eligibility: [
      'BSc in Computer Science or equivalent',
      '3+ years of React and Node.js experience',
      'Knowledge of cloud architecture (AWS/GCP)'
    ],
    responsibilities: [
      'Develop responsive, high-performance UIs',
      'Maintain and scale backend microservices',
      'Implement data security best practices'
    ],
    benefits: [
      'Generous PTO and holidays',
      'Modern tech stack environment',
      'Collaborative team atmosphere'
    ]
  },
  {
    id: 6,
    title: 'Scientific Project Manager',
    dept: 'Operations',
    location: 'Saskatoon, SK / Hybrid',
    type: 'Full-time',
    level: 'Mid-Senior',
    accent: '#d97706',
    icon: <Briefcase size={20} />,
    tags: ['Agile', 'Jira', 'Genomics', 'Stakeholder Mgmt'],
    desc: 'Manage complex bioinformatics projects across multiple client accounts. Bridge communication between scientists, engineers, and external partners to deliver on time and on spec.',
    eligibility: [
      'BSc or MSc in Life Sciences or Management',
      'Experience managing technical projects',
      'PMP or Agile certification is a plus'
    ],
    responsibilities: [
      'Define project scope and timelines',
      'Coordinate cross-functional teams',
      'Manage client relationships and expectations'
    ],
    benefits: [
      'Hybrid work flexibility',
      'Leadership development program',
      'Comprehensive insurance package'
    ]
  },
]

const INTERNSHIP = {
  title: 'Internship Excellence Program',
  lead: 'Empowering the next generation of bioinformatics experts through immersion in high-impact research.',
  modules: [
    {
      icon: <Code size={22} />,
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
}

const JOB_API_URL = 'http://localhost:5000/api/jobs';

/* ── Puzzle Background Component ────────────────────────── */
function PuzzleBackground() {
  const cols = 20
  const rows = 13

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

  // Soft light theme puzzle wall palette
  const pieceShades = useMemo(() => {
    const shades = []
    const palette = [
      { start: "#ffffff", end: "#fafafa" }, // Pure white to light gray
      { start: "#ffffff", end: "#fcfdfd" }, // Soft off-white
      { start: "#fcfdfd", end: "#f8fafc" }, // Faint slate white
      { start: "#ffffff", end: "#fafbfb" }, // Glowing white
      { start: "#fafafa", end: "#f5f5f5" }  // Soft gray
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

  // Build the interlocking paths
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

        // 1. Top Edge
        if (top === 0) {
          d += `L ${x + 100} ${y} `
        } else if (top === 1) {
          d += `L ${x + 38} ${y} C ${x + 34} ${y - 15}, ${x + 42} ${y - 22}, ${x + 50} ${y - 22} C ${x + 58} ${y - 22}, ${x + 66} ${y - 15}, ${x + 62} ${y} L ${x + 100} ${y} `
        } else if (top === -1) {
          d += `L ${x + 38} ${y} C ${x + 34} ${y + 15}, ${x + 42} ${y + 22}, ${x + 50} ${y + 22} C ${x + 58} ${y + 22}, ${x + 66} ${y + 15}, ${x + 62} ${y} L ${x + 100} ${y} `
        }

        // 2. Right Edge
        if (right === 0) {
          d += `L ${x + 100} ${y + 100} `
        } else if (right === 1) {
          d += `L ${x + 100} ${y + 38} C ${x + 115} ${y + 34}, ${x + 122} ${y + 42}, ${x + 122} ${y + 50} C ${x + 122} ${y + 58}, ${x + 115} ${y + 66}, ${x + 100} ${y + 62} L ${x + 100} ${y + 100} `
        } else if (right === -1) {
          d += `L ${x + 100} ${y + 38} C ${x + 85} ${y + 34}, ${x + 78} ${y + 42}, ${x + 78} ${y + 50} C ${x + 78} ${y + 58}, ${x + 85} ${y + 66}, ${x + 100} ${y + 62} L ${x + 100} ${y + 100} `
        }

        // 3. Bottom Edge
        if (bottom === 0) {
          d += `L ${x} ${y + 100} `
        } else if (bottom === 1) {
          d += `L ${x + 62} ${y + 100} C ${x + 66} ${y + 115}, ${x + 58} ${y + 122}, ${x + 50} ${y + 122} C ${x + 42} ${y + 122}, ${x + 34} ${y + 115}, ${x + 38} ${y + 100} L ${x} ${y + 100} `
        } else if (bottom === -1) {
          d += `L ${x + 62} ${y + 100} C ${x + 66} ${y + 85}, ${x + 58} ${y + 78}, ${x + 50} ${y + 78} C ${x + 42} ${y + 78}, ${x + 34} ${y + 85}, ${x + 38} ${y + 100} L ${x} ${y + 100} `
        }

        // 4. Left Edge
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
      <motion.svg
        className={s.puzzleWallSvg}
        viewBox={`0 0 ${cols * 100} ${rows * 100}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
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
      </motion.svg>
    </div>
  )
}

/* ── Genomic Background Component (Premium Stars & Grid Connection) ── */
function GenomicBackground() {
  return (
    <div className={s.genomicBackground}>
      <svg className={s.genomicSvg} viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Fine tech grid */}
        <defs>
          <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            <circle cx="60" cy="0" r="1.5" fill="rgba(255, 199, 44, 0.25)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
        
        {/* Floating clean star particles in golden yellow and white */}
        <g opacity="0.4">
          <circle cx="150" cy="200" r="3.5" fill="#ffffff" />
          <circle cx="250" cy="150" r="2" fill="#FFC72C" />
          <circle cx="350" cy="220" r="4" fill="#ffffff" />
          <circle cx="420" cy="180" r="3" fill="#FFC72C" />
          
          <circle cx="1000" cy="150" r="3" fill="#FFC72C" />
          <circle cx="1120" cy="250" r="4.5" fill="#ffffff" />
          <circle cx="1250" cy="180" r="3.5" fill="#FFC72C" />

          <circle cx="200" cy="500" r="3" fill="#ffffff" />
          <circle cx="220" cy="510" r="2" fill="#FFC72C" />
          <circle cx="240" cy="525" r="3.5" fill="#ffffff" />
          
          <circle cx="800" cy="600" r="2.5" fill="#ffffff" />
          <circle cx="850" cy="620" r="3" fill="#FFC72C" />
          <circle cx="900" cy="590" r="2" fill="#ffffff" />
        </g>

        {/* Large decorative glowing rings */}
        <circle cx="1400" cy="100" r="180" stroke="rgba(255, 199, 44, 0.08)" strokeWidth="2" />
        <circle cx="1400" cy="100" r="240" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" strokeDasharray="8 8" />
        
        <circle cx="50" cy="700" r="120" stroke="rgba(255, 199, 44, 0.05)" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

/* ── Component ──────────────────────────────────────────── */
export default function CareerPage() {
  const navigate = useNavigate()
  const [activeDept, setActiveDept] = useState('All')
  const [selectedJob, setSelectedJob] = useState(null)

  // Job application modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [applyingForJob, setApplyingForJob] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const handleApplyClick = (job) => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    setApplyingForJob(job)
    setValue('jobTitle', job.title)
    setValue('department', job.dept)
    setIsApplyModalOpen(true)
    setSelectedJob(null)
  }

  const handleResumeChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (!validTypes.includes(selected.type)) {
      toast.error('Only PDF, DOC, or DOCX files are allowed.')
      e.target.value = ''
      setResumeFile(null)
      return
    }
    if (selected.size > 2 * 1024 * 1024) {
      toast.error('File size must be under 2MB.')
      e.target.value = ''
      setResumeFile(null)
      return
    }
    setResumeFile(selected)
  }

  const removeResume = () => {
    setResumeFile(null)
    const el = document.getElementById('jobResumeUpload')
    if (el) el.value = ''
  }

  const closeApplyModal = () => {
    setIsApplyModalOpen(false)
    setApplyingForJob(null)
    setResumeFile(null)
    reset()
  }

  const onSubmitJob = async (data) => {
    if (!resumeFile) {
      toast.error('Please upload your resume.')
      return
    }
    setIsSubmitting(true)
    const formData = new FormData()
    Object.keys(data).forEach(key => formData.append(key, data[key]))
    formData.append('resume', resumeFile)
    try {
      await axios.post(`${JOB_API_URL}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Application submitted! We\'ll be in touch soon.')
      closeApplyModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filtered = activeDept === 'All'
    ? JOBS
    : JOBS.filter(j => j.dept === activeDept)

  return (
    <div className={s.page}>
      <Toaster position="top-right" />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className={s.hero}>
        <GenomicBackground />
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
              We're Hiring · Join Our Mission
            </motion.div>

            <motion.h1 variants={fadeUp} className={s.h1}>
              Build the Future of<br />
              <span className={s.gradientText}>Genomic Intelligence</span>
            </motion.h1>

            <motion.p variants={fadeUp} className={s.heroLead}>
              At AI Infowave, we're decoding life at the molecular level.
              Join a team of scientists and engineers pushing the boundaries of
              bioinformatics, AI, and precision medicine — from Saskatoon to the world.
            </motion.p>

            <motion.div variants={fadeUp} className={s.heroCtas}>
              <a href="#openings" className={s.btnPrimary}>
                View Open Roles <ArrowRight size={16} />
              </a>
              <Link to="/#about-section" className={s.btnOutline}>
                About Us
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className={s.trustRow}>
              {STATS.map(({ num, label }) => (
                <div key={label} className={s.trustStat}>
                  <span className={s.trustNum}>{num}</span>
                  <span className={s.trustLabel}>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className={s.heroVisual}
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            <div className={s.visualGlow} />
            <AtomicAnimation />
          </motion.div>
        </div>
      </section>

      {/* ── OPEN POSITIONS ─────────────────────────────── */}
      <section className={s.jobsSection} id="openings">
        <div className={s.inner}>
          <div className={s.sectionHeaderSplit}>
            <motion.div
              className={s.sectionHeadLeft}
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={fadeUp} className={s.sectionPill}>Opportunities</motion.div>
              <motion.h2 variants={fadeUp} className={s.h2Left}>
                Find Your Role in<br />
                <span className={s.goldText}>Precision Science</span>
              </motion.h2>
            </motion.div>

            <motion.div
              className={s.sectionHeadRight}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className={s.recruitingBadge}>
                <span className={s.recruitingDot} />
                Actively Recruiting
              </div>
              <p className={s.sectionSubLeft}>
                We're building diverse, world-class teams. Browse our open roles and find where you fit in our mission.
              </p>
            </motion.div>
          </div>

          <div className={s.filterRow}>
            {DEPARTMENTS.map(dept => (
              <button
                key={dept}
                className={`${s.filterBtn} ${activeDept === dept ? s.filterBtnActive : ''}`}
                onClick={() => setActiveDept(dept)}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className={s.jobsList}>
            <AnimatePresence mode="popLayout">
              {filtered.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={s.jobCard}
                    style={{ '--accent': job.accent }}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className={s.jobCardLeft}>
                      <div className={s.cardHeaderMain}>
                        <div className={s.jobIconWrap}>{job.icon}</div>
                        <span className={s.cardDeptBadge}>{job.dept}</span>
                      </div>
                      
                      <h3 className={s.jobTitle}>{job.title}</h3>
                      
                      <div className={s.cardMidContent}>
                        <p className={s.cardDescSnippet}>{job.desc}</p>
                        
                        <div className={s.cardMetaRow}>
                          <span className={s.cardMetaItem}>
                            <MapPin size={14} /> {job.location}
                          </span>
                          <span className={s.cardMetaItem}>
                            <Clock size={14} /> {job.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={s.jobCardRight}>
                      <span className={s.learnMoreBtn}>
                        More Details <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── JOB DETAILS MODAL ────────────────────────── */}
        <AnimatePresence>
          {selectedJob && (
            <div className={s.modalOverlay} onClick={() => setSelectedJob(null)}>
              <motion.div 
                className={s.modalContent}
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                {/* Pinned Close Button */}
                <button className={s.modalClose} onClick={() => setSelectedJob(null)}>
                  <X size={20} />
                </button>

                <div className={s.jobDetailsWrapper}>
                  {/* Sidebar Context Panel */}
                  <div className={s.jobDetailsSidebar}>
                    <div 
                      className={s.sidebarIconWrap}
                      style={{ 
                        backgroundColor: `${selectedJob.accent}15`,
                        color: selectedJob.accent
                      }}
                    >
                      {selectedJob.icon}
                    </div>
                    <h2 className={s.sidebarTitle}>{selectedJob.title}</h2>
                    <span className={s.sidebarSubtitle}>{selectedJob.dept} Division</span>
                    
                    <div className={s.sidebarStats}>
                      <div className={s.sidebarStatItem}>
                        <MapPin size={16} className={s.sidebarStatIcon} style={{ color: selectedJob.accent }} />
                        <span>Location: <strong>{selectedJob.location}</strong></span>
                      </div>
                      <div className={s.sidebarStatItem}>
                        <Clock size={16} className={s.sidebarStatIcon} style={{ color: selectedJob.accent }} />
                        <span>Format: <strong>{selectedJob.type}</strong></span>
                      </div>
                      <div className={s.sidebarStatItem}>
                        <TrendingUp size={16} className={s.sidebarStatIcon} style={{ color: selectedJob.accent }} />
                        <span>Level: <strong>{selectedJob.level}</strong></span>
                      </div>
                    </div>

                    <div className={s.sidebarTechStack}>
                      <h5>Required Tech Stack</h5>
                      <div className={s.techTags}>
                        {selectedJob.tags.map(tag => (
                          <span key={tag} className={s.techTag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Main Content Scroll Panel */}
                  <div className={s.jobDetailsMain}>
                    {/* Role Overview */}
                    <div className={s.mainSection}>
                      <h3 className={s.mainSectionTitle}>
                        <Briefcase size={18} className={s.iconBlue} /> 
                        Role Overview
                      </h3>
                      <p className={s.jobDesc}>{selectedJob.desc}</p>
                    </div>

                    {/* Requirements & Eligibility */}
                    <div className={s.mainSection}>
                      <h3 className={s.mainSectionTitle}>
                        <CheckCircle2 size={18} className={s.iconGreen} />
                        Requirements & Eligibility
                      </h3>
                      <ul className={s.requirementsList}>
                        {selectedJob.eligibility.map((item, idx) => (
                          <li key={idx}>
                            <span className={s.bulletNode} style={{ borderColor: selectedJob.accent }} />
                            <span className={s.bulletText}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Responsibilities */}
                    <div className={s.mainSection}>
                      <h3 className={s.mainSectionTitle}>
                        <Zap size={18} className={s.iconPurple} />
                        Key Responsibilities
                      </h3>
                      <ul className={s.requirementsList}>
                        {selectedJob.responsibilities.map((item, idx) => (
                          <li key={idx}>
                            <span className={s.bulletNode} style={{ borderColor: selectedJob.accent }} />
                            <span className={s.bulletText}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Why Join Us */}
                    <div className={s.mainSection}>
                      <h3 className={s.mainSectionTitle}>
                        <Heart size={18} className={s.iconRed} />
                        Perks & Why Join Us
                      </h3>
                      <div className={s.perksBox}>
                        {selectedJob.benefits.map((item, idx) => (
                          <div key={idx} className={s.perkItem}>
                            <CheckCircle2 size={16} className={s.perkIcon} />
                            <span className={s.perkText}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pinned Action Footer */}
                <div className={s.modalFooter}>
                  <button className={s.btnDetailsSecondary} onClick={() => setSelectedJob(null)}>
                    Back to Listings
                  </button>
                  <div className={s.modalFooterRight}>
                    <div className={s.modalShareNote}>
                      <Send size={14} />
                      <span>Direct Apply: <strong>hrmanager@aiinfowave.com</strong></span>
                    </div>
                    <button
                      onClick={() => handleApplyClick(selectedJob)}
                      className={s.btnApply}
                    >
                      Apply Now <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
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
                {INTERNSHIP.modules.map((m, i) => (
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

      {/* ── JOB APPLICATION MODAL ─────────────────────────── */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className={s.modalOverlay} onClick={closeApplyModal}>
            <motion.div
              className={s.modalContent}
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <button className={s.modalClose} onClick={closeApplyModal}>
                <X size={20} />
              </button>

              <div className={s.applyFormWrapper}>
                <form onSubmit={handleSubmit(onSubmitJob)} className={s.applyForm}>

                  {/* Form Header */}
                  <div className={s.applyFormHeader}>
                    <div
                      className={s.applyFormIconWrap}
                      style={applyingForJob ? { backgroundColor: `${applyingForJob.accent}18`, color: applyingForJob.accent } : {}}
                    >
                      <Briefcase size={22} />
                    </div>
                    <div>
                      <h3 className={s.applyFormTitle}>Apply for Position</h3>
                      {applyingForJob && (
                        <p className={s.applyFormSubtitle}>
                          {applyingForJob.title} &mdash; {applyingForJob.dept}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hidden fields */}
                  <input type="hidden" {...register('jobTitle')} />
                  <input type="hidden" {...register('department')} />

                  {/* Row 1: Name + Email */}
                  <div className={s.applyGrid2}>
                    <div className={s.applyInputGroup}>
                      <label>Full Name <span className={s.req}>*</span></label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        {...register('fullName', { required: 'Name is required' })}
                      />
                      {errors.fullName && <span className={s.applyError}>{errors.fullName.message}</span>}
                    </div>
                    <div className={s.applyInputGroup}>
                      <label>Email Address <span className={s.req}>*</span></label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                        })}
                      />
                      {errors.email && <span className={s.applyError}>{errors.email.message}</span>}
                    </div>
                  </div>

                  {/* Row 2: Phone + LinkedIn */}
                  <div className={s.applyGrid2}>
                    <div className={s.applyInputGroup}>
                      <label>Phone Number <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
                      <input
                        type="tel"
                        placeholder="+1 234 567 890"
                        {...register('phone')}
                      />
                    </div>
                    <div className={s.applyInputGroup}>
                      <label>LinkedIn URL</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        {...register('linkedin')}
                      />
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className={s.applyInputGroup}>
                    <label>Cover Letter <span className={s.req}>*</span></label>
                    <textarea
                      rows="5"
                      placeholder="Tell us why you're the perfect fit for this role and what excites you about AI InfoWave..."
                      {...register('coverLetter', { required: 'Cover letter is required' })}
                    />
                    {errors.coverLetter && <span className={s.applyError}>{errors.coverLetter.message}</span>}
                  </div>

                  {/* Resume Upload */}
                  <div className={s.applyInputGroup}>
                    <label>Resume <span className={s.req}>*</span></label>
                    <div className={s.applyUploadBox}>
                      {resumeFile ? (
                        <div className={s.applyFilePreview}>
                          <FileText size={22} className={s.applyFileIcon} />
                          <span className={s.applyFileName}>{resumeFile.name}</span>
                          <button type="button" onClick={removeResume} className={s.applyRemoveFile}>
                            <X size={15} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <UploadCloud size={28} className={s.applyUploadIcon} />
                          <p>Drag & drop or <span>browse</span></p>
                          <span className={s.applyUploadHint}>PDF, DOC, DOCX — max 2 MB</span>
                        </>
                      )}
                      <input
                        type="file"
                        id="jobResumeUpload"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleResumeChange}
                        className={s.applyFileInput}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className={s.applySubmitBtn}>
                    {isSubmitting ? (
                      <span className={s.applySpinner} />
                    ) : (
                      <><CheckCircle2 size={18} /> Submit Application</>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
