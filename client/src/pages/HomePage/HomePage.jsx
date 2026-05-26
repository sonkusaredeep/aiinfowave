import { useRef, useEffect, useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/Logo.png'
import s from './HomePage.module.css'

/* ── SVG Icon helpers ─────────────────────────────────── */
const Ico = {
  dna: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#2054D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20M2 6c3 0 5 2 5 6s2 6 5 6 5-2 5-6 2-6 5-6M2 18c3 0 5-2 5-6s2-6 5-6 5 2 5 6 2 6 5 6" />
    </svg>
  ),
  protein: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#6C3FD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><circle cx="4" cy="6" r="2" /><circle cx="20" cy="6" r="2" /><circle cx="4" cy="18" r="2" /><circle cx="20" cy="18" r="2" />
      <line x1="6" y1="6" x2="10" y2="10" /><line x1="18" y1="6" x2="14" y2="10" /><line x1="6" y1="18" x2="10" y2="14" /><line x1="18" y1="18" x2="14" y2="14" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#06B6A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="8" height="8" rx="2" /><rect x="14" y="2" width="8" height="8" rx="2" /><rect x="2" y="14" width="8" height="8" rx="2" />
      <path d="M14 18h8M18 14v8" />
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#2054D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2C7 2 5 4 5 6.5c0 1-.3 2-.8 2.8C3.4 10.3 3 11.4 3 12.5 3 16.1 6 19 9.5 19H12v-1M14.5 2C17 2 19 4 19 6.5c0 1 .3 2 .8 2.8.8 1 1.2 2 1.2 3.2C21 16.1 18 19 14.5 19H12v-1" />
      <path d="M12 19v3M9 22h6" />
    </svg>
  ),
  speed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#6C3FD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#06B6A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9,12 11,14 15,10" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="2,6 5,9 10,3" />
    </svg>
  ),
  arrow: ' →',
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#06B6A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
}

const SERVICES = [
  {
    id: 'ngs',
    visClass: s.svcVisNgs,
    visIcon: '🧬',
    badgeColor: '#06B6A4',
    dotColor: '#06B6A4',
    title: 'NGS Data Analysis',
    desc: 'Decode next-generation sequencing data with AI-driven pipelines that deliver variant calls, expression levels, and genome assemblies at clinical-grade accuracy.',
    tags: ['Whole Genome Sequencing', 'RNA-Seq', 'Single-Cell', 'Metagenomics'],
    linkColor: '#06B6A4',
    reverse: false,
  },
  {
    id: 'proteomics',
    visClass: s.svcVisProt,
    visIcon: '⚗️',
    badgeColor: '#06B6A4',
    dotColor: '#06B6A4',
    title: 'Proteomics Analysis',
    desc: 'Understand cellular function at the protein level. Our models predict 3D structure, protein–protein interactions, and post-translational modifications with high confidence.',
    tags: ['Mass Spectrometry', 'Structural Prediction', 'PPI Networks', 'PTM Mapping'],
    linkColor: '#06B6A4',
    reverse: true,
  },
  {
    id: 'ai-healthcare',
    visClass: s.svcVisAI,
    visIcon: '🏥',
    badgeColor: '#06B6A4',
    dotColor: '#06B6A4',
    title: 'AI Healthcare',
    desc: 'Optimize patient outcomes through machine learning powered personalized medicine and healthcare innovations. We integrate multi-omics and clinical datasets to deliver precise diagnostic insights and next-generation therapeutic strategies.',
    tags: ['Predictive Diagnostics', 'Personalized Therapy', 'Clinical NLP', 'Precision Medicine'],
    linkColor: '#06B6A4',
    reverse: false,
  },
]

const PILLARS = [
  { icon: Ico.brain, bg: '#EEF3FF', title: 'AI-Powered', desc: 'Proprietary deep-learning architectures trained on curated genomic and proteomic datasets.' },
  { icon: Ico.dna, bg: '#F3EEFF', title: 'Domain Expertise', desc: 'A multidisciplinary team of bioinformaticians, data scientists, and computational biologists.' },
  { icon: Ico.speed, bg: '#ECFDF9', title: 'Fast Turnaround', desc: 'Scalable cloud infrastructure processes terabyte-scale multi-omics datasets in hours, not weeks.' },
  { icon: Ico.shield, bg: '#FFF7ED', title: 'Validated Results', desc: 'Rigorous quality-control and reproducibility protocols aligned with clinical research standards.' },
]


