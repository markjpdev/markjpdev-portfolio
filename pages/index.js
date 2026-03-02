import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef, useCallback } from 'react'

// ═══════════════════════════════════════════════════════════════
//  MARK JP — Portfolio v7.0
//  Final Fantasy Cinematic Experience
//  Every frame is intentional. Every sound is earned.
// ═══════════════════════════════════════════════════════════════

const C = {
  black:     '#000008',
  deep:      '#04040F',
  bgNav:     'rgba(4,6,24,0.92)',
  bgPanel:   'rgba(6,8,28,0.88)',
  bgCard:    'rgba(8,10,32,0.85)',
  border:    'rgba(140,120,60,0.35)',
  borderBright:'rgba(200,170,80,0.7)',
  gold:      '#C8A84B',
  goldBright:'#F0D070',
  goldDim:   'rgba(200,168,75,0.5)',
  silver:    '#A8B8D0',
  silverBright:'#D8E8F8',
  blue:      '#4060A0',
  blueBright:'#6090D8',
  blueLight: '#90B8E8',
  white:     '#F0EDE8',
  text:      '#D8D4C8',
  dim:       'rgba(216,212,200,0.55)',
  dimmer:    'rgba(216,212,200,0.3)',
  dimmest:   'rgba(216,212,200,0.14)',
  red:       '#C04040',
  green:     '#50A878',
}

const YEARS_EXP = new Date().getFullYear() - 2014

// ═══════════════════════════════════════════════════════════════
//  ORCHESTRAL SOUND ENGINE
//  Final Fantasy-inspired: mysterious, building, epic
// ═══════════════════════════════════════════════════════════════
class OrchestraEngine {
  constructor() { this.ctx = null; this.mg = null; this.playing = false; this.enabled = true; this._nodes = [] }

  init() {
    if (this.ctx) return
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.mg = this.ctx.createGain()
      this.mg.gain.setValueAtTime(0, this.ctx.currentTime)
      this.mg.connect(this.ctx.destination)
    } catch(e) { this.enabled = false }
  }

  _note(freq, type, dur, vol, delay = 0, detune = 0) {
    if (!this.ctx) return
    const o = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    const f = this.ctx.createBiquadFilter()
    o.type = type; o.frequency.setValueAtTime(freq, this.ctx.currentTime + delay)
    o.detune.setValueAtTime(detune, this.ctx.currentTime + delay)
    f.type = 'lowpass'; f.frequency.setValueAtTime(1800, this.ctx.currentTime)
    g.gain.setValueAtTime(0, this.ctx.currentTime + delay)
    g.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + delay + 0.08)
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + dur)
    o.connect(f); f.connect(g); g.connect(this.mg)
    o.start(this.ctx.currentTime + delay)
    o.stop(this.ctx.currentTime + delay + dur + 0.1)
  }

  // Deep reverberant pad — strings/choir feel
  _pad(freq, vol, dur, delay = 0) {
    if (!this.ctx) return
    const o = this.ctx.createOscillator()
    const o2 = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    const f = this.ctx.createBiquadFilter()
    o.type = 'sine'; o2.type = 'sine'
    o.frequency.setValueAtTime(freq, this.ctx.currentTime + delay)
    o2.frequency.setValueAtTime(freq * 1.005, this.ctx.currentTime + delay) // slight detune for warmth
    f.type = 'lowpass'; f.frequency.setValueAtTime(600, this.ctx.currentTime)
    g.gain.setValueAtTime(0, this.ctx.currentTime + delay)
    g.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + delay + 1.5)
    g.gain.linearRampToValueAtTime(vol * 0.7, this.ctx.currentTime + delay + dur - 1)
    g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + delay + dur)
    o.connect(g); o2.connect(g); g.connect(f); f.connect(this.mg)
    o.start(this.ctx.currentTime + delay); o2.start(this.ctx.currentTime + delay)
    o.stop(this.ctx.currentTime + delay + dur + 0.1); o2.stop(this.ctx.currentTime + delay + dur + 0.1)
    this._nodes.push(o, o2, g, f)
  }

  // The cinematic intro music — mysterious, builds slowly
  playIntro() {
    if (!this.enabled || !this.ctx) return
    this.mg.gain.setValueAtTime(0, this.ctx.currentTime)
    this.mg.gain.linearRampToValueAtTime(0.7, this.ctx.currentTime + 2)

    // Bass drone — deep mystery
    this._pad(55, 0.18, 12, 0)
    this._pad(82.4, 0.1, 10, 0.5)

    // Mysterious rising strings
    const melody = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440]
    melody.forEach((f, i) => this._pad(f, 0.06, 3, 2 + i * 0.35))

    // Harp-like arpeggios
    const harp = [261.63, 329.63, 392, 523.25, 659.25, 783.99]
    harp.forEach((f, i) => this._note(f, 'sine', 0.8, 0.08, 3 + i * 0.18))
    harp.forEach((f, i) => this._note(f, 'sine', 0.8, 0.06, 5 + i * 0.18))

    // Choir-like swell
    ;[130.81, 164.81, 196, 261.63].forEach((f, i) => this._pad(f, 0.07, 6, 4 + i * 0.3))
  }

  // Login screen ambient loop
  playAmbient() {
    if (!this.enabled || !this.ctx || this.playing) return
    this.playing = true

    const loop = () => {
      if (!this.playing) return
      // Soft mystery chord
      ;[110, 138.59, 164.81, 220].forEach((f, i) => this._pad(f, 0.04, 8, i * 0.2))
      // Gentle harp melody
      const mel = [329.63, 392, 440, 392, 349.23, 329.63, 293.66, 261.63]
      mel.forEach((f, i) => this._note(f, 'sine', 1.0, 0.05, i * 0.4))
      this._loopTimer = setTimeout(loop, 7000)
    }
    setTimeout(loop, 500)
  }

  stopAmbient() {
    this.playing = false
    clearTimeout(this._loopTimer)
    if (this.mg && this.ctx) {
      this.mg.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1)
      setTimeout(() => { this.mg && this.mg.gain.setValueAtTime(0.5, this.ctx.currentTime) }, 1200)
    }
  }

  // Main page ambient — softer, deeper, more mysterious than login screen
  playMainAmbient() {
    if (!this.enabled || !this.ctx || this.playing) return
    this.playing = true
    const loop = () => {
      if (!this.playing) return
      // Deep bass drone
      this._pad(55, 0.05, 9, 0); this._pad(82.4, 0.03, 7, 1.5)
      // Slow harp arpeggios
      const harp = [196, 246.94, 293.66, 369.99, 392, 493.88]
      harp.forEach((f, i) => this._note(f, 'sine', 1.4, 0.025, 2 + i * 0.7))
      // Soft mystery pad chord
      ;[110, 138.59, 164.81].forEach((f, i) => this._pad(f, 0.02, 7, 4 + i * 0.5))
      this._loopTimer = setTimeout(loop, 10000)
    }
    setTimeout(loop, 400)
  }

  setVol(v) { if (this.mg && this.ctx) this.mg.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.5) }

  // UI sounds — classic FF menu
  menuMove()    { this._note(880, 'sine', 0.08, 0.12) }
  menuConfirm() { this._note(1047, 'sine', 0.06, 0.14); setTimeout(() => this._note(1319, 'sine', 0.1, 0.12), 60) }
  menuCancel()  { this._note(440, 'sine', 0.12, 0.1, 0); this._note(330, 'sine', 0.15, 0.08, 0.1) }
  transition()  {
    // Dramatic FF-style transition chord
    ;[261.63, 329.63, 392, 523.25].forEach((f, i) => this._note(f, 'sine', 0.6, 0.12, i * 0.05))
    setTimeout(() => { ;[523.25, 659.25, 783.99, 1046.50].forEach((f, i) => this._note(f, 'sine', 0.8, 0.1, i * 0.04)) }, 300)
  }
  sectionEnter() { ;[523, 659, 784].forEach((f, i) => this._note(f, 'sine', 0.4, 0.08, i * 0.07)) }
}

const Orchestra = new OrchestraEngine()

// ═══════════════════════════════════════════════════════════════
//  LIGHT BEAM CANVAS — Like FF's light rays through clouds
// ═══════════════════════════════════════════════════════════════
function LightBeams({ opacity = 1 }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current; if (!cv) return
    const ctx = cv.getContext('2d'); let id
    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    let t = 0

    const beams = Array.from({ length: 6 }, (_, i) => ({
      x: 0.1 + (i / 6) * 0.85,
      width: 0.04 + Math.random() * 0.06,
      speed: 0.0003 + Math.random() * 0.0004,
      phase: Math.random() * Math.PI * 2,
      color: i % 2 === 0 ? [180, 160, 80] : [100, 140, 220],
    }))

    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height)
      t += 0.01

      beams.forEach(b => {
        const alpha = (0.015 + 0.01 * Math.sin(t * b.speed * 100 + b.phase)) * opacity
        const cx = b.x * cv.width + Math.sin(t * b.speed * 100 + b.phase) * 40
        const w = b.width * cv.width

        const g = ctx.createLinearGradient(0, 0, 0, cv.height)
        g.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0)`)
        g.addColorStop(0.2, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},${alpha})`)
        g.addColorStop(0.7, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},${alpha * 0.6})`)
        g.addColorStop(1, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0)`)

        ctx.beginPath()
        ctx.moveTo(cx - w / 2, 0)
        ctx.lineTo(cx + w / 2, 0)
        ctx.lineTo(cx + w * 0.7, cv.height)
        ctx.lineTo(cx - w * 0.7, cv.height)
        ctx.closePath()
        ctx.fillStyle = g
        ctx.fill()
      })

      id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [opacity])
  return <canvas ref={ref} aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}

