import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'

// ─────────────────────────────────────────────────────────
//  MJP — Portfolio v9.3
//  Cormorant Garamond · Inter · JetBrains Mono
//  One display. One body. One code. No exceptions.
// ─────────────────────────────────────────────────────────

const YEARS = new Date().getFullYear() - 2014
const BAYBAYIN = 'ᜋᜍᜃ᜔ ᜇᜒᜐᜓᜈ᜔ ᜉᜓᜈ᜔ᜐᜎᜈ᜔'

const C = {
  bg:        '#111318',
  bgCard:    '#16181F',
  bgHover:   '#1A1C24',
  line:      'rgba(255,255,255,0.08)',
  lineHover: 'rgba(255,255,255,0.16)',
  text:      '#E8EAF0',
  textDim:   'rgba(232,234,240,0.70)',
  textMute:  'rgba(232,234,240,0.38)',
  accent:    '#5B8DEF',
  accentDim: 'rgba(91,141,239,0.12)',
  white:     '#F5F6FA',
  green:     '#4ACA8B',
  amber:     '#E8A830',
}

const SECTIONS = ['about', 'skills', 'projects', 'contact']

// Font system — locked. Do not change.
const F = {
  display: "'Cormorant Garamond', serif",   // headings, names, display
  body:    "'Inter', sans-serif",            // paragraphs, body copy
  mono:    "'JetBrains Mono', monospace",    // labels, tags, metadata
}

// ─────────────────────────────────────────────────────────
//  HOOKS
// ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

// ─────────────────────────────────────────────────────────
//  GRID BACKGROUND
// ─────────────────────────────────────────────────────────
function GridBg({ cx = '50%', cy = '50%', size = '60%' }) {
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
      backgroundSize: '80px 80px',
      maskImage: `radial-gradient(ellipse ${size} ${size} at ${cx} ${cy}, black 20%, transparent 100%)`,
      WebkitMaskImage: `radial-gradient(ellipse ${size} ${size} at ${cx} ${cy}, black 20%, transparent 100%)`,
    }} />
  )
}

// ─────────────────────────────────────────────────────────
//  INTRO
// ─────────────────────────────────────────────────────────
function Intro({ onDone }) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const ts = [
      [200,  () => setStep(1)],
      [900,  () => setStep(2)],
      [1700, () => setStep(3)],
      [2800, () => onDone()],
    ]
    const timers = ts.map(([t, fn]) => setTimeout(fn, t))
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <GridBg size="55%" />
      <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
        <div style={{ width: 'clamp(120px, 20vw, 160px)', height: 1, background: C.line, margin: '0 auto 56px' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: step >= 1 ? '100%' : 0 }}
            transition={{ duration: 2.0, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', background: C.accent }} />
        </div>
        <AnimatePresence>
          {step >= 2 && (
            <motion.div initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}>
              <div style={{ fontFamily: F.display, fontSize: 'clamp(80px, 16vw, 130px)', color: C.white, fontWeight: 600, letterSpacing: '0.08em', lineHeight: 1, marginBottom: 14 }}>
                MJP
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.4, duration: 0.8 }}
                style={{ fontFamily: "'Noto Sans Tagalog', sans-serif", fontSize: 'clamp(13px, 2.5vw, 17px)', color: C.accent, letterSpacing: '0.12em' }}>
                {BAYBAYIN}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {step >= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.5vw, 11px)', color: C.textMute, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 32 }}>
            Engineer · Analyst · Builder
          </motion.div>
        )}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0 }}
        style={{ position: 'absolute', bottom: 24, right: 'clamp(20px, 4vw, 40px)', fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.1em' }}>
        v9.3.0
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  CINEMATIC FADE
// ─────────────────────────────────────────────────────────
function CinematicFade({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1200); return () => clearTimeout(t) }, [onDone])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.2, times: [0, 0.3, 0.7, 1] }}
      style={{ position: 'fixed', inset: 0, zIndex: 950, background: '#000', pointerEvents: 'none' }} />
  )
}