const BUBBLE_CFG = [
  { left: 5, size: 28, dur: 6.0, delay: 0.0 }, { left: 13, size: 22, dur: 4.5, delay: 1.2 },
  { left: 22, size: 38, dur: 7.2, delay: 0.4 }, { left: 31, size: 16, dur: 3.8, delay: 2.1 },
  { left: 40, size: 34, dur: 5.5, delay: 0.7 }, { left: 49, size: 25, dur: 4.9, delay: 3.0 },
  { left: 57, size: 45, dur: 6.8, delay: 1.5 }, { left: 65, size: 18, dur: 4.2, delay: 0.9 },
  { left: 73, size: 32, dur: 5.8, delay: 2.4 }, { left: 80, size: 24, dur: 4.6, delay: 0.2 },
  { left: 87, size: 42, dur: 7.0, delay: 1.8 }, { left: 93, size: 26, dur: 5.2, delay: 3.5 },
  { left: 17, size: 18, dur: 4.0, delay: 4.1 }, { left: 35, size: 29, dur: 6.3, delay: 2.8 },
  { left: 61, size: 35, dur: 5.0, delay: 1.0 }, { left: 76, size: 20, dur: 3.6, delay: 3.8 },
  { left: 9, size: 30, dur: 5.3, delay: 0.5 }, { left: 27, size: 22, dur: 4.8, delay: 1.6 },
  { left: 45, size: 40, dur: 6.5, delay: 2.3 }, { left: 53, size: 15, dur: 3.9, delay: 0.8 },
  { left: 69, size: 28, dur: 5.1, delay: 2.9 }, { left: 84, size: 36, dur: 6.1, delay: 1.4 },
  { left: 91, size: 19, dur: 4.4, delay: 0.3 }, { left: 97, size: 25, dur: 5.6, delay: 2.7 },
  { left: 2, size: 33, dur: 6.9, delay: 1.9 }, { left: 19, size: 21, dur: 4.7, delay: 3.2 },
  { left: 38, size: 48, dur: 7.5, delay: 0.6 }, { left: 59, size: 17, dur: 4.1, delay: 2.5 },
]

