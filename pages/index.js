import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

// ═══════════════════════════════════════════════════════
//  MARK JP — Portfolio v3.0
//  Theme: RPG World — every element tells your story
// ═══════════════════════════════════════════════════════

const C = {
  bg:     '#050D14',
  card:   '#0A1628',
  border: '#1a2f4a',
  green:  '#00E5A5',
  cyan:   '#00C8FF',
  gold:   '#FFD97D',
  red:    '#FF6B6B',
  text:   '#c8e0f0',
  dim:    'rgba(200,224,240,0.5)',
  dimmer: 'rgba(200,224,240,0.3)',
}

const YEARS_EXP = new Date().getFullYear() - 2014

const SKILL_TIERS = [
  {
    tier: 'MASTER',
    color: C.green,
    icon: '⬡',
    skills: ['System Analysis', 'Clinical SaaS Ops', 'API Integration', 'Federated Auth / SSO'],
  },
  {
    tier: 'EXPERT',
    color: C.cyan,
    icon: '⬢',
    skills: ['SQL / Databases', 'REST & SOAP APIs', 'UAT & QA', 'Technical Support'],
  },
  {
    tier: 'JOURNEYMAN',
    color: C.gold,
    icon: '◈',
    skills: ['Python', 'Linux CLI', 'Docker', 'Git'],
  },
  {
    tier: 'APPRENTICE',
    color: '#aaaaaa',
    icon: '◇',
    skills: ['Go', 'Kubernetes', 'Next.js', 'Backend Dev'],
  },
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
  { name: 'Veeva',      color: C.green,   bg: '#00E5A522', symbol: '💊' },
  { name: 'Medidata',   color: C.cyan,    bg: '#00C8FF22', symbol: '🧬' },
  { name: 'SAML/SSO',  color: C.gold,    bg: '#FFD97D22', symbol: '🔐' },
  { name: 'REST APIs',  color: '#61DAFB', bg: '#61DAFB22', symbol: '🔌' },
]

const QUESTS = [
  {
    id: 'Q001',
    title: 'IoT Flood Monitoring System',
    status: 'COMPLETED',
    statusColor: C.green,
    desc: 'Designed and built an end-to-end IoT flood monitoring system for my thesis — real-time sensor data ingestion, alert pipelines, and a monitoring dashboard. Awarded Thesis Finalist for Best Thesis.',
    tech: ['IoT', 'Sensors', 'Real-time Data', 'Embedded Systems'],
    xp: '+1200 XP',
    reward: 'Thesis Finalist Award',
    locked: false,
  },
  {
    id: 'Q002',
    title: 'markjp.dev — Portfolio Rebuild',
    status: 'IN PROGRESS',
    statusColor: C.gold,
    desc: 'Total redesign of personal portfolio from a generic dark site to a full RPG gaming aesthetic. Custom boot animation, skill tiers, quest log, tech inventory, and gamified layout built with Next.js and Framer Motion.',
    tech: ['Next.js', 'Framer Motion', 'CSS', 'Netlify'],
    xp: '+600 XP',
    reward: 'Unique Portfolio',
    locked: false,
  },
  {
    id: 'Q003',
    title: '??? — Godot Game Project',
    status: 'UPCOMING',
    statusColor: C.dimmer,
    desc: 'First game development project using Godot Engine. Open source, GDScript-powered. Details unlocked soon.',
    tech: ['Godot', 'GDScript', 'Game Dev'],
    xp: '+??? XP',
    reward: '???',
    locked: true,
  },
]

const ACHIEVEMENTS = [
  { icon: '🏆', label: 'Thesis Finalist', desc: 'Best Thesis Award Finalist — IoT Flood Monitor' },
  { icon: '🏥', label: 'Clinical SaaS',   desc: '3+ years managing Veeva, Medidata & Chameleon in regulated environments' },
  { icon: '🔐', label: 'SSO Wrangler',    desc: 'Solved complex federated auth issues across healthcare portals' },
  { icon: '🔌', label: 'API Veteran',     desc: '10+ years working with REST, SOAP and enterprise API integrations' },
  { icon: '📡', label: 'IoT Builder',     desc: 'Built a real IoT system from sensors to dashboard' },
  { icon: '⚔️', label: 'Career Changer', desc: 'Actively transitioning from support to backend engineering' },
]