// ─────────────────────────────────────────────────────────
//  TITLE SCREEN
// ─────────────────────────────────────────────────────────
function TitleScreen({ onEnter }) {
  const [ready, setReady] = useState(false)
  const [entering, setEntering] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 600); return () => clearTimeout(t) }, [])
  const handleEnter = useCallback(() => {
    if (entering) return
    setEntering(true)
    setTimeout(onEnter, 300)
  }, [entering, onEnter])
  useEffect(() => {
    if (!ready) return
    const h = e => { if (!['Tab','Shift','Control','Alt','Meta'].includes(e.key)) handleEnter() }
    window.addEventListener('keydown', h, { once: true })
    return () => window.removeEventListener('keydown', h)
  }, [ready, handleEnter])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
      onClick={ready ? handleEnter : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: 900, background: C.bg, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <GridBg size="65%" />
      <div style={{ position: 'absolute', top: 'clamp(28px, 4vw, 40px)', left: 'clamp(20px, 4vw, 48px)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 5, height: 5, background: C.accent, borderRadius: '50%' }} />
        <span style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.5vw, 10px)', color: C.textMute, letterSpacing: '0.14em' }}>MARKJP.DEV</span>
      </div>
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <div style={{ fontFamily: F.display, fontSize: 'clamp(88px, 18vw, 180px)', color: C.white, fontWeight: 600, letterSpacing: '0.1em', lineHeight: 0.9, marginBottom: 16 }}>
            MJP
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.7, duration: 0.8 }}
            style={{ fontFamily: "'Noto Sans Tagalog', sans-serif", fontSize: 'clamp(15px, 3vw, 22px)', color: C.accent, letterSpacing: '0.16em', marginBottom: 40 }}>
            {BAYBAYIN}
          </motion.div>
        </motion.div>
        <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
          style={{ width: 1, height: 'clamp(28px, 5vw, 44px)', background: `linear-gradient(to bottom, ${C.accent}, transparent)`, margin: '0 auto 32px' }} />
        {ready && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.7, 0.7, 0.2, 0.7] }}
            transition={{ duration: 2.8, repeat: Infinity }}
            style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.8vw, 11px)', color: C.textMute, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Press any key to continue
          </motion.div>
        )}
      </div>
      <div style={{ position: 'absolute', bottom: 'clamp(20px, 4vw, 32px)', left: 0, right: 0, padding: '0 clamp(20px, 4vw, 48px)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.5vw, 10px)', color: C.textMute, letterSpacing: '0.1em' }}>Quezon City, PH</span>
        <span style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.5vw, 10px)', color: C.textMute, letterSpacing: '0.1em' }}>© {new Date().getFullYear()} MJP</span>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  TOP BAR
