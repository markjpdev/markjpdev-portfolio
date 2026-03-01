import Head from 'next/head'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState, useRef, useCallback } from 'react'

// ═══════════════════════════════════════════════════════════════
//  MARK JP — Portfolio v4.0  |  THE GAME JOURNEY
//  Round 1: Boot → Press Start → Cinematic Reveal → Custom Cursor
// ═══════════════════════════════════════════════════════════════

const C = {
  bg:     '#050D14',
  card:   '#0A1628',
  border: '#1a2f4a',
  green:  '#00E5A5',
  cyan:   '#00C8FF',
  gold:   '#FFD97D',
  red:    '#FF6B6B',
  text:   '#c8e0f0',
  dim:    'rgba(200,224,240,0.55)',
  dimmer: 'rgba(200,224,240,0.3)',
}

const YEARS_EXP = new Date().getFullYear() - 2014

// ── Data ────────────────────────────────────────────────────────
const SKILL_TIERS = [
  { tier: 'MASTER',     color: C.green,  icon: '⬡', skills: ['System Analysis', 'Clinical SaaS Ops', 'API Integration', 'Federated Auth / SSO'] },
  { tier: 'EXPERT',     color: C.cyan,   icon: '⬢', skills: ['SQL / Databases', 'REST & SOAP APIs', 'UAT & QA', 'Technical Support'] },
  { tier: 'JOURNEYMAN', color: C.gold,   icon: '◈', skills: ['Python', 'Linux CLI', 'Docker', 'Git'] },
  { tier: 'APPRENTICE', color: '#aaaaaa',icon: '◇', skills: ['Go', 'Kubernetes', 'Next.js', 'Backend Dev'] },
]

const TECH = [
  { name: 'Python',     color: '#3776AB', bg: '#3776AB22', symbol: '🐍' },
  { name: 'Go',         color: '#00ACD7', bg: '#00ACD722', symbol: '🔵' },
  { name: 'Docker',     color: '#2496ED', bg: '#2496ED22', symbol: '🐳' },
  { name: 'Kubernetes', color: '#326CE5', bg: '#326CE522', symbol: '⚙️' },
  { name: 'SQL',        color: '#F29111', bg: '#F2911122', symbol: '🗄️' },
  { name: 'Linux',      color: '#FCC624', bg: '#FCC62422', symbol: '🐧' },
  { name: 'Git',        color: '#F05032', bg: '#F0503222', symbol: '📦' },
  { name: 'Next.js',    color: '#e6eef6', bg: '#ffffff11', symbol: '▲' },
  { name: 'Veeva',      color: C.green,  bg: '#00E5A522', symbol: '💊' },
  { name: 'Medidata',   color: C.cyan,   bg: '#00C8FF22', symbol: '🧬' },
  { name: 'SAML/SSO',   color: C.gold,   bg: '#FFD97D22', symbol: '🔐' },
  { name: 'REST APIs',  color: '#61DAFB', bg: '#61DAFB22', symbol: '🔌' },
]

const QUESTS = [
  {
    id: 'Q001', title: 'IoT Flood Monitoring System',
    status: 'COMPLETED', statusColor: C.green,
    desc: 'Designed and built an end-to-end IoT flood monitoring system for my thesis — real-time sensor data ingestion, alert pipelines, and a monitoring dashboard. Awarded Thesis Finalist for Best Thesis.',
    tech: ['IoT', 'Sensors', 'Real-time Data', 'Embedded Systems'],
    xp: '+1200 XP', reward: 'Thesis Finalist Award', locked: false,
  },
  {
    id: 'Q002', title: 'markjp.dev — Portfolio Rebuild',
    status: 'IN PROGRESS', statusColor: C.gold,
    desc: 'Total redesign of personal portfolio — RPG gaming aesthetic with boot animation, custom cursor, cinematic reveals, skill tiers, quest log, and gamified layout. Built with Next.js and Framer Motion.',
    tech: ['Next.js', 'Framer Motion', 'CSS', 'Netlify'],
    xp: '+600 XP', reward: 'Unique Portfolio', locked: false,
  },
  {
    id: 'Q003', title: '??? — Godot Game Project',
    status: 'UPCOMING', statusColor: C.dimmer,
    desc: 'First game development project using Godot Engine. Open source, GDScript-powered. Details unlocked soon.',
    tech: ['Godot', 'GDScript', 'Game Dev'],
    xp: '+??? XP', reward: '???', locked: true,
  },
]

const ACHIEVEMENTS = [
  { icon: '🏆', label: 'Thesis Finalist',  desc: 'Best Thesis Award Finalist — IoT Flood Monitor' },
  { icon: '🏥', label: 'Clinical SaaS',    desc: '3+ years managing Veeva, Medidata & Chameleon in regulated environments' },
  { icon: '🔐', label: 'SSO Wrangler',     desc: 'Solved complex federated auth issues across healthcare portals' },
  { icon: '🔌', label: 'API Veteran',      desc: '10+ years working with REST, SOAP and enterprise API integrations' },
  { icon: '📡', label: 'IoT Builder',      desc: 'Built a real IoT system from sensors to dashboard' },
  { icon: '⚔️', label: 'Career Changer',  desc: 'Actively leveling up from support to backend engineering' },
]

