import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Briefcase, GraduationCap, Clock, Globe, Award, 
  UploadCloud, CheckCircle2, FileText, X, ArrowRight,
  Zap, Star, Target, Laptop, Server, Layers, Palette, Cpu, BarChart2, BookOpen, TrendingUp
} from 'lucide-react';
import styles from './InternshipPage.module.css';

const API_URL = 'http://localhost:5000/api/internships';

const TRACKS = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    subtitle: 'Genomic Interfaces & React',
    tags: ['React', 'Next.js', 'Tailwind', 'D3.js'],
    iconName: 'Laptop',
    accentColor: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    description: 'Engineer high-performance web applications and interactive scientific dashboards. You will work on real-time data visualization platforms, genomic browsers, and three-dimensional protein visualization tools.',
    duration: '12 Weeks',
    level: 'Intermediate',
    curriculum: [
      { phase: 'Weeks 1-4', title: 'Advanced React & Architecture', desc: 'Deep dive into state management (Redux/Zustand), Custom Hooks, performance profiling, and modern component systems.' },
      { phase: 'Weeks 5-8', title: 'Bio-Data Visualization', desc: 'Master charting and visual analysis tools like D3.js and Highcharts to map chromosomes, genetic variations, and microarrays.' },
      { phase: 'Weeks 9-12', title: 'Next.js & Micro-Frontends', desc: 'Architect server-side rendered (SSR) applications with Next.js, implement client auth flow, and connect backend APIs.' }
    ],
    projects: [
      'Interactive Biological Genome Browser (Render chromosomes and gene tracks interactively)',
      'Clinical Variant Filtration Dashboard (Dynamic tables, cohort filtering, and charts for medical labs)'
    ],
    prerequisites: 'Strong proficiency in HTML, CSS, JavaScript (ES6+). Familiarity with React concepts.',
    careers: ['Frontend Architect', 'Bio-Data UI Engineer', 'Creative Technologist'],
    featured: true
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    subtitle: 'High-Throughput APIs',
    tags: ['Node.js', 'Express', 'MongoDB', 'Redis'],
    iconName: 'Server',
    accentColor: '#7c3aed',
    bgColor: 'rgba(124, 58, 237, 0.1)',
    description: 'Engineer ultra-scalable microservices and secure database structures capable of handling billions of genetic query variants and patient logs in real time.',
    duration: '12 Weeks',
    level: 'Intermediate to Advanced',
    curriculum: [
      { phase: 'Weeks 1-4', title: 'Advanced REST/GraphQL APIs', desc: 'Architect modular backend engines using Node.js/Express, setting up validation and clean error handling.' },
      { phase: 'Weeks 5-8', title: 'Caching & Database Tuning', desc: 'Optimize high-load queries in MongoDB, set up Redis caching layers, and manage bulk tasks with BullMQ queues.' },
      { phase: 'Weeks 9-12', title: 'Security & Cloud Deployment', desc: 'Integrate secure OAuth/JWT systems, implement rate limiting, containerize apps with Docker, and deploy to AWS.' }
    ],
    projects: [
      'Variant Annotation REST API (Processes heavy genomic variant files and aggregates details from multiple databases)',
      'High-Concurrency Processing Engine (Manages asynchronous heavy calculations using task queues)'
    ],
    prerequisites: 'Solid programming skills in JavaScript or Python, basic database management, and network concepts.',
    careers: ['Backend Architect', 'Data Platform Engineer', 'DevOps / Site Reliability Specialist'],
    featured: false
  },
  {
    id: 'mern',
    title: 'MERN Stack Developer',
    subtitle: 'Full-Stack Labs & Platforms',
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
    iconName: 'Layers',
    accentColor: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    description: 'Bridge the full development spectrum. Construct robust server endpoints, configure database schemas, and create interactive, highly responsive client-side bioinformatics dashboards.',
    duration: '12 Weeks',
    level: 'Intermediate',
    curriculum: [
      { phase: 'Weeks 1-4', title: 'End-to-End Foundation', desc: 'Design full database structures in MongoDB, write Express controllers, and connect them with stateful React clients.' },
      { phase: 'Weeks 5-8', title: 'User Roles & File Workflows', desc: 'Implement multi-role security (Researcher, Physician, Admin), session management, and high-volume data file uploading.' },
      { phase: 'Weeks 9-12', title: 'Unit Testing & DevOps Integration', desc: 'Write comprehensive integration tests with Jest, bundle optimized production builds, and deploy using CI/CD.' }
    ],
    projects: [
      'Collaborative Research Workspace (Live updates, shared notes, and secure data storage for lab members)',
      'Variant Quality Analysis System (An app to upload files, process them, and download generated clinical reports)'
    ],
    prerequisites: 'Basic knowledge of frontend React and server-side Node.js. Familiarity with databases.',
    careers: ['Full-Stack Engineer', 'SaaS Product Developer', 'Technical Architect'],
    featured: false
  },
  {
    id: 'design',
    title: 'UI/UX Designer',
    subtitle: 'Scientific Product Design',
    tags: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
    iconName: 'Palette',
    accentColor: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    description: 'Engage in user research with scientists, clinicians, and engineers. Translate biological pipelines into streamlined workflows, designing gorgeous and intuitive interfaces.',
    duration: '12 Weeks',
    level: 'Beginner to Intermediate',
    curriculum: [
      { phase: 'Weeks 1-4', title: 'Figma Mastery & Styling Systems', desc: 'Harness Figma auto-layout, interactive variants, variables, and create modular scientific design components.' },
      { phase: 'Weeks 5-8', title: 'UX Research & Wireframing', desc: 'Understand biological workflow friction, draw high-level user flow charts, and map dense multi-panel analytical portals.' },
      { phase: 'Weeks 9-12', title: 'Hi-Fi Mockups & Interactive Testing', desc: 'Formulate modern aesthetic mockups, build realistic prototype transitions, and conduct usability tests.' }
    ],
    projects: [
      'Bioinformatics Design System (Figma library specifically tailored for dense laboratory UI layouts)',
      'Clinical Diagnostic Portal Redesign (A simplified dashboard workflow for testing variant panels)'
    ],
    prerequisites: 'A portfolio displaying design sensibilities. Strong empathy and basic knowledge of Figma.',
    careers: ['Lead Product Designer', 'UX Researcher / Strategist', 'Interaction Designer'],
    featured: false
  },
  {
    id: 'aiml',
    title: 'AI/ML Intern',
    subtitle: 'Predictive Biology & Deep Learning',
    tags: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn'],
    iconName: 'Cpu',
    accentColor: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.1)',
    description: 'Formulate, train, and test advanced artificial intelligence models to predict chemical interactions, classify mutations, and extract patterns from biological imagery.',
    duration: '12 Weeks',
    level: 'Advanced',
    curriculum: [
      { phase: 'Weeks 1-4', title: 'Classical ML & Data pipelines', desc: 'Perform heavy data processing with Pandas/Numpy, clean biological datasets, and train classical statistical ML models.' },
      { phase: 'Weeks 5-8', title: 'Deep Learning & DNA Sequencing', desc: 'Write deep neural networks in PyTorch, focusing on CNNs for cell imagery or sequence models (RNNs/Transformers) for DNA.' },
      { phase: 'Weeks 9-12', title: 'Model Optimization & AI Deployment', desc: 'Tune hyperparameters, analyze confusion matrices, optimize model inference speeds, and package models as microservices.' }
    ],
    projects: [
      'Genomic Mutation Classifier (Classifies variant files into benign, pathogenic, or uncertain categories)',
      'Protein-Ligand Interaction Predictor (A deep learning model predicting drug-molecule binding affinity)'
    ],
    prerequisites: 'Intermediate Python programming, advanced linear algebra, calculus, and basic statistics/ML concepts.',
    careers: ['AI / ML Engineer', 'Computational Biologist', 'Bioinformatics Scientist'],
    featured: true
  },
  {
    id: 'data',
    title: 'Data Analyst',
    subtitle: 'Clinical Intelligence',
    tags: ['SQL', 'Pandas', 'Tableau', 'Statistics'],
    iconName: 'BarChart2',
    accentColor: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.1)',
    description: 'Transform massive raw scientific datasets into valuable clinical insights. Build dashboards that track data collection accuracy and help direct platform expansion.',
    duration: '12 Weeks',
    level: 'Beginner to Intermediate',
    curriculum: [
      { phase: 'Weeks 1-4', title: 'Advanced SQL Querying', desc: 'Master analytical queries, window functions, complex database joins, and ETL pipeline designs.' },
      { phase: 'Weeks 5-8', title: 'Python Wrangling & Statistics', desc: 'Leverage Pandas/Numpy for scientific data cleaning, and apply statistical models to check data variances.' },
      { phase: 'Weeks 9-12', title: 'Business Intelligence & Dashboards', desc: 'Create interactive clinical dashboards in Tableau, detailing pipeline performance, run success rates, and diagnostic timelines.' }
    ],
    projects: [
      'Lab Throughput Performance Dashboard (Visualizes lab equipment usage, average test durations, and anomalies)',
      'Clinical Trial Analysis Report (Evaluates efficiency and diagnostic accuracy across different trial variants)'
    ],
    prerequisites: 'Strong mathematical/analytical mindset, basic SQL knowledge, and proficiency in spreadsheet analysis.',
    careers: ['Clinical Data Analyst', 'BI Specialist', 'Healthcare Data Operations Lead'],
    featured: false
  }
];