// ═══════════════════════════════════════════════════════════════
//  PARTICLE FIELD — Crystal dust, embers, magic motes
// ═══════════════════════════════════════════════════════════════
function CrystalDust({ count = 80 }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current; if (!cv) return
    const ctx = cv.getContext('2d'); let id
    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)

    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.3,
      a: Math.random() * 0.7 + 0.1,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.2 + 0.03),
      p: Math.random() * Math.PI * 2,
      ps: Math.random() * 0.012 + 0.004,
      type: Math.floor(Math.random() * 3), // 0=gold, 1=blue, 2=silver
    }))

    const COLORS = [
      [200, 168, 75],   // gold
      [96, 144, 216],   // blue
      [168, 184, 208],  // silver
    ]

    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height)
      pts.forEach(p => {
        p.p += p.ps
        const al = p.a * (0.3 + 0.7 * Math.sin(p.p))
        p.x += p.vx; p.y += p.vy
        if (p.y < -10) { p.y = cv.height + 10; p.x = Math.random() * cv.width }
        if (p.x < -10) p.x = cv.width + 10
        if (p.x > cv.width + 10) p.x = -10

        const [r, g, b] = COLORS[p.type]
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        grad.addColorStop(0, `rgba(${r},${g},${b},${al.toFixed(2)})`)
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx.fillStyle = grad; ctx.fill()

        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, al * 2).toFixed(2)})`; ctx.fill()
      })
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [count])
  return <canvas ref={ref} aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }} />
}

// ═══════════════════════════════════════════════════════════════
//  FF CURSOR — Classic Final Fantasy menu arrow
//  White arrow pointing upper-left, gold glow on hover, blinks on interactive
// ═══════════════════════════════════════════════════════════════
function FFCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 })
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const mv = e => {
      setPos({ x: e.clientX, y: e.clientY })
      setHovering(!!document.elementFromPoint(e.clientX, e.clientY)?.closest('button,a,.click'))
    }
    const dn = () => { setClicking(true); setFlash(true); Orchestra.menuConfirm(); setTimeout(() => setFlash(false), 180) }
    const up = () => setClicking(false)
    window.addEventListener('mousemove', mv)
    window.addEventListener('mousedown', dn)
    window.addEventListener('mouseup', up)
    return () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mousedown', dn); window.removeEventListener('mouseup', up) }
  }, [])

  // Classic cursor arrow path pointing upper-left
  // Tip at (2,2), forms the familiar mouse-cursor arrow shape
  const fill  = flash ? '#FFFFFF' : hovering ? C.goldBright : '#E8E4DC'
  const glow  = hovering ? C.gold : 'rgba(232,228,220,0.4)'
  const scale = clicking ? 0.82 : 1

  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
      <svg
        width={22} height={26} viewBox="0 0 22 26"
        style={{
          position: 'fixed', left: pos.x, top: pos.y,
          transform: `scale(${scale})`, transformOrigin: '2px 2px',
          transition: 'transform 0.08s',
          filter: `drop-shadow(0 0 3px ${glow}) drop-shadow(0 0 7px ${hovering ? C.gold + '88' : 'transparent'})`,
          animation: hovering && !clicking ? 'cursorBlink 0.9s ease-in-out infinite' : 'none',
        }}
      >
        {/* Classic arrow cursor shape */}
        <path
          d="M 2,2 L 2,20 L 6,15 L 9,22 L 12,21 L 9,14 L 15,14 Z"
          fill={fill}
          stroke="rgba(4,4,15,0.7)"
          strokeWidth="1"
          strokeLinejoin="round"
          style={{ transition: 'fill 0.15s' }}
        />
        {/* Notch highlight — gives the FF pixel-art feel */}
        <path
          d="M 3,3 L 3,16 L 6,12"
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
//  PHASE 1 — CINEMATIC INTRO
//  Pure darkness. Music begins. World slowly emerges.
//  Like the opening of Final Fantasy — before the title appears.
// ═══════════════════════════════════════════════════════════════
function CinematicIntro({ onDone }) {
  const [step, setStep] = useState(0)
  const [showSkip, setShowSkip] = useState(false)
  const timersRef = useRef([])
  // 0: black  1: light begins  2: dust appears  3: title  4: subtitle  5: complete

  useEffect(() => {
    Orchestra.init()
    const timings = [
      [600,  () => { setStep(1); Orchestra.playIntro() }],
      [1800, () => setStep(2)],
      [3200, () => setStep(3)],
      [4400, () => setStep(4)],
      [6000, () => setStep(5)],
      [7200, () => onDone()],
    ]
    timersRef.current = timings.map(([t, fn]) => setTimeout(fn, t))
    timersRef.current.push(setTimeout(() => setShowSkip(true), 1500))
    return () => timersRef.current.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const skip = e => { if (e.key === 'Escape') { timersRef.current.forEach(clearTimeout); onDone() } }
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [onDone])

  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: C.black, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

      {step >= 1 && <LightBeams opacity={step >= 2 ? 1 : 0.3} />}
      {step >= 2 && <CrystalDust count={60} />}

      {/* Vignette */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,8,0.8) 100%)', pointerEvents: 'none', zIndex: 2 }} />

      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.5em', filter: 'blur(12px)' }}
              animate={{ opacity: 1, letterSpacing: '0.15em', filter: 'blur(0px)' }}
              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: "'Cinzel', 'Press Start 2P', serif", fontSize: 'clamp(48px, 10vw, 96px)', color: C.goldBright, textShadow: `0 0 30px ${C.gold}88, 0 0 80px ${C.gold}33`, marginBottom: 12 }}
            >
              MJP
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(11px, 1.8vw, 16px)', color: C.silver, letterSpacing: '0.4em', textTransform: 'uppercase' }}
            >
              Just a Tech Guy.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showSkip && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="click"
          onClick={() => { timersRef.current.forEach(clearTimeout); onDone() }}
          onMouseOver={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.goldBright }}
          onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.silver }}
          style={{ position: 'absolute', bottom: 28, right: 32, fontFamily: 'VT323, monospace', fontSize: 16, color: C.silver, letterSpacing: '0.2em', zIndex: 10, border: `1px solid ${C.border}`, padding: '6px 16px', borderRadius: 2, animation: 'ffBlink 1.6s ease-in-out infinite', background: 'rgba(0,0,8,0.55)', backdropFilter: 'blur(8px)', transition: 'border-color .2s, color .2s' }}>
          ESC · SKIP
        </motion.div>
      )}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
//  PHASE 2 — TITLE SCREEN (FF Login Screen)
//  Elegant. The world is revealed. You choose to enter.
// ═══════════════════════════════════════════════════════════════
function TitleScreen({ onStart }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Orchestra.playAmbient()
    const t = setTimeout(() => setReady(true), 800)
    return () => clearTimeout(t)
  }, [])

  const enter = useCallback(() => {
    Orchestra.stopAmbient()
    Orchestra.transition()
    onStart()
  }, [onStart])

  useEffect(() => {
    if (!ready) return
    const h = () => enter()
    window.addEventListener('keydown', h, { once: true })
    return () => window.removeEventListener('keydown', h)
  }, [ready, enter])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      onClick={ready ? enter : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: 900, background: C.black, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'none', overflow: 'hidden' }}
    >
      <LightBeams opacity={0.8} />
      <CrystalDust count={90} />

      {/* Deep radial darkness */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 90% 75% at 50% 60%, transparent 20%, rgba(0,0,8,0.75) 100%)', pointerEvents: 'none', zIndex: 2 }} />
      {/* Bottom darkness */}
      <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, rgba(0,0,8,0.9), transparent)', pointerEvents: 'none', zIndex: 2 }} />

      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', width: '100%', padding: '0 24px' }}>

        {/* Top ornamental lines */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ flex: 1, maxWidth: 200, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}77)` }} />
          <div style={{ width: 6, height: 6, background: C.gold, transform: 'rotate(45deg)', boxShadow: `0 0 8px ${C.gold}` }} />
          <div style={{ flex: 1, maxWidth: 200, height: 1, background: `linear-gradient(90deg, ${C.gold}77, transparent)` }} />
        </motion.div>

        {/* Main Title */}
        <motion.div initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          <div style={{ fontFamily: "'Cinzel', 'Press Start 2P', serif", fontSize: 'clamp(52px, 11vw, 100px)', color: C.goldBright, textShadow: `0 0 25px ${C.gold}99, 0 0 70px ${C.gold}44`, letterSpacing: '0.15em', lineHeight: 1 }}>
            MJP
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.6vw, 14px)', color: C.silver, letterSpacing: '0.5em', marginTop: 10, marginBottom: 48, textTransform: 'uppercase' }}>
            Portfolio · Version VII
          </div>
        </motion.div>

        {/* Bottom ornamental line */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginBottom: 52 }}>
          <div style={{ flex: 1, maxWidth: 200, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}77)` }} />
          <div style={{ display: 'flex', gap: 8 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, background: C.goldDim, transform: 'rotate(45deg)' }} />)}
          </div>
          <div style={{ flex: 1, maxWidth: 200, height: 1, background: `linear-gradient(90deg, ${C.gold}77, transparent)` }} />
        </motion.div>

        {/* Press Start */}
        <AnimatePresence>
          {ready && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(10px, 1.8vw, 14px)', color: C.goldBright, letterSpacing: '0.4em', animation: 'ffBlink 1.6s ease-in-out infinite', textTransform: 'uppercase' }}>
                Press Any Button
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Copyright */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.5 }}
          style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Cinzel', serif", fontSize: 11, color: C.dimmer, letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>
          © {new Date().getFullYear()} Mark JP · All Rights Reserved
        </motion.div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
//  DRAMATIC TRANSITION — Full screen flash + fade
//  That short "wow" moment between title and main
// ═══════════════════════════════════════════════════════════════
function Transition({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div style={{ position: 'fixed', inset: 0, zIndex: 950, pointerEvents: 'none' }}>
      {/* White flash */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.6, times: [0, 0.3, 1] }}
        style={{ position: 'absolute', inset: 0, background: 'white' }}
      />
      {/* Iris wipe — circle expands from center */}
      <motion.div
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{ position: 'absolute', inset: 0, background: C.black }}
      />
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
//  FF-STYLE MENU WINDOW
//  Classic Final Fantasy menu — slides in, options with ▶ cursor
// ═══════════════════════════════════════════════════════════════
const MENU_ITEMS = [
  { id: 'profile', label: 'Profile',    icon: '✦', desc: 'Character · Story · Stats' },
  { id: 'skills',  label: 'Abilities',  icon: '⚡', desc: 'Skills · Tier · Inventory' },
  { id: 'quests',  label: 'Quest Log',  icon: '📜', desc: 'Projects · Completed · Sealed' },
  { id: 'contact', label: 'Message',    icon: '✉',  desc: 'Send · Connect · Collaborate' },
]

function FFMenu({ onSelect, onClose, onHover }) {
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    const handler = e => {
      if (e.key === 'ArrowDown')  { setCursor(c => { const n = (c+1)%MENU_ITEMS.length; Orchestra.menuMove(); onHover?.(MENU_ITEMS[n].id); return n }) }
      if (e.key === 'ArrowUp')    { setCursor(c => { const n = (c-1+MENU_ITEMS.length)%MENU_ITEMS.length; Orchestra.menuMove(); onHover?.(MENU_ITEMS[n].id); return n }) }
      if (e.key === 'Enter')      { Orchestra.menuConfirm(); onSelect(MENU_ITEMS[cursor].id) }
      if (e.key === 'Escape')     { Orchestra.menuCancel(); onClose() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [cursor, onSelect, onClose, onHover])

  return (
    <motion.div
      initial={{ opacity: 0, x: -40, scaleX: 0.85 }}
      animate={{ opacity: 1, x: 0, scaleX: 1 }}
      exit={{ opacity: 0, x: -30, scaleX: 0.9 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', left: 40, top: '50%', transform: 'translateY(-50%)',
        width: 260, zIndex: 200,
        background: C.bgNav,
        border: `1px solid ${C.border}`,
        backdropFilter: 'blur(20px)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Top border glow */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}88, transparent)` }} />

      <div style={{ padding: '8px 0' }}>
        {MENU_ITEMS.map((item, i) => (
          <div key={item.id}
            className="click"
            onMouseEnter={() => { setCursor(i); Orchestra.menuMove(); onHover?.(item.id) }}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => { Orchestra.menuConfirm(); onSelect(item.id) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 20px', cursor: 'none',
              background: cursor === i ? 'rgba(200,168,75,0.08)' : 'transparent',
              transition: 'background 0.15s',
              position: 'relative',
            }}
          >
            {/* FF cursor arrow */}
            <motion.div
              animate={{ opacity: cursor === i ? 1 : 0, x: cursor === i ? 0 : -4 }}
              transition={{ duration: 0.12 }}
              style={{ position: 'absolute', left: 8, color: C.goldBright, fontFamily: 'serif', fontSize: 10 }}
            >▶</motion.div>

            <span style={{ fontSize: 14, marginLeft: 8 }}>{item.icon}</span>
            <div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: cursor === i ? C.goldBright : C.text, letterSpacing: '0.05em', transition: 'color 0.15s', textShadow: cursor === i ? `0 0 8px ${C.gold}66` : 'none' }}>{item.label}</div>
              <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.dimmer, letterSpacing: '0.05em' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom border */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}55, transparent)` }} />
      <div style={{ padding: '8px 20px', display: 'flex', gap: 20 }}>
        <span style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.dimmer }}>↑↓ NAVIGATE</span>
        <span style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.dimmer }}>ENTER SELECT</span>
        <span style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.dimmer }}>ESC CLOSE</span>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
//  STAINED GLASS — Gothic window, 4 section panels
//  Lives on the right of MainPage; mini badge in section headers
// ═══════════════════════════════════════════════════════════════
const GLASS_CFG = {
  profile: { col: '#C8A84B', glow: '#F0D070', cx: 83,  cy: 130 },
  skills:  { col: '#4060A0', glow: '#6090D8', cx: 197, cy: 130 },
  quests:  { col: '#50A878', glow: '#70D898', cx: 83,  cy: 285 },
  contact: { col: '#7060C0', glow: '#A090F0', cx: 197, cy: 285 },
}

function StainedGlassWindow({ hoveredSection }) {
  const lead = 'rgba(4,4,15,0.92)'
  const lw   = 7
  const hov  = hoveredSection

  // Panel fills (top panels are arch-clipped via clipPath; bottom panels are rects)
  const panelFill = (id, base) => hov === id ? `${base}55` : `${base}22`

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 300, margin: '0 auto' }}>
      <svg viewBox="0 0 280 380" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          {/* Arch clip: left half */}
          <clipPath id="sgClipTL">
            <path d="M 26,202 C 26,102 140,26 140,26 L 140,202 Z" />
          </clipPath>
          {/* Arch clip: right half */}
          <clipPath id="sgClipTR">
            <path d="M 140,26 C 140,26 254,102 254,202 L 140,202 Z" />
          </clipPath>
        </defs>

        {/* ── BACKGROUND ── */}
        <path d="M 26,370 L 26,202 C 26,102 140,26 140,26 C 140,26 254,102 254,202 L 254,370 Z"
          fill="rgba(4,4,15,0.82)" />

        {/* ── PANEL FILLS ── */}
        {/* Profile – top-left gold */}
        <g clipPath="url(#sgClipTL)">
          <path d="M 26,202 C 26,102 140,26 140,26 L 140,202 Z"
            fill={panelFill('profile', '#C8A84B')}
            style={{ transition: 'fill 0.45s' }} />
        </g>
        {/* Skills – top-right blue */}
        <g clipPath="url(#sgClipTR)">
          <path d="M 140,26 C 140,26 254,102 254,202 L 140,202 Z"
            fill={panelFill('skills', '#4060A0')}
            style={{ transition: 'fill 0.45s' }} />
        </g>
        {/* Quests – bottom-left green */}
        <rect x={30} y={205} width={107} height={162}
          fill={panelFill('quests', '#50A878')}
          style={{ transition: 'fill 0.45s' }} />
        {/* Contact – bottom-right purple */}
        <rect x={143} y={205} width={107} height={162}
          fill={panelFill('contact', '#7060C0')}
          style={{ transition: 'fill 0.45s' }} />

        {/* ── PANEL GLOW (hovered) ── */}
        {hov && GLASS_CFG[hov] && (
          <circle cx={GLASS_CFG[hov].cx} cy={GLASS_CFG[hov].cy} r={55}
            fill={`${GLASS_CFG[hov].glow}14`}
            style={{ filter: `blur(8px)`, transition: 'all 0.4s' }} />
        )}

        {/* ── ICONS ── */}
        {/* Profile: warrior silhouette */}
        <g transform="translate(83,130)" opacity={hov === 'profile' ? 1 : hov ? 0.5 : 0.75}
          style={{ transition: 'opacity 0.35s' }}>
          <circle r="16" fill="none" stroke="#C8A84B" strokeWidth="1.5" strokeOpacity="0.7" />
          <ellipse cx="0" cy="-22" rx="7" ry="5.5" fill="#C8A84B" opacity="0.85" />
          <line x1="0" y1="-16" x2="0" y2="-4" stroke="#C8A84B" strokeWidth="6" strokeOpacity="0.5" strokeLinecap="round" />
          <path d="M -9,0 Q 0,18 9,0" fill="#C8A84B" opacity="0.55" />
          <line x1="-13" y1="-6" x2="13" y2="-6" stroke="#C8A84B" strokeWidth="1.5" strokeOpacity="0.8" />
        </g>

        {/* Abilities: arcane rune star */}
        <g transform="translate(197,130)" opacity={hov === 'skills' ? 1 : hov ? 0.5 : 0.75}
          style={{ transition: 'opacity 0.35s' }}>
          <circle r="18" fill="none" stroke="#6090D8" strokeWidth="1" strokeOpacity="0.5" />
          <circle r="9"  fill="none" stroke="#6090D8" strokeWidth="1.5" strokeOpacity="0.9" />
          {[0,45,90,135,180,225,270,315].map(a => (
            <line key={a}
              x1={Math.cos(a*Math.PI/180)*9} y1={Math.sin(a*Math.PI/180)*9}
              x2={Math.cos(a*Math.PI/180)*17} y2={Math.sin(a*Math.PI/180)*17}
              stroke="#6090D8" strokeWidth="1" strokeOpacity="0.8" />
          ))}
          <circle r="3" fill="#6090D8" opacity="0.95" />
        </g>

        {/* Quests: compass rose */}
        <g transform="translate(83,285)" opacity={hov === 'quests' ? 1 : hov ? 0.5 : 0.75}
          style={{ transition: 'opacity 0.35s' }}>
          <circle r="16" fill="none" stroke="#50A878" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="-16" y1="0" x2="16" y2="0" stroke="#50A878" strokeWidth="1.5" strokeOpacity="0.9" />
          <line x1="0" y1="-16" x2="0" y2="16" stroke="#50A878" strokeWidth="1.5" strokeOpacity="0.9" />
          <polygon points="0,-13 3,-5 -3,-5" fill="#50A878" opacity="0.95" />
          <circle r="4" fill="none" stroke="#50A878" strokeWidth="1.5" strokeOpacity="0.8" />
          <circle r="1.5" fill="#50A878" opacity="0.9" />
          <text textAnchor="middle" y={-19} fontSize="7" fill="#50A878" opacity="0.9"
            style={{ fontFamily: "'Cinzel', serif" }}>N</text>
        </g>

        {/* Contact: transmission rune */}
        <g transform="translate(197,285)" opacity={hov === 'contact' ? 1 : hov ? 0.5 : 0.75}
          style={{ transition: 'opacity 0.35s' }}>
          <circle r="16" fill="none" stroke="#9080D8" strokeWidth="1.5" strokeOpacity="0.7" />
          <circle r="9"  fill="none" stroke="#9080D8" strokeWidth="1"   strokeOpacity="0.8" />
          <circle r="3"  fill="#9080D8" opacity="0.95" />
          {[30,90,150,210,270,330].map(a => (
            <line key={a}
              x1={Math.cos(a*Math.PI/180)*9}  y1={Math.sin(a*Math.PI/180)*9}
              x2={Math.cos(a*Math.PI/180)*15} y2={Math.sin(a*Math.PI/180)*15}
              stroke="#9080D8" strokeWidth="1.5" strokeOpacity="0.7" />
          ))}
        </g>

        {/* ── LEAD LINES (drawn last so they sit on top) ── */}
        <path d="M 26,370 L 26,202 C 26,102 140,26 140,26 C 140,26 254,102 254,202 L 254,370 Z"
          fill="none" stroke={lead} strokeWidth={lw} strokeLinejoin="round" />
        <line x1="140" y1="26"  x2="140" y2="370" stroke={lead} strokeWidth={lw} />
        <line x1="26"  y1="202" x2="254" y2="202" stroke={lead} strokeWidth={lw} />
        {/* Gold frame overlay */}
        <path d="M 26,370 L 26,202 C 26,102 140,26 140,26 C 140,26 254,102 254,202 L 254,370 Z"
          fill="none" stroke="rgba(200,168,75,0.55)" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="140" y1="26"  x2="140" y2="370" stroke="rgba(200,168,75,0.3)" strokeWidth="1" />
        <line x1="26"  y1="202" x2="254" y2="202" stroke="rgba(200,168,75,0.3)" strokeWidth="1" />

        {/* Inner decorative panel borders */}
        <g clipPath="url(#sgClipTL)">
          <path d="M 30,198 C 30,108 137,30 137,30 L 137,198 Z"
            fill="none" stroke="rgba(200,168,75,0.18)" strokeWidth="1" />
        </g>
        <g clipPath="url(#sgClipTR)">
          <path d="M 143,30 C 143,30 250,108 250,198 L 143,198 Z"
            fill="none" stroke="rgba(96,144,216,0.18)" strokeWidth="1" />
        </g>
        <rect x={33} y={208} width={101} height={156} fill="none" stroke="rgba(80,168,120,0.18)" strokeWidth="1" />
        <rect x={146} y={208} width={101} height={156} fill="none" stroke="rgba(144,128,216,0.18)" strokeWidth="1" />

        {/* Section labels */}
        {[
          { id: 'profile', x: 83,  y: 196, col: '#C8A84B', label: 'PROFILE'   },
          { id: 'skills',  x: 197, y: 196, col: '#6090D8', label: 'ABILITIES' },
          { id: 'quests',  x: 83,  y: 362, col: '#50A878', label: 'QUESTS'    },
          { id: 'contact', x: 197, y: 362, col: '#9080D8', label: 'MESSAGE'   },
        ].map(p => (
          <text key={p.id} x={p.x} y={p.y} textAnchor="middle" fontSize="7"
            fill={p.col} opacity={hov === p.id ? 1 : hov ? 0.4 : 0.65}
            style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.12em', transition: 'opacity 0.35s' }}>
            {p.label}
          </text>
        ))}
      </svg>
      {/* Glass surface sheen */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 38% 28%, rgba(255,255,255,0.05), transparent 55%)', pointerEvents: 'none' }} />
    </div>
  )
}

// Mini stained glass badge shown in section header
function StainedGlassBadge({ sectionId }) {
  const cfg = GLASS_CFG[sectionId] || GLASS_CFG.profile
  const icons = {
    profile: <g>
      <ellipse cx="0" cy="-7" rx="4" ry="3" fill={cfg.col} opacity="0.9" />
      <path d="M -4,0 Q 0,6 4,0" fill={cfg.col} opacity="0.7" />
      <line x1="-5" y1="-1" x2="5" y2="-1" stroke={cfg.col} strokeWidth="1" opacity="0.8" />
    </g>,
    skills: <g>
      <circle r="5" fill="none" stroke={cfg.col} strokeWidth="1.5" />
      {[0,60,120,180,240,300].map(a => (
        <line key={a} x1={Math.cos(a*Math.PI/180)*5} y1={Math.sin(a*Math.PI/180)*5}
          x2={Math.cos(a*Math.PI/180)*9} y2={Math.sin(a*Math.PI/180)*9}
          stroke={cfg.col} strokeWidth="1" opacity="0.9" />
      ))}
      <circle r="2" fill={cfg.col} />
    </g>,
    quests: <g>
      <circle r="8" fill="none" stroke={cfg.col} strokeWidth="1.5" />
      <line x1="-8" y1="0" x2="8" y2="0" stroke={cfg.col} strokeWidth="1" />
      <line x1="0" y1="-8" x2="0" y2="8" stroke={cfg.col} strokeWidth="1" />
      <polygon points="0,-6 1.5,-2 -1.5,-2" fill={cfg.col} />
    </g>,
    contact: <g>
      <circle r="8" fill="none" stroke={cfg.col} strokeWidth="1.5" />
      <circle r="4" fill="none" stroke={cfg.col} strokeWidth="1" />
      <circle r="1.5" fill={cfg.col} />
    </g>,
  }
  return (
    <svg width={28} height={28} viewBox="-14 -14 28 28"
      style={{ filter: `drop-shadow(0 0 4px ${cfg.glow}66)`, flexShrink: 0 }}>
      <rect x={-12} y={-12} width={24} height={24} rx="1"
        fill={`${cfg.col}12`} stroke={`${cfg.col}44`} strokeWidth="1" />
      {icons[sectionId] || icons.profile}
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
//  MAIN LANDING PAGE
//  Full screen · Left-aligned · Animation heavy · No top nav
// ═══════════════════════════════════════════════════════════════
function MainPage({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredSection, setHoveredSection] = useState(null)
  const typed = useTypewriter(['Backend Engineer (leveling up)', 'Clinical Systems Specialist', 'Application Support Engineer', 'Business Analyst', 'Problem Solver'])

  useEffect(() => {
    Orchestra.playMainAmbient()
    return () => Orchestra.stopAmbient()
  }, [])

  const openMenu  = () => { setMenuOpen(true); Orchestra.menuMove() }
  const closeMenu = () => { setMenuOpen(false); Orchestra.menuCancel(); setHoveredSection(null) }
  const handleSelect = (id) => { setMenuOpen(false); Orchestra.transition(); onNavigate(id) }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      style={{ position: 'fixed', inset: 0, background: C.black, overflow: 'hidden' }}
    >
      <LightBeams opacity={0.7} />
      <CrystalDust count={70} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,8,0.7) 100%)', pointerEvents: 'none', zIndex: 2 }} />

      {/* LEFT SIDE — Character info */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 'clamp(320px, 45%, 560px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(32px, 6vw, 80px)',
        zIndex: 10,
        background: 'linear-gradient(90deg, rgba(0,0,8,0.7) 0%, rgba(0,0,8,0.4) 70%, transparent 100%)',
      }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, boxShadow: `0 0 6px ${C.green}`, animation: 'pulse 2s infinite' }} />
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 15, color: C.green, letterSpacing: '0.12em' }}>ONLINE · OPEN TO OPPORTUNITIES</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(28px, 4.5vw, 56px)', color: C.white, lineHeight: 1.2, marginBottom: 8, fontWeight: 600 }}>
          <span style={{ fontSize: 'clamp(16px, 2.2vw, 28px)', color: C.dim, display: 'block', marginBottom: 4, letterSpacing: '0.05em' }}>Hi, I'm</span>
          <span style={{ display: 'block', color: C.goldBright, textShadow: `0 0 20px ${C.gold}66` }}>Mark JP.</span>
        </motion.h1>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
          style={{ fontFamily: 'VT323, monospace', fontSize: 'clamp(18px, 2.2vw, 22px)', color: C.blueLight, letterSpacing: '0.08em', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: C.dimmer }}>▶ </span>{typed}<span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}
          style={{ width: 60, height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginBottom: 24 }} />

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
          style={{ fontFamily: "'Cinzel', Georgia, serif", fontSize: 'clamp(13px, 1.4vw, 15px)', color: C.dim, lineHeight: 1.9, marginBottom: 40, maxWidth: 440, fontWeight: 400, letterSpacing: '0.02em' }}>
          {YEARS_EXP}+ years turning complex systems into solutions.
          Clinical platforms, IoT systems, enterprise integrations.{' '}
          <span style={{ color: C.goldBright }}>Now leveling into backend engineering</span> —
          because the full stack demands to be understood.
        </motion.p>

        {/* MENU BUTTON — The only navigation */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.6 }}>
          <button
            className="click"
            onMouseEnter={() => Orchestra.menuMove()}
            onMouseOver={e => { if (!menuOpen) { e.currentTarget.style.borderColor = C.borderBright; e.currentTarget.style.background = `${C.gold}14`; e.currentTarget.style.color = C.goldBright } }}
            onMouseOut={e => { if (!menuOpen) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gold } }}
            onClick={menuOpen ? closeMenu : openMenu}
            style={{
              background: menuOpen ? `${C.gold}22` : 'transparent',
              border: `1px solid ${menuOpen ? C.borderBright : C.border}`,
              borderRadius: 2,
              padding: '14px 32px',
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(11px, 1.4vw, 13px)',
              color: menuOpen ? C.goldBright : C.gold,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
              cursor: 'none',
              display: 'flex', alignItems: 'center', gap: 10,
              animation: menuOpen ? 'none' : 'buttonBreathe 3s ease-in-out infinite',
            }}
          >
            <span style={{ fontSize: 12, opacity: 0.7 }}>{menuOpen ? '✕' : '⚔'}</span>
            {menuOpen ? 'Close Menu' : 'Open Menu'}
            <span style={{ fontSize: 12, opacity: 0.7 }}>{menuOpen ? '✕' : '⚔'}</span>
          </button>

          <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.dimmest, letterSpacing: '0.1em', marginTop: 10 }}>
            or press any arrow key
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE — Stained Glass Chronicle */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '52%', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px 80px' }}
      >
        {/* Ambient glow behind the window */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 50%, rgba(200,168,75,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <StainedGlassWindow hoveredSection={hoveredSection} />
      </motion.div>

      {/* BOTTOM STATUS BAR — Like FF's bottom info bar */}
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.6, duration: 0.7 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, height: 44, background: C.bgNav, borderTop: `1px solid ${C.border}`, backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', padding: '0 clamp(16px, 4vw, 48px)', gap: 32 }}>
        <MusicToggle />
        <div style={{ height: '60%', width: 1, background: C.border, marginLeft: 'auto' }} />
        {[
          { label: 'EXP', value: `${YEARS_EXP}+ YRS` },
          { label: 'CLASS', value: 'ENGINEER / ANALYST' },
          { label: 'STATUS', value: 'AVAILABLE', color: C.green, pulse: true },
          { label: 'ORIGIN', value: 'Quezon City, PH' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.dimmer, letterSpacing: '0.1em' }}>{s.label}</span>
            <span style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: s.color || C.silver, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 5 }}>
              {s.pulse && <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: C.green, boxShadow: `0 0 6px ${C.green}`, animation: 'pulse 2s infinite', flexShrink: 0 }} />}
              {s.value}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Menu backdrop — click outside to close */}
      {menuOpen && (
        <div onClick={closeMenu} style={{ position: 'fixed', inset: 0, zIndex: 190 }} />
      )}

      {/* FF MENU — slides in from left */}
      <AnimatePresence>
        {menuOpen && <FFMenu onSelect={handleSelect} onClose={closeMenu} onHover={setHoveredSection} />}
      </AnimatePresence>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
//  SECTION SCREENS — Full screen, FF-styled panels
// ═══════════════════════════════════════════════════════════════
function SectionScreen({ id, onBack }) {
  const sections = { profile: ProfileSection, skills: SkillsSection, quests: QuestsSection, contact: ContactSection }
  const Section = sections[id]

  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') { Orchestra.menuCancel(); onBack() } }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onBack])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      style={{ position: 'fixed', inset: 0, background: C.black, zIndex: 100, overflow: 'hidden' }}
    >
      <LightBeams opacity={0.5} />
      <CrystalDust count={40} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,8,0.7) 100%)', pointerEvents: 'none', zIndex: 2 }} />

      {/* Content area */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Section header bar */}
        <div style={{ flexShrink: 0, background: C.bgNav, borderBottom: `1px solid ${C.border}`, backdropFilter: 'blur(20px)', padding: '12px clamp(16px, 4vw, 48px)', display: 'flex', alignItems: 'center', gap: 20 }}>
          <button className="click"
            onMouseEnter={() => Orchestra.menuMove()}
            onClick={() => { Orchestra.menuCancel(); onBack() }}
            style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 2, padding: '6px 14px', fontFamily: "'Cinzel', serif", fontSize: 11, color: C.silver, letterSpacing: '0.15em', cursor: 'none', transition: 'all .2s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.goldBright }}
            onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.silver }}
          >◀ RETURN</button>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: C.dimmest, letterSpacing: '0.1em' }}>ESC</span>

          <div style={{ height: 20, width: 1, background: C.border }} />
          <StainedGlassBadge sectionId={id} />
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: GLASS_CFG[id]?.col || C.gold, letterSpacing: '0.2em', textTransform: 'uppercase', textShadow: `0 0 10px ${GLASS_CFG[id]?.glow || C.gold}55` }}>
            {MENU_ITEMS.find(m => m.id === id)?.label}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <MusicToggle />
          </div>
        </div>

        {/* Section content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(24px, 4vw, 48px) clamp(20px, 5vw, 64px)' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
            {Section && <Section />}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// Section content components
function SectionTitle({ icon, title, sub, color = C.goldBright }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(18px, 3vw, 28px)', color, textShadow: `0 0 15px ${color}44`, letterSpacing: '0.08em' }}>{title}</span>
      </div>
      <div style={{ height: 1, background: `linear-gradient(90deg, ${color}55, transparent)`, marginBottom: 8 }} />
      {sub && <div style={{ fontFamily: 'VT323, monospace', fontSize: 17, color: C.dimmer, letterSpacing: '0.08em' }}>{sub}</div>}
    </div>
  )
}

function Panel({ children, accent = C.gold, style = {} }) {
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderLeft: `3px solid ${accent}55`, borderRadius: 2, padding: 'clamp(16px, 3vw, 24px)', backdropFilter: 'blur(10px)', ...style }}>
      {children}
    </div>
  )
}

// ── Pixel Art Character ──────────────────────────────────────────
function PixelCharacter() {
  // 0=transparent 1=gold 2=gold-dark 3=silver 4=deep-blue 5=blue-armor
  const PAL = { 1: '#C8A84B', 2: '#6A4820', 3: '#A8B8D0', 4: '#1A2850', 5: '#344E8A' }
  const MAP = [
    [0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,1,3,3,3,3,3,3,1,0,0],
    [0,0,1,3,4,4,4,4,3,1,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,5,5,1,1,5,5,1,1,0],
    [1,1,5,5,5,5,5,5,5,5,1,1],
    [1,5,5,5,5,5,5,5,5,5,5,1],
    [1,5,5,5,4,4,4,5,5,5,5,1],
    [1,5,5,2,2,2,2,2,5,5,5,1],
    [0,1,1,5,5,0,0,5,5,1,1,0],
    [0,0,1,5,5,0,0,5,5,1,0,0],
    [0,0,1,5,5,0,0,5,5,1,0,0],
    [0,0,1,4,4,0,0,4,4,1,0,0],
    [0,0,1,4,4,0,0,4,4,1,0,0],
    [0,0,1,1,0,0,0,0,1,1,0,0],
  ]
  const SZ = 5
  return (
    <svg width={MAP[0].length * SZ} height={MAP.length * SZ}
      style={{ display: 'block', margin: '0 auto', animation: 'orbFloat 4s ease-in-out infinite', imageRendering: 'pixelated' }}>
      {MAP.map((row, ri) => row.map((cell, ci) =>
        cell ? <rect key={`${ri}-${ci}`} x={ci * SZ} y={ri * SZ} width={SZ} height={SZ} fill={PAL[cell]} /> : null
      ))}
    </svg>
  )
}

// ── Profile ─────────────────────────────────────────────────────
function ProfileSection() {
  const [hoveredAch, setHoveredAch] = useState(null)
  const typed = useTypewriter(['Backend Engineer (leveling up)', 'Clinical Systems Specialist', 'App Support Engineer', 'Business Analyst'])
  const XP = 7240, NXP = 10000

  const achs = [
    { icon: '🏆', label: 'Thesis Finalist',  desc: 'Best Thesis Award Finalist — IoT Flood Monitor' },
    { icon: '⚕️', label: 'Clinical Sage',   desc: '3+ years in Veeva, Medidata & Chameleon' },
    { icon: '🔐', label: 'Auth Wrangler',   desc: 'Solved complex SAML/SSO federation challenges' },
    { icon: '🔗', label: 'API Veteran',     desc: '10+ years of REST, SOAP, enterprise integrations' },
    { icon: '📡', label: 'IoT Architect',   desc: 'Built full sensor-to-dashboard IoT pipeline' },
    { icon: '⚔️', label: 'Class Change',   desc: 'Transitioning: Support → Backend Engineering' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,300px)', gap: 24, maxWidth: 1100 }}>
      <div>
        <SectionTitle icon="✦" title="Character Profile" sub="Background · Class · Equipped Skills" />

        <Panel accent={C.gold} style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(20px, 3vw, 28px)', color: C.white, marginBottom: 10, lineHeight: 1.3 }}>
            Hi, I'm <span style={{ color: C.goldBright }}>Mark.</span>
          </div>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 20, color: C.blueLight, letterSpacing: '0.06em', marginBottom: 18, display: 'flex', gap: 4 }}>
            <span style={{ color: C.dimmer }}>▶ </span>{typed}<span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
          </div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(14px, 1.4vw, 16px)', color: C.dim, lineHeight: 1.9 }}>
            {YEARS_EXP}+ years turning complex systems into solutions — from clinical trial platforms to IoT hardware.
            <span style={{ color: C.goldBright }}> Now leveling up into backend engineering</span> because
            understanding the full stack makes you a better engineer at every layer.
          </div>
        </Panel>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {[{ l: 'YEARS EXP', v: `${YEARS_EXP}+` }, { l: 'SYSTEMS', v: '8+' }, { l: 'QUESTS', v: '2 Active' }].map(s => (
            <Panel key={s.l} accent={C.gold} style={{ textAlign: 'center', padding: '16px 10px' }}>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(20px, 3vw, 28px)', color: C.goldBright, marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.dimmer, letterSpacing: '0.1em' }}>{s.l}</div>
            </Panel>
          ))}
        </div>

        <Panel accent={C.gold}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: C.gold, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 14 }}>Titles & Achievements</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {achs.map((a, i) => (
              <div key={a.label} className="click"
                onMouseEnter={() => { setHoveredAch(i); Orchestra.menuMove() }} onMouseLeave={() => setHoveredAch(null)}
                style={{ width: 48, height: 48, background: 'rgba(0,0,8,0.6)', border: `1px solid ${hoveredAch === i ? C.gold : C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, position: 'relative', transition: 'all .2s', transform: hoveredAch === i ? 'scale(1.1)' : 'scale(1)' }}>
                {a.icon}
                {hoveredAch === i && (
                  <div style={{ position: 'absolute', bottom: '110%', left: i >= 4 ? 'auto' : '50%', right: i >= 4 ? 0 : 'auto', transform: i >= 4 ? 'none' : 'translateX(-50%)', background: C.bgNav, border: `1px solid ${C.gold}55`, borderRadius: 2, padding: '8px 12px', fontFamily: 'VT323, monospace', zIndex: 99, boxShadow: `0 4px 20px rgba(0,0,0,0.8)`, minWidth: 180, textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: C.goldBright, marginBottom: 4 }}>{a.label}</div>
                    <div style={{ fontSize: 15, color: C.dim }}>{a.desc}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Character card */}
      <div>
        <Panel accent={C.gold} style={{ position: 'sticky', top: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ margin: '0 auto 12px', position: 'relative', display: 'inline-block' }}>
              <div style={{ position: 'absolute', inset: -8, borderRadius: 4, border: `1px solid ${C.border}`, background: `radial-gradient(circle at 40% 20%, ${C.gold}14, transparent)`, boxShadow: `0 0 20px ${C.gold}18` }} />
              <PixelCharacter />
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: C.white }}>Mark JP</div>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.gold, marginTop: 3 }}>LVL {YEARS_EXP} · ENGINEER CLASS</div>
          </div>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}44, transparent)`, marginBottom: 12 }} />
          {[['CLASS', C.blueLight, 'Engineer / Analyst'], ['GUILD', C.text, 'Clinical Systems'], ['ORIGIN', C.text, 'Quezon City, PH 🇵🇭'], ['STATUS', C.green, 'AVAILABLE']].map(([l, c, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.dimmest }}>{l}</span>
              <span style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: c }}>{v}</span>
            </div>
          ))}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}44, transparent)`, marginTop: 12, marginBottom: 12 }} />
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: C.gold, marginBottom: 5, letterSpacing: '0.1em' }}>NEXT CLASS CHANGE</div>
          <div style={{ height: 5, background: 'rgba(0,0,8,0.6)', borderRadius: 1, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${(XP / NXP) * 100}%` }} transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
              style={{ height: '100%', background: `linear-gradient(90deg, ${C.blue}, ${C.gold})`, boxShadow: `0 0 6px ${C.gold}66` }} />
          </div>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 11, color: C.dimmer, marginTop: 4 }}>{XP}/{NXP} · Target: Backend Engineer</div>
        </Panel>
      </div>
    </div>
  )
}

// ── Skills ──────────────────────────────────────────────────────
const SKILLS_DATA = [
  { name: 'System Analysis', tier: 'MASTER', color: C.goldBright, xp: 95 },
  { name: 'Clinical SaaS Ops', tier: 'MASTER', color: C.goldBright, xp: 92 },
  { name: 'API Integration', tier: 'MASTER', color: C.goldBright, xp: 90 },
  { name: 'Federated Auth / SSO', tier: 'MASTER', color: C.goldBright, xp: 88 },
  { name: 'SQL / Databases', tier: 'EXPERT', color: C.blueLight, xp: 78 },
  { name: 'REST & SOAP APIs', tier: 'EXPERT', color: C.blueLight, xp: 80 },
  { name: 'UAT & QA', tier: 'EXPERT', color: C.blueLight, xp: 75 },
  { name: 'Python', tier: 'JOURNEYMAN', color: C.green, xp: 52 },
  { name: 'Docker', tier: 'JOURNEYMAN', color: C.green, xp: 48 },
  { name: 'Go / Kubernetes', tier: 'APPRENTICE', color: C.dimmer, xp: 25 },
  { name: 'Backend Dev', tier: 'APPRENTICE', color: C.dimmer, xp: 30 },
]
const TIER_ORDER = ['MASTER', 'EXPERT', 'JOURNEYMAN', 'APPRENTICE']
const TIER_COLORS_MAP = { MASTER: C.goldBright, EXPERT: C.blueLight, JOURNEYMAN: C.green, APPRENTICE: C.dimmer }
const TIER_ICONS_MAP = { MASTER: '★', EXPERT: '◆', JOURNEYMAN: '▲', APPRENTICE: '○' }
const TECH_LIST = [
  { n: 'Python',     c: '#3776AB', s: '🐍', icon: 'python/python-original',      tier: 'JOURNEYMAN' },
  { n: 'Go',         c: '#00ACD7', s: '◈',  icon: 'go/go-original',              tier: 'APPRENTICE' },
  { n: 'Docker',     c: '#2496ED', s: '⬡',  icon: 'docker/docker-original',      tier: 'JOURNEYMAN' },
  { n: 'Kubernetes', c: '#326CE5', s: '✦',  icon: 'kubernetes/kubernetes-plain', tier: 'APPRENTICE' },
  { n: 'SQL',        c: '#F29111', s: '⊞',  icon: 'mysql/mysql-original',        tier: 'EXPERT'     },
  { n: 'Linux',      c: '#FCC624', s: '◉',  icon: 'linux/linux-original',        tier: 'EXPERT'     },
  { n: 'Git',        c: '#F05032', s: '⎇',  icon: 'git/git-original',            tier: 'MASTER'     },
  { n: 'Next.js',    c: '#FFFFFF', s: '▲',  icon: 'nextjs/nextjs-original',      tier: 'JOURNEYMAN' },
  { n: 'Veeva',      c: C.green,      s: '✚',  icon: null, tier: 'MASTER'     },
  { n: 'Medidata',   c: C.blueLight,  s: '⬟',  icon: null, tier: 'MASTER'     },
  { n: 'SAML/SSO',   c: C.goldBright, s: '🔐', icon: null, tier: 'MASTER'     },
  { n: 'REST APIs',  c: '#FF6B6B',    s: '⟳',  icon: null, tier: 'MASTER'     },
]

// ── SVG Skill Tree ───────────────────────────────────────────────
function SkillTreeSVG() {
  const [hoveredNode, setHoveredNode] = useState(null)
  const [drawn, setDrawn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 300); return () => clearTimeout(t) }, [])

  const nodes = [
    { id: 0,  tier: 'MASTER',     name: 'System Analysis', xp: 95, x: 110, y: 70  },
    { id: 1,  tier: 'MASTER',     name: 'Clinical SaaS',   xp: 92, x: 310, y: 70  },
    { id: 2,  tier: 'MASTER',     name: 'API Integration', xp: 90, x: 560, y: 70  },
    { id: 3,  tier: 'MASTER',     name: 'Auth / SSO',      xp: 88, x: 770, y: 70  },
    { id: 4,  tier: 'EXPERT',     name: 'SQL / Databases', xp: 78, x: 210, y: 185 },
    { id: 5,  tier: 'EXPERT',     name: 'REST & SOAP',     xp: 80, x: 460, y: 185 },
    { id: 6,  tier: 'EXPERT',     name: 'UAT & QA',        xp: 75, x: 680, y: 185 },
    { id: 7,  tier: 'JOURNEYMAN', name: 'Python',          xp: 52, x: 300, y: 300 },
    { id: 8,  tier: 'JOURNEYMAN', name: 'Docker',          xp: 48, x: 560, y: 300 },
    { id: 9,  tier: 'APPRENTICE', name: 'Go / Kubernetes', xp: 25, x: 300, y: 405 },
    { id: 10, tier: 'APPRENTICE', name: 'Backend Dev',     xp: 30, x: 560, y: 405 },
  ]
  const edges = [[0,4],[1,4],[1,5],[2,5],[2,6],[3,6],[4,7],[5,7],[5,8],[6,8],[7,9],[8,10]]
  const hov = hoveredNode !== null ? nodes.find(n => n.id === hoveredNode) : null

  return (
    <div>
      <svg viewBox="0 0 880 450" style={{ width: '100%', height: 'auto' }}>
        {edges.map(([a, b], i) => {
          const na = nodes[a], nb = nodes[b], col = TIER_COLORS_MAP[na.tier]
          return (
            <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={col} strokeWidth={1.5} strokeOpacity={0.35} strokeDasharray={400}
              style={{ strokeDashoffset: drawn ? 0 : 400, transition: `stroke-dashoffset 1.4s ease-out ${i * 0.07}s` }}
            />
          )
        })}
        {nodes.map(node => {
          const col = TIER_COLORS_MAP[node.tier], isH = hoveredNode === node.id, r = 20
          const arc = 2 * Math.PI * (r - 5)
          return (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}
              onMouseEnter={() => { setHoveredNode(node.id); Orchestra.menuMove() }}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'none' }}
            >
              <circle r={r + 10} fill={col} opacity={isH ? 0.14 : 0.04} />
              <circle r={r} fill={isH ? `${col}1a` : 'rgba(4,4,15,0.88)'} stroke={col} strokeWidth={isH ? 2 : 1.5} opacity={isH ? 1 : 0.85}
                style={{ transition: 'all 0.2s', filter: isH ? `drop-shadow(0 0 5px ${col})` : 'none' }} />
              <circle r={r - 5} fill="none" stroke={col} strokeWidth={2.5} strokeOpacity={0.35}
                strokeDasharray={`${(node.xp / 100) * arc} 9999`} transform="rotate(-90)" />
              <text textAnchor="middle" dominantBaseline="central" fontSize="12" fill={col} style={{ fontFamily: 'serif', userSelect: 'none' }}>
                {TIER_ICONS_MAP[node.tier]}
              </text>
              <text textAnchor="middle" y={r + 16} fontSize="11" fill={isH ? col : '#7888A8'} style={{ fontFamily: 'VT323, monospace', userSelect: 'none' }}>
                {node.name}
              </text>
            </g>
          )
        })}
      </svg>
      {hov && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 10, padding: '10px 16px', background: 'rgba(4,4,15,0.95)', border: `1px solid ${TIER_COLORS_MAP[hov.tier]}55`, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ color: TIER_COLORS_MAP[hov.tier], fontSize: 18 }}>{TIER_ICONS_MAP[hov.tier]}</span>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: TIER_COLORS_MAP[hov.tier], letterSpacing: '0.1em' }}>{hov.name}</div>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.dimmer }}>{hov.tier}</div>
          </div>
          <div style={{ flex: 1, height: 4, background: 'rgba(0,0,8,0.6)', borderRadius: 1, border: `1px solid ${TIER_COLORS_MAP[hov.tier]}33`, overflow: 'hidden', marginLeft: 8 }}>
            <div style={{ height: '100%', width: `${hov.xp}%`, background: `linear-gradient(90deg, ${TIER_COLORS_MAP[hov.tier]}66, ${TIER_COLORS_MAP[hov.tier]})` }} />
          </div>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: TIER_COLORS_MAP[hov.tier] }}>{hov.xp}%</span>
        </motion.div>
      )}
    </div>
  )
}

// ── 3D Tech Card ─────────────────────────────────────────────────
function TechCard({ tech, index }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const ref = useRef(null)

  const onMove = e => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setTilt({ x: ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 13, y: -((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 13 })
  }

  const iconUrl = tech.icon ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}.svg` : null
  const tierCol = TIER_COLORS_MAP[tech.tier] || C.dimmer

  return (
    <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.04, duration: 0.3 }}
      style={{ perspective: '600px' }}>
      <div ref={ref} className="click"
        onMouseMove={onMove}
        onMouseEnter={() => { setHovered(true); Orchestra.menuMove() }}
        onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false) }}
        style={{
          background: `${tech.c}10`, border: `1px solid ${hovered ? tech.c + '66' : tech.c + '28'}`,
          borderRadius: 3, padding: '14px 8px 10px', textAlign: 'center',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.08 : 1})`,
          transition: hovered ? 'transform 0.08s ease-out, border-color 0.2s' : 'transform 0.4s ease-out, border-color 0.2s',
          position: 'relative', overflow: 'hidden', transformStyle: 'preserve-3d',
        }}>
        {hovered && (
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(circle at ${50 - tilt.y * 1.5}% ${50 - tilt.x * 1.5}%, rgba(255,255,255,0.07), transparent 65%)` }} />
        )}
        <div style={{ height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
          {iconUrl && !imgErr
            ? <img src={iconUrl} alt={tech.n} width={34} height={34} onError={() => setImgErr(true)} style={{ objectFit: 'contain' }} />
            : <span style={{ fontSize: 22 }}>{tech.s}</span>
          }
        </div>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: tech.c, lineHeight: 1.2, marginBottom: 4 }}>{tech.n}</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color: tierCol, letterSpacing: '0.06em', opacity: 0.8 }}>{tech.tier}</div>
      </div>
    </motion.div>
  )
}