// ── Typewriter ──────────────────────────────────────────────────
function useTypewriter(words, speed = 85, pause = 1800) {
  const [display, setDisplay] = useState('')
  const [wi, setWi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)
  useEffect(() => {
    const word = words[wi % words.length]
    let t
    if (!del && ci <= word.length) { setDisplay(word.slice(0, ci)); t = setTimeout(() => setCi(c => c + 1), speed) }
    else if (!del && ci > word.length) { t = setTimeout(() => setDel(true), pause) }
    else if (del && ci >= 0) { setDisplay(word.slice(0, ci)); t = setTimeout(() => setCi(c => c - 1), speed / 2) }
    else { setDel(false); setWi(i => (i + 1) % words.length) }
    return () => clearTimeout(t)
  }, [ci, del, wi, words, speed, pause])
  return display
}

// ── Star Field ──────────────────────────────────────────────────
function StarField() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.2, a: Math.random(),
      s: Math.random() * 0.005 + 0.001, d: (Math.random() - 0.5) * 0.1,
    }))
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.a += Math.sin(Date.now() * s.s) * 0.006
        s.a = Math.max(0.05, Math.min(1, s.a))
        s.x += s.d * 0.15
        if (s.x < 0) s.x = canvas.width
        if (s.x > canvas.width) s.x = 0
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(160,210,255,${s.a * 0.75})`; ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} aria-hidden style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

// ── Custom Cursor ───────────────────────────────────────────────
function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [trail, setTrail] = useState([])
  const trailRef = useRef([])

  useEffect(() => {
    const move = (e) => {
      const p = { x: e.clientX, y: e.clientY }
      setPos(p)
      trailRef.current = [p, ...trailRef.current.slice(0, 6)]
      setTrail([...trailRef.current])

      const el = document.elementFromPoint(e.clientX, e.clientY)
      const isClickable = el?.closest('button, a, [role="button"], input, textarea, .clickable')
      setHovering(!!isClickable)
    }
    const down = () => setClicking(true)
    const up   = () => setClicking(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup',   up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup',   up)
    }
  }, [])

  const size = clicking ? 6 : hovering ? 20 : 12
  const color = hovering ? C.gold : C.green

  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
      {/* Trail dots */}
      {trail.map((p, i) => (
        <div key={i} style={{
          position: 'fixed',
          left: p.x, top: p.y,
          width: Math.max(2, 6 - i),
          height: Math.max(2, 6 - i),
          borderRadius: '50%',
          background: C.green,
          opacity: (1 - i / trail.length) * 0.4,
          transform: 'translate(-50%, -50%)',
          transition: 'none',
          pointerEvents: 'none',
        }} />
      ))}

      {/* Crosshair outer ring */}
      <div style={{
        position: 'fixed',
        left: pos.x, top: pos.y,
        width: clicking ? 16 : hovering ? 36 : 24,
        height: clicking ? 16 : hovering ? 36 : 24,
        border: `1.5px solid ${color}`,
        borderRadius: hovering ? '50%' : '2px',
        transform: `translate(-50%, -50%) rotate(${hovering ? '45deg' : '0deg'})`,
        transition: 'width 0.12s, height 0.12s, border-radius 0.12s, border-color 0.12s, transform 0.12s',
        boxShadow: `0 0 ${hovering ? 10 : 6}px ${color}66`,
        opacity: clicking ? 0.6 : 1,
      }} />

      {/* Crosshair lines */}
      {!hovering && (
        <>
          <div style={{ position: 'fixed', left: pos.x - 14, top: pos.y, width: 8, height: 1, background: color, transform: 'translateY(-50%)', opacity: 0.8 }} />
          <div style={{ position: 'fixed', left: pos.x + 6,  top: pos.y, width: 8, height: 1, background: color, transform: 'translateY(-50%)', opacity: 0.8 }} />
          <div style={{ position: 'fixed', left: pos.x, top: pos.y - 14, width: 1, height: 8, background: color, transform: 'translateX(-50%)', opacity: 0.8 }} />
          <div style={{ position: 'fixed', left: pos.x, top: pos.y + 6,  width: 1, height: 8, background: color, transform: 'translateX(-50%)', opacity: 0.8 }} />
        </>
      )}

      {/* Center dot */}
      <div style={{
        position: 'fixed',
        left: pos.x, top: pos.y,
        width: size, height: size,
        borderRadius: '50%',
        background: color,
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.1s, height 0.1s, background 0.12s',
        boxShadow: `0 0 8px ${color}`,
      }} />
    </div>
  )
}

// ── Boot Screen (Dramatic) ───────────────────────────────────────
function BootScreen({ onDone }) {
  const [phase, setPhase] = useState('flicker') // flicker → lines → bar → done
  const [step, setStep] = useState(0)
  const [flickerOn, setFlickerOn] = useState(true)

  const bootLines = [
    { text: 'BIOS v2.14.0 — MARK JP SYSTEMS', color: C.dimmer, delay: 0 },
    { text: 'CPU: ENGINEER-ANALYST HYBRID @ 3.2GHz', color: C.dimmer, delay: 80 },
    { text: 'RAM: 10+ YEARS EXPERIENCE LOADED', color: C.dimmer, delay: 160 },
    { text: '──────────────────────────────────', color: C.border, delay: 240 },
    { text: 'DETECTING SKILL MODULES...', color: C.dim, delay: 320 },
    { text: '  [OK] CLINICAL SYSTEMS............. LOADED', color: C.green, delay: 440 },
    { text: '  [OK] API INTEGRATION.............. LOADED', color: C.green, delay: 560 },
    { text: '  [OK] SSO/SAML AUTH................ LOADED', color: C.green, delay: 680 },
    { text: '  [..] BACKEND ENGINEERING.......... LOADING', color: C.gold, delay: 800 },
    { text: '──────────────────────────────────', color: C.border, delay: 920 },
    { text: 'QUEST LOG: 2 ACTIVE · 1 LOCKED', color: C.cyan, delay: 1000 },
    { text: 'INITIALIZING PORTFOLIO INTERFACE...', color: C.green, delay: 1100 },
  ]

  // Phase 1: CRT flicker
  useEffect(() => {
    if (phase !== 'flicker') return
    let count = 0
    const flicker = setInterval(() => {
      setFlickerOn(f => !f)
      count++
      if (count > 7) { clearInterval(flicker); setFlickerOn(true); setPhase('lines') }
    }, 60)
    return () => clearInterval(flicker)
  }, [phase])

  // Phase 2: Boot lines
  useEffect(() => {
    if (phase !== 'lines') return
    if (step < bootLines.length) {
      const t = setTimeout(() => setStep(s => s + 1), step === 0 ? 200 : 120)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setPhase('bar'), 300)
      return () => clearTimeout(t)
    }
  }, [phase, step])

  // Phase 3: done
  useEffect(() => {
    if (phase !== 'bar') return
    const t = setTimeout(onDone, 1200)
    return () => clearTimeout(t)
  }, [phase])

  const barProgress = phase === 'bar' ? 100 : 0

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: C.bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: "'VT323', monospace",
        opacity: flickerOn ? 1 : 0.15,
      }}
    >
      {/* CRT vignette */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)',
      }} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 32, color: C.green,
          textShadow: `0 0 20px ${C.green}, 0 0 60px ${C.green}55`,
          marginBottom: 32, letterSpacing: 6,
        }}
      >MJP</motion.div>

      {/* Boot lines */}
      <div style={{ width: 480, maxWidth: '90vw' }}>
        {bootLines.slice(0, step).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            style={{ fontSize: 15, letterSpacing: 0.5, marginBottom: 3, color: line.color, fontFamily: "'VT323', monospace" }}
          >
            {line.text}
            {i === step - 1 && phase === 'lines' && (
              <span style={{ animation: 'blink 0.6s step-end infinite' }}>█</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Loading bar */}
      {phase === 'bar' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ width: 480, maxWidth: '90vw', marginTop: 20 }}
        >
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.green, marginBottom: 6, letterSpacing: 1 }}>
            LOADING PORTFOLIO... <span style={{ animation: 'blink 0.5s step-end infinite' }}>█</span>
          </div>
          <div style={{ height: 8, background: '#0e1e30', borderRadius: 2, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              style={{ height: '100%', background: `linear-gradient(90deg, ${C.green}88, ${C.green})`, boxShadow: `0 0 10px ${C.green}`, borderRadius: 2 }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// ── Press Start Screen ───────────────────────────────────────────
function PressStartScreen({ onStart }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t) }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      onClick={onStart}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: C.bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'none',
        fontFamily: "'VT323', monospace",
      }}
    >
      <StarField />

      {/* Vignette */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none', zIndex: 1 }} />

      {/* Grid */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${C.green}06 1px, transparent 1px), linear-gradient(90deg, ${C.green}06 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        {/* MJP big logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(32px, 8vw, 64px)',
            color: C.green,
            textShadow: `0 0 30px ${C.green}, 0 0 80px ${C.green}44`,
            marginBottom: 8, letterSpacing: 8,
          }}
        >MJP</motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(8px, 1.5vw, 12px)', color: C.dim, letterSpacing: 3, marginBottom: 48 }}
        >PORTFOLIO · v4.0</motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{ width: 300, height: 1, background: `linear-gradient(90deg, transparent, ${C.green}, transparent)`, margin: '0 auto 48px' }}
        />

        {/* Press Start */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(10px, 2vw, 14px)',
            color: C.gold,
            letterSpacing: 3,
            animation: 'pressStartBlink 1.2s ease-in-out infinite',
          }}
        >
          — PRESS START —
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: C.dimmer, marginTop: 16, letterSpacing: 2 }}
        >
          CLICK OR PRESS ANY KEY TO CONTINUE
        </motion.div>

        {/* Bottom decorative text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ position: 'absolute', bottom: -120, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
        >
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.dimmer, letterSpacing: 1 }}>
            © {new Date().getFullYear()} MARK JP · ALL RIGHTS RESERVED
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ── Brackets ────────────────────────────────────────────────────
function Brackets({ color = C.green, size = 10 }) {
  const b = { position: 'absolute', width: size, height: size, borderColor: `${color}55` }
  return (
    <>
      <div style={{ ...b, top: 6, left: 6,   borderTop: '2px solid', borderLeft: '2px solid'  }} />
      <div style={{ ...b, top: 6, right: 6,  borderTop: '2px solid', borderRight: '2px solid' }} />
      <div style={{ ...b, bottom: 6, left: 6,  borderBottom: '2px solid', borderLeft: '2px solid'  }} />
      <div style={{ ...b, bottom: 6, right: 6, borderBottom: '2px solid', borderRight: '2px solid' }} />
    </>
  )
}

// ── Section Header ──────────────────────────────────────────────
function SectionHeader({ title, color = C.green, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: 28 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, color, letterSpacing: 1 }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}55, transparent)` }} />
      </div>
      {sub && <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: C.dimmer, letterSpacing: 1 }}>{sub}</div>}
    </motion.div>
  )
}