/* ── Service Section Canvas (DNA / Protein / Molecular) ─ */
function SvcCanvas({ type }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d'), W = c.width, H = c.height, cx = W / 2, cy = H / 2
    let t = 0, raf
    function frame() {
      t += 0.014
      ctx.clearRect(0, 0, W, H)
      if (type === 'ngs') {
        const R = 48, RUNGS = 14, sA = [], sB = []
        for (let i = 0; i < RUNGS; i++) {
          const fr = i / (RUNGS - 1), y = 16 + fr * (H - 32), a = fr * Math.PI * 3.5 + t
          sA.push({ x: cx + Math.cos(a) * R, y, z: Math.sin(a) })
          sB.push({ x: cx + Math.cos(a + Math.PI) * R, y, z: Math.sin(a + Math.PI) })
        }
        const draw = (pts, col) => {
          ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y)
          for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2; ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my) }
          ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y)
          ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0
        }
        draw(sA, 'rgba(96,165,250,0.9)'); draw(sB, 'rgba(167,139,250,0.9)')
        sA.forEach((a, i) => {
          const b = sB[i], d = ((a.z + b.z) / 2 + 2) / 4
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(200,220,255,${0.2 + d * 0.5})`; ctx.lineWidth = 1 + d; ctx.stroke()
            ;[a, b].forEach(p => {
              const r = 4 + d * 3; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(147,197,253,${0.7 + d * 0.3})`; ctx.shadowColor = 'rgba(96,165,250,0.9)'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0
            })
        })
      } else if (type === 'proteomics') {
        const nodes = [{ x: cx, y: cy, r: 13 }, { x: cx - 58, y: cy - 48, r: 8 }, { x: cx + 54, y: cy - 44, r: 9 }, { x: cx - 52, y: cy + 54, r: 7 }, { x: cx + 54, y: cy + 48, r: 10 }, { x: cx, y: cy - 82, r: 6 }]
        const cols = ['rgba(167,139,250,1)', 'rgba(96,165,250,0.9)', 'rgba(96,165,250,0.9)', 'rgba(52,211,153,0.9)', 'rgba(52,211,153,0.9)', 'rgba(251,146,60,0.9)']
        const edges = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 5]]
        edges.forEach(([a, b]) => {
          const na = nodes[a], nb = nodes[b], pulse = 0.3 + Math.sin(t + a) * 0.2
          ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y)
          ctx.strokeStyle = `rgba(148,163,184,${pulse})`; ctx.lineWidth = 1.5; ctx.stroke()
          const pg = (Math.sin(t * 1.5 + a) + 1) / 2, px = na.x + (nb.x - na.x) * pg, py = na.y + (nb.y - na.y) * pg
          ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(167,139,250,0.95)'; ctx.shadowColor = 'rgba(167,139,250,0.9)'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0
        })
        nodes.forEach((n, i) => {
          const p = 1 + Math.sin(t * 1.2 + i) * 0.1
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r * p, 0, Math.PI * 2)
          ctx.fillStyle = cols[i]; ctx.shadowColor = cols[i]; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0
          ctx.beginPath(); ctx.arc(n.x - n.r * .3, n.y - n.r * .3, n.r * .35, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fill()
        })
      } else {
        const orbits = [
          { r: 58, spd: 0.7, off: 0, col: 'rgba(52,211,153,0.85)', sz: 7 },
          { r: 58, spd: 0.7, off: Math.PI * 2 / 3, col: 'rgba(96,165,250,0.85)', sz: 6 },
          { r: 58, spd: 0.7, off: Math.PI * 4 / 3, col: 'rgba(251,146,60,0.85)', sz: 8 },
          { r: 92, spd: 0.4, off: 0, col: 'rgba(167,139,250,0.8)', sz: 5 },
          { r: 92, spd: 0.4, off: Math.PI, col: 'rgba(52,211,153,0.8)', sz: 6 },
        ]
          ;[58, 92].forEach(r => {
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
            ctx.strokeStyle = 'rgba(148,163,184,0.12)'; ctx.lineWidth = 1; ctx.stroke()
          })
        const cg = ctx.createRadialGradient(cx - 6, cy - 6, 0, cx, cy, 20)
        cg.addColorStop(0, 'rgba(255,255,255,0.9)'); cg.addColorStop(1, 'rgba(96,165,250,0.8)')
        ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2)
        ctx.fillStyle = cg; ctx.shadowColor = 'rgba(96,165,250,0.9)'; ctx.shadowBlur = 24; ctx.fill(); ctx.shadowBlur = 0
        orbits.forEach(o => {
          const ax = t * o.spd + o.off, x = cx + Math.cos(ax) * o.r, y = cy + Math.sin(ax) * o.r
          ctx.beginPath(); ctx.arc(x, y, o.sz, 0, Math.PI * 2)
          ctx.fillStyle = o.col; ctx.shadowColor = o.col; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0
          ctx.beginPath(); ctx.arc(x - o.sz * .3, y - o.sz * .3, o.sz * .35, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill()
        })
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [type])
  return <canvas ref={ref} width={200} height={200} style={{ display: 'block' }} />
}

