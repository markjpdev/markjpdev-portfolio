import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef, useCallback } from 'react'

// ─────────────────────────────────────────────────────────
//  MARK JP — Portfolio v9.0
//  Cool. Precise. No decoration that doesn't earn its place.
// ─────────────────────────────────────────────────────────

const YEARS = new Date().getFullYear() - 2014

const C = {
  bg:        '#0D0E12',
  bgCard:    '#13141A',
  bgHover:   '#181920',
  surface:   '#1C1D24',
  line:      'rgba(255,255,255,0.07)',
  lineHover: 'rgba(255,255,255,0.14)',
  text:      '#E2E4EC',
  textDim:   'rgba(226,228,236,0.48)',
  textMute:  'rgba(226,228,236,0.26)',
  accent:    '#5B8DEF',
  accentDim: 'rgba(91,141,239,0.12)',
  accentGlow:'rgba(91,141,239,0.25)',
  white:     '#F4F5F8',
  green:     '#4ACA8B',
  amber:     '#E8A830',
}

// ─────────────────────────────────────────────────────────
//  PHASE 1 — INTRO
//  Precise. No drama. Just the name arriving with intent.
// ─────────────────────────────────────────────────────────
function Intro({ onDone }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const ts = [
      [300,  () => setStep(1)],
      [900,  () => setStep(2)],
      [1700, () => setStep(3)],
      [2600, () => setStep(4)],
      [3600, () => onDone()],
    ]
    const timers = ts.map(([t, fn]) => setTimeout(fn, t))
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: C.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Precise grid lines — the engineering aesthetic */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 100%)',
      }} />

      <div style={{ position: 'relative', textAlign: 'center' }}>

        {/* Loading bar */}
        <div style={{ width: 200, height: 1, background: C.line, marginBottom: 48, margin: '0 auto 48px' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: step >= 1 ? '100%' : 0 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', background: C.accent }}
          />
        </div>

        {/* Name */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(48px, 8vw, 88px)',
                color: C.white,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginBottom: 16,
              }}>
                Mark JP
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Label */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: C.accent,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Engineer · Analyst · Builder
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Version tag */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute', bottom: 32, right: 40,
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, color: C.textMute, letterSpacing: '0.1em',
            }}
          >
            v9.0.0
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  PHASE 2 — TITLE SCREEN
//  Still. Confident. Waiting.
// ─────────────────────────────────────────────────────────
function TitleScreen({ onEnter }) {
  const [ready, setReady] = useState(false)
  const [entering, setEntering] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400)
    return () => clearTimeout(t)
  }, [])

  const handleEnter = useCallback(() => {
    if (entering) return
    setEntering(true)
    setTimeout(onEnter, 500)
  }, [entering, onEnter])

  useEffect(() => {
    if (!ready) return
    const h = e => {
      if (!['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) handleEnter()
    }
    window.addEventListener('keydown', h, { once: true })
    return () => window.removeEventListener('keydown', h)
  }, [ready, handleEnter])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={ready ? handleEnter : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 900,
        background: C.bg, cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Grid */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
      }} />

      {/* Accent dot — top left corner for visual anchoring */}
      <div style={{ position: 'absolute', top: 40, left: 48, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 6, height: 6, background: C.accent, borderRadius: '50%' }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.12em' }}>MARKJP.DEV</span>
      </div>

      {/* Main content */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(60px, 10vw, 120px)',
            color: C.white,
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            marginBottom: 32,
          }}>
            Mark JP
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            width: 1, height: 48,
            background: `linear-gradient(to bottom, ${C.accent}, transparent)`,
            margin: '0 auto 32px',
          }}
        />

        {/* Press any key */}
        <AnimatePresence>
          {ready && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0.2, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: C.textMute,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Press any key to continue
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom info row */}
      <div style={{
        position: 'absolute', bottom: 32, left: 0, right: 0,
        padding: '0 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.1em' }}>
          Quezon City, PH
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.1em' }}>
          © {new Date().getFullYear()}
        </span>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  TRANSITION — Clean wipe, no drama