// ─────────────────────────────────────────────────────────
function TopBar({ currentSection, onNavigate }) {
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px, 5vw, 64px)', background: 'rgba(17,19,24,0.95)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.line}` }}>
      <button onClick={() => { onNavigate('home'); setMenuOpen(false) }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: 0 }}>
        <div style={{ width: 28, height: 28, border: `1px solid ${C.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: F.display, fontSize: 13, color: C.accent, fontWeight: 600 }}>MJP</span>
        </div>
        {!isMobile && <span style={{ fontFamily: F.mono, fontSize: 11, color: C.textMute, letterSpacing: '0.08em' }}>markjp.dev</span>}
      </button>
      {isMobile ? (
        <>
          <button onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: `1px solid ${C.line}`, cursor: 'pointer', padding: '6px 14px', fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {menuOpen ? 'Close' : 'Menu'}
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                style={{ position: 'absolute', top: 56, left: 0, right: 0, background: 'rgba(17,19,24,0.98)', borderBottom: `1px solid ${C.line}`, zIndex: 300 }}>
                {SECTIONS.map(s => (
                  <button key={s} onClick={() => { onNavigate(s); setMenuOpen(false) }}
                    style={{ width: '100%', background: currentSection === s ? C.accentDim : 'none', border: 'none', borderBottom: `1px solid ${C.line}`, cursor: 'pointer', padding: '16px clamp(16px, 5vw, 64px)', textAlign: 'left', fontFamily: F.mono, fontSize: 12, color: currentSection === s ? C.accent : C.textDim, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {s}
                  </button>
                ))}
                <a href="/resume.pdf" download
                  style={{ display: 'block', padding: '16px clamp(16px, 5vw, 64px)', fontFamily: F.mono, fontSize: 12, color: C.accent, textDecoration: 'none', letterSpacing: '0.08em' }}>
                  ↓ Resume
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {SECTIONS.map(s => {
            const active = currentSection === s
            return (
              <button key={s} onClick={() => onNavigate(s)}
                style={{ background: active ? C.accentDim : 'none', border: 'none', cursor: 'pointer', fontFamily: F.mono, fontSize: 11, color: active ? C.accent : C.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 16px', transition: 'all 0.2s' }}
                onMouseOver={e => { if (!active) e.currentTarget.style.color = C.textDim }}
                onMouseOut={e => { if (!active) e.currentTarget.style.color = C.textMute }}>
                {s}
              </button>
            )
          })}
          <div style={{ width: 1, height: 16, background: C.line, margin: '0 6px' }} />
          <a href="/resume.pdf" download
            style={{ fontFamily: F.mono, fontSize: 11, color: C.textMute, letterSpacing: '0.08em', textDecoration: 'none', padding: '6px 14px', border: `1px solid ${C.line}`, transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.lineHover }}
            onMouseOut={e => { e.currentTarget.style.color = C.textMute; e.currentTarget.style.borderColor = C.line }}>
            ↓ CV
          </a>
          <div style={{ width: 1, height: 16, background: C.line, margin: '0 6px' }} />
          <a href="mailto:mark@markjp.dev"
            style={{ fontFamily: F.mono, fontSize: 11, color: C.accent, letterSpacing: '0.08em', textDecoration: 'none', padding: '6px 16px', border: `1px solid ${C.accent}33`, transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = C.accentDim }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent' }}>
            hire
          </a>
        </div>
      )}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  BOTTOM NAV
// ─────────────────────────────────────────────────────────
function BottomNav({ currentSection, onNavigate }) {
  const idx = SECTIONS.indexOf(currentSection)
  const prev = idx > 0 ? SECTIONS[idx - 1] : null
  const next = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 150, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px, 5vw, 64px)', background: 'rgba(17,19,24,0.95)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${C.line}` }}>
      <button onClick={() => prev && onNavigate(prev)}
        style={{ background: 'none', border: 'none', cursor: prev ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 8, opacity: prev ? 1 : 0.2, padding: 0, transition: 'opacity 0.2s' }}
        onMouseOver={e => { if (prev) e.currentTarget.style.opacity = '0.65' }}
        onMouseOut={e => { if (prev) e.currentTarget.style.opacity = '1' }}>
        <span style={{ color: C.accent, fontSize: 14 }}>←</span>
        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{prev || ''}</span>
      </button>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {SECTIONS.map(s => (
          <button key={s} onClick={() => onNavigate(s)}
            style={{ width: s === currentSection ? 22 : 5, height: 4, background: s === currentSection ? C.accent : C.line, border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0, borderRadius: 2 }} />
        ))}
      </div>
      <button onClick={() => next && onNavigate(next)}
        style={{ background: 'none', border: 'none', cursor: next ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 8, opacity: next ? 1 : 0.2, padding: 0, transition: 'opacity 0.2s' }}
        onMouseOver={e => { if (next) e.currentTarget.style.opacity = '0.65' }}
        onMouseOut={e => { if (next) e.currentTarget.style.opacity = '1' }}>
        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{next || ''}</span>
        <span style={{ color: C.accent, fontSize: 14 }}>→</span>
      </button>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  HOME SCREEN
// ─────────────────────────────────────────────────────────
function HomeScreen({ onNavigate }) {
  const isMobile = useIsMobile()
  const roles = ['Business Analyst', 'Application Support Engineer', 'Clinical Systems Specialist', 'Backend Engineer']
  const [roleIdx, setRoleIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % roles.length), 3200)
    return () => clearInterval(t)
  }, [])

  const NAV = [
    { id: 'about',    label: 'About',    sub: 'Background & Story' },
    { id: 'skills',   label: 'Skills',   sub: 'Stack & Expertise' },
    { id: 'projects', label: 'Projects', sub: 'Work & Builds' },
    { id: 'contact',  label: 'Contact',  sub: 'Get in Touch' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      style={{ position: 'fixed', inset: 0, background: C.bg, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflowY: isMobile ? 'auto' : 'hidden' }}>
      <GridBg cx="15%" cy="50%" size="80%" />
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 40% 35% at 8% 50%, rgba(91,141,239,0.055) 0%, transparent 100%)' }} />

      {/* LEFT */}
      <div style={{ width: isMobile ? '100%' : 'clamp(300px, 46%, 580px)', display: 'flex', flexDirection: 'column', justifyContent: isMobile ? 'flex-start' : 'center', padding: isMobile ? 'clamp(80px, 12vw, 100px) clamp(20px, 6vw, 48px) 32px' : '80px clamp(28px, 5vw, 64px)', position: 'relative', zIndex: 2, borderRight: isMobile ? 'none' : `1px solid ${C.line}`, borderBottom: isMobile ? `1px solid ${C.line}` : 'none' }}>

        {/* Available */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(74,202,139,0.08)', border: '1px solid rgba(74,202,139,0.28)', padding: '7px 14px', marginBottom: 40, alignSelf: 'flex-start' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green, boxShadow: `0 0 8px ${C.green}`, animation: 'glow 2s infinite' }} />
          <span style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.5vw, 11px)', color: C.green, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Available · Open to Work</span>
        </motion.div>

        {/* Name */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: F.display, fontSize: 'clamp(56px, 8vw, 96px)', color: C.white, fontWeight: 600, lineHeight: 0.95, letterSpacing: '0.06em', margin: '0 0 10px' }}>
          MJP
        </motion.h1>

        {/* Baybayin */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.55, duration: 0.7 }}
          style={{ fontFamily: "'Noto Sans Tagalog', sans-serif", fontSize: 'clamp(12px, 2vw, 15px)', color: C.accent, letterSpacing: '0.14em', marginBottom: 24 }}>
          {BAYBAYIN}
        </motion.div>

        {/* Role */}
        <div style={{ height: 24, overflow: 'hidden', marginBottom: 20 }}>
          <AnimatePresence mode="wait">
            <motion.div key={roleIdx} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.3 }}
              style={{ fontFamily: F.mono, fontSize: 'clamp(10px, 1.5vw, 12px)', color: C.accent, letterSpacing: '0.06em' }}>
              {roles[roleIdx]}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6, transformOrigin: 'left' }}
          style={{ width: 36, height: 1, background: C.accent, marginBottom: 24 }} />

        {/* Bio */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ fontFamily: F.body, fontSize: 'clamp(13px, 1.4vw, 15px)', color: C.textDim, lineHeight: 1.85, marginBottom: 36, maxWidth: 420, fontWeight: 300 }}>
          {YEARS}+ years in clinical systems and enterprise integrations.
          Building toward backend engineering — Python, Go, Docker, Kubernetes.{' '}
          <span style={{ color: C.text, fontWeight: 400 }}>The support engineer who learned to read the source.</span>
        </motion.p>

        {/* Social */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
          style={{ display: 'flex', gap: 'clamp(16px, 4vw, 28px)', flexWrap: 'wrap' }}>
          {[
            { label: 'GitHub',   href: 'https://github.com/markjpdev' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/jaysonpunsalan' },
            { label: 'Email',    href: 'mailto:mark@markjp.dev' },
          ].map(s => (
            <a key={s.label} href={s.href} target={s.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
              style={{ fontFamily: F.body, fontSize: 'clamp(12px, 1.5vw, 14px)', fontWeight: 400, color: C.textDim, textDecoration: 'none', borderBottom: `1px solid ${C.line}`, paddingBottom: 2, transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accent + '55' }}
              onMouseOut={e => { e.currentTarget.style.color = C.textDim; e.currentTarget.style.borderColor = C.line }}>
              {s.label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* RIGHT — Nav */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? 'clamp(24px, 5vw, 36px) clamp(20px, 6vw, 48px) clamp(48px, 8vw, 72px)' : '80px clamp(28px, 5vw, 64px)', position: 'relative', zIndex: 2 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginBottom: 28 }}>
          <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Navigate</span>
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map((item, i) => (
            <motion.button key={item.id}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.32 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onNavigate(item.id)}
              style={{ background: 'transparent', border: `1px solid ${C.line}`, cursor: 'pointer', textAlign: 'left', padding: 'clamp(16px, 2.5vw, 24px) clamp(16px, 3vw, 28px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.25s', minHeight: 'clamp(64px, 10vw, 78px)' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.lineHover; e.currentTarget.style.background = C.bgCard }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = 'transparent' }}>
              <div>
                <div style={{ fontFamily: F.display, fontSize: 'clamp(20px, 2.8vw, 30px)', color: C.white, fontWeight: 600, lineHeight: 1, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.2vw, 10px)', color: C.textMute, letterSpacing: '0.08em' }}>{item.sub}</div>
              </div>
              <span style={{ color: C.accent, fontSize: 18, opacity: 0.5 }}>→</span>
            </motion.button>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
          style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 16, height: 1, background: C.line }} />
          <span style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.3vw, 10px)', color: C.textMute, letterSpacing: '0.1em' }}>Quezon City, PH · UTC+8</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  SCREEN SHELL
// ─────────────────────────────────────────────────────────
function ScreenShell({ children, title, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
      style={{ position: 'fixed', inset: 0, background: C.bg, overflowY: 'auto', paddingTop: 56, paddingBottom: 50 }}>
      <div style={{ padding: 'clamp(32px, 5vw, 60px) clamp(20px, 6vw, 80px) clamp(40px, 6vw, 60px)', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
          <span style={{ fontFamily: F.display, fontSize: 'clamp(11px, 1.5vw, 13px)', color: C.textMute, letterSpacing: '0.04em' }}>{index}</span>
          <div style={{ width: 1, height: 14, background: C.line }} />
          <span style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.3vw, 11px)', color: C.accent, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{title}</span>
          <div style={{ width: 40, height: 1, background: C.line }} />
          <span style={{ fontFamily: "'Noto Sans Tagalog', sans-serif", fontSize: 11, color: C.accent, opacity: 0.3 }}>{BAYBAYIN.split(' ')[0]}</span>
        </motion.div>
        {children}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  ABOUT — Narrative + Timeline
// ─────────────────────────────────────────────────────────
const TIMELINE = [
  {
    period: '2023 — Present',
    role: 'Business Analyst & App Support Engineer',
    company: 'RxPx Health',
    color: C.accent,
    points: [
      'Manage Veeva Vault and Medidata Rave across clinical trial programs',
      'Architect and troubleshoot federated SSO/SAML configurations for enterprise clients',
      'Lead UAT sessions and translate business requirements into technical specifications',
      'Own cross-platform API integrations between clinical and operational systems',
    ],
  },
  {
    period: '2020 — 2023',
    role: 'Clinical Systems Support Specialist',
    company: 'Thermo Fisher Scientific (PPD)',
    color: '#6BBFEF',
    points: [
      'Supported clinical trial platforms across GxP-regulated global environments',
      'Managed user provisioning, role-based access, and audit trail compliance',
      'Resolved complex cross-system integration issues under tight SLA windows',
    ],
  },
  {
    period: '2019 — 2020',
    role: 'IoT Systems Developer',
    company: 'Academic — Thesis Project',
    color: C.green,
    points: [
      'Designed and built an end-to-end IoT flood monitoring system from scratch',
      'Real-time sensor ingestion, alert pipeline, and live monitoring dashboard',
      'Awarded Best Thesis Finalist — recognized for practical community impact',
    ],
  },
]

function AboutScreen() {
  const isMobile = useIsMobile()
  const [openEntry, setOpenEntry] = useState(0)

  return (
    <ScreenShell title="About" index="01">
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1.15fr) minmax(0,0.85fr)', gap: 'clamp(28px, 5vw, 72px)', paddingBottom: 40 }}>

        {/* LEFT — Narrative */}
        <div>
          <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ fontFamily: F.display, fontSize: 'clamp(28px, 4vw, 48px)', color: C.white, fontWeight: 600, lineHeight: 1.15, marginBottom: 28, letterSpacing: '0.01em' }}>
            Engineer who learned<br />
            <span style={{ color: C.accent, fontStyle: 'italic' }}>to read the source.</span>
          </motion.h2>

          {/* Narrative paragraphs */}
          {[
            `I didn't start as an engineer. I started as the person who kept things running — managing clinical trial platforms, mapping system integrations, being the one in the room who could speak to both the business and the database.`,
            `Over ${YEARS}+ years across healthcare SaaS environments — Veeva Vault, Medidata Rave, federated SSO/SAML, GxP-regulated integrations — I built a rare combination: technical depth with operational instinct. I know what breaks systems and why, because I've fixed them at 2am.`,
            `Now I'm making the transition deliberate. Python. Go. Docker. FastAPI. I'm not leaving support behind — I'm standing on top of it. The support engineer who learned to read the source.`,
          ].map((text, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
              style={{ fontFamily: F.body, fontSize: 'clamp(14px, 1.5vw, 15px)', color: C.textDim, lineHeight: 1.9, marginBottom: 16, fontWeight: 300 }}>
              {text}
            </motion.p>
          ))}

          {/* Timeline */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            style={{ marginTop: 40, borderTop: `1px solid ${C.line}`, paddingTop: 32 }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 24 }}>Experience</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {TIMELINE.map((entry, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.08 }}>
                  <div onClick={() => setOpenEntry(openEntry === i ? null : i)}
                    style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 'clamp(14px, 2vw, 18px) clamp(14px, 2vw, 18px)', background: openEntry === i ? C.bgCard : 'transparent', border: `1px solid ${openEntry === i ? entry.color + '33' : C.line}`, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => { if (openEntry !== i) e.currentTarget.style.borderColor = C.lineHover }}
                    onMouseOut={e => { if (openEntry !== i) e.currentTarget.style.borderColor = C.line }}>
                    <div style={{ width: 3, background: entry.color, alignSelf: 'stretch', flexShrink: 0, minHeight: 20 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: openEntry === i ? 14 : 0 }}>
                        <div>
                          <div style={{ fontFamily: F.display, fontSize: 'clamp(16px, 2vw, 20px)', color: C.white, fontWeight: 600, lineHeight: 1.2, marginBottom: 3 }}>{entry.role}</div>
                          <div style={{ fontFamily: F.mono, fontSize: 10, color: entry.color, letterSpacing: '0.08em' }}>{entry.company}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.06em' }}>{entry.period}</span>
                          <span style={{ color: C.textMute, fontSize: 12, transform: openEntry === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>→</span>
                        </div>
                      </div>
                      <AnimatePresence>
                        {openEntry === i && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                            {entry.points.map((pt, pi) => (
                              <div key={pi} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                                <span style={{ color: entry.color, fontSize: 8, marginTop: 5, flexShrink: 0 }}>◆</span>
                                <span style={{ fontFamily: F.body, fontSize: 'clamp(13px, 1.4vw, 14px)', color: C.textDim, lineHeight: 1.7, fontWeight: 300 }}>{pt}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT — Status */}
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            style={{ background: C.bgCard, border: `1px solid ${C.line}`, padding: 'clamp(20px, 3vw, 28px)', marginBottom: 3 }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 20 }}>Status</div>
            {[
              { l: 'Full Name', v: 'Mark Jayson Punsalan' },
              { l: 'Handle',    v: 'MJP' },
              { l: 'Role',      v: 'Engineer / Analyst' },
              { l: 'Location',  v: 'Quezon City, PH' },
              { l: 'Status',    v: 'Available', c: C.green },
              { l: 'Focus',     v: 'Backend Eng.', c: C.accent },
            ].map(row => (
              <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: `1px solid ${C.line}` }}>
                <span style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.2vw, 10px)', color: C.textMute }}>{row.l}</span>
                <span style={{ fontFamily: F.body, fontSize: 'clamp(12px, 1.4vw, 14px)', color: row.c || C.textDim, fontWeight: 400 }}>{row.v}</span>
              </div>
            ))}
          </motion.div>

          {/* Progress */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            style={{ background: C.bgCard, border: `1px solid ${C.line}`, padding: 'clamp(16px, 2.5vw, 22px)', marginBottom: 3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Progress</span>
              <span style={{ fontFamily: F.mono, fontSize: 10, color: C.accent }}>72%</span>
            </div>
            <div style={{ height: 2, background: C.line }}>
              <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: '100%', background: C.accent }} />
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMute, marginTop: 8 }}>Target: Backend Engineer</div>
          </motion.div>

          {/* Resume download */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <a href="/resume.pdf" download
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.bgCard, border: `1px solid ${C.line}`, padding: 'clamp(14px, 2vw, 18px) clamp(16px, 2.5vw, 22px)', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.accent + '55'; e.currentTarget.style.background = C.bgHover }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = C.bgCard }}>
              <div>
                <div style={{ fontFamily: F.body, fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 3 }}>Download CV</div>
                <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMute, letterSpacing: '0.08em' }}>PDF · Updated 2025</div>
              </div>
              <span style={{ fontFamily: F.mono, fontSize: 16, color: C.accent }}>↓</span>
            </a>
          </motion.div>
        </div>
      </div>
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────
//  SKILLS — Tech Constellation
// ─────────────────────────────────────────────────────────
const TECH_CLUSTERS = [
  {
    label: 'Core Expertise',
    color: C.accent,
    anchor: 'Clinical · Enterprise · Integration',
    techs: [
      { name: 'System Analysis', size: 'lg' },
      { name: 'Clinical SaaS', size: 'lg' },
      { name: 'API Integration', size: 'md' },
      { name: 'Federated Auth', size: 'md' },
      { name: 'SSO / SAML', size: 'md' },
      { name: 'SQL', size: 'sm' },
      { name: 'UAT & QA', size: 'sm' },
    ],
  },
  {
    label: 'Platforms',
    color: '#6BBFEF',
    anchor: 'Clinical Trial Systems',
    techs: [
      { name: 'Veeva Vault', size: 'lg' },
      { name: 'Medidata Rave', size: 'lg' },
      { name: 'Chameleon IRT', size: 'md' },
      { name: 'ServiceNow', size: 'sm' },
      { name: 'Jira', size: 'sm' },
      { name: 'Confluence', size: 'sm' },
    ],
  },
  {
    label: 'Engineering',
    color: C.green,
    anchor: 'Building · Learning · Shipping',
    techs: [
      { name: 'Python', size: 'lg' },
      { name: 'Linux / CLI', size: 'md' },
      { name: 'Docker', size: 'md' },
      { name: 'FastAPI', size: 'md' },
      { name: 'Go', size: 'sm' },
      { name: 'Kubernetes', size: 'sm' },
      { name: 'Next.js', size: 'sm' },
      { name: 'Git', size: 'sm' },
    ],
  },
]