function AnimBar({ skill, delay }) {
  const ref = useRef(null); const [on, setOn] = useState(false)
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true) }, { threshold: 0.5 }); if (ref.current) o.observe(ref.current); return () => o.disconnect() }, [])
  return (
    <div ref={ref} style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: TIER_COLORS_MAP[skill.tier], fontSize: 10 }}>{TIER_ICONS_MAP[skill.tier]}</span>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 17, color: C.text }}>{skill.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: TIER_COLORS_MAP[skill.tier], letterSpacing: '0.1em' }}>{skill.tier}</span>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.dimmer }}>{skill.xp}%</span>
        </div>
      </div>
      <div style={{ height: 4, background: 'rgba(0,0,8,0.6)', borderRadius: 1, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: on ? `${skill.xp}%` : 0 }} transition={{ delay: delay + 0.1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', background: `linear-gradient(90deg, ${skill.color}66, ${skill.color})`, boxShadow: `0 0 5px ${skill.color}55` }} />
      </div>
    </div>
  )
}

function SkillsSection() {
  const [tab, setTab] = useState('tree')
  const grouped = TIER_ORDER.reduce((a, t) => { a[t] = SKILLS_DATA.filter(s => s.tier === t); return a }, {})
  return (
    <div style={{ maxWidth: 900 }}>
      <SectionTitle icon="⚡" title="Abilities" sub="Skill tree · Rankings · Equipped technologies" color={C.blueLight} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[['tree', 'Skill Tree'], ['bag', 'Tech Inventory']].map(([k, l]) => (
          <button key={k} className="click" onMouseEnter={() => Orchestra.menuMove()} onClick={() => { setTab(k); Orchestra.menuConfirm() }}
            style={{ background: tab === k ? `${C.gold}14` : 'transparent', border: `1px solid ${tab === k ? C.gold : C.border}`, borderRadius: 2, padding: '8px 18px', fontFamily: "'Cinzel', serif", fontSize: 11, color: tab === k ? C.goldBright : C.dim, letterSpacing: '0.12em', cursor: 'none', transition: 'all .2s', textTransform: 'uppercase' }}>
            {l}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {tab === 'tree' && (
          <motion.div key="tree" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <Panel accent={C.blue} style={{ padding: '16px 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 12, flexWrap: 'wrap' }}>
                {TIER_ORDER.map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: TIER_COLORS_MAP[t], fontSize: 10 }}>{TIER_ICONS_MAP[t]}</span>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: TIER_COLORS_MAP[t], letterSpacing: '0.1em' }}>{t}</span>
                  </div>
                ))}
              </div>
              <SkillTreeSVG />
            </Panel>
          </motion.div>
        )}
        {tab === 'bag' && (
          <motion.div key="bag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 10 }}>
              {TECH_LIST.map((t, i) => <TechCard key={t.n} tech={t} index={i} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Quests ──────────────────────────────────────────────────────
const QUESTS_DATA = [
  { id: 'Q-001', title: 'IoT Flood Monitoring System', status: 'COMPLETE', sc: C.green, ch: 'Chapter I', desc: 'Built an end-to-end IoT flood monitoring system for thesis — real-time sensor ingestion, alert pipelines, and a live monitoring dashboard. Awarded Thesis Finalist for Best Thesis.', tech: ['IoT', 'Sensors', 'Real-time Data', 'Embedded Systems'], xp: '1,200', reward: 'Thesis Finalist Award', locked: false },
  { id: 'Q-002', title: 'Portfolio Rebuild — markjp.dev', status: 'ACTIVE', sc: C.gold, ch: 'Chapter II', desc: 'Complete redesign of personal portfolio as a Final Fantasy-inspired game experience. Cinematic intro, title screen, orchestral ambient music, full-screen sections, animated skill bars. Next.js + Framer Motion.', tech: ['Next.js', 'Framer Motion', 'Web Audio API', 'Netlify'], xp: '600', reward: 'Unique Digital Identity', locked: false },
  { id: 'Q-003', title: '??? — The Sealed Quest', status: 'SEALED', sc: C.dimmer, ch: 'Chapter III', desc: 'A new quest stirs in the darkness. Built with Godot Engine. The world is not yet ready to know its name.', tech: ['Godot', 'GDScript', 'Game Dev'], xp: '???', reward: 'Unknown', locked: true },
]

function QuestsSection() {
  const [open, setOpen] = useState(null)
  const [hoveredQuest, setHoveredQuest] = useState(null)
  return (
    <div style={{ maxWidth: 860 }}>
      <SectionTitle icon="📜" title="Quest Log" sub="Completed chapters · Active missions · Sealed stories" color={C.goldBright} />
      <div style={{ display: 'grid', gap: 14 }}>
        {QUESTS_DATA.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }}
            className="click" onClick={() => { if (!q.locked) { setOpen(open === q.id ? null : q.id); Orchestra.menuConfirm() } }}
            onMouseEnter={() => { if (!q.locked) { setHoveredQuest(q.id); Orchestra.menuMove() } }}
            onMouseLeave={() => setHoveredQuest(null)}
            whileHover={!q.locked ? { y: -2 } : {}}
            style={{ background: C.bgCard, border: `1px solid ${q.locked ? C.border : hoveredQuest === q.id ? q.sc + '88' : q.sc + '33'}`, borderLeft: `3px solid ${q.locked ? C.dimmer : hoveredQuest === q.id ? q.sc : q.sc + 'aa'}`, borderRadius: 2, padding: '20px 22px', cursor: q.locked ? 'default' : 'none', opacity: q.locked ? 0.45 : 1, backdropFilter: 'blur(10px)', transition: 'border .2s, background .2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.dimmest, letterSpacing: '0.1em' }}>{q.id}</span>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, color: C.dimmer, letterSpacing: '0.1em' }}>{q.ch}</span>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: q.sc, border: `1px solid ${q.sc}44`, padding: '1px 7px', borderRadius: 1 }}>{q.status}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.gold }}>{q.xp} XP</span>
                {!q.locked && <span style={{ color: open === q.id ? C.gold : C.dimmer, fontSize: 12 }}>{open === q.id ? '▲' : '▼'}</span>}
              </div>
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(11px, 1.4vw, 14px)', color: C.text, marginBottom: 10, lineHeight: 1.6 }}>{q.locked ? '??? — The Sealed Quest' : q.title}</div>
            <AnimatePresence>
              {open === q.id && !q.locked && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: C.dim, lineHeight: 1.8, marginBottom: 12, paddingTop: 8 }}>{q.desc}</div>
                  <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.gold, marginBottom: 12 }}>✦ Reward: {q.reward}</div>
                </motion.div>
              )}
            </AnimatePresence>
            {open !== q.id && !q.locked && <div style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: C.dimmer }}>{q.desc.slice(0, 90)}... <span style={{ color: C.gold, fontFamily: "'Cinzel', serif", fontSize: 10 }}>[ click to open ]</span></div>}
            {q.locked && <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: C.dimmer }}>🔒 {q.desc}</div>}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
              {q.tech.map(t => <span key={t} style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.blueLight, background: `${C.blue}14`, border: `1px solid ${C.blue}33`, padding: '1px 8px', borderRadius: 1 }}>{t}</span>)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Contact ─────────────────────────────────────────────────────