// ── Quest Card ──────────────────────────────────────────────────
function QuestCard({ q, i }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: i * 0.12, duration: 0.5 }}
      className="clickable"
      onClick={() => !q.locked && setOpen(o => !o)}
      style={{
        background: q.locked ? `${C.card}55` : C.card,
        border: `1px solid ${q.locked ? C.border : q.statusColor + '44'}`,
        borderLeft: `3px solid ${q.statusColor}`,
        borderRadius: 6, padding: '18px 20px',
        cursor: q.locked ? 'default' : 'none',
        opacity: q.locked ? 0.5 : 1,
        transition: 'background 0.2s, transform 0.2s',
      }}
      whileHover={!q.locked ? { scale: 1.005, boxShadow: `0 4px 24px rgba(0,0,0,0.3)` } : {}}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: C.dimmer, letterSpacing: 2 }}>{q.id}</span>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: q.statusColor, border: `1px solid ${q.statusColor}44`, padding: '1px 7px', borderRadius: 3 }}>{q.status}</span>
        </div>
        <span style={{ fontFamily: 'VT323, monospace', fontSize: 15, color: C.gold }}>{q.xp}</span>
      </div>

      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#e6eef6', marginBottom: 10, lineHeight: 1.7 }}>
        {q.locked ? '??? CLASSIFIED' : q.title}
      </div>

      <AnimatePresence>
        {open && !q.locked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 17, color: C.dim, lineHeight: 1.65, marginBottom: 10 }}>
              {q.desc}
            </div>
            {q.reward && (
              <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.gold, marginBottom: 10 }}>
                🏆 REWARD: {q.reward}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!open && !q.locked && (
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: C.dim, lineHeight: 1.65 }}>
          {q.desc.slice(0, 95)}...{' '}
          <span style={{ color: C.green }}>[ tap to expand ]</span>
        </div>
      )}

      {q.locked && (
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: C.dimmer }}>🔒 {q.desc}</div>
      )}

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
        {q.tech.map(t => (
          <span key={t} style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.cyan, background: `${C.cyan}10`, border: `1px solid ${C.cyan}30`, padding: '1px 8px', borderRadius: 3 }}>{t}</span>
        ))}
      </div>
    </motion.div>
  )
}