// ── Typewriter ──────────────────────────────────────────
function useTypewriter(words, speed = 85, pause = 1800) {
  const [display, setDisplay] = useState('')
  const [wi, setWi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)

  useEffect(() => {
    const word = words[wi % words.length]
    let t
    if (!del && ci <= word.length) {
      setDisplay(word.slice(0, ci))
      t = setTimeout(() => setCi(c => c + 1), speed)
    } else if (!del && ci > word.length) {
      t = setTimeout(() => setDel(true), pause)
    } else if (del && ci >= 0) {
      setDisplay(word.slice(0, ci))
      t = setTimeout(() => setCi(c => c - 1), speed / 2)
    } else {
      setDel(false)
      setWi(i => (i + 1) % words.length)
    }
    return () => clearTimeout(t)
  }, [ci, del, wi, words, speed, pause])

  return display
}

// ── Star Field ──────────────────────────────────────────
function StarField() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.3 + 0.2,
      a: Math.random(),
      s: Math.random() * 0.005 + 0.001,
      d: (Math.random() - 0.5) * 0.1,
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
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(160,210,255,${s.a * 0.75})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} aria-hidden style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

// ── Boot Screen ─────────────────────────────────────────
function BootScreen({ onDone }) {
  const [step, setStep] = useState(0)
  const lines = [
    '> INITIALIZING MARKJP.DEV...',
    '> LOADING CHARACTER DATA...',
    '> MOUNTING SKILL TREE...',
    '> CALIBRATING QUEST LOG...',
    '> SYSTEM READY.',
  ]
  useEffect(() => {
    if (step < lines.length) {
      const t = setTimeout(() => setStep(s => s + 1), step === lines.length - 1 ? 600 : 380)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(onDone, 400)
      return () => clearTimeout(t)
    }
  }, [step])

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: C.bg,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'VT323', monospace",
      }}
    >
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 28, color: C.green,
        textShadow: `0 0 30px ${C.green}, 0 0 60px ${C.green}55`,
        marginBottom: 40, letterSpacing: 4,
      }}>MJP</div>

      <div style={{ width: 360, textAlign: 'left' }}>
        {lines.slice(0, step).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: 16, letterSpacing: 1, marginBottom: 8, color: i === step - 1 ? C.green : C.dim }}
          >
            {line}{i === step - 1 && <span style={{ animation: 'blink 1s step-end infinite' }}>_</span>}
          </motion.div>
        ))}
      </div>

      <div style={{ width: 360, height: 4, background: '#0e1e30', borderRadius: 2, marginTop: 24, border: `1px solid ${C.border}` }}>
        <motion.div
          animate={{ width: `${(step / lines.length) * 100}%` }}
          transition={{ duration: 0.3 }}
          style={{ height: '100%', background: C.green, boxShadow: `0 0 8px ${C.green}`, borderRadius: 2 }}
        />
      </div>
    </motion.div>
  )
}

// ── Brackets ────────────────────────────────────────────
function Brackets({ color = C.green, size = 10 }) {
  const base = { position: 'absolute', width: size, height: size, borderColor: `${color}55` }
  return (
    <>
      <div style={{ ...base, top: 6, left: 6,   borderTop: '2px solid', borderLeft:  '2px solid' }} />
      <div style={{ ...base, top: 6, right: 6,  borderTop: '2px solid', borderRight: '2px solid' }} />
      <div style={{ ...base, bottom: 6, left: 6,  borderBottom: '2px solid', borderLeft:  '2px solid' }} />
      <div style={{ ...base, bottom: 6, right: 6, borderBottom: '2px solid', borderRight: '2px solid' }} />
    </>
  )
}