function ContactSection() {
  const [showForm, setShowForm] = useState(false)
  return (
    <div style={{ maxWidth: 760 }}>
      <SectionTitle icon="✉" title="Send a Message" sub="Open for quests · Collaboration · Conversation" color={C.green} />
      <Panel accent={C.green} style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(14px, 1.5vw, 16px)', color: C.dim, lineHeight: 1.9, marginBottom: 14 }}>
          Whether you're here as a recruiter, a fellow developer, or just exploring — welcome. I'm actively seeking new opportunities in backend and full-stack engineering.
        </div>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 18, color: C.green }}>🟢 AVAILABLE — Seeking backend / full-stack roles</div>
      </Panel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { icon: '📧', l: 'EMAIL',    v: 'mark@markjp.dev',        h: 'mailto:mark@markjp.dev',                c: C.goldBright },
          { icon: '🐙', l: 'GITHUB',  v: 'github.com/markjpdev',   h: 'https://github.com/markjpdev',          c: C.blueLight  },
          { icon: '💼', l: 'LINKEDIN',v: 'in/jaysonpunsalan',      h: 'https://linkedin.com/in/jaysonpunsalan',c: C.blueLight  },
          { icon: '🌐', l: 'WEBSITE', v: 'markjp.dev',             h: 'https://markjp.dev',                    c: C.goldBright },
        ].map((item, i) => (
          <motion.a key={item.l} href={item.h} target={item.h.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
            className="click" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            onMouseEnter={e => { Orchestra.menuMove(); e.currentTarget.style.borderColor = `${item.c}55`; e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.querySelector('.arrow').style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.querySelector('.arrow').style.opacity = '0' }}
            onClick={() => Orchestra.menuConfirm()}
            style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 2, padding: '14px 18px', backdropFilter: 'blur(10px)', transition: 'all .2s', textDecoration: 'none' }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.dimmest, letterSpacing: '0.15em' }}>{item.l}</div>
              <div style={{ fontFamily: 'VT323, monospace', fontSize: 15, color: item.c }}>{item.v}</div>
            </div>
            <span className="arrow" style={{ fontFamily: 'VT323, monospace', fontSize: 18, color: item.c, opacity: 0, transition: 'opacity .2s' }}>→</span>
          </motion.a>
        ))}
      </div>
      {!showForm ? (
        <button className="click" onMouseEnter={() => Orchestra.menuMove()} onClick={() => { Orchestra.menuConfirm(); setShowForm(true) }}
          style={{ background: 'transparent', border: `1px solid ${C.gold}`, borderRadius: 2, padding: '13px 28px', fontFamily: "'Cinzel', serif", fontSize: 12, color: C.goldBright, letterSpacing: '0.2em', cursor: 'none', transition: 'all .2s', textTransform: 'uppercase' }}>
          ✉ Compose a Message
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Panel accent={C.gold}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, color: C.gold, marginBottom: 6, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Send Transmission</div>
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.dimmer, marginBottom: 20 }}>→ mark@markjp.dev</div>
            <ContactForm onClose={() => { Orchestra.menuCancel(); setShowForm(false) }} />
          </Panel>
        </motion.div>
      )}
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────
function MusicToggle() {
  const [on, setOn] = useState(true)
  const toggle = () => { const n = !on; setOn(n); n ? Orchestra.setVol(0.5) : Orchestra.setVol(0) }
  return (
    <button className="click" onClick={toggle} onMouseEnter={() => Orchestra.menuMove()}
      onMouseOver={e => { e.currentTarget.style.borderColor = on ? C.gold : C.red; e.currentTarget.style.background = on ? `${C.gold}14` : `${C.red}14` }}
      onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'transparent' }}
      style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 2, padding: '4px 10px', fontFamily: "'Cinzel', serif", fontSize: 10, color: on ? C.gold : C.red, letterSpacing: '0.1em', transition: 'all .2s' }}>
      {on ? '♪ ON' : '♪ MUTED'}
    </button>
  )
}