// ── Zone Wrapper (section entrance animation) ───────────────────
function Zone({ id, children, style }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.section>
  )
}

// ── Main ────────────────────────────────────────────────────────
export default function Home() {
  const [mounted,    setMounted]    = useState(false)
  const [booted,     setBooted]     = useState(false)
  const [started,    setStarted]    = useState(false)
  const [hoveredAch, setHoveredAch] = useState(null)
  const [showContact, setShowContact] = useState(false)

  const typed = useTypewriter([
    'Business Analyst',
    'Application Support Engineer',
    'Clinical Systems Specialist',
    'Backend Engineer (leveling up)',
    'Problem Solver',
  ])

  useEffect(() => { setMounted(true) }, [])

  // Press any key to start
  useEffect(() => {
    if (!booted || started) return
    const handler = () => setStarted(true)
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [booted, started])

  if (!mounted) return null

  const LEVEL = YEARS_EXP
  const XP = 7240
  const NEXT_XP = 10000

  // ── Hero reveal variants ──────────────────────────────────────
  const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
  }
  const heroItem = {
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  }
  const heroCard = {
    hidden: { opacity: 0, x: 40, rotateY: -10 },
    show:   { opacity: 1, x: 0, rotateY: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 } }
  }

  return (
    <>
      <Head>
        <title>Mark JP — Portfolio</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="description" content="Mark JP — Engineer, Analyst, Builder. 10+ years in IT and clinical systems." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Silkscreen:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next { background: ${C.bg}; color: ${C.text}; }
        * { cursor: none !important; }
        a { text-decoration: none; color: inherit; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }

        @keyframes blink         { 0%,100%{opacity:1}   50%{opacity:0} }
        @keyframes float         { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-8px)} }
        @keyframes glowPulse     { 0%,100%{box-shadow:0 0 10px ${C.green}33} 50%{box-shadow:0 0 26px ${C.green}88} }
        @keyframes gridScroll    { 0%{background-position:0 0} 100%{background-position:40px 40px} }
        @keyframes scanline      { 0%{transform:translateY(0)} 100%{transform:translateY(4px)} }
        @keyframes pressStartBlink { 0%,100%{opacity:1; text-shadow:0 0 20px ${C.gold}, 0 0 40px ${C.gold}66} 50%{opacity:0.3; text-shadow:none} }
        @keyframes zoneEntrance  { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:translateY(0)} }
        @keyframes borderGlow    { 0%,100%{border-color:${C.border}} 50%{border-color:${C.green}44} }

        .cta {
          background: ${C.green}; color: #021014;
          font-family: 'Press Start 2P', monospace; font-size: 9px;
          padding: 14px 22px; border: none; border-radius: 4px;
          letter-spacing: 1px; animation: glowPulse 2.5s ease-in-out infinite;
          box-shadow: 4px 4px 0 #009966; transition: all 0.15s;
        }
        .cta:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #009966; }
        .cta:active { transform: translate(2px,2px); box-shadow: 2px 2px 0 #009966; }

        .ghost {
          background: transparent; border: 1px solid ${C.border};
          color: ${C.dim}; font-family: 'VT323', monospace; font-size: 18px;
          padding: 11px 22px; border-radius: 4px;
          letter-spacing: 1px; transition: all 0.2s;
        }
        .ghost:hover { border-color: ${C.cyan}66; color: ${C.cyan}; background: ${C.cyan}0d; box-shadow: 0 0 12px ${C.cyan}22; }

        .nav-btn {
          background: transparent; border: 1px solid transparent;
          color: ${C.dim}; font-family: 'VT323', monospace; font-size: 16px;
          padding: 6px 14px; border-radius: 4px; letter-spacing: 1px; transition: all 0.2s;
        }
        .nav-btn:hover { color: ${C.green}; border-color: ${C.green}44; background: ${C.green}0d; text-shadow: 0 0 8px ${C.green}88; }

        .tier-card { transition: transform 0.2s, box-shadow 0.2s; }
        .tier-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }

        .tech-item { transition: transform 0.18s, box-shadow 0.18s; }
        .tech-item:hover { transform: scale(1.08) translateY(-2px); }

        .ach-badge { transition: border-color 0.2s, transform 0.2s; }
        .ach-badge:hover { border-color: ${C.gold} !important; transform: scale(1.1); }

        .contact-link {
          display: flex; align-items: center; gap: 14px;
          background: ${C.card}; border: 1px solid ${C.border};
          border-radius: 6px; padding: 16px 20px; transition: all 0.2s;
        }
        .contact-link:hover { transform: translateX(4px); }

        /* Zone dividers */
        .zone-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, ${C.border}, transparent);
          margin: 0 0 64px;
          position: relative;
        }
        .zone-divider::after {
          content: '◆';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          color: ${C.border};
          font-size: 10px;
          background: ${C.bg};
          padding: 0 8px;
        }

        /* Modal overlay */
        .modal-overlay {
          position: fixed; inset: 0; zIndex: 500;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
        }

        @media (max-width: 768px) {
          .hero-grid    { grid-template-columns: 1fr !important; }
          .skills-grid  { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .char-card    { display: none !important; }
          .header-xp    { display: none !important; }
          .nav-btn      { padding: 5px 8px !important; font-size: 13px !important; }
        }
      `}} />

      {/* Scanlines */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 998, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)', animation: 'scanline 0.08s linear infinite' }} />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Stars */}
      <StarField />

      {/* Grid */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', backgroundImage: `linear-gradient(${C.green}07 1px, transparent 1px), linear-gradient(90deg, ${C.green}07 1px, transparent 1px)`, backgroundSize: '40px 40px', animation: 'gridScroll 10s linear infinite' }} />

      {/* ── GAME FLOW ────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!booted && <BootScreen key="boot" onDone={() => setBooted(true)} />}
        {booted && !started && <PressStartScreen key="pressstart" onStart={() => setStarted(true)} />}
      </AnimatePresence>

      {/* ── MAIN WORLD ───────────────────────────────────────── */}
      <AnimatePresence>
        {started && (
          <motion.div
            key="world"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ minHeight: '100vh', fontFamily: "'VT323', monospace", position: 'relative', zIndex: 10, overflowX: 'hidden' }}
          >

            {/* ── HEADER ──────────────────────────────────── */}
            <motion.header
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'sticky', top: 0, zIndex: 100, background: `${C.bg}ee`, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}
            >
              <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: '#021014', boxShadow: `0 0 14px ${C.green}44` }}>MJP</div>
                  <div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: '#e6eef6' }}>MARK JP</div>
                    <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.gold, letterSpacing: 1 }}>LVL {LEVEL} · ENGINEER</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="header-xp" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.gold }}>XP</span>
                    <div style={{ width: 90, height: 6, background: '#0e1e30', borderRadius: 2, border: `1px solid ${C.border}` }}>
                      <div style={{ width: `${(XP / NEXT_XP) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.gold}99, ${C.gold})`, boxShadow: `0 0 6px ${C.gold}88`, borderRadius: 2 }} />
                    </div>
                    <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: C.dimmer }}>{XP}/{NEXT_XP}</span>
                  </div>
                  <nav style={{ display: 'flex', gap: 2 }}>
                    {[['HOME','hero'],['SKILLS','skills'],['QUESTS','quests'],['CONTACT','contact']].map(([label, id]) => (
                      <button key={id} className="nav-btn clickable"
                        onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}>
                        {label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </motion.header>

            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>

              {/* ── HERO ────────────────────────────────────── */}
              <section id="hero" style={{ paddingTop: 80, paddingBottom: 72 }}>
                <motion.div
                  className="hero-grid"
                  variants={heroContainer}
                  initial="hidden"
                  animate="show"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 48, alignItems: 'center' }}
                >
                  <div>
                    <motion.div variants={heroItem} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', display: 'inline-block', background: C.green, boxShadow: `0 0 8px ${C.green}, 0 0 16px ${C.green}`, animation: 'glowPulse 2s infinite' }} />
                      <span style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: C.green, letterSpacing: 2 }}>ONLINE · OPEN TO OPPORTUNITIES</span>
                    </motion.div>

                    <motion.h1 variants={heroItem}
                      style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(22px, 3.5vw, 38px)', lineHeight: 1.5, marginBottom: 22, color: '#e6eef6' }}>
                      HI, I'M{' '}
                      <span style={{ color: C.green, textShadow: `0 0 20px ${C.green}66, 0 0 40px ${C.green}33` }}>MARK.</span>
                    </motion.h1>

                    <motion.div variants={heroItem}
                      style={{ fontFamily: 'VT323, monospace', fontSize: 24, marginBottom: 26, color: C.cyan, letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <span style={{ color: C.dimmer }}>&gt; </span>
                      <span>{typed}</span>
                      <span style={{ animation: 'blink 1s step-end infinite', color: C.cyan }}>_</span>
                    </motion.div>

                    <motion.p variants={heroItem}
                      style={{ fontFamily: 'Silkscreen, monospace', fontSize: 14, lineHeight: 1.85, marginBottom: 36, color: C.dim, maxWidth: 560 }}>
                      {YEARS_EXP}+ years turning complex systems into solutions —
                      from clinical trial platforms to IoT hardware.{' '}
                      <span style={{ color: C.green }}>Now expanding into backend engineering</span>{' '}
                      because understanding the full stack makes you a better engineer at every layer.
                    </motion.p>

                    <motion.div variants={heroItem} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <button className="cta clickable" onClick={() => document.getElementById('quests')?.scrollIntoView({ behavior: 'smooth' })}>
                        VIEW QUEST LOG
                      </button>
                      <button className="ghost clickable" onClick={() => setShowContact(true)}>
                        SEND MESSAGE
                      </button>
                      <a href="https://github.com/markjpdev" target="_blank" rel="noreferrer">
                        <button className="ghost clickable">GITHUB</button>
                      </a>
                    </motion.div>
                  </div>

                  {/* Character Card */}
                  <motion.div className="char-card" variants={heroCard} style={{ animation: 'float 4s ease-in-out infinite' }}>
                    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 22, position: 'relative', overflow: 'hidden', boxShadow: `0 0 40px rgba(0,229,165,0.07), 0 24px 64px rgba(0,0,0,0.5)` }}>
                      <Brackets />

                      <div style={{ textAlign: 'center', marginBottom: 18 }}>
                        <div style={{ width: 72, height: 72, margin: '0 auto 12px', background: `linear-gradient(135deg, ${C.green}22, ${C.cyan}22)`, border: `2px solid ${C.green}66`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Press Start 2P', monospace", fontSize: 11, color: C.green, boxShadow: `0 0 20px ${C.green}22` }}>MJP</div>
                        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: '#e6eef6' }}>MARK JP</div>
                        <div style={{ fontFamily: 'VT323, monospace', fontSize: 15, color: C.gold, marginTop: 4 }}>★ LEVEL {LEVEL} · {YEARS_EXP} YRS EXP ★</div>
                      </div>

                      <div style={{ background: '#071020', border: `1px solid ${C.border}`, borderRadius: 4, padding: '10px 12px', marginBottom: 14, fontFamily: 'VT323, monospace', fontSize: 15 }}>
                        {[['CLASS', C.cyan, 'Engineer / Analyst Hybrid'], ['GUILD', '#e6eef6', 'Clinical Systems · Backend Dev'], ['LOCATION', '#e6eef6', 'Quezon City, PH 🇵🇭']].map(([lbl, col, val]) => (
                          <div key={lbl} style={{ marginBottom: 7 }}>
                            <div style={{ color: C.dimmer, fontSize: 12, letterSpacing: 1, marginBottom: 1 }}>{lbl}</div>
                            <div style={{ color: col }}>{val}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.gold, letterSpacing: 1 }}>XP TO NEXT LEVEL</span>
                          <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.gold }}>{XP}/{NEXT_XP}</span>
                        </div>
                        <div style={{ height: 7, background: '#0e1e30', borderRadius: 2, border: `1px solid ${C.border}` }}>
                          <div style={{ width: `${(XP / NEXT_XP) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.gold}99, ${C.gold})`, boxShadow: `0 0 6px ${C.gold}66`, borderRadius: 2 }} />
                        </div>
                        <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.dimmer, marginTop: 3 }}>GOAL: Backend Engineer</div>
                      </div>

                      <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.dimmer, letterSpacing: 1, marginBottom: 8 }}>ACHIEVEMENTS ({ACHIEVEMENTS.length}/{ACHIEVEMENTS.length})</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {ACHIEVEMENTS.map((a, i) => (
                          <div key={a.label} className="ach-badge clickable"
                            onMouseEnter={() => setHoveredAch(i)} onMouseLeave={() => setHoveredAch(null)}
                            style={{ width: 36, height: 36, background: '#071020', border: `1px solid ${C.border}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, position: 'relative' }}>
                            {a.icon}
                            {hoveredAch === i && (
                              <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', background: '#0d1f33', border: `1px solid ${C.gold}44`, borderRadius: 4, padding: '7px 10px', fontFamily: 'VT323, monospace', fontSize: 13, color: C.gold, zIndex: 99, boxShadow: '0 4px 16px rgba(0,0,0,0.6)', minWidth: 170, textAlign: 'center' }}>
                                <div style={{ color: '#e6eef6', marginBottom: 3 }}>{a.label}</div>
                                <div style={{ color: C.dimmer, fontSize: 12 }}>{a.desc}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </section>

              <div className="zone-divider" />

              {/* ── SKILLS ZONE ─────────────────────────────── */}
              <Zone id="skills" style={{ paddingBottom: 64 }}>
                <SectionHeader title="CHARACTER STATS" color={C.cyan} sub={`SKILL TIERS · BASED ON ${YEARS_EXP}+ YEARS OF FIELD EXPERIENCE`} />

                <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 52 }}>
                  {SKILL_TIERS.map((tier, i) => (
                    <motion.div key={tier.tier} className="tier-card"
                      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.1, duration: 0.5 }}
                      style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${tier.color}`, borderRadius: 6, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
                      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: `linear-gradient(180deg, ${tier.color}08, transparent)`, pointerEvents: 'none' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <span style={{ fontSize: 20, color: tier.color, filter: `drop-shadow(0 0 4px ${tier.color})` }}>{tier.icon}</span>
                        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: tier.color }}>{tier.tier}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {tier.skills.map(skill => (
                          <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: tier.color, flexShrink: 0 }} />
                            <span style={{ fontFamily: 'VT323, monospace', fontSize: 17, color: '#e6eef6' }}>{skill}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <SectionHeader title="TECH INVENTORY" color={C.green} sub="TOOLS & TECHNOLOGIES IN THE ARSENAL" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 10 }}>
                  {TECH.map((t, i) => (
                    <motion.div key={t.name} className="tech-item"
                      initial={{ opacity: 0, scale: 0.75 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: '-20px' }} transition={{ delay: i * 0.04, duration: 0.4 }}
                      style={{ background: t.bg, border: `1px solid ${t.color}44`, borderRadius: 6, padding: '13px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{t.symbol}</div>
                      <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: t.color, letterSpacing: 0.5, lineHeight: 1.2 }}>{t.name}</div>
                    </motion.div>
                  ))}
                </div>
              </Zone>

              <div className="zone-divider" />

              {/* ── QUEST LOG ZONE ──────────────────────────── */}
              <Zone id="quests" style={{ paddingBottom: 64 }}>
                <SectionHeader title="QUEST LOG" color={C.gold} sub="PROJECTS · MISSIONS · CLICK CARD TO EXPAND" />
                <div style={{ display: 'grid', gap: 14 }}>
                  {QUESTS.map((q, i) => <QuestCard key={q.id} q={q} i={i} />)}
                </div>
              </Zone>

              <div className="zone-divider" />

              {/* ── CONTACT ZONE ────────────────────────────── */}
              <Zone id="contact" style={{ paddingBottom: 88 }}>
                <SectionHeader title="SEND TRANSMISSION" color={C.green} sub="OPEN FOR COLLABORATION · JOB OPPORTUNITIES · TECH CHAT" />

                <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  style={{ background: '#030a10', border: `1px solid ${C.border}`, borderRadius: 6, padding: '18px 22px', marginBottom: 20, fontFamily: 'VT323, monospace', fontSize: 16, color: C.dim }}>
                  <div style={{ color: C.dimmer, marginBottom: 6, fontSize: 13, letterSpacing: 1 }}>TERMINAL v1.0</div>
                  <div><span style={{ color: C.green }}>$</span> whoami</div>
                  <div style={{ color: '#e6eef6', marginLeft: 14, marginBottom: 6 }}>mark_jp — engineer, builder, problem solver</div>
                  <div><span style={{ color: C.green }}>$</span> status</div>
                  <div style={{ color: C.gold, marginLeft: 14, marginBottom: 6 }}>AVAILABLE · Open to backend / full-stack roles</div>
                  <div><span style={{ color: C.green }}>$</span> contact --list</div>
                  <div style={{ color: C.dim, marginLeft: 14 }}>Initiating contact channels...<span style={{ animation: 'blink 1s step-end infinite' }}>_</span></div>
                </motion.div>

                <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { icon: '📧', label: 'EMAIL',    value: 'mark@markjp.dev',         href: 'mailto:mark@markjp.dev',                color: C.green },
                    { icon: '🐙', label: 'GITHUB',   value: 'github.com/markjpdev',    href: 'https://github.com/markjpdev',          color: C.cyan  },
                    { icon: '💼', label: 'LINKEDIN', value: 'in/jaysonpunsalan',       href: 'https://linkedin.com/in/jaysonpunsalan', color: C.cyan  },
                    { icon: '🌐', label: 'WEBSITE',  value: 'markjp.dev',              href: 'https://markjp.dev',                    color: C.green },
                  ].map((item, i) => (
                    <motion.a key={item.label} href={item.href}
                      target={item.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                      className="contact-link clickable"
                      initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.background = `${item.color}0a` }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card }}>
                      <span style={{ fontSize: 26 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.dimmer, letterSpacing: 1 }}>{item.label}</div>
                        <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 13, color: item.color }}>{item.value}</div>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Quick message button */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                  style={{ marginTop: 20, textAlign: 'center' }}>
                  <button className="ghost clickable" style={{ fontSize: 16 }} onClick={() => setShowContact(true)}>
                    ✉️ COMPOSE MESSAGE
                  </button>
                </motion.div>
              </Zone>
            </main>

            {/* ── FOOTER ──────────────────────────────────── */}
            <footer style={{ borderTop: `1px solid ${C.border}`, padding: '24px', textAlign: 'center', background: `${C.bg}cc`, position: 'relative' }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: C.green, letterSpacing: 2, marginBottom: 8 }}>
                ── GAME SAVED ──
              </div>
              <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.dimmer, letterSpacing: 1 }}>
                © {new Date().getFullYear()} MARK JP · BUILT WITH NEXT.JS + FRAMER MOTION · v4.0.0
              </div>
              <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: `${C.dimmer}77`, marginTop: 4, letterSpacing: 1 }}>
                THANK YOU FOR PLAYING_
              </div>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONTACT MODAL ───────────────────────────────────── */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay clickable"
            onClick={(e) => { if (e.target === e.currentTarget) setShowContact(false) }}
            style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '28px 32px', width: '100%', maxWidth: 480, position: 'relative' }}
            >
              <Brackets color={C.green} size={10} />

              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: C.green, marginBottom: 6, letterSpacing: 1 }}>
                COMPOSE MESSAGE
              </div>
              <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.dimmer, marginBottom: 24, letterSpacing: 1 }}>
                DIRECT LINE TO: mark@markjp.dev
              </div>

              <ContactForm onClose={() => setShowContact(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Contact Form ────────────────────────────────────────────────
function ContactForm({ onClose }) {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const inputStyle = {
    width: '100%', background: '#071020',
    border: `1px solid ${C.border}`, borderRadius: 4,
    padding: '10px 14px', color: '#e6eef6',
    fontFamily: 'VT323, monospace', fontSize: 17,
    outline: 'none', transition: 'border-color 0.2s',
    marginBottom: 14,
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    // Opens mailto as fallback — replace with EmailJS in Round 3
    const subject = encodeURIComponent(`Message from ${fields.name}`)
    const body = encodeURIComponent(`From: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`)
    window.open(`mailto:mark@markjp.dev?subject=${subject}&body=${body}`)
    setTimeout(() => { setStatus('sent') }, 500)
  }

  if (status === 'sent') {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: C.green, marginBottom: 8 }}>MESSAGE SENT!</div>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: C.dim, marginBottom: 20 }}>Your mail app should have opened. Talk soon!</div>
        <button className="ghost clickable" onClick={onClose} style={{ fontSize: 16 }}>CLOSE</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.dimmer, letterSpacing: 1, marginBottom: 4 }}>NAME</div>
      <input style={inputStyle} placeholder="Your name..." value={fields.name}
        onChange={e => setFields(f => ({ ...f, name: e.target.value }))} required
        onFocus={e => e.target.style.borderColor = C.green}
        onBlur={e => e.target.style.borderColor = C.border} />

      <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.dimmer, letterSpacing: 1, marginBottom: 4 }}>EMAIL</div>
      <input style={inputStyle} type="email" placeholder="your@email.com" value={fields.email}
        onChange={e => setFields(f => ({ ...f, email: e.target.value }))} required
        onFocus={e => e.target.style.borderColor = C.green}
        onBlur={e => e.target.style.borderColor = C.border} />

      <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.dimmer, letterSpacing: 1, marginBottom: 4 }}>MESSAGE</div>
      <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical', marginBottom: 20 }}
        placeholder="Type your message..." value={fields.message}
        onChange={e => setFields(f => ({ ...f, message: e.target.value }))} required
        onFocus={e => e.target.style.borderColor = C.green}
        onBlur={e => e.target.style.borderColor = C.border} />

      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="cta clickable" style={{ flex: 1 }}>
          {status === 'sending' ? 'SENDING...' : 'TRANSMIT ▶'}
        </button>
        <button type="button" className="ghost clickable" onClick={onClose} style={{ fontSize: 16 }}>
          CANCEL
        </button>
      </div>
    </form>
  )
}