const SZ = {
  lg: { fontSize: 'clamp(13px, 1.8vw, 15px)', padding: 'clamp(8px, 1.2vw, 11px) clamp(14px, 2.2vw, 20px)', opacity: 1,    font: F.display, weight: 600 },
  md: { fontSize: 'clamp(11px, 1.4vw, 13px)', padding: 'clamp(6px, 1vw, 8px) clamp(12px, 1.8vw, 16px)',   opacity: 0.85, font: F.body,    weight: 400 },
  sm: { fontSize: 'clamp(10px, 1.2vw, 11px)', padding: 'clamp(5px, 0.8vw, 6px) clamp(9px, 1.4vw, 12px)', opacity: 0.6,  font: F.mono,    weight: 400 },
}

function SkillsScreen() {
  const [active, setActive] = useState(null)
  return (
    <ScreenShell title="Skills" index="02">
      <div style={{ paddingBottom: 40 }}>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          style={{ fontFamily: F.body, fontSize: 'clamp(13px, 1.5vw, 15px)', color: C.textMute, marginBottom: 36, fontStyle: 'italic', maxWidth: 480, fontWeight: 300 }}>
          Three domains. One engineer. Hover a cluster to explore.
        </motion.p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {TECH_CLUSTERS.map((cluster, ci) => (
            <motion.div key={cluster.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }}
              onMouseEnter={() => setActive(cluster.label)}
              onMouseLeave={() => setActive(null)}
              style={{ background: active === cluster.label ? C.bgHover : C.bgCard, border: `1px solid ${active === cluster.label ? cluster.color + '44' : C.line}`, padding: 'clamp(20px, 3vw, 32px)', transition: 'all 0.25s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 3, height: 'clamp(18px, 3vw, 24px)', background: cluster.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: F.display, fontSize: 'clamp(18px, 2.5vw, 24px)', color: C.white, fontWeight: 600, lineHeight: 1 }}>{cluster.label}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.2vw, 10px)', color: C.textMute, letterSpacing: '0.1em', marginTop: 3 }}>{cluster.anchor}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(6px, 1vw, 8px)', alignItems: 'center' }}>
                {cluster.techs.map((tech, ti) => (
                  <motion.div key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: SZ[tech.size].opacity, scale: 1 }}
                    transition={{ delay: ci * 0.1 + ti * 0.04 }}
                    whileHover={{ opacity: 1, scale: 1.04, transition: { duration: 0.15 } }}
                    style={{ fontFamily: SZ[tech.size].font, fontSize: SZ[tech.size].fontSize, padding: SZ[tech.size].padding, color: active === cluster.label ? cluster.color : C.textDim, border: `1px solid ${active === cluster.label ? cluster.color + '50' : C.line}`, background: active === cluster.label ? cluster.color + '08' : 'transparent', fontWeight: SZ[tech.size].weight, transition: 'all 0.25s', letterSpacing: tech.size === 'sm' ? '0.06em' : '0.02em' }}>
                    {tech.name}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${C.line}` }}>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>Also</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(5px, 1vw, 7px)' }}>
            {['REST APIs', 'SOAP', 'PostgreSQL', 'GxP Compliance', 'SFTP', 'OAuth2', 'Webhooks', 'Postman'].map(tag => (
              <span key={tag} style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.2vw, 10px)', color: C.textMute, border: `1px solid ${C.line}`, padding: 'clamp(4px, 0.7vw, 5px) clamp(8px, 1.4vw, 11px)', letterSpacing: '0.06em' }}>{tag}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────
//  PROJECTS — Case studies, not placeholders
// ─────────────────────────────────────────────────────────
const PROJECT_DATA = [
  {
    num: '01',
    title: 'IoT Flood Monitoring System',
    status: 'Shipped',
    sc: C.green,
    tags: ['IoT', 'Embedded Systems', 'Real-time', 'Sensors'],
    problem: 'Flood-prone communities lack affordable, real-time water level monitoring. Commercial systems cost thousands. Manual monitoring is slow and dangerous.',
    approach: 'Built a low-cost IoT sensor network with automated data ingestion, threshold-based alerting, and a live dashboard — designed to run on minimal infrastructure.',
    outcome: 'Fully functional system deployed and demonstrated. Awarded Best Thesis Finalist. The architecture proved that enterprise-grade monitoring principles apply at community scale.',
    link: null,
    github: null,
  },
  {
    num: '02',
    title: 'markjp.dev — This Portfolio',
    status: 'Live',
    sc: C.accent,
    tags: ['Next.js', 'Framer Motion', 'Netlify', 'CSS'],
    problem: 'Most developer portfolios look the same — a hero section, a skills list, a project grid. None of them communicate identity.',
    approach: 'Designed and built from scratch with a cinematic entry experience, Baybayin cultural identity mark, and a full-screen section architecture. Every decision was intentional.',
    outcome: 'Deployed to markjp.dev via GitHub → Netlify pipeline. Iterated through nine versions. The site you\'re looking at right now.',
    link: 'https://markjp.dev',
    github: null,
  },
  {
    num: '03',
    title: 'Clinical REST API',
    status: 'Building',
    sc: '#6BBFEF',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    problem: 'Healthcare SaaS systems are notoriously difficult to integrate. Most engineers lack the domain knowledge to build APIs that reflect how clinical data actually flows.',
    approach: 'Leveraging years of hands-on clinical platform experience to build a mock eClinical API with realistic data models, OpenAPI documentation, and containerized deployment.',
    outcome: 'In active development. Architecture decisions documented. GitHub link and live demo to follow on deploy.',
    link: null,
    github: null,
    wip: true,
  },
]

function ProjectsScreen() {
  const [open, setOpen] = useState(0)
  return (
    <ScreenShell title="Projects" index="03">
      <div style={{ paddingBottom: 40 }}>
        {PROJECT_DATA.map((p, i) => (
          <motion.div key={p.num} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ marginBottom: 3 }}>
            <div onClick={() => setOpen(open === i ? null : i)}
              style={{ background: open === i ? C.bgCard : 'transparent', border: `1px solid ${open === i ? p.sc + '33' : C.line}`, padding: 'clamp(16px, 2.5vw, 26px)', cursor: 'pointer', transition: 'all 0.22s' }}
              onMouseOver={e => { if (open !== i) e.currentTarget.style.borderColor = C.lineHover }}
              onMouseOut={e => { if (open !== i) e.currentTarget.style.borderColor = C.line }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 20px)', flexWrap: 'wrap', marginBottom: open === i ? 20 : 0 }}>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, flexShrink: 0 }}>{p.num}</span>
                <h3 style={{ flex: 1, fontFamily: F.display, fontSize: 'clamp(18px, 2.5vw, 24px)', color: C.white, fontWeight: 600, margin: 0, minWidth: 140 }}>{p.title}</h3>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: p.sc, border: `1px solid ${p.sc}44`, padding: '3px 10px', flexShrink: 0, letterSpacing: '0.08em' }}>{p.status}</span>
                <span style={{ color: C.textMute, fontSize: 14, transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>→</span>
              </div>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                    {/* Case study */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'clamp(12px, 2vw, 20px)', marginBottom: 20 }}>
                      {[
                        { label: 'Problem', text: p.problem },
                        { label: 'Approach', text: p.approach },
                        { label: 'Outcome', text: p.outcome },
                      ].map(cs => (
                        <div key={cs.label} style={{ borderLeft: `2px solid ${p.sc}44`, paddingLeft: 14 }}>
                          <div style={{ fontFamily: F.mono, fontSize: 9, color: p.sc, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{cs.label}</div>
                          <p style={{ fontFamily: F.body, fontSize: 'clamp(12px, 1.4vw, 13px)', color: C.textDim, lineHeight: 1.75, margin: 0, fontWeight: 300 }}>{cs.text}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 'clamp(6px, 1vw, 8px)', flexWrap: 'wrap', marginBottom: 14 }}>
                      {p.tags.map(t => <span key={t} style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.2vw, 10px)', color: C.textMute, border: `1px solid ${C.line}`, padding: '4px 10px', letterSpacing: '0.06em' }}>{t}</span>)}
                    </div>
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontFamily: F.mono, fontSize: 11, color: C.accent, textDecoration: 'none', letterSpacing: '0.06em' }}>↗ Visit Site</a>}
                    {p.wip && <span style={{ fontFamily: F.mono, fontSize: 11, color: C.textMute, letterSpacing: '0.06em' }}>In active development — links on deploy</span>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────
//  CONTACT
// ─────────────────────────────────────────────────────────
function ContactScreen() {
  const isMobile = useIsMobile()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const submit = e => {
    e.preventDefault()
    window.open(`mailto:mark@markjp.dev?subject=${encodeURIComponent(`Message from ${form.name}`)}&body=${encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`)
    setSent(true)
  }
  const inp = { width: '100%', background: C.bgCard, border: `1px solid ${C.line}`, padding: 'clamp(10px, 1.5vw, 13px) clamp(12px, 2vw, 16px)', fontFamily: F.body, fontSize: 'clamp(13px, 1.5vw, 15px)', color: C.text, outline: 'none', transition: 'border-color 0.2s', fontWeight: 300 }
  const lbl = { fontFamily: F.mono, fontSize: 'clamp(9px, 1.2vw, 10px)', color: C.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }

  return (
    <ScreenShell title="Contact" index="04">
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) minmax(0,1fr)', gap: 'clamp(28px, 5vw, 72px)', paddingBottom: 40 }}>
        <div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ fontFamily: F.display, fontSize: 'clamp(28px, 3.5vw, 44px)', color: C.white, fontWeight: 600, lineHeight: 1.2, marginBottom: 16 }}>
            Let's work<br /><span style={{ color: C.accent, fontStyle: 'italic' }}>together.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            style={{ fontFamily: F.body, fontSize: 'clamp(13px, 1.5vw, 15px)', color: C.textDim, lineHeight: 1.85, marginBottom: 36, fontWeight: 300 }}>
            Open to backend engineering roles, clinical systems consulting, and interesting problems at the intersection of tech and healthcare.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            {[
              { l: 'Email',    v: 'mark@markjp.dev',      h: 'mailto:mark@markjp.dev' },
              { l: 'GitHub',   v: 'github.com/markjpdev', h: 'https://github.com/markjpdev' },
              { l: 'LinkedIn', v: 'in/jaysonpunsalan',    h: 'https://linkedin.com/in/jaysonpunsalan' },
            ].map(item => (
              <div key={item.l} style={{ padding: 'clamp(10px, 1.5vw, 14px) 0', borderBottom: `1px solid ${C.line}` }}>
                <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>{item.l}</div>
                <a href={item.h} target={item.h.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                  style={{ fontFamily: F.body, fontSize: 'clamp(13px, 1.5vw, 15px)', color: C.textDim, textDecoration: 'none', transition: 'color 0.2s', fontWeight: 300 }}
                  onMouseOver={e => e.currentTarget.style.color = C.accent}
                  onMouseOut={e => e.currentTarget.style.color = C.textDim}>
                  {item.v}
                </a>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          {sent ? (
            <div style={{ background: C.bgCard, border: `1px solid ${C.line}`, padding: 'clamp(36px, 5vw, 48px) clamp(24px, 4vw, 32px)', textAlign: 'center' }}>
              <div style={{ fontFamily: F.display, fontSize: 'clamp(20px, 3vw, 26px)', color: C.white, fontWeight: 600, marginBottom: 12 }}>Sent.</div>
              <p style={{ fontFamily: F.body, fontSize: 14, color: C.textDim, lineHeight: 1.7, fontWeight: 300 }}>Your mail client should have opened. I'll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2vw, 18px)' }}>
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
                <textarea style={{ ...inp, minHeight: 'clamp(90px, 12vw, 120px)', resize: 'vertical' }} placeholder="What's on your mind?" value={form.message} required
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = C.line} />
              </div>
              <button type="submit"
                style={{ background: C.accent, border: 'none', padding: 'clamp(11px, 1.5vw, 13px) clamp(20px, 3vw, 28px)', fontFamily: F.mono, fontSize: 'clamp(10px, 1.3vw, 11px)', color: C.bg, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer', transition: 'opacity 0.2s', textTransform: 'uppercase', alignSelf: 'flex-start' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                Send Message →
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────
//  ROOT
// ─────────────────────────────────────────────────────────
export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState('intro')
  const [section, setSection] = useState(null)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const navigate = id => setSection(id === 'home' ? null : id)
  const SCREENS = { about: AboutScreen, skills: SkillsScreen, projects: ProjectsScreen, contact: ContactScreen }
  const ActiveScreen = section ? SCREENS[section] : null

  return (
    <>
      <Head>
        <title>MJP — Mark Jayson Punsalan</title>
        <meta name="description" content="MJP — Mark Jayson Punsalan. Engineer, Analyst, Builder. Based in the Philippines." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#111318" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&family=Noto+Sans+Tagalog&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next { background: ${C.bg}; min-height: 100%; height: 100%; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        a { color: inherit; }
        button { outline: none; -webkit-tap-highlight-color: transparent; }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.accent}55; }
        ::selection { background: ${C.accentDim}; color: ${C.white}; }

        input, textarea { -webkit-appearance: none; border-radius: 0; }
        input::placeholder, textarea::placeholder {
          color: ${C.textMute};
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 300;
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 8px ${C.green}, 0 0 16px ${C.green}44; }
          50%       { box-shadow: 0 0 3px ${C.green}; }
        }
      `}} />

      <AnimatePresence mode="wait">
        {phase === 'intro' && <Intro key="intro" onDone={() => setPhase('title')} />}
        {phase === 'title' && <TitleScreen key="title" onEnter={() => setPhase('transition')} />}
        {phase === 'transition' && <CinematicFade key="fade" onDone={() => setPhase('main')} />}
        {phase === 'main' && (
          <motion.div key="main" style={{ position: 'fixed', inset: 0 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {section && <TopBar currentSection={section} onNavigate={navigate} />}
            {section && <BottomNav currentSection={section} onNavigate={navigate} />}
            <AnimatePresence mode="wait">
              {!section && <HomeScreen key="home" onNavigate={navigate} />}
              {section && ActiveScreen && <ActiveScreen key={section} />}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