function useTypewriter(words, speed = 90, pause = 2000) {
  const [display, setDisplay] = useState(''); const [wi, setWi] = useState(0); const [ci, setCi] = useState(0); const [del, setDel] = useState(false)
  useEffect(() => {
    const word = words[wi % words.length]; let t
    if (!del && ci <= word.length) { setDisplay(word.slice(0, ci)); t = setTimeout(() => setCi(c => c + 1), speed) }
    else if (!del) { t = setTimeout(() => setDel(true), pause) }
    else if (del && ci >= 0) { setDisplay(word.slice(0, ci)); t = setTimeout(() => setCi(c => c - 1), speed / 2) }
    else { setDel(false); setWi(i => (i + 1) % words.length) }
    return () => clearTimeout(t)
  }, [ci, del, wi, words, speed, pause])
  return display
}

function ContactForm({ onClose }) {
  const [f, setF] = useState({ name: '', email: '', message: '' }); const [s, setS] = useState('idle')
  const sub = e => { e.preventDefault(); setS('sending'); Orchestra.transition(); window.open(`mailto:mark@markjp.dev?subject=${encodeURIComponent(`Message from ${f.name}`)}&body=${encodeURIComponent(`From: ${f.name}\nEmail: ${f.email}\n\n${f.message}`)}`); setTimeout(() => setS('sent'), 700) }
  const inp = { width: '100%', background: 'rgba(0,0,8,0.6)', border: `1px solid ${C.border}`, borderRadius: 2, padding: '10px 14px', color: C.text, fontFamily: 'VT323, monospace', fontSize: 17, outline: 'none', marginBottom: 14, transition: 'border-color .2s' }
  if (s === 'sent') return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: 36, marginBottom: 14 }}>✅</div>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, color: C.green, marginBottom: 10, letterSpacing: '0.1em' }}>TRANSMISSION SENT</div>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 17, color: C.dim, marginBottom: 22 }}>Your mail app should have opened. Talk soon, adventurer!</div>
      <button className="click" onClick={onClose} onMouseEnter={() => Orchestra.menuMove()} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 2, padding: '9px 20px', fontFamily: "'Cinzel', serif", fontSize: 11, color: C.silver, cursor: 'none', letterSpacing: '0.15em' }}>CLOSE</button>
    </div>
  )
  return (
    <form onSubmit={sub}>
      {[{ k: 'name', l: 'YOUR NAME', t: 'text', p: 'Enter your name...' }, { k: 'email', l: 'YOUR EMAIL', t: 'email', p: 'your@email.com' }].map(fi => (
        <div key={fi.k}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: C.dimmer, letterSpacing: '0.2em', marginBottom: 5, textTransform: 'uppercase' }}>{fi.l}</div>
          <input style={inp} type={fi.t} placeholder={fi.p} value={f[fi.k]} required onChange={e => setF(p => ({ ...p, [fi.k]: e.target.value }))} onFocus={e => e.target.style.borderColor = C.gold} onBlur={e => e.target.style.borderColor = C.border} />
        </div>
      ))}
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, color: C.dimmer, letterSpacing: '0.2em', marginBottom: 5, textTransform: 'uppercase' }}>MESSAGE</div>
      <textarea style={{ ...inp, minHeight: 100, resize: 'vertical', marginBottom: 20 }} placeholder="Write your message..." value={f.message} required onChange={e => setF(p => ({ ...p, message: e.target.value }))} onFocus={e => e.target.style.borderColor = C.gold} onBlur={e => e.target.style.borderColor = C.border} />
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="click" onMouseEnter={() => Orchestra.menuMove()}
          style={{ flex: 1, background: `linear-gradient(135deg, ${C.blue}44, ${C.gold}33)`, border: `1px solid ${C.gold}55`, borderRadius: 2, padding: '12px', fontFamily: "'Cinzel', serif", fontSize: 11, color: C.goldBright, cursor: 'none', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {s === 'sending' ? 'Sending...' : 'Send ▶'}
        </button>
        <button type="button" className="click" onClick={onClose} onMouseEnter={() => Orchestra.menuMove()}
          style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 2, padding: '12px 18px', fontFamily: "'Cinzel', serif", fontSize: 11, color: C.dim, cursor: 'none', letterSpacing: '0.1em' }}>Cancel</button>
      </div>
    </form>
  )
}