// ── Section Header ───────────────────────────────────────
function SectionHeader({ title, color = C.green, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: 28 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 11, color, letterSpacing: 1 }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}44, transparent)` }} />
      </div>
      {sub && <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.dimmer, letterSpacing: 1 }}>{sub}</div>}
    </motion.div>
  )
}

// ── Quest Card ───────────────────────────────────────────
function QuestCard({ q, i }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      onClick={() => !q.locked && setOpen(o => !o)}
      style={{
        background: q.locked ? `${C.card}66` : C.card,
        border: `1px solid ${q.locked ? C.border : q.statusColor + '44'}`,
        borderLeft: `3px solid ${q.statusColor}`,
        borderRadius: 6, padding: '16px 18px',
        cursor: q.locked ? 'default' : 'pointer',
        opacity: q.locked ? 0.55 : 1,
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => { if (!q.locked) e.currentTarget.style.background = `${C.card}dd` }}
      onMouseLeave={e => { e.currentTarget.style.background = q.locked ? `${C.card}66` : C.card }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: C.dimmer, letterSpacing: 2 }}>{q.id}</span>
          <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: q.statusColor, border: `1px solid ${q.statusColor}44`, padding: '1px 7px', borderRadius: 3 }}>
            {q.status}
          </span>
        </div>
        <span style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.gold }}>{q.xp}</span>
      </div>

      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#e6eef6', marginBottom: 8, lineHeight: 1.7 }}>
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
            <div style={{ fontFamily: 'VT323, monospace', fontSize: 15, color: C.dim, lineHeight: 1.7, marginBottom: 10 }}>
              {q.desc}
            </div>
            {q.reward && (
              <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.gold, marginBottom: 10 }}>
                🏆 REWARD: {q.reward}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!open && !q.locked && (
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 15, color: C.dim, lineHeight: 1.7 }}>
          {q.desc.slice(0, 90)}...{' '}
          <span style={{ color: C.green }}>[ tap to expand ]</span>
        </div>
      )}

      {q.locked && (
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 15, color: C.dimmer }}>
          {q.desc}
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
        {q.tech.map(t => (
          <span key={t} style={{
            fontFamily: 'VT323, monospace', fontSize: 13,
            color: C.cyan, background: `${C.cyan}10`,
            border: `1px solid ${C.cyan}30`,
            padding: '1px 8px', borderRadius: 3,
          }}>{t}</span>
        ))}
      </div>
    </motion.div>
  )
}

// ── Main ────────────────────────────────────────────────
export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [booted, setBooted] = useState(false)
  const [hoveredAch, setHoveredAch] = useState(null)

  const typed = useTypewriter([
    'Business Analyst',
    'Application Support Engineer',
    'Clinical Systems Specialist',
    'Backend Engineer (leveling up)',
    'Problem Solver',
  ])

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const LEVEL = YEARS_EXP
  const XP = 7240
  const NEXT_XP = 10000

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
        a { text-decoration: none; color: inherit; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }

        @keyframes blink       { 0%,100%{opacity:1}   50%{opacity:0} }
        @keyframes float       { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-7px)} }
        @keyframes glowPulse   { 0%,100%{box-shadow:0 0 10px ${C.green}33} 50%{box-shadow:0 0 24px ${C.green}77} }
        @keyframes gridScroll  { 0%{background-position:0 0} 100%{background-position:40px 40px} }
        @keyframes scanline    { 0%{transform:translateY(0)} 100%{transform:translateY(4px)} }

        .cta {
          background: ${C.green}; color: #021014;
          font-family: 'Press Start 2P', monospace; font-size: 9px;
          padding: 13px 22px; border: none; border-radius: 4px; cursor: pointer;
          letter-spacing: 1px; animation: glowPulse 2.5s ease-in-out infinite;
          box-shadow: 4px 4px 0 #009966; transition: all 0.15s;
        }
        .cta:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #009966; }
        .cta:active { transform: translate(2px,2px); box-shadow: 2px 2px 0 #009966; }

        .ghost {
          background: transparent; border: 1px solid ${C.border};
          color: ${C.dim}; font-family: 'VT323', monospace; font-size: 17px;
          padding: 10px 20px; border-radius: 4px; cursor: pointer;
          letter-spacing: 1px; transition: all 0.2s;
        }
        .ghost:hover { border-color: ${C.cyan}66; color: ${C.cyan}; background: ${C.cyan}0d; }

        .nav-btn {
          background: transparent; border: 1px solid transparent;
          color: ${C.dim}; font-family: 'VT323', monospace; font-size: 16px;
          padding: 6px 14px; border-radius: 4px; cursor: pointer; letter-spacing: 1px;
          transition: all 0.2s;
        }
        .nav-btn:hover { color: ${C.green}; border-color: ${C.green}44; background: ${C.green}0d; text-shadow: 0 0 8px ${C.green}88; }

        .tier-card { transition: transform 0.2s; }
        .tier-card:hover { transform: translateY(-2px); }

        .tech-item { transition: transform 0.2s; }
        .tech-item:hover { transform: scale(1.06); }

        .ach-badge { transition: border-color 0.2s; }
        .ach-badge:hover { border-color: ${C.gold} !important; }

        .contact-link {
          display: flex; align-items: center; gap: 14px;
          background: ${C.card}; border: 1px solid ${C.border};
          border-radius: 6px; padding: 14px 18px; transition: all 0.2s;
        }
        .contact-link:hover { background: ${C.card}ee; }

        @media (max-width: 768px) {
          .hero-grid     { grid-template-columns: 1fr !important; }
          .skills-grid   { grid-template-columns: 1fr !important; }
          .contact-grid  { grid-template-columns: 1fr !important; }
          .char-card     { display: none !important; }
          .header-xp     { display: none !important; }
          .header-nav    { gap: 2px !important; }
          .nav-btn       { padding: 5px 8px !important; font-size: 13px !important; }
        }
      `}} />

      {/* Scanlines */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 999, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px)',
        animation: 'scanline 0.08s linear infinite',
      }} />

      {/* Stars */}
      <StarField />

      {/* Grid */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${C.green}08 1px, transparent 1px), linear-gradient(90deg, ${C.green}08 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        animation: 'gridScroll 10s linear infinite',
      }} />

      {/* Boot screen */}
      <AnimatePresence>
        {!booted && <BootScreen onDone={() => setBooted(true)} />}
      </AnimatePresence>

      <div style={{ minHeight: '100vh', fontFamily: "'VT323', monospace", position: 'relative', zIndex: 10, overflowX: 'hidden' }}>

        {/* ── HEADER ──────────────────────────────────── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: `${C.bg}ee`, backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36,
                background: `linear-gradient(135deg, ${C.green}, ${C.cyan})`,
                borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: '#021014',
                boxShadow: `0 0 14px ${C.green}44`,
              }}>MJP</div>
              <div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: '#e6eef6' }}>MARK JP</div>
                <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.gold, letterSpacing: 1 }}>LVL {LEVEL} · ENGINEER</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* XP bar */}
              <div className="header-xp" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: C.gold }}>XP</span>
                <div style={{ width: 90, height: 6, background: '#0e1e30', borderRadius: 2, border: `1px solid ${C.border}` }}>
                  <div style={{ width: `${(XP / NEXT_XP) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.gold}99, ${C.gold})`, boxShadow: `0 0 6px ${C.gold}88`, borderRadius: 2 }} />
                </div>
                <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: C.dimmer }}>{XP}/{NEXT_XP}</span>
              </div>

              <nav className="header-nav" style={{ display: 'flex', gap: 2 }}>
                {[['HOME','hero'],['SKILLS','skills'],['QUESTS','quests'],['CONTACT','contact']].map(([label, id]) => (
                  <button key={id} className="nav-btn"
                    onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}>
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

          {/* ── HERO ──────────────────────────────────── */}
          <section id="hero" style={{ paddingTop: 72, paddingBottom: 64 }}>
            <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40, alignItems: 'center' }}>

              {/* Left */}
              <div>
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', display: 'inline-block', background: C.green, boxShadow: `0 0 8px ${C.green}, 0 0 16px ${C.green}`, animation: 'glowPulse 2s infinite' }} />
                  <span style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.green, letterSpacing: 2 }}>ONLINE · OPEN TO OPPORTUNITIES</span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(22px, 4vw, 38px)', lineHeight: 1.5, marginBottom: 20, color: '#e6eef6' }}>
                  HI, I'M{' '}
                  <span style={{ color: C.green, textShadow: `0 0 20px ${C.green}66, 0 0 40px ${C.green}33` }}>MARK.</span>
                </motion.h1>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  style={{ fontFamily: 'VT323, monospace', fontSize: 22, marginBottom: 24, color: C.cyan, letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <span style={{ color: C.dimmer }}>&gt; </span>
                  <span>{typed}</span>
                  <span style={{ animation: 'blink 1s step-end infinite', color: C.cyan }}>_</span>
                </motion.div>

                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  style={{ fontFamily: 'Silkscreen, monospace', fontSize: 13, lineHeight: 1.85, marginBottom: 32, color: C.dim, maxWidth: 540 }}>
                  {YEARS_EXP}+ years turning complex systems into solutions — from clinical trial platforms to IoT hardware.{' '}
                  <span style={{ color: C.green }}>Now expanding into backend engineering</span>{' '}
                  because understanding the full stack makes you a better engineer at every layer.
                </motion.p>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                  style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="cta" onClick={() => document.getElementById('quests')?.scrollIntoView({ behavior: 'smooth' })}>
                    VIEW QUEST LOG
                  </button>
                  <button className="ghost" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                    SEND MESSAGE
                  </button>
                  <a href="https://github.com/markjpdev" target="_blank" rel="noreferrer">
                    <button className="ghost">GITHUB</button>
                  </a>
                </motion.div>
              </div>

              {/* Character Card */}
              <motion.div className="char-card" style={{ animation: 'float 4s ease-in-out infinite' }}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 20, position: 'relative', overflow: 'hidden', boxShadow: `0 0 40px rgba(0,229,165,0.06), 0 20px 60px rgba(0,0,0,0.5)` }}>
                  <Brackets />

                  {/* Avatar */}
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <div style={{
                      width: 72, height: 72, margin: '0 auto 10px',
                      background: `linear-gradient(135deg, ${C.green}22, ${C.cyan}22)`,
                      border: `2px solid ${C.green}66`, borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Press Start 2P', monospace", fontSize: 11, color: C.green,
                      boxShadow: `0 0 20px ${C.green}22`,
                    }}>MJP</div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: '#e6eef6' }}>MARK JP</div>
                    <div style={{ fontFamily: 'VT323, monospace', fontSize: 15, color: C.gold, marginTop: 3 }}>★ LEVEL {LEVEL} · {YEARS_EXP} YRS EXP ★</div>
                  </div>

                  {/* Info */}
                  <div style={{ background: '#071020', border: `1px solid ${C.border}`, borderRadius: 4, padding: '8px 12px', marginBottom: 12, fontFamily: 'VT323, monospace', fontSize: 14 }}>
                    {[
                      ['CLASS', C.cyan, 'Engineer / Analyst Hybrid'],
                      ['GUILD', '#e6eef6', 'Clinical Systems · Backend Dev'],
                      ['LOCATION', '#e6eef6', 'Quezon City, PH 🇵🇭'],
                    ].map(([lbl, col, val]) => (
                      <div key={lbl} style={{ marginBottom: 6 }}>
                        <div style={{ color: C.dimmer, fontSize: 12, letterSpacing: 1, marginBottom: 2 }}>{lbl}</div>
                        <div style={{ color: col }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* XP bar */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: C.gold, letterSpacing: 1 }}>XP TO NEXT LEVEL</span>
                      <span style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: C.gold }}>{XP}/{NEXT_XP}</span>
                    </div>
                    <div style={{ height: 7, background: '#0e1e30', borderRadius: 2, border: `1px solid ${C.border}` }}>
                      <div style={{ width: `${(XP / NEXT_XP) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.gold}99, ${C.gold})`, boxShadow: `0 0 6px ${C.gold}66`, borderRadius: 2 }} />
                    </div>
                    <div style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: C.dimmer, marginTop: 3 }}>GOAL: Backend Engineer</div>
                  </div>

                  {/* Achievements */}
                  <div style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: C.dimmer, letterSpacing: 1, marginBottom: 8 }}>
                    ACHIEVEMENTS ({ACHIEVEMENTS.length}/{ACHIEVEMENTS.length})
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {ACHIEVEMENTS.map((a, i) => (
                      <div key={a.label} className="ach-badge"
                        onMouseEnter={() => setHoveredAch(i)}
                        onMouseLeave={() => setHoveredAch(null)}
                        style={{ width: 36, height: 36, background: '#071020', border: `1px solid ${C.border}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'default', position: 'relative' }}>
                        {a.icon}
                        {hoveredAch === i && (
                          <div style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', background: '#0d1f33', border: `1px solid ${C.gold}44`, borderRadius: 4, padding: '6px 10px', fontFamily: 'VT323, monospace', fontSize: 12, color: C.gold, zIndex: 99, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', minWidth: 160, textAlign: 'center' }}>
                            <div style={{ color: '#e6eef6', marginBottom: 2 }}>{a.label}</div>
                            <div style={{ color: C.dimmer }}>{a.desc}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <div aria-hidden style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`, marginBottom: 64 }} />

          {/* ── SKILLS ────────────────────────────────── */}
          <section id="skills" style={{ paddingBottom: 64 }}>
            <SectionHeader title="CHARACTER STATS" color={C.cyan} sub={`SKILL TIERS · BASED ON ${YEARS_EXP}+ YEARS OF FIELD EXPERIENCE`} />

            <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }}>
              {SKILL_TIERS.map((tier, i) => (
                <motion.div key={tier.tier} className="tier-card"
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderTop: `2px solid ${tier.color}`, borderRadius: 6, padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
                  <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: `linear-gradient(180deg, ${tier.color}08, transparent)`, pointerEvents: 'none' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 18, color: tier.color, filter: `drop-shadow(0 0 4px ${tier.color})` }}>{tier.icon}</span>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: tier.color }}>{tier.tier}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {tier.skills.map(skill => (
                      <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: tier.color, flexShrink: 0 }} />
                        <span style={{ fontFamily: 'VT323, monospace', fontSize: 16, color: '#e6eef6', letterSpacing: 0.5 }}>{skill}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <SectionHeader title="TECH INVENTORY" color={C.green} sub="TOOLS & TECHNOLOGIES IN THE ARSENAL" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(85px, 1fr))', gap: 10 }}>
              {TECH.map((t, i) => (
                <motion.div key={t.name} className="tech-item"
                  initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  style={{ background: t.bg, border: `1px solid ${t.color}44`, borderRadius: 6, padding: '12px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{t.symbol}</div>
                  <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: t.color, letterSpacing: 0.5, lineHeight: 1.2 }}>{t.name}</div>
                </motion.div>
              ))}
            </div>
          </section>

          <div aria-hidden style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`, marginBottom: 64 }} />

          {/* ── QUEST LOG ─────────────────────────────── */}
          <section id="quests" style={{ paddingBottom: 64 }}>
            <SectionHeader title="QUEST LOG" color={C.gold} sub="PROJECTS · MISSIONS · CLICK CARD TO EXPAND" />
            <div style={{ display: 'grid', gap: 12 }}>
              {QUESTS.map((q, i) => <QuestCard key={q.id} q={q} i={i} />)}
            </div>
          </section>

          <div aria-hidden style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`, marginBottom: 64 }} />

          {/* ── CONTACT ───────────────────────────────── */}
          <section id="contact" style={{ paddingBottom: 80 }}>
            <SectionHeader title="SEND TRANSMISSION" color={C.green} sub="OPEN FOR COLLABORATION · JOB OPPORTUNITIES · TECH CHAT" />

            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ background: '#030a10', border: `1px solid ${C.border}`, borderRadius: 6, padding: '16px 20px', marginBottom: 20, fontFamily: 'VT323, monospace', fontSize: 15, color: C.dim }}>
              <div style={{ color: C.dimmer, marginBottom: 6, fontSize: 12, letterSpacing: 1 }}>TERMINAL v1.0</div>
              <div><span style={{ color: C.green }}>$</span> whoami</div>
              <div style={{ color: '#e6eef6', marginLeft: 12, marginBottom: 6 }}>mark_jp — engineer, builder, problem solver</div>
              <div><span style={{ color: C.green }}>$</span> status</div>
              <div style={{ color: C.gold, marginLeft: 12, marginBottom: 6 }}>AVAILABLE · Open to backend / full-stack roles</div>
              <div><span style={{ color: C.green }}>$</span> contact --list</div>
              <div style={{ color: C.dim, marginLeft: 12 }}>Initiating contact channels...<span style={{ animation: 'blink 1s step-end infinite' }}>_</span></div>
            </motion.div>

            <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: '📧', label: 'EMAIL',    value: 'mark@markjp.dev',               href: 'mailto:mark@markjp.dev',                         color: C.green },
                { icon: '🐙', label: 'GITHUB',   value: 'github.com/markjpdev',          href: 'https://github.com/markjpdev',                   color: C.cyan  },
                { icon: '💼', label: 'LINKEDIN', value: 'in/jaysonpunsalan',             href: 'https://linkedin.com/in/jaysonpunsalan',          color: C.cyan  },
                { icon: '🌐', label: 'WEBSITE',  value: 'markjp.dev',                    href: 'https://markjp.dev',                             color: C.green },
              ].map((item, i) => (
                <motion.a key={item.label} href={item.href}
                  target={item.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                  className="contact-link"
                  initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.background = `${item.color}0a` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card }}>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'VT323, monospace', fontSize: 12, color: C.dimmer, letterSpacing: 1 }}>{item.label}</div>
                    <div style={{ fontFamily: 'Silkscreen, monospace', fontSize: 12, color: item.color }}>{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </section>

        </main>

        {/* ── FOOTER ──────────────────────────────────── */}
        <footer style={{ borderTop: `1px solid ${C.border}`, padding: '20px 24px', textAlign: 'center', background: `${C.bg}cc` }}>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: C.dimmer, letterSpacing: 1 }}>
            © {new Date().getFullYear()} MARK JP · BUILT WITH NEXT.JS + FRAMER MOTION · v3.0.0
          </div>
          <div style={{ fontFamily: 'VT323, monospace', fontSize: 13, color: `${C.dimmer}88`, marginTop: 4, letterSpacing: 1 }}>
            PRESS START TO CONTINUE_
          </div>
        </footer>

      </div>
    </>
  )
}