/* ── Interactive 3D DNA Canvas ───────────────────────── */
function DNACanvas() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0, over: false })
  const stateRef = useRef({ speed: 0.008, targetSpeed: 0.008, glowIntensity: 0, hoveredRung: -1 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height, cx = W / 2
    const RUNGS = 22, RADIUS = 72
    let t = 0, raf

    const onMouseMove = e => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) * (W / rect.width),
        y: (e.clientY - rect.top) * (H / rect.height),
        over: true,
      }
    }
    const onMouseLeave = () => { mouseRef.current.over = false }
    const onClick = e => {
      const rect = canvas.getBoundingClientRect()
      const mx = (e.clientX - rect.left) * (W / rect.width)
      const my = (e.clientY - rect.top) * (H / rect.height)
      // Burst speed on click
      stateRef.current.targetSpeed = 0.06
      setTimeout(() => { stateRef.current.targetSpeed = 0.008 }, 600)
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('click', onClick)

    function frame() {
      const st = stateRef.current
      const mo = mouseRef.current

      // Smooth speed
      st.speed += (st.targetSpeed - st.speed) * 0.08
      // Slow down on hover
      if (mo.over) st.speed = Math.max(st.speed * 0.92, 0.002)

      t += st.speed
      ctx.clearRect(0, 0, W, H)

      // Build strand points
      const strandA = [], strandB = []
      for (let i = 0; i < RUNGS; i++) {
        const frac = i / (RUNGS - 1)
        const y = 18 + frac * (H - 36)
        const angle = frac * Math.PI * 4 + t
        strandA.push({ x: cx + Math.cos(angle) * RADIUS, y, z: Math.sin(angle), angle })
        strandB.push({ x: cx + Math.cos(angle + Math.PI) * RADIUS, y, z: Math.sin(angle + Math.PI), angle: angle + Math.PI })
      }

      // Hit test — find closest rung to mouse
      let hoveredRung = -1
      if (mo.over) {
        let minDist = 28
        strandA.forEach((a, i) => {
          const b = strandB[i]
          const mx2 = (a.x + b.x) / 2, my2 = (a.y + b.y) / 2
          const d = Math.hypot(mo.x - mx2, mo.y - my2)
          if (d < minDist) { minDist = d; hoveredRung = i }
        })
      }
      st.hoveredRung = hoveredRung

      // Draw smooth strands
      const drawStrand = (pts) => {
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length - 1; i++) {
          const mx2 = (pts[i].x + pts[i + 1].x) / 2
          const my2 = (pts[i].y + pts[i + 1].y) / 2
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx2, my2)
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y)
        ctx.strokeStyle = 'rgba(160,200,245,0.88)'
        ctx.lineWidth = 4.5
        ctx.lineCap = 'round'
        ctx.shadowColor = 'rgba(80,160,240,0.4)'
        ctx.shadowBlur = 14
        ctx.stroke()
        ctx.shadowBlur = 0
      }
      drawStrand(strandA)
      drawStrand(strandB)

      // Rungs + nodes — depth-sorted
      strandA
        .map((a, i) => ({ a, b: strandB[i], i }))
        .sort((r1, r2) => (r1.a.z + r1.b.z) - (r2.a.z + r2.b.z))
        .forEach(({ a, b, i }) => {
          const depth = ((a.z + b.z) / 2 + 2) / 4           // 0..1
          const alpha = 0.28 + depth * 0.6
          const isHov = i === hoveredRung
          const rungScale = isHov ? 1.35 : 1

          // Rung highlight glow
          if (isHov) {
            const mx2 = (a.x + b.x) / 2, my2 = (a.y + b.y) / 2
            const hg = ctx.createRadialGradient(mx2, my2, 0, mx2, my2, 44)
            hg.addColorStop(0, 'rgba(58,143,212,0.28)')
            hg.addColorStop(1, 'transparent')
            ctx.fillStyle = hg
            ctx.beginPath(); ctx.arc(mx2, my2, 44, 0, Math.PI * 2); ctx.fill()
          }

          // Rung line
          ctx.beginPath()
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = isHov
            ? `rgba(58,143,212,${alpha * 0.9})`
            : `rgba(180,215,248,${alpha * 0.65})`
          ctx.lineWidth = (1.5 + depth) * rungScale
          ctx.stroke()

            // Nodes
            ;[a, b].forEach(pt => {
              const r = (5 + depth * 4.5) * rungScale
              const ng = ctx.createRadialGradient(pt.x - r * .3, pt.y - r * .3, 0, pt.x, pt.y, r)
              if (isHov) {
                ng.addColorStop(0, `rgba(255,255,255,${alpha})`)
                ng.addColorStop(0.4, `rgba(140,200,255,${alpha * .95})`)
                ng.addColorStop(1, `rgba(58,143,212,${alpha * .75})`)
              } else {
                ng.addColorStop(0, `rgba(240,250,255,${alpha})`)
                ng.addColorStop(0.4, `rgba(190,225,252,${alpha * .9})`)
                ng.addColorStop(1, `rgba(110,175,235,${alpha * .6})`)
              }
              ctx.shadowColor = isHov ? 'rgba(58,143,212,0.7)' : 'rgba(100,180,255,0.3)'
              ctx.shadowBlur = isHov ? 18 + depth * 14 : 8 + depth * 10
              ctx.beginPath(); ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2)
              ctx.fillStyle = ng; ctx.fill()
              ctx.shadowBlur = 0

              // Specular highlight
              ctx.beginPath()
              ctx.arc(pt.x - r * .28, pt.y - r * .28, r * .35, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(255,255,255,${0.45 + depth * .45})`
              ctx.fill()
            })
        })

      // Tooltip label on hovered rung
      if (hoveredRung >= 0) {
        const a = strandA[hoveredRung], b = strandB[hoveredRung]
        const mx2 = (a.x + b.x) / 2 + RADIUS + 10
        const my2 = (a.y + b.y) / 2
        const labels = ['A–T', 'G–C', 'T–A', 'C–G']
        const label = labels[hoveredRung % 4]
        ctx.font = 'bold 11px "Rajdhani", sans-serif'
        ctx.fillStyle = 'rgba(26,58,92,0.85)'
        ctx.fillText(label, mx2, my2 + 4)
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('click', onClick)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={560}
      className={s.dnaCanvas}
      title="Hover over base pairs · Click to spin"
    />
  )
}

import { 
  Zap, Users, Rocket, BarChart, CheckCircle, Globe, 
  ArrowRight, Layers, Microscope, Sparkles, GraduationCap 
} from 'lucide-react'

export default function HomePage() {
  const heroRef = useRef(null)
  const bubbleRefs = useRef([])
  const mousePos = useRef({ x: -9999, y: -9999 })
  const vels = useRef(BUBBLE_CFG.map(() => ({ vx: 0, vy: 0, dx: 0, dy: 0 })))
  const navigate = useNavigate()

  const scrollToServices = (e) => {
    e.preventDefault()
    const el = document.getElementById('services-main')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

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
    const hero = heroRef.current
    if (!hero) return
    const onMove = e => { mousePos.current = { x: e.clientX, y: e.clientY } }
    const onLeave = () => { mousePos.current = { x: -9999, y: -9999 } }
    hero.addEventListener('mousemove', onMove)
    hero.addEventListener('mouseleave', onLeave)
    let raf
    const tick = () => {
      bubbleRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const bx = r.left + r.width / 2
        const by = r.top + r.height / 2
        const v = vels.current[i]
        const ddx = bx - mousePos.current.x
        const ddy = by - mousePos.current.y
        const dist = Math.sqrt(ddx * ddx + ddy * ddy)
        const REPEL = 110
        if (dist < REPEL && dist > 0) {
          const f = ((REPEL - dist) / REPEL) * 7
          v.vx += (ddx / dist) * f
          v.vy += (ddy / dist) * f
        }
        v.vx += -v.dx * 0.06; v.vy += -v.dy * 0.06
        v.vx *= 0.80; v.vy *= 0.80
        v.dx += v.vx; v.dy += v.vy
        el.style.transform = `translate(${v.dx}px,${v.dy}px)`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className={s.page}>

      {/* ── HERO ──────────────────────────────────────── */}
      <section className={s.hero} aria-label="Hero" ref={heroRef}>
        {BUBBLE_CFG.map((cfg, i) => (
          <span
            key={i}
            ref={el => { bubbleRefs.current[i] = el }}
            className={s.heroBubble}
            style={{ left: cfg.left + '%', width: cfg.size + 'px', height: cfg.size + 'px', animationDuration: cfg.dur + 's', animationDelay: cfg.delay + 's' }}
          />
        ))}

        <div className={s.heroInner}>
          {/* Left */}
          <div className={s.heroLeft}>
            <div className={s.pill}>
              <span className={s.pillDot} aria-hidden />
              Pioneering Genomic Intelligence
            </div>

            <h1 className={s.heroH1}>
              Transforming Life Sciences with <span>AI</span>
            </h1>

            <p className={s.heroP}>
              Accelerating drug discovery and precision genomics through
              computational power. We analyse complex biological data with
              unprecedented accuracy and speed.
            </p>

            <div className={s.heroCtas}>
              <a href="#services-main" onClick={scrollToServices} className={s.btnBlue} id="hero-explore-btn">
                Explore Services {Ico.arrow}
              </a>
              <Link to="/contact" className={s.btnGhost} id="hero-contact-btn">
                Contact Us
              </Link>
            </div>

            <div className={s.heroTrust}>
              <div className={s.trustAvatars}>
                {['AI', 'NG', 'PR', 'DR'].map(l => (
                  <div key={l} className={s.trustAvatar}>{l}</div>
                ))}
              </div>
              <p className={s.trustText}>
                <strong>50+ projects</strong> delivered for leading research institutions
              </p>
            </div>
          </div>

          {/* Right — Interactive 3D DNA Canvas */}
          <div className={s.heroRight} aria-hidden="true">
            <div className={s.dnaWrap}>
              <DNACanvas />
              <div className={s.dnaGlow} />
            </div>
          </div>
        </div>
      </section>



      {/* ── STATS STRIP ───────────────────────────────── */}
      <div className={s.statsStrip} aria-label="Statistics">
        <div className={s.statsInner}>
          {[
            { num: '10,000+', label: 'Visitors', accent: false },
            { num: '50+', label: 'Projects', accent: false },
            { num: '99.9%', label: 'Accuracy Rate', accent: true },
            { num: '3', label: 'Core Services', accent: false },
          ].map(({ num, label, accent }) => (
            <div key={label} className={s.statItem}>
              <div className={`${s.statNum} ${accent ? s.statNumAccent : ''}`}>{num}</div>
              <div className={s.statLabel}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ─────────────────────────────────────── */}
      <section id="about-section" className={s.sectionBlue} aria-labelledby="about-h">
        <div className={s.inner}>
          <div className={s.aboutGrid}>
            <div>
              <div className={s.sectionLabel}>About Us</div>
              <h2 id="about-h" className={s.sectionH2}>
                Intelligence Applied to Biology
              </h2>
              <p className={s.sectionP}>
                AI Infowave bridges the gap between massive biological datasets and
                actionable medical insights. Our machine learning models are trained
                specifically on genomic and proteomic structures, enabling researchers
                to identify targets faster and with higher confidence.
              </p>
              <ul className={s.checkList} role="list">
                {[
                  'Advanced machine learning for predictive modelling',
                  'Scalable infrastructure for multi-omics data pipelines',
                  'Rigorous validation protocols for clinical relevance',
                  'End-to-end delivery from raw data to clinical insight',
                ].map(item => (
                  <li key={item} className={s.checkItem}>
                    <span className={s.checkDot} aria-hidden>{Ico.check}</span>
                    {item}
                  </li>
                ))}
              </ul>

            </div>

            <div className={s.aboutPanel}>
              <div className={s.aboutBigCard}>
                <div className={s.aboutBigNum}>10,000+</div>
                <div className={s.aboutBigLabel}>Genomic samples processed to date</div>
              </div>
              <div className={s.aboutSmallCards}>
                {[
                  { num: '50+', label: 'Research projects' },
                  { num: '99.9%', label: 'Analysis accuracy' },
                  { num: '3', label: 'Core service areas' },
                  { num: '1M+', label: 'Genomic data points' },
                ].map(({ num, label }) => (
                  <div key={label} className={s.aboutSmCard}>
                    <div className={s.aboutSmNum}>{num}</div>
                    <div className={s.aboutSmLabel}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={s.sectionSeparator} />

      {/* ── SERVICES ──────────────────────────────────── */}
      <section className={s.svcSection} id="services-main" aria-labelledby="services-h">
        <div className={s.inner}>
          <div className={`${s.sectionHeaderCenter} ${s.svcDarkHeader}`}>
            <div className={s.sectionLabel}>Our Services</div>
            <h2 id="services-h" className={s.sectionH2}>Advanced Analytical Capabilities</h2>
            <p className={s.sectionP}>
              We process massive multi-omics datasets to uncover patterns invisible to traditional methods.
            </p>
          </div>
          <div className={s.svcCardGrid}>
            {SERVICES.map(svc => (
              <article key={svc.id} className={s.svcGlassCard} style={{ '--svc-accent': svc.dotColor }}>
                <div className={s.svcCanvasWrap}>
                  <SvcCanvas type={svc.id === 'ngs' ? 'ngs' : svc.id === 'proteomics' ? 'proteomics' : 'drug'} />
                </div>
                <div className={s.svcCardBody}>
                  <div className={s.svcCardBadge} style={{ color: svc.badgeColor }}>
                    <span className={s.svcBadgeDot} style={{ background: svc.dotColor }} />
                    {svc.id.replace('-', ' ').toUpperCase()}
                  </div>
                  <h3 className={s.svcCardH3}>{svc.title}</h3>
                  <p className={s.svcCardP}>{svc.desc}</p>
                  <div className={s.svcTags}>
                    {svc.tags.map(t => <span key={t} className={s.svcTag}>{t}</span>)}
                  </div>
                  <a href={`/${svc.id}`} className={s.svcCardLink}>Explore →</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────────── */}
      <section className={s.section} aria-labelledby="why-h">
        <div className={s.inner}>
          <div className={s.sectionHeaderCenter}>
            <div className={s.sectionLabel}>Why Choose Us</div>
            <h2 id="why-h" className={s.sectionH2}>Built for Researchers, by Researchers</h2>
            <p className={s.sectionP}>
              Every tool and pipeline is purpose-built for real-world bioinformatics — not adapted from generic ML frameworks.
            </p>
          </div>
          <div className={s.pillarGrid} role="list">
            {PILLARS.map(p => (
              <div key={p.title} className={s.pillar} role="listitem">
                <div className={s.pillarIcon} style={{ background: p.bg }}>{p.icon}</div>
                <h4 className={s.pillarH4}>{p.title}</h4>
                <p className={s.pillarP}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA BANNER ────────────────────────────────── */}
      <div className={s.ctaBanner} aria-label="Call to action">
        <div className={s.ctaBannerInner}>
          <h2 className={s.ctaBannerH2}>Ready to Accelerate Your Research?</h2>
          <p className={s.ctaBannerP}>
            Join leading research institutions and biotech companies already
            harnessing AI Infowave's computational power to drive discoveries faster.
          </p>
          <div className={s.ctaBtns}>
            <a href="/open-project-call" onClick={handleOpenProjectCallClick} className={s.btnWhite} id="cta-project-btn">
              Open Project Call {Ico.arrow}
            </a>
            <Link to="/contact" className={s.btnWhiteOutline} id="cta-contact-btn">
              Contact Our Team
            </Link>
          </div>
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className={s.footer} role="contentinfo">
        <div className={s.footerGrid}>
          <div className={s.footerBrand}>
            <Link to="/" className={s.footerLogoRow} aria-label="AI Infowave home">
              <img src={logo} alt="AI Infowave Logo" style={{ height: 34, width: 'auto' }} />
              <span className={s.footerLogoText}>AI <span>Infowave</span></span>
            </Link>
            <p className={s.footerDesc}>
              Pioneering Genomic Intelligence. Bridging raw biological data and
              clinical breakthroughs through advanced computational models.
            </p>
            <div className={s.footerSocRow}>
              {[['globe', Ico.globe], ['linkedin', Ico.linkedin], ['twitter', Ico.twitter]].map(([key, icon]) => (
                <a key={key} href="#" className={s.footerSoc} aria-label={key}>{icon}</a>
              ))}
            </div>
          </div>

          {[
            { head: 'Platform', links: [['Home', '/'], ['Services', '/services'], ['NGS Analysis', '/ngs'], ['Proteomics', '/proteomics']] },
            { head: 'Company', links: [['About', '/about'], ['Research', '/research'], ['Careers', '/career'], ['Contact', '/contact']] },
            { head: 'Legal', links: [['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Cookies', '/cookies']] },
          ].map(col => (
            <div key={col.head} className={s.footerCol}>
              <div className={s.footerColHead}>{col.head}</div>
              {col.links.map(([label, path]) => (
                <Link key={label} to={path} className={s.footerLink}>{label}</Link>
              ))}
            </div>
          ))}
        </div>

        <div className={s.footerBottom}>
          <span className={s.footerCopy}>© 2024 AI Infowave. Pioneering Genomic Intelligence.</span>
          <div className={s.footerBottomLinks}>
            <a href="/privacy" className={s.footerBottomLink}>Privacy</a>
            <a href="/terms" className={s.footerBottomLink}>Terms</a>
            <a href="/cookies" className={s.footerBottomLink}>Cookies</a>
          </div>
        </div>
      </footer>

    </div>
  )
}