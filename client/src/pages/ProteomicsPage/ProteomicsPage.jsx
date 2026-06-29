import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, Network, Search,
  Cpu, CheckCircle2, Server, FileText, Lock,
  ArrowRight, ChevronLeft, Layers, ScanSearch,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import proteomicsPhoto from '../../assets/Protomics.png'
import imgAdvancedTools from '../../assets/Advanced Tools.png'
import imgHighAccuracy from '../../assets/High Accuracy.png'
import imgLargeDataset from '../../assets/Large Dataset.png'
import imgTailoredReports from '../../assets/Tailored_Report.png'
import imgSecureData from '../../assets/secure_Data_Handling.png'
import s from './ProteomicsPage.module.css'

/* ── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

/* ── Data ───────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: <ScanSearch size={28} />,
    title: 'Protein Identification',
    desc: 'High-confidence protein identification from raw mass spectrometry data using state-of-the-art database search engines and spectral library matching.',
    tools: ['MaxQuant', 'Mascot', 'Sequest'],
    accent: '#2563eb',
    bg: '#eff6ff',
  },
  {
    icon: <BarChart3 size={28} />,
    title: 'Quantitative Proteomics',
    desc: 'Label-free quantification and isotopic labeling approaches including TMT and SILAC for robust, reproducible protein abundance measurements.',
    tools: ['TMT', 'SILAC', 'Perseus', 'Skyline'],
    accent: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    icon: <Layers size={28} />,
    title: 'Post-Translational Modifications',
    desc: 'Comprehensive PTM analysis covering phosphorylation, glycosylation, ubiquitination, and acetylation using site-specific enrichment workflows.',
    tools: ['PhosphoRS', 'Byonic', 'MSFragger'],
    accent: '#06b6d4',
    bg: '#ecfeff',
  },
  {
    icon: <Network size={28} />,
    title: 'Protein-Protein Interaction Analysis',
    desc: 'Mapping and visualization of interaction networks from AP-MS and BioID experiments to uncover functional protein complexes and signaling hubs.',
    tools: ['STRING', 'Cytoscape', 'ProHits'],
    accent: '#059669',
    bg: '#ecfdf5',
  },
  {
    icon: <Search size={28} />,
    title: 'Functional Enrichment Analysis',
    desc: 'GO term enrichment, KEGG pathway analysis, and gene set enrichment to translate protein lists into biological insights and actionable hypotheses.',
    tools: ['ClusterProfiler', 'GSEA', 'Enrichr'],
    accent: '#d97706',
    bg: '#fffbeb',
  },
]

const WHY_US = [
  { icon: <Cpu size={24} />, img: imgAdvancedTools, title: 'Advanced Tools', desc: 'Industry-leading software — MaxQuant, Skyline, Perseus, and MSFragger — for deep proteome coverage and precise quantification.', accent: '#2563eb' },
  { icon: <CheckCircle2 size={24} />, img: imgHighAccuracy, title: 'High Accuracy', desc: 'Rigorous FDR control and multi-engine validation ensure >99% identification confidence across complex biological matrices.', accent: '#7c3aed' },
  { icon: <Server size={24} />, img: imgLargeDataset, title: 'Large Dataset Expertise', desc: 'Scalable cloud infrastructure handles deep proteome experiments — millions of MS2 spectra processed with speed and precision.', accent: '#06b6d4' },
  { icon: <FileText size={24} />, img: imgTailoredReports, title: 'Tailored Reports', desc: 'Publication-ready reports with interactive volcano plots, heatmaps, and dedicated scientific support throughout your project.', accent: '#059669' },
  { icon: <Lock size={24} />, img: imgSecureData, title: 'Secure Data Handling', desc: 'End-to-end encryption and GDPR-compliant data management for sensitive clinical and research proteomics datasets.', accent: '#d97706' },
]

const STATS = [
  { num: '8K+', label: 'Proteomes Analyzed' },
  { num: '99.2%', label: 'ID Confidence' },
  { num: '350+', label: 'Research Projects' },
  { num: '48h', label: 'Avg. Turnaround' },
]

/* ── Component ──────────────────────────────────────────── */
export default function ProteomicsPage() {
  const navigate = useNavigate()
  const [activeWhy, setActiveWhy] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleOpenProjectCallClick = (e) => {
    e.preventDefault()
    navigate('/open-project-call')
  }

  useEffect(() => {
    if (isHovered) return
    const interval = setInterval(() => {
      setActiveWhy((prev) => (prev + 1) % WHY_US.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <div className={s.page}>

      {/* ── HERO ───────────────────────────────────────────── */}
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
              Proteomics Data Analysis · AI-Powered
            </motion.div>

            <motion.h1 variants={fadeUp} className={s.h1}>
              Proteomics<br />
              <span className={s.gradientText}>Data Analysis</span>
            </motion.h1>

            <motion.p variants={fadeUp} className={s.heroLead}>
              Unlock the full potential of your proteomics data with our expert analysis services.
              From protein identification and quantification to pathway analysis and PTM
              characterization — delivering accurate, actionable insights tailored to your unique
              scientific needs.
            </motion.p>

            <motion.div variants={fadeUp} className={s.heroCtas}>
              <a href="#services" className={s.btnPrimary}>
                Explore Services <ArrowRight size={16} />
              </a>
              <Link to="/contact" className={s.btnOutline}>
                Contact Experts
              </Link>
            </motion.div>

            {/* Trust stats */}
            <motion.div variants={fadeUp} className={s.trustRow}>
              {STATS.map(({ num, label }) => (
                <div key={label} className={s.trustStat}>
                  <span className={s.trustNum}>{num}</span>
                  <span className={s.trustLabel}>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero visual — animated protein network SVG */}
          <motion.div
            className={s.heroImage}
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            <div className={s.imageGlow} />
            <div className={s.imageCard}>
              <img src={proteomicsPhoto} alt="Proteomics data visualization" />
            </div>
          </motion.div>
        </div>
      </section>



      {/* ── KEY SERVICES ───────────────────────────────────── */}
      <section className={s.section} id="services">
        <div className={s.inner}>
          <motion.div
            className={s.sectionHead}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeUp} className={s.sectionPill}>Key Services</motion.div>
            <motion.h2 variants={fadeUp} className={s.h2}>
              Comprehensive Proteomics<br />
              <span className={s.gradientText}>Capabilities & Tech Stack</span>
            </motion.h2>
            <motion.p variants={fadeUp} className={s.sectionSub}>
              End-to-end proteomics analysis powered by validated mass spectrometry pipelines and
              industry-standard bioinformatics tools.
            </motion.p>
          </motion.div>

          <div className={s.zigzagContainer}>
            <div className={s.zigzagLine} />
            {SERVICES.map((svc, index) => (
              <motion.div
                key={svc.title}
                className={`${s.zigzagItem} ${index % 2 === 0 ? s.itemLeft : s.itemRight}`}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className={s.zigzagNode} style={{ borderColor: svc.accent }}>
                  <div className={s.zigzagNodeInner} style={{ background: svc.accent }} />
                </div>

                <div className={s.zigzagCardWrapper}>
                  <div className={s.dataCard} style={{ '--accent': svc.accent }}>
                    <div className={s.dataBorder} />
                    <div className={s.dataInner}>
                      <div className={s.dataGridPattern} />
                      <div className={s.dataHeader}>
                        <div className={s.dataIconWrap}>{svc.icon}</div>
                        <div className={s.dataEqualizer}>
                          <span /><span /><span />
                        </div>
                      </div>
                      <h3 className={s.dataTitle}>{svc.title}</h3>
                      <p className={s.dataDesc}>{svc.desc}</p>
                      <div className={s.dataToolsContainer}>
                        <div className={s.dataToolsHeader}>
                          <div className={s.dataDot} />
                          <span className={s.dataToolsLabel}>PIPELINE_MODULES</span>
                        </div>
                        <div className={s.dataToolsList}>
                          {svc.tools.map(tool => (
                            <span key={tool} className={s.dataToolTag}>
                              <span className={s.dataToolHash}>#</span>
                              {tool}
                            </span>
                          ))}
                          <span className={s.dataCursor} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ──────────────────────────────────── */}
      <section className={s.whyInteractiveSection}>
        <div className={`${s.blob} ${s.blob1}`} />
        <div className={`${s.blob} ${s.blob2}`} />
        <div className={s.inner}>
          <motion.div
            className={s.sectionHead}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeUp} className={s.sectionPill}>
              <span className={s.pillDot} />
              Why Choose Us
            </motion.div>
            <motion.h2 variants={fadeUp} className={s.h2}>
              Built for Researchers,<br />
              <span className={s.gradientText}>by Researchers</span>
            </motion.h2>
            <motion.p variants={fadeUp} className={s.sectionSub}>
              Every pipeline is purpose-built for real-world proteomics — from clinical biomarker
              discovery to structural proteomics and interactomics.
            </motion.p>
          </motion.div>

          <div className={s.whyInteractiveContainer}>
            {/* Left Nav */}
            <div className={s.whyNav}>
              {WHY_US.map((item, idx) => {
                const isActive = activeWhy === idx
                return (
                  <button
                    key={item.title}
                    className={`${s.whyTab} ${isActive ? s.whyTabActive : ''}`}
                    onClick={() => setActiveWhy(idx)}
                    style={{ '--accent': item.accent }}
                  >
                    <div className={s.whyTabIcon}>{item.icon}</div>
                    <span className={s.whyTabTitle}>{item.title}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicatorProteomics"
                        className={s.whyTabIndicator}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Right Display Area */}
            <div
              className={s.whyDisplayArea}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWhy}
                  className={s.whyDisplayCard}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ '--accent': WHY_US[activeWhy].accent }}
                >
                  <div className={s.whyDisplayGlow} />
                  <div className={s.whyDisplayImgWrap}>
                    <img
                      src={WHY_US[activeWhy].img}
                      alt={WHY_US[activeWhy].title}
                      className={s.whyDisplayImg}
                    />
                    <div className={s.whyDisplayImgOverlay} />
                  </div>
                  <div className={s.whyDisplayContent}>
                    <h3 className={s.whyDisplayH3}>{WHY_US[activeWhy].title}</h3>
                    <p className={s.whyDisplayP}>{WHY_US[activeWhy].desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────── */}
      <div className={s.ctaBanner} aria-label="Call to action">
        <div className={s.ctaBannerInner}>
          <h2 className={s.ctaBannerH2}>Accelerate Your Proteomics Research<br />with AI-Driven Mass Spec Analysis</h2>
          <p className={s.ctaBannerP}>
            Join leading biotech companies and research institutions already unlocking the
            full potential of their proteomics data with our expert services.
          </p>
          <div className={s.ctaBtns}>
            <a href="/open-project-call" onClick={handleOpenProjectCallClick} className={s.ctaBtnWhite}>
              Start Your Project <ArrowRight size={16} />
            </a>
            <Link to="/contact" className={s.ctaBtnWhiteOutline}>
              Contact Our Team
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}