// ─────────────────────────────────────────────────────────
function Transition({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 900)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, zIndex: 950, pointerEvents: 'none' }}
    >
      <motion.div
        initial={{ scaleY: 0, transformOrigin: 'top' }}
        animate={{ scaleY: [0, 1, 1, 0] }}
        transition={{ duration: 0.9, times: [0, 0.4, 0.6, 1], ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0, background: C.accent, transformOrigin: 'top' }}
      />
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  NAV — Top bar, clean
// ─────────────────────────────────────────────────────────
function TopBar({ currentSection, onNavigate }) {
  const SECTIONS = ['about', 'skills', 'projects', 'contact']

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(24px, 5vw, 64px)',
        background: 'rgba(13,14,18,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      {/* Logo */}
      <button
        onClick={() => onNavigate('home')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: 0 }}
      >
        <div style={{
          width: 26, height: 26,
          border: `1px solid ${C.accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: C.accent, fontWeight: 800 }}>M</span>
        </div>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: C.text, fontWeight: 700, letterSpacing: '-0.01em' }}>
          markjp.dev
        </span>
      </button>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {SECTIONS.map(s => {
          const active = currentSection === s
          return (
            <button key={s} onClick={() => onNavigate(s)}
              style={{
                background: active ? C.accentDim : 'none',
                border: 'none', cursor: 'pointer',
                fontFamily: "'DM Mono', monospace",
                fontSize: 11, color: active ? C.accent : C.textMute,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '6px 14px',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { if (!active) e.currentTarget.style.color = C.textDim }}
              onMouseOut={e => { if (!active) e.currentTarget.style.color = C.textMute }}
            >{s}</button>
          )
        })}
        <div style={{ width: 1, height: 16, background: C.line, margin: '0 8px' }} />
        <a href="mailto:mark@markjp.dev"
          style={{
            fontFamily: "'DM Mono', monospace", fontSize: 11,
            color: C.accent, letterSpacing: '0.08em',
            textDecoration: 'none', padding: '6px 14px',
            border: `1px solid ${C.accent}22`,
            transition: 'all 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.background = C.accentDim; e.currentTarget.style.borderColor = C.accent + '55' }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.accent + '22' }}
        >hire</a>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  HOME SCREEN — Full viewport, left-weighted
// ─────────────────────────────────────────────────────────
function HomeScreen({ onNavigate }) {
  const roles = ['Business Analyst', 'App Support Engineer', 'Clinical Systems Specialist', 'Backend Engineer']
  const [roleIdx, setRoleIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % roles.length), 3000)
    return () => clearInterval(t)
  }, [])

  const NAV = [
    { id: 'about',    label: 'About',    sub: 'Background & Story',      num: '01' },
    { id: 'skills',   label: 'Skills',   sub: 'Stack & Expertise',       num: '02' },
    { id: 'projects', label: 'Projects', sub: 'Work & Builds',           num: '03' },
    { id: 'contact',  label: 'Contact',  sub: 'Let\'s Talk',             num: '04' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'fixed', inset: 0, background: C.bg, display: 'flex' }}
    >
      {/* Grid background */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 15% 50%, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 15% 50%, black 0%, transparent 70%)',
      }} />

      {/* Accent glow — very subtle */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 50% 40% at 10% 50%, rgba(91,141,239,0.05) 0%, transparent 70%)',
      }} />

      {/* LEFT — Identity */}
      <div style={{
        width: 'clamp(300px, 46%, 580px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '80px clamp(24px, 5vw, 64px)',
        position: 'relative', zIndex: 2,
        borderRight: `1px solid ${C.line}`,
      }}>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.green, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Available · Open to Work
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(40px, 5.5vw, 72px)',
            color: C.white, fontWeight: 800,
            lineHeight: 1.05, letterSpacing: '-0.03em',
            marginBottom: 20,
          }}
        >
          Mark JP
        </motion.h1>

        {/* Animated role */}
        <div style={{ height: 28, overflow: 'hidden', marginBottom: 28 }}>
          <AnimatePresence mode="wait">
            <motion.div key={roleIdx}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 'clamp(11px, 1.2vw, 13px)',
                color: C.accent,
                letterSpacing: '0.08em',
              }}
            >
              {roles[roleIdx]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6, transformOrigin: 'left', ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 40, height: 1, background: C.accent, marginBottom: 28 }}
        />

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(13px, 1.3vw, 15px)',
            color: C.textDim, lineHeight: 1.85,
            marginBottom: 40, maxWidth: 420,
          }}
        >
          {YEARS}+ years in clinical systems and enterprise integrations.
          Now building toward backend engineering — Python, Go, Docker, Kubernetes.
          <span style={{ color: C.text }}> The support engineer who learned to read the source.</span>
        </motion.p>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          style={{ display: 'flex', gap: 32, marginBottom: 44 }}
        >
          {[
            { v: `${YEARS}+`, l: 'Years' },
            { v: '8+',        l: 'Platforms' },
            { v: '100K+',     l: 'Target Salary' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, color: C.white, fontWeight: 800, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.textMute, letterSpacing: '0.1em', marginTop: 4, textTransform: 'uppercase' }}>{s.l}</div>
            </div>
          ))}
        </motion.div>

        {/* Social row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          style={{ display: 'flex', gap: 20 }}
        >
          {[
            { label: 'GitHub',   href: 'https://github.com/markjpdev' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/jaysonpunsalan' },
            { label: 'Email',    href: 'mailto:mark@markjp.dev' },
          ].map(s => (
            <a key={s.label} href={s.href}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
              style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10,
                color: C.textMute, textDecoration: 'none',
                letterSpacing: '0.1em', transition: 'color 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.color = C.accent}
              onMouseOut={e => e.currentTarget.style.color = C.textMute}
            >{s.label}</a>
          ))}
        </motion.div>
      </div>

      {/* RIGHT — Navigation menu */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '80px clamp(24px, 5vw, 64px)',
        position: 'relative', zIndex: 2,
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ marginBottom: 40 }}
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            Navigate
          </span>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onNavigate(item.id)}
              style={{
                background: 'transparent',
                border: `1px solid ${C.line}`,
                cursor: 'pointer', textAlign: 'left',
                padding: 'clamp(18px, 2.5vw, 26px) clamp(20px, 3vw, 32px)',
                display: 'flex', alignItems: 'center',
                gap: 20, transition: 'all 0.2s',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = C.lineHover
                e.currentTarget.style.background = C.bgCard
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = C.line
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.08em', width: 24, flexShrink: 0 }}>{item.num}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(18px, 2.5vw, 26px)', color: C.white, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.08em' }}>{item.sub}</div>
              </div>
              <span style={{ color: C.accent, fontSize: 18, opacity: 0.6, transition: 'opacity 0.2s' }}>→</span>
            </motion.button>
          ))}
        </div>

        {/* Location / time indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <div style={{ width: 20, height: 1, background: C.line }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.1em' }}>
            Quezon City, PH · UTC+8
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  SECTION SHELL — shared wrapper for all content screens
// ─────────────────────────────────────────────────────────
function ScreenShell({ children, onBack, title, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ position: 'fixed', inset: 0, background: C.bg, overflowY: 'auto', paddingTop: 56 }}
    >
      {/* Section header */}
      <div style={{
        padding: 'clamp(40px, 6vw, 72px) clamp(24px, 6vw, 80px) 0',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.12em' }}>{index}</span>
          <div style={{ width: 1, height: 12, background: C.line }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: C.accent, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>{title}</span>
          <div style={{ flex: 1, maxWidth: 60, height: 1, background: C.line }} />
        </motion.div>
        {children}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  ABOUT SCREEN
// ─────────────────────────────────────────────────────────
function AboutScreen() {
  const XP = 7240, NXP = 10000

  return (
    <ScreenShell title="About" index="01">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: 'clamp(32px, 6vw, 80px)', paddingBottom: 80 }}>
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 3.5vw, 44px)', color: C.white, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 32 }}
          >
            Engineer who learned<br />
            <span style={{ color: C.accent }}>to read the source.</span>
          </motion.h2>

          {[
            `${YEARS}+ years at the intersection of technology and healthcare — managing clinical trial platforms, designing system integrations, and keeping enterprise-grade tools running without incident.`,
            `My background spans Veeva Vault, Medidata Rave, federated SSO/SAML architecture, SQL database management, and API integrations across GxP-regulated environments.`,
            `Now building toward backend engineering — writing Python and Go, containerizing with Docker, learning Kubernetes. Not a career change. The next level.`,
          ].map((text, i) => (
            <motion.p key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.1, duration: 0.5 }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px, 1.4vw, 15px)', color: C.textDim, lineHeight: 1.9, marginBottom: 18 }}
            >{text}</motion.p>
          ))}

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: 36, borderTop: `1px solid ${C.line}`, paddingTop: 28 }}
          >
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>Highlights</div>
            {[
              { icon: '◆', text: 'Best Thesis Finalist — IoT Flood Monitoring System' },
              { icon: '◆', text: 'SAML/SSO federation architecture across enterprise platforms' },
              { icon: '◆', text: '3+ years GxP-regulated clinical trial system support' },
              { icon: '◆', text: 'Cross-platform API integration specialist' },
            ].map((h, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.07 }}
                style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}
              >
                <span style={{ color: C.accent, fontSize: 8, marginTop: 5, flexShrink: 0 }}>{h.icon}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.textDim, lineHeight: 1.6 }}>{h.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right — Status card */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ background: C.bgCard, border: `1px solid ${C.line}`, padding: '28px 24px', marginBottom: 2 }}
          >
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 24 }}>Status</div>
            {[
              { l: 'Name',     v: 'Mark JP' },
              { l: 'Role',     v: 'Engineer / Analyst' },
              { l: 'Location', v: 'Quezon City, PH' },
              { l: 'Status',   v: 'Available', c: C.green },
              { l: 'Focus',    v: 'Backend Eng.', c: C.accent },
            ].map(row => (
              <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.line}` }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.08em' }}>{row.l}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: row.c || C.textDim }}>{row.v}</span>
              </div>
            ))}
          </motion.div>

          {/* XP bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ background: C.bgCard, border: `1px solid ${C.line}`, padding: '20px 24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Progress</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.accent }}>{XP}/{NXP}</span>
            </div>
            <div style={{ height: 2, background: C.line, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(XP / NXP) * 100}%` }}
                transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: '100%', background: C.accent }}
              />
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.textMute, marginTop: 8, letterSpacing: '0.08em' }}>
              Target: Backend Engineer
            </div>
          </motion.div>
        </div>
      </div>
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────
//  SKILLS SCREEN
// ─────────────────────────────────────────────────────────
const SKILL_DATA = [
  { name: 'System Analysis',      level: 95, cat: 'Core' },
  { name: 'Clinical SaaS Ops',    level: 92, cat: 'Core' },
  { name: 'API Integration',      level: 90, cat: 'Core' },
  { name: 'Federated Auth / SSO', level: 88, cat: 'Core' },
  { name: 'SQL & Databases',      level: 78, cat: 'Core' },
  { name: 'Veeva Vault',          level: 92, cat: 'Platforms' },
  { name: 'Medidata Rave',        level: 88, cat: 'Platforms' },
  { name: 'Chameleon / IRT',      level: 80, cat: 'Platforms' },
  { name: 'Python',               level: 52, cat: 'Engineering' },
  { name: 'FastAPI',              level: 45, cat: 'Engineering' },
  { name: 'Docker',               level: 48, cat: 'Engineering' },
  { name: 'Go',                   level: 25, cat: 'Engineering' },
  { name: 'Kubernetes',           level: 22, cat: 'Engineering' },
  { name: 'Linux / CLI',          level: 70, cat: 'Engineering' },
]

const CAT_COLORS = { Core: C.accent, Platforms: '#6BBFEF', Engineering: C.green }

function SkillsScreen() {
  const [active, setActive] = useState('All')
  const cats = ['All', 'Core', 'Platforms', 'Engineering']
  const filtered = active === 'All' ? SKILL_DATA : SKILL_DATA.filter(s => s.cat === active)

  return (
    <ScreenShell title="Skills" index="02">
      <div style={{ paddingBottom: 80 }}>
        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: 2, marginBottom: 36 }}
        >
          {cats.map(c => (
            <button key={c} onClick={() => setActive(c)}
              style={{
                background: active === c ? C.accentDim : 'transparent',
                border: `1px solid ${active === c ? C.accent + '44' : C.line}`,
                cursor: 'pointer', padding: '7px 16px',
                fontFamily: "'DM Mono', monospace", fontSize: 10,
                color: active === c ? C.accent : C.textMute,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
            >{c}</button>
          ))}
        </motion.div>

        {/* Skill bars */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
          >
            {filtered.map((skill, i) => (
              <motion.div key={skill.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                style={{
                  display: 'grid', gridTemplateColumns: '200px 1fr 48px',
                  gap: 24, alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: `1px solid ${C.line}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 3, height: 3, background: CAT_COLORS[skill.cat], borderRadius: '50%', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.textDim }}>{skill.name}</span>
                </div>
                <div style={{ height: 2, background: C.line, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 + 0.2, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', background: CAT_COLORS[skill.cat] }}
                  />
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, textAlign: 'right' }}>{skill.level}%</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Tech tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: 48, borderTop: `1px solid ${C.line}`, paddingTop: 36 }}
        >
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>Also worked with</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Jira', 'Confluence', 'ServiceNow', 'Git', 'Next.js', 'REST APIs', 'SOAP', 'PostgreSQL', 'GxP Compliance', 'UAT', 'SSO/SAML', 'SFTP'].map(tag => (
              <span key={tag} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, border: `1px solid ${C.line}`, padding: '5px 12px', letterSpacing: '0.06em' }}>{tag}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────
//  PROJECTS SCREEN
// ─────────────────────────────────────────────────────────
const PROJECT_DATA = [
  {
    num: '01',
    title: 'IoT Flood Monitoring System',
    status: 'Completed',
    sc: C.green,
    tags: ['IoT', 'Sensors', 'Real-time', 'Embedded Systems'],
    desc: 'End-to-end flood monitoring system for thesis — real-time sensor ingestion, alert pipelines, live monitoring dashboard. Awarded Best Thesis Finalist.',
    link: null, github: null,
  },
  {
    num: '02',
    title: 'markjp.dev',
    status: 'Live',
    sc: C.accent,
    tags: ['Next.js', 'Framer Motion', 'Netlify', 'CSS'],
    desc: 'Personal portfolio designed and built from scratch. Cinematic intro, full-screen sections, scroll-free navigation, deployed via GitHub → Netlify pipeline.',
    link: 'https://markjp.dev', github: null,
  },
  {
    num: '03',
    title: 'Clinical REST API',
    status: 'In Progress',
    sc: '#6BBFEF',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    desc: 'Mock clinical data API built with domain knowledge from years in healthcare SaaS. OpenAPI docs, containerized deployment, structured around real eClinical workflows.',
    link: null, github: null, wip: true,
  },
]

function ProjectsScreen() {
  const [open, setOpen] = useState(null)

  return (
    <ScreenShell title="Projects" index="03">
      <div style={{ paddingBottom: 80 }}>
        {PROJECT_DATA.map((p, i) => (
          <motion.div key={p.num}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            style={{ marginBottom: 2 }}
          >
            <div
              onClick={() => setOpen(open === p.num ? null : p.num)}
              style={{
                background: open === p.num ? C.bgCard : 'transparent',
                border: `1px solid ${open === p.num ? C.lineHover : C.line}`,
                padding: 'clamp(20px, 3vw, 32px)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { if (open !== p.num) e.currentTarget.style.borderColor = C.lineHover }}
              onMouseOut={e => { if (open !== p.num) e.currentTarget.style.borderColor = C.line }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: open === p.num ? 20 : 0 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, width: 24, flexShrink: 0 }}>{p.num}</span>
                <h3 style={{ flex: 1, fontFamily: "'Syne', sans-serif", fontSize: 'clamp(16px, 2vw, 20px)', color: C.white, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>{p.title}</h3>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: p.sc, border: `1px solid ${p.sc}44`, padding: '3px 10px', letterSpacing: '0.08em', flexShrink: 0 }}>{p.status}</span>
                <span style={{ color: C.textMute, fontSize: 12, transform: open === p.num ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>→</span>
              </div>

              <AnimatePresence>
                {open === p.num && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden', paddingLeft: 44 }}
                  >
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.textDim, lineHeight: 1.8, marginBottom: 16, maxWidth: 600 }}>{p.desc}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                      {p.tags.map(t => (
                        <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.textMute, border: `1px solid ${C.line}`, padding: '4px 10px', letterSpacing: '0.06em' }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.accent, textDecoration: 'none', letterSpacing: '0.08em' }}>↗ Visit Site</a>}
                      {p.github && <a href={p.github} target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.accent, textDecoration: 'none', letterSpacing: '0.08em' }}>↗ GitHub</a>}
                      {p.wip && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.08em' }}>Links available on deploy</span>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.textMute, marginTop: 24, letterSpacing: '0.06em' }}
        >
          More projects in progress. GitHub links added on deploy.
        </motion.p>
      </div>
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────
//  CONTACT SCREEN
// ─────────────────────────────────────────────────────────
function ContactScreen() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const submit = e => {
    e.preventDefault()
    window.open(`mailto:mark@markjp.dev?subject=${encodeURIComponent(`Message from ${form.name}`)}&body=${encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`)
    setSent(true)
  }

  const inp = {
    width: '100%', background: C.bgCard,
    border: `1px solid ${C.line}`, padding: '12px 16px',
    fontFamily: "'DM Sans', sans-serif", fontSize: 14,
    color: C.text, outline: 'none',
    transition: 'border-color 0.2s',
  }
  const lbl = {
    fontFamily: "'DM Mono', monospace", fontSize: 10,
    color: C.textMute, letterSpacing: '0.14em',
    textTransform: 'uppercase', display: 'block', marginBottom: 8,
  }

  return (
    <ScreenShell title="Contact" index="04">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'clamp(32px, 6vw, 80px)', paddingBottom: 80 }}>
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(26px, 3vw, 40px)', color: C.white, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 20 }}
          >
            Let's work<br /><span style={{ color: C.accent }}>together.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.textDim, lineHeight: 1.85, marginBottom: 40 }}
          >
            Open to backend engineering roles, clinical systems consulting, and interesting problems at the intersection of tech and healthcare.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {[
              { l: 'Email',    v: 'mark@markjp.dev',             h: 'mailto:mark@markjp.dev' },
              { l: 'GitHub',   v: 'github.com/markjpdev',        h: 'https://github.com/markjpdev' },
              { l: 'LinkedIn', v: 'in/jaysonpunsalan',           h: 'https://linkedin.com/in/jaysonpunsalan' },
            ].map((item, i) => (
              <div key={item.l} style={{ padding: '14px 0', borderBottom: `1px solid ${C.line}` }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: C.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>{item.l}</div>
                <a href={item.h} target={item.h.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: C.textDim, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = C.accent}
                  onMouseOut={e => e.currentTarget.style.color = C.textDim}
                >{item.v}</a>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {sent ? (
            <div style={{ background: C.bgCard, border: `1px solid ${C.line}`, padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, color: C.white, fontWeight: 700, marginBottom: 12 }}>Sent.</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.textDim, lineHeight: 1.7 }}>Your mail client should have opened. I'll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[{ k: 'name', l: 'Name', t: 'text', p: 'Your name' }, { k: 'email', l: 'Email', t: 'email', p: 'your@email.com' }].map(f => (
                <div key={f.k}>
                  <label style={lbl}>{f.l}</label>
                  <input style={inp} type={f.t} placeholder={f.p} value={form[f.k]} required
                    onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = C.line} />
                </div>
              ))}
              <div>
                <label style={lbl}>Message</label>
                <textarea style={{ ...inp, minHeight: 110, resize: 'vertical' }} placeholder="What's on your mind?" value={form.message} required
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = C.line} />
              </div>
              <button type="submit"
                style={{ background: C.accent, border: 'none', padding: '13px 28px', fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.bg, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer', transition: 'opacity 0.2s', textTransform: 'uppercase', alignSelf: 'flex-start' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >Send Message →</button>
            </form>
          )}
        </motion.div>
      </div>
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────
//  ROOT — State machine
//  intro → title → transition → home → [section]
// ─────────────────────────────────────────────────────────
export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState('intro')
  const [section, setSection] = useState(null)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const navigate = id => {
    if (id === 'home') { setSection(null) }
    else { setSection(id) }
  }

  const SCREENS = { about: AboutScreen, skills: SkillsScreen, projects: ProjectsScreen, contact: ContactScreen }
  const ActiveScreen = section ? SCREENS[section] : null

  return (
    <>
      <Head>
        <title>Mark JP — Engineer & Analyst</title>
        <meta name="description" content="Mark JP — Business Analyst, Application Support Engineer, Clinical Systems Specialist. Based in the Philippines." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next { background: ${C.bg}; height: 100%; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        a { color: inherit; }
        button { outline: none; }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.accent}44; }
        ::selection { background: ${C.accentDim}; color: ${C.white}; }

        input::placeholder, textarea::placeholder {
          color: ${C.textMute};
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
        }
      `}} />

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <Intro key="intro" onDone={() => setPhase('title')} />
        )}
        {phase === 'title' && (
          <TitleScreen key="title" onEnter={() => setPhase('transition')} />
        )}
        {phase === 'transition' && (
          <Transition key="transition" onDone={() => setPhase('main')} />
        )}
        {phase === 'main' && (
          <>
            {section && (
              <TopBar key="topbar" currentSection={section} onNavigate={navigate} />
            )}
            <AnimatePresence mode="wait">
              {!section && (
                <HomeScreen key="home" onNavigate={navigate} />
              )}
              {section && ActiveScreen && (
                <ActiveScreen key={section} />
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
