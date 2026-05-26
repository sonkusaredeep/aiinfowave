import { useEffect, useRef } from 'react'
import s from './AnimatedBackground.module.css'

export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    /* ── Particle network ─────────────────────────────── */
    const NUM_DOTS = 55
    const dots = Array.from({ length: NUM_DOTS }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 2.5 + 1.2,
    }))

    /* ── Bubbles ──────────────────────────────────────── */
    const NUM_BUBBLES = 18
    const mkBubble = () => ({
      x:    Math.random() * canvas.width,
      y:    canvas.height + Math.random() * 200,
      r:    Math.random() * 25 + 8,
      speed:Math.random() * 0.6 + 0.25,
      sway: Math.random() * 0.4 + 0.1,
      phase:Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.25 + 0.05,
    })
    const bubbles = Array.from({ length: NUM_BUBBLES }, mkBubble)

    let tick = 0

    const draw = () => {
      tick++
      const W = canvas.width
      const H = canvas.height

      /* background gradient */
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#e8f4ff')
      grad.addColorStop(1, '#ddeeff')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      /* radial glow mesh */
      const mesh = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.35, W * 0.65)
      mesh.addColorStop(0, 'rgba(180,215,255,0.45)')
      mesh.addColorStop(1, 'rgba(221,238,255,0)')
      ctx.fillStyle = mesh
      ctx.fillRect(0, 0, W, H)

      /* ── dots ──────────────────────────────────────── */
      dots.forEach(d => {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0 || d.x > W) d.vx *= -1
        if (d.y < 0 || d.y > H) d.vy *= -1

        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(100,170,240,0.55)'
        ctx.fill()
      })

      /* ── connection lines ──────────────────────────── */
      const LINK_DIST = 130
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.28
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.strokeStyle = `rgba(100,170,240,${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      /* ── bubbles ───────────────────────────────────── */
      bubbles.forEach((b, idx) => {
        b.y -= b.speed
        b.x += Math.sin(tick * 0.015 + b.phase) * b.sway

        const fadeStart = H * 0.25
        const fadeEnd   = 0
        let opacityMod = b.opacity
        if (b.y < fadeStart) {
          opacityMod *= Math.max(0, (b.y - fadeEnd) / (fadeStart - fadeEnd))
        }

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,230,255,${opacityMod})`
        ctx.fill()
        ctx.strokeStyle = `rgba(150,200,255,${opacityMod * 1.4})`
        ctx.lineWidth = 1
        ctx.stroke()

        if (b.y + b.r < 0) bubbles[idx] = mkBubble()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />
}