const iconMap = {
  Laptop,
  Server,
  Layers,
  Palette,
  Cpu,
  BarChart2
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

export default function InternshipPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const handleApplyClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const validTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!validTypes.includes(selected.type)) {
        toast.error('Only PDF, DOC, or DOCX files are allowed.');
        e.target.value = '';
        setFile(null);
        return;
      }
      if (selected.size > 2 * 1024 * 1024) {
        toast.error('File size must be under 2MB.');
        e.target.value = '';
        setFile(null);
        return;
      }
      setFile(selected);
    }
  };

  const removeFile = () => {
    setFile(null);
    document.getElementById('resumeUpload').value = '';
  };

  const onSubmit = async (data) => {
    if (!file) {
      toast.error('Please upload your resume.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    formData.append('resume', file);

    try {
      await axios.post(`${API_URL}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Application submitted successfully!');
      reset();
      removeFile();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Toaster position="top-right" />
      
      {/* ── HERO ─────────────────────────────────────── */}
      <section className={styles.heroCenter}>
        <div className={styles.heroBg}></div>
        <div className={styles.heroGridBg}></div>
        
        <div className={styles.inner}>
          <motion.div 
            className={styles.heroCenterContent}
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className={styles.pillCenter}>
              <Zap size={14} className={styles.textBlue} /> 2026 Cohort Open
            </motion.div>
            
            <motion.h1 variants={fadeUp} className={styles.h1Center}>
              Accelerate Your<br />
              <span className={styles.gradientText}>Potential</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className={styles.heroLeadCenter}>
              Dive into real-world projects. Work alongside elite engineers. 
              Build the future of biological intelligence with AI InfoWave.
            </motion.p>
            

            {/* Floating Glass Statistics */}
            <motion.div 
              className={styles.glassStatsRow}
              variants={fadeUp}
            >
              <div className={styles.glassStatCard}>
                <div className={styles.glassStatIconWrap}><Target size={20} className={styles.textViolet} /></div>
                <div className={styles.glassStatText}>
                  <h4>Real-World Projects</h4>
                  <p>Build enterprise-grade platforms.</p>
                </div>
              </div>

              <div className={styles.glassStatCard}>
                <div className={styles.glassStatIconWrap}><Clock size={20} className={styles.textBlue} /></div>
                <div className={styles.glassStatText}>
                  <h4>12 Weeks of Immersion</h4>
                  <p>From zero to shipping production code.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CHOOSE SPECIALIZATION: AVAILABLE TRACKS ── */}
      <section className={styles.sectionAlt}>
        <div className={styles.inner}>
          <div className={styles.sectionHeaderSplit}>
            <div>
              <h2 className={styles.h2}>Available Tracks</h2>
              <p className={styles.sectionP}>Choose your specialization.</p>
            </div>
            <button onClick={handleApplyClick} className={styles.btnOutline}>
              Apply Now
            </button>
          </div>
          
          <div className={styles.tracksGrid}>
            {TRACKS.map((track, idx) => {
              const IconComp = iconMap[track.iconName] || BookOpen;
              return (
                <motion.div 
                  key={track.id} 
                  className={styles.trackCard}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, type: 'spring', stiffness: 80 }}
                  onClick={() => setSelectedTrack(track)}
                >
                  <div>
                    <div className={styles.trackCardHeader}>
                      <div 
                        className={styles.trackCardIconWrap}
                        style={{ 
                          backgroundColor: track.bgColor,
                          color: track.accentColor
                        }}
                      >
                        <IconComp size={24} />
                      </div>
                      {track.featured && (
                        <span className={styles.trackFeaturedBadge}>
                          Hot Track
                        </span>
                      )}
                    </div>

                    <h3 className={styles.trackCardTitle}>{track.title}</h3>
                    <span className={styles.trackCardSubtitle}>{track.subtitle}</span>
                    <p className={styles.trackCardDesc}>{track.description}</p>
                    
                    <div className={styles.trackCardTags}>
                      {track.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={styles.trackCardTag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.trackCardFooter}>
                    <div className={styles.trackCardFooterLeft}>
                      <Clock size={14} className={styles.textBlue} />
                      <span>{track.duration}</span>
                    </div>
                    <div className={styles.trackCardFooterRight}>
                      <span>More Details</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── UNIFIED GROWTH ENGINE & APPLY SECTION ───── */}
      <section className={styles.applySection}>
        <div className={styles.inner}>
          <div className={styles.sectionHeaderCentered}>
            <h2 className={styles.h2Light}>Why Join Us</h2>
            <p className={styles.sectionPLight}>Everything you need to level up your career.</p>
          </div>

          <div className={styles.applyGrid}>
            
            {/* Left Column: Benefits */}
            <div className={styles.benefitsCol}>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIconWrap}><Briefcase size={24} /></div>
                <div>
                  <h4>Real-World Impact</h4>
                  <p>Forget toy projects. You'll be pushing code that directly impacts our core bioinformatics pipelines and helps researchers globally.</p>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIconWrap}><Award size={24} /></div>
                <div>
                  <h4>Certification</h4>
                  <p>Receive a verified, industry-recognized certificate of excellence.</p>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIconWrap}><GraduationCap size={24} /></div>
                <div>
                  <h4>Expert Guidance</h4>
                  <p>Weekly 1:1 sessions with senior engineers.</p>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.benefitIconWrap}><Globe size={24} /></div>
                <div>
                  <h4>Work from Anywhere</h4>
                  <p>Our remote-first culture means you can contribute from any timezone, giving you the ultimate flexibility.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Application Process */}
            <div className={styles.processCol}>
              <div className={styles.processCard}>
                <h3 className={styles.h3Light}>Ready to Build?</h3>
                <p className={styles.processDesc}>
                  Submit your application today. Our engineering team reviews portfolios on a rolling basis. 
                  Make sure to highlight your best work!
                </p>
                
                <ul className={styles.stepsList}>
                  <li>
                    <div className={styles.stepNum}>1</div>
                    <div>
                      <strong>Submit Application</strong>
                      <span>Fill out the form with your resume</span>
                    </div>
                  </li>
                  <li>
                    <div className={styles.stepNum}>2</div>
                    <div>
                      <strong>Technical Review</strong>
                      <span>We review your GitHub & Portfolio</span>
                    </div>
                  </li>
                  <li>
                    <div className={styles.stepNum}>3</div>
                    <div>
                      <strong>Interview</strong>
                      <span>A quick chat with our engineers</span>
                    </div>
                  </li>
                </ul>

                <button onClick={handleApplyClick} className={styles.btnPrimaryBlock}>
                  Apply for Internship <ArrowRight size={18} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MODAL OVERLAY & FORM ────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
            <motion.div 
              className={styles.modalContent}
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <button className={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>

              <div className={styles.formWrapper}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.modernForm}>
                  <div className={styles.formHeader}>
                    <h3>Application Form</h3>
                    <p>Tell us about yourself and your experience.</p>
                  </div>

                  <div className={styles.grid2}>
                    <div className={styles.inputGroup}>
                      <label>Full Name</label>
                      <input type="text" placeholder="John Doe" {...register('fullName', { required: 'Name is required' })} />
                      {errors.fullName && <span className={styles.error}>{errors.fullName.message}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Email Address</label>
                      <input type="email" placeholder="john@example.com" {...register('email', { 
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                      })} />
                      {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                    </div>
                  </div>

                  <div className={styles.grid2}>
                    <div className={styles.inputGroup}>
                      <label>Phone Number</label>
                      <input type="tel" placeholder="+1 234 567 890" {...register('phone', { required: 'Phone is required' })} />
                      {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>College/University</label>
                      <input type="text" placeholder="MIT" {...register('college', { required: 'College is required' })} />
                      {errors.college && <span className={styles.error}>{errors.college.message}</span>}
                    </div>
                  </div>

                  <div className={styles.grid2}>
                    <div className={styles.inputGroup}>
                      <label>Current Year</label>
                      <select {...register('currentYear', { required: 'Select your year' })}>
                        <option value="">Select...</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduated">Graduated</option>
                      </select>
                      {errors.currentYear && <span className={styles.error}>{errors.currentYear.message}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Role</label>
                      <select {...register('internshipRole', { required: 'Select a role' })}>
                        <option value="">Select...</option>
                        {TRACKS.map((t, i) => <option key={i} value={t.title}>{t.title}</option>)}
                      </select>
                      {errors.internshipRole && <span className={styles.error}>{errors.internshipRole.message}</span>}
                    </div>
                  </div>

                  <div className={styles.divider}></div>

                  <div className={styles.formHeader}>
                    <h3>Experience & Portfolio</h3>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Key Skills</label>
                    <input type="text" placeholder="React, Node.js, Python (comma separated)" {...register('skills', { required: 'Skills are required' })} />
                    {errors.skills && <span className={styles.error}>{errors.skills.message}</span>}
                  </div>

                  <div className={styles.grid2}>
                    <div className={styles.inputGroup}>
                      <label>LinkedIn</label>
                      <input type="url" placeholder="https://linkedin.com/in/..." {...register('linkedin')} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>GitHub / Portfolio</label>
                      <input type="url" placeholder="https://github.com/..." {...register('portfolio')} />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Why should we hire you?</label>
                    <textarea rows="4" placeholder="Tell us about your passion and what you hope to achieve..." {...register('hireReason', { required: 'This field is required' })}></textarea>
                    {errors.hireReason && <span className={styles.error}>{errors.hireReason.message}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Resume</label>
                    <div className={styles.uploadBox}>
                      {file ? (
                        <div className={styles.filePreview}>
                          <FileText size={24} className={styles.fileIcon} />
                          <span className={styles.fileName}>{file.name}</span>
                          <button type="button" onClick={removeFile} className={styles.removeFile}>
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <UploadCloud size={32} className={styles.uploadIcon} />
                          <p>Drag & drop your resume here, or <span>browse</span></p>
                          <span className={styles.uploadHint}>PDF, DOC, DOCX (Max 2MB)</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        id="resumeUpload"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                        onChange={handleFileChange}
                        className={styles.fileInput}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                    {isSubmitting ? (
                      <span className={styles.spinner}></span>
                    ) : (
                      <>Submit Application <CheckCircle2 size={18} /></>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── TRACK DETAILS MODAL ────────────────────── */}
      <AnimatePresence>
        {selectedTrack && (
          <div className={styles.detailModalOverlay} onClick={() => setSelectedTrack(null)}>
            <motion.div 
              className={styles.detailModalContent}
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <button className={styles.trackDetailsClose} onClick={() => setSelectedTrack(null)}>
                <X size={20} />
              </button>

              <div className={styles.trackDetailsWrapper}>
                {/* Sidebar */}
                <div className={styles.trackDetailsSidebar}>
                  <div 
                    className={styles.sidebarIconWrap}
                    style={{ 
                      backgroundColor: selectedTrack.bgColor,
                      color: selectedTrack.accentColor
                    }}
                  >
                    {React.createElement(iconMap[selectedTrack.iconName] || BookOpen, { size: 28 })}
                  </div>
                  <h2 className={styles.sidebarTitle}>{selectedTrack.title}</h2>
                  <span className={styles.sidebarSubtitle}>{selectedTrack.subtitle}</span>
                  
                  <p className={styles.sidebarDesc}>{selectedTrack.description}</p>

                  <div className={styles.sidebarStats}>
                    <div className={styles.sidebarStatItem}>
                      <Clock size={16} className={styles.sidebarStatIcon} />
                      <span>Duration: <strong>{selectedTrack.duration}</strong></span>
                    </div>
                    <div className={styles.sidebarStatItem}>
                      <TrendingUp size={16} className={styles.sidebarStatIcon} />
                      <span>Level: <strong>{selectedTrack.level}</strong></span>
                    </div>
                    <div className={styles.sidebarStatItem}>
                      <Globe size={16} className={styles.sidebarStatIcon} />
                      <span>Format: <strong>Remote-First</strong></span>
                    </div>
                  </div>

                  <div className={styles.sidebarPrereq}>
                    <h5><BookOpen size={14} /> Prerequisites</h5>
                    <p>{selectedTrack.prerequisites}</p>
                  </div>
                </div>

                {/* Main Content */}
                <div className={styles.trackDetailsMain}>
                  {/* Curriculum */}
                  <div>
                    <h3 className={styles.mainSectionTitle}>
                      <Clock size={18} className={styles.textBlue} /> 
                      12-Week Structured Curriculum
                    </h3>
                    <div className={styles.timelineList}>
                      {selectedTrack.curriculum.map((item, idx) => (
                        <div key={idx} className={styles.timelineItem}>
                          <div className={styles.timelineNode} style={{ borderColor: selectedTrack.accentColor }} />
                          <div className={styles.timelineContent}>
                            <span className={styles.timelinePhase} style={{ color: selectedTrack.accentColor }}>{item.phase}</span>
                            <span className={styles.timelineTitle}>{item.title}</span>
                            <span className={styles.timelineDesc}>{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects */}
                  <div>
                    <h3 className={styles.mainSectionTitle}>
                      <Target size={18} className={styles.textViolet} />
                      Capstone Portfolio Projects
                    </h3>
                    <div className={styles.capstoneBox}>
                      {selectedTrack.projects.map((proj, idx) => (
                        <div key={idx} className={styles.projectItem}>
                          <CheckCircle2 size={16} className={styles.projectIcon} />
                          <span className={styles.projectText}>{proj}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className={styles.mainSectionTitle}>
                      <Zap size={18} className={styles.textBlue} />
                      Core Technologies & Tools
                    </h3>
                    <div className={styles.trackCardTags}>
                      {selectedTrack.tags.map(tag => (
                        <span key={tag} className={styles.trackCardTag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Career Pathways */}
                  <div>
                    <h3 className={styles.mainSectionTitle}>
                      <Award size={18} className={styles.textViolet} />
                      Target Career Pathways
                    </h3>
                    <div className={styles.careersBox}>
                      {selectedTrack.careers.map((career, idx) => (
                        <span key={idx} className={styles.careerBadge}>{career}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className={styles.detailModalFooter}>
                <button 
                  className={styles.btnDetailsSecondary} 
                  onClick={() => setSelectedTrack(null)}
                >
                  Close & Back
                </button>
                <button 
                  className={styles.btnDetailsApply}
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    if (!token) {
                      navigate('/login');
                    } else {
                      setValue('internshipRole', selectedTrack.title);
                      setIsModalOpen(true);
                      setSelectedTrack(null);
                    }
                  }}
                >
                  Apply for this Track <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