// ═══════════════════════════════════════════════════════════════
//  APP STATE MACHINE
//  cinematic → title → transition → main → [section]
// ═══════════════════════════════════════════════════════════════
export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState('cinematic') // cinematic | title | transition | main
  const [section, setSection] = useState(null)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const handleNavigate = (id) => {
    setSection(id)
    Orchestra.sectionEnter()
  }

  return (
    <>
      <Head>
        <title>Mark JP — Portfolio</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="description" content="Mark JP — Engineer, Analyst, Builder." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Press+Start+2P&family=VT323&display=swap');
        *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next { background: ${C.black}; color: ${C.text}; height: 100%; overflow: hidden; }
        * { cursor: none !important; }
        a { text-decoration: none; color: inherit; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${C.black}; }
        ::-webkit-scrollbar-thumb { background: ${C.gold}55; border-radius: 2px; }

        @keyframes blink         { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes buttonBreathe { 0%,100%{box-shadow:0 0 0px ${C.gold}00} 50%{box-shadow:0 0 14px ${C.gold}44,0 0 28px ${C.gold}22} }
        @keyframes ffBlink       { 0%,100%{opacity:1;text-shadow:0 0 16px ${C.goldBright},0 0 40px ${C.gold}66} 50%{opacity:0.4;text-shadow:none} }
        @keyframes pulse         { 0%,100%{box-shadow:0 0 4px ${C.green}} 50%{box-shadow:0 0 10px ${C.green},0 0 20px ${C.green}66} }
        @keyframes orbFloat      { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(1deg)} }
        @keyframes breathe       { 0%,100%{opacity:0.5,transform:scale(1)} 50%{opacity:1,transform:scale(1.05)} }
        @keyframes cursorBlink   { 0%,100%{opacity:1;filter:drop-shadow(0 0 3px ${C.gold}) drop-shadow(0 0 7px ${C.gold}88)} 50%{opacity:0.65;filter:drop-shadow(0 0 2px ${C.gold}66)} }

        /* Override for scrollable sections */
        .section-scroll { overflow-y: auto !important; }
        .section-scroll body { overflow: auto !important; }
      `}} />

      <FFCursor />

      <AnimatePresence mode="wait">
        {phase === 'cinematic' && (
          <CinematicIntro key="cinematic" onDone={() => setPhase('title')} />
        )}
        {phase === 'title' && (
          <TitleScreen key="title" onStart={() => setPhase('transition')} />
        )}
        {phase === 'transition' && (
          <Transition key="transition" onDone={() => setPhase('main')} />
        )}
        {phase === 'main' && !section && (
          <MainPage key="main" onNavigate={handleNavigate} />
        )}
        {phase === 'main' && section && (
          <SectionScreen key={section} id={section} onBack={() => setSection(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
