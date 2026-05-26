import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Database, Dna, BarChart3, SearchCheck, Microscope,
  Shield, Cpu, Lock, FileText, Zap, Server,
  ArrowRight, ChevronLeft, CheckCircle2,
  FlaskConical, GitBranch, AlignCenter, ScanLine, Activity, LayoutDashboard
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import ngsPhoto from '../../assets/ngs_photo.png'
import imgAdvancedTools from '../../assets/Advanced Tools.png'
import imgHighAccuracy from '../../assets/High Accuracy.png'
import imgLargeDataset from '../../assets/Large Dataset.png'
import imgTailoredReports from '../../assets/Tailored_Report.png'
import imgSecureData from '../../assets/secure_Data_Handling.png'
import s from './NgsPage.module.css'

/* ── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
}

/* ── Data ───────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: <Database size={28} />,
    title: 'Core Processing & Alignment',
    desc: 'High-throughput data preprocessing, quality assessment, and precise read alignment against reference genomes.',
    tools: ['FastQC', 'Trimmomatic', 'BWA', 'Bowtie2'],
    accent: '#2563eb',
    bg: '#eff6ff',
  },
  {
    icon: <Dna size={28} />,
    title: 'Variant Discovery',
    desc: 'Identification of SNPs, INDELs, and structural variants from WGS and WES with clinical-grade accuracy.',
    tools: ['GATK', 'SAMtools', 'Picard'],
    accent: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    icon: <BarChart3 size={28} />,
    title: 'Expression Analysis',
    desc: 'Differential gene expression analysis, transcript assembly, and isoform quantification from RNA-Seq data.',
    tools: ['STAR', 'HISAT2', 'DESeq2', 'Salmon'],
    accent: '#06b6d4',
    bg: '#ecfeff',
  },
  {
    icon: <ScanLine size={28} />,
    title: 'Single-Cell Genomics',
    desc: 'High-resolution cellular profiling, clustering, and trajectory inference from scRNA-Seq and scATAC-Seq.',
    tools: ['Seurat', 'Scanpy', 'CellRanger'],
    accent: '#059669',
    bg: '#ecfdf5',
  },
  {
    icon: <Microscope size={28} />,
    title: 'Microbiome Analysis',
    desc: 'Taxonomic profiling and functional analysis of microbial communities from environmental or clinical samples.',
    tools: ['QIIME2', 'Kraken2', 'MetaPhlAn'],
    accent: '#d97706',
    bg: '#fffbeb',
  },
]

const WORKFLOW = [
  { icon: <FlaskConical size={22} />, step: '01', title: 'Raw Data Input', desc: 'Secure ingestion of FASTQ/BAM files' },
  { icon: <ScanLine size={22} />, step: '02', title: 'Quality Control', desc: 'FastQC, MultiQC assessment & filtering' },
  { icon: <AlignCenter size={22} />, step: '03', title: 'Alignment', desc: 'STAR / HISAT2 / Bowtie2 mapping' },
  { icon: <GitBranch size={22} />, step: '04', title: 'Variant Calling', desc: 'GATK HaplotypeCaller & annotation' },
  { icon: <Activity size={22} />, step: '05', title: 'Functional Analysis', desc: 'Pathway enrichment & expression' },
  { icon: <LayoutDashboard size={22} />, step: '06', title: 'Visualization', desc: 'Interactive dashboards & reports' },
]

const WHY_US = [
  { icon: <Cpu size={24} />, img: imgAdvancedTools, title: 'Advanced Tools', desc: 'Industry-leading pipelines: STAR, HISAT2, GATK, Bowtie2, SAMtools — fully automated.', accent: '#2563eb' },
  { icon: <CheckCircle2 size={24} />, img: imgHighAccuracy, title: 'High Accuracy', desc: '99.9% analysis accuracy backed by rigorous validation protocols and QC checkpoints.', accent: '#7c3aed' },
  { icon: <Server size={24} />, img: imgLargeDataset, title: 'Large Dataset Expertise', desc: 'Scalable cloud infrastructure handles terabyte-scale multi-omics datasets with ease.', accent: '#06b6d4' },
  { icon: <FileText size={24} />, img: imgTailoredReports, title: 'Tailored Reports', desc: 'Peer-review-ready reports and interactive dashboards with dedicated scientific support.', accent: '#059669' },
  { icon: <Lock size={24} />, img: imgSecureData, title: 'Secure Data Handling', desc: 'End-to-end encryption and GDPR-compliant data management for sensitive genomic data.', accent: '#d97706' },
]

const TOOLS = ['STAR', 'HISAT2', 'GATK', 'Bowtie2', 'SAMtools', 'FastQC', 'DESeq2', 'QIIME2', 'Trimmomatic', 'Picard', 'BWA', 'Salmon']

const STATS = [
  { num: '10K+', label: 'Samples Processed' },
  { num: '99.9%', label: 'Accuracy Rate' },
  { num: '500+', label: 'Research Projects' },
  { num: '24h', label: 'Avg. Turnaround' },
]

// Tech Stack is now combined with SERVICES
/* ── Component ──────────────────────────────────────────── */
export default function NgsPage() {
  const navigate = useNavigate();
  const [activeWhy, setActiveWhy] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenProjectCallClick = (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    } else {
      navigate('/open-project-call')
    }
  }

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveWhy((prev) => (prev + 1) % WHY_US.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div className={s.page}>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className={s.hero}>
        {/* decorative blobs */}
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
              Next-Generation Sequencing · AI-Powered
            </motion.div>

            <motion.h1 variants={fadeUp} className={s.h1}>
              NGS Data<br />
              <span className={s.gradientText}>Analysis</span>
            </motion.h1>

            <motion.p variants={fadeUp} className={s.heroLead}>
              Transforming raw sequencing data into clinical-grade insights. Our AI-driven
              bioinformatics pipelines decode billions of genomic fragments with
              unparalleled speed and precision.
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

          {/* Hero image */}
          <motion.div
            className={s.heroImage}
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            <div className={s.imageGlow} />
            <div className={s.imageCard}>
              <img src={ngsPhoto} alt="NGS data visualization" />
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
              End-to-End NGS<br />
              <span className={s.gradientText}>Capabilities & Tech Stack</span>
            </motion.h2>
            <motion.p variants={fadeUp} className={s.sectionSub}>
              Comprehensive bioinformatics services powered by validated, industry-standard pipelines and tools.
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
                        <div className={s.dataIconWrap}>
                          {svc.icon}
                        </div>

                        <div className={s.dataEqualizer}>
                          <span /> <span /> <span />
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

      {/* ── WHY CHOOSE US (Interactive Switcher) ───────────────── */}
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
              Every tool and pipeline is purpose-built for real-world bioinformatics — not adapted from generic ML frameworks.
            </motion.p>
          </motion.div>

          <div className={s.whyInteractiveContainer}>
            {/* Left Nav */}
            <div className={s.whyNav}>
              {WHY_US.map((item, idx) => {
                const isActive = activeWhy === idx;
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
                        layoutId="activeTabIndicator"
                        className={s.whyTabIndicator}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                );
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
                  {/* Card image */}
                  <div className={s.whyDisplayImgWrap}>
                    <img
                      src={WHY_US[activeWhy].img}
                      alt={WHY_US[activeWhy].title}
                      className={s.whyDisplayImg}
                    />
                    <div className={s.whyDisplayImgOverlay} />
                  </div>
                  {/* Icon badge over image removed */}
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

      {/* Removed cluster grid, tools are now in SERVICES */}

      {/* ── CTA BANNER ────────────────────────────────── */}
      <div className={s.ctaBanner} aria-label="Call to action">
        <div className={s.ctaBannerInner}>
          <h2 className={s.ctaBannerH2}>Accelerate Your Genomics Research<br />with AI-Driven NGS Analysis</h2>
          <p className={s.ctaBannerP}>
            Join leading biotech companies and research institutions already harnessing the power of precision genomics.
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
