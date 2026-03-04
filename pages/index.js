import Head from 'next/head'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { useEffect, useState, useCallback, useRef } from 'react'

// ─────────────────────────────────────────────────────────
//  MJP — Portfolio v9.5
//  Every surface communicates. Nothing is accidental.
//  Beauty and function are the same thing.
// ─────────────────────────────────────────────────────────

const YEARS = new Date().getFullYear() - 2014
const BAYBAYIN = 'ᜋᜍᜃ᜔ ᜇᜒᜐᜓᜈ᜔ ᜉᜓᜈ᜔ᜐᜎᜈ᜔'

const C = {
  bg:          '#12131A',
  bgCard:      '#171820',
  bgHover:     '#1C1D27',
  line:        'rgba(255,255,255,0.07)',
  lineHover:   'rgba(255,255,255,0.13)',
  text:        '#E8EAF2',
  textDim:     'rgba(232,234,242,0.68)',
  textMute:    'rgba(232,234,242,0.36)',
  textGhost:   'rgba(232,234,242,0.03)',
  accent:      '#5B8DEF',
  accentDim:   'rgba(91,141,239,0.10)',
  accentGlow:  'rgba(91,141,239,0.18)',
  white:       '#F4F5FA',
  green:       '#4ACA8B',
}

const F = {
  display: "'Cormorant Garamond', serif",
  body:    "'Inter', sans-serif",
  mono:    "'JetBrains Mono', monospace",
  bay:     "'Noto Sans Tagalog', sans-serif",
}

const SECTIONS = ['about', 'skills', 'projects', 'contact']

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
//  CUSTOM CURSOR
// ─────────────────────────────────────────────────────────
function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [trail, setTrail] = useState({ x: -100, y: -100 })
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) return
    let animId
    let current = { x: -100, y: -100 }
    let target = { x: -100, y: -100 }

    const onMove = e => {
      target = { x: e.clientX, y: e.clientY }
      setPos({ x: e.clientX, y: e.clientY })
    }
    const onOver = e => {
      const el = e.target.closest('button, a, [role="button"]')
      setHovered(!!el)
    }

    const animate = () => {
      current.x += (target.x - current.x) * 0.12
      current.y += (target.y - current.y) * 0.12
      setTrail({ x: current.x, y: current.y })
      animId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    animId = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(animId)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      {/* Dot */}
      <div style={{
        position: 'fixed', zIndex: 9999, pointerEvents: 'none',
        left: pos.x - 3, top: pos.y - 3,
        width: 6, height: 6, borderRadius: '50%',
        background: hovered ? C.accent : C.white,
        transition: 'background 0.2s',
        mixBlendMode: 'difference',
      }} />
      {/* Ring */}
      <div style={{
        position: 'fixed', zIndex: 9998, pointerEvents: 'none',
        left: trail.x - (hovered ? 20 : 14),
        top: trail.y - (hovered ? 20 : 14),
        width: hovered ? 40 : 28,
        height: hovered ? 40 : 28,
        borderRadius: '50%',
        border: `1px solid ${hovered ? C.accent : 'rgba(255,255,255,0.25)'}`,
        transition: 'width 0.3s, height 0.3s, border-color 0.3s, left 0s, top 0s',
      }} />
    </>
  )
}

// ─────────────────────────────────────────────────────────
//  GRAIN OVERLAY — The texture layer
// ─────────────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, zIndex: 9000, pointerEvents: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
      opacity: 0.028,
      mixBlendMode: 'overlay',
    }} />
  )
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

function LightSource() {
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: `
        radial-gradient(ellipse 55% 45% at -5% -5%, rgba(91,141,239,0.05) 0%, transparent 65%),
        radial-gradient(ellipse 35% 35% at 105% 105%, rgba(91,141,239,0.025) 0%, transparent 60%)
      `,
    }} />
  )
}

// ─────────────────────────────────────────────────────────
//  GHOST NUMERAL
// ─────────────────────────────────────────────────────────
function GhostNum({ num }) {
  return (
    <div aria-hidden style={{
      position: 'absolute', right: '-0.1em', top: '50%',
      transform: 'translateY(-58%)',
      fontFamily: F.display,
      fontSize: 'clamp(200px, 32vw, 360px)',
      color: C.textGhost, fontWeight: 600,
      lineHeight: 1, letterSpacing: '-0.05em',
      pointerEvents: 'none', userSelect: 'none', zIndex: 0,
    }}>
      {num}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  SECTION TRANSITION FLASH
// ─────────────────────────────────────────────────────────
function SectionFlash({ num }) {
  return (
    <motion.div
      initial={{ opacity: 0.15 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 500, pointerEvents: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
      <span style={{ fontFamily: F.display, fontSize: 'clamp(120px, 25vw, 280px)', color: C.white, fontWeight: 600, letterSpacing: '-0.05em', lineHeight: 1 }}>
        {num}
      </span>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  SWIPE WRAPPER
// ─────────────────────────────────────────────────────────
function SwipeWrapper({ currentSection, onNavigate, children }) {
  const idx = SECTIONS.indexOf(currentSection)
  const dragX = useMotionValue(0)

  const handleDragEnd = (_, info) => {
    const v = info.velocity.x
    const o = info.offset.x
    if ((o < -80 || v < -500) && idx < SECTIONS.length - 1) onNavigate(SECTIONS[idx + 1])
    else if ((o > 80 || v > 500) && idx > 0) onNavigate(SECTIONS[idx - 1])
    dragX.set(0)
  }

  return (
    <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.06}
      onDragEnd={handleDragEnd} style={{ x: dragX, position: 'fixed', inset: 0 }}
      whileDrag={{ cursor: 'grabbing' }}>
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  INTRO
// ─────────────────────────────────────────────────────────
function Intro({ onDone }) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const ts = [[200, () => setStep(1)], [900, () => setStep(2)], [1700, () => setStep(3)], [2800, () => onDone()]]
    const timers = ts.map(([t, fn]) => setTimeout(fn, t))
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.9 }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <GridBg size="55%" />
      <LightSource />
      <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px', zIndex: 1 }}>
        <div style={{ width: 'clamp(100px, 16vw, 140px)', height: 1, background: C.line, margin: '0 auto 52px' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: step >= 1 ? '100%' : 0 }}
            transition={{ duration: 2.0, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', background: C.accent }} />
        </div>
        <AnimatePresence>
          {step >= 2 && (
            <motion.div initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
              <div style={{ fontFamily: F.display, fontSize: 'clamp(80px, 16vw, 130px)', color: C.white, fontWeight: 600, letterSpacing: '0.08em', lineHeight: 1, marginBottom: 16 }}>
                MJP
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} transition={{ delay: 0.5, duration: 1.0 }}
                style={{ fontFamily: F.bay, fontSize: 'clamp(13px, 2.5vw, 18px)', color: C.accent, letterSpacing: '0.14em' }}>
                {BAYBAYIN}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {step >= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}
            style={{ fontFamily: F.mono, fontSize: 'clamp(9px, 1.4vw, 11px)', color: C.textMute, letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 36 }}>
            Engineer · Analyst · Builder
          </motion.div>
        )}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0 }}
        style={{ position: 'absolute', bottom: 'clamp(20px, 4vw, 32px)', right: 'clamp(20px, 4vw, 40px)', fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.1em' }}>
        v9.5.0
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  CINEMATIC FADE
// ─────────────────────────────────────────────────────────
function CinematicFade({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1300); return () => clearTimeout(t) }, [onDone])
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.3, times: [0, 0.25, 0.75, 1] }}
      style={{ position: 'fixed', inset: 0, zIndex: 950, background: '#000', pointerEvents: 'none' }} />
  )
}

// ─────────────────────────────────────────────────────────
//  TITLE SCREEN
// ─────────────────────────────────────────────────────────
function TitleScreen({ onEnter }) {
  const [ready, setReady] = useState(false)
  const [entering, setEntering] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 700); return () => clearTimeout(t) }, [])
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}
      onClick={ready ? handleEnter : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: 900, background: C.bg, cursor: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <GridBg size="70%" />
      <LightSource />
      <div style={{ position: 'absolute', top: 'clamp(28px,4vw,40px)', left: 'clamp(20px,4vw,48px)', display: 'flex', alignItems: 'center', gap: 10, zIndex: 2 }}>
        <div style={{ width: 4, height: 4, background: C.accent, borderRadius: '50%' }} />
        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.16em' }}>MARKJP.DEV</span>
      </div>
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <div style={{ fontFamily: F.display, fontSize: 'clamp(96px, 20vw, 200px)', color: C.white, fontWeight: 600, letterSpacing: '0.1em', lineHeight: 0.88, marginBottom: 20 }}>
            MJP
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.8, duration: 1.0 }}
            style={{ fontFamily: F.bay, fontSize: 'clamp(15px, 3vw, 22px)', color: C.accent, letterSpacing: '0.18em', marginBottom: 48 }}>
            {BAYBAYIN}
          </motion.div>
        </motion.div>
        <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.7, duration: 0.9 }}
          style={{ width: 1, height: 'clamp(32px,5vw,48px)', background: `linear-gradient(to bottom, ${C.accent}99, transparent)`, margin: '0 auto 36px' }} />
        {ready && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0.6, 0.15, 0.6] }}
            transition={{ duration: 3.0, repeat: Infinity }}
            style={{ fontFamily: F.mono, fontSize: 'clamp(9px,1.6vw,11px)', color: C.textMute, letterSpacing: '0.24em', textTransform: 'uppercase' }}>
            Press any key to continue
          </motion.div>
        )}
      </div>
      <div style={{ position: 'absolute', bottom: 'clamp(20px,4vw,32px)', left: 0, right: 0, padding: '0 clamp(20px,4vw,48px)', display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.1em' }}>Quezon City, PH</span>
        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.1em' }}>© {new Date().getFullYear()} MJP</span>
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
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,5vw,64px)', background: 'rgba(18,19,26,0.95)', backdropFilter: 'blur(24px)', borderBottom: `1px solid ${C.line}` }}>
      <button onClick={() => { onNavigate('home'); setMenuOpen(false) }}
        style={{ background: 'none', border: 'none', cursor: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: 0 }}>
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
                style={{ position: 'absolute', top: 56, left: 0, right: 0, background: 'rgba(18,19,26,0.98)', borderBottom: `1px solid ${C.line}`, zIndex: 300 }}>
                {SECTIONS.map(s => (
                  <button key={s} onClick={() => { onNavigate(s); setMenuOpen(false) }}
                    style={{ width: '100%', background: currentSection === s ? C.accentDim : 'none', border: 'none', borderBottom: `1px solid ${C.line}`, cursor: 'pointer', padding: '16px clamp(16px,5vw,64px)', textAlign: 'left', fontFamily: F.mono, fontSize: 12, color: currentSection === s ? C.accent : C.textDim, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {s}
                  </button>
                ))}
                <a href="/resume.pdf" download style={{ display: 'block', padding: '16px clamp(16px,5vw,64px)', fontFamily: F.mono, fontSize: 12, color: C.accent, textDecoration: 'none', letterSpacing: '0.08em' }}>↓ Resume</a>
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
                style={{ background: active ? C.accentDim : 'none', border: 'none', cursor: 'none', fontFamily: F.mono, fontSize: 11, color: active ? C.accent : C.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 14px', transition: 'color 0.2s' }}
                onMouseOver={e => { if (!active) e.currentTarget.style.color = C.textDim }}
                onMouseOut={e => { if (!active) e.currentTarget.style.color = C.textMute }}>
                {s}
              </button>
            )
          })}
          <div style={{ width: 1, height: 14, background: C.line, margin: '0 6px' }} />
          <a href="/resume.pdf" download
            style={{ fontFamily: F.mono, fontSize: 11, color: C.textMute, letterSpacing: '0.08em', textDecoration: 'none', padding: '6px 12px', border: `1px solid ${C.line}`, transition: 'all 0.2s', cursor: 'none' }}
            onMouseOver={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.lineHover }}
            onMouseOut={e => { e.currentTarget.style.color = C.textMute; e.currentTarget.style.borderColor = C.line }}>
            ↓ CV
          </a>
          <div style={{ width: 1, height: 14, background: C.line, margin: '0 6px' }} />
          <a href="mailto:mark@markjp.dev"
            style={{ fontFamily: F.mono, fontSize: 11, color: C.accent, letterSpacing: '0.08em', textDecoration: 'none', padding: '6px 14px', border: `1px solid ${C.accent}33`, transition: 'all 0.2s', cursor: 'none' }}
            onMouseOver={e => e.currentTarget.style.background = C.accentDim}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
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
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 150, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(16px,5vw,64px)', background: 'rgba(18,19,26,0.95)', backdropFilter: 'blur(24px)', borderTop: `1px solid ${C.line}` }}>
      <button onClick={() => prev && onNavigate(prev)}
        style={{ background: 'none', border: 'none', cursor: prev ? 'none' : 'default', display: 'flex', alignItems: 'center', gap: 8, opacity: prev ? 1 : 0.18, padding: 0, transition: 'opacity 0.2s' }}
        onMouseOver={e => { if (prev) e.currentTarget.style.opacity = '0.6' }}
        onMouseOut={e => { if (prev) e.currentTarget.style.opacity = '1' }}>
        <span style={{ color: C.accent, fontSize: 14 }}>←</span>
        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{prev || ''}</span>
      </button>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {SECTIONS.map(s => (
          <button key={s} onClick={() => onNavigate(s)}
            style={{ width: s === currentSection ? 24 : 5, height: 4, background: s === currentSection ? C.accent : C.line, border: 'none', cursor: 'none', transition: 'all 0.3s', padding: 0, borderRadius: 2 }} />
        ))}
      </div>
      <button onClick={() => next && onNavigate(next)}
        style={{ background: 'none', border: 'none', cursor: next ? 'none' : 'default', display: 'flex', alignItems: 'center', gap: 8, opacity: next ? 1 : 0.18, padding: 0, transition: 'opacity 0.2s' }}
        onMouseOver={e => { if (next) e.currentTarget.style.opacity = '0.6' }}
        onMouseOut={e => { if (next) e.currentTarget.style.opacity = '1' }}>
        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{next || ''}</span>
        <span style={{ color: C.accent, fontSize: 14 }}>→</span>
      </button>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  HOME SCREEN — Baybayin watermark behind MJP
// ─────────────────────────────────────────────────────────
function HomeScreen({ onNavigate }) {
  const isMobile = useIsMobile()
  const roles = ['Business Analyst', 'Application Support Engineer', 'Clinical Systems Specialist', 'Backend Engineer']
  const [roleIdx, setRoleIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % roles.length), 3400)
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
      <LightSource />

      {/* LEFT — Identity */}
      <div style={{ width: isMobile ? '100%' : 'clamp(300px,46%,580px)', display: 'flex', flexDirection: 'column', justifyContent: isMobile ? 'flex-start' : 'center', padding: isMobile ? 'clamp(80px,12vw,100px) clamp(20px,6vw,48px) 36px' : '80px clamp(28px,5vw,64px)', position: 'relative', zIndex: 2, borderRight: isMobile ? 'none' : `1px solid ${C.line}`, borderBottom: isMobile ? `1px solid ${C.line}` : 'none', overflow: 'hidden' }}>

        {/* Baybayin watermark — the signature moment */}
        <div aria-hidden style={{
          position: 'absolute', bottom: '-10%', left: '-5%',
          fontFamily: F.bay,
          fontSize: 'clamp(100px, 18vw, 200px)',
          color: 'rgba(91,141,239,0.04)',
          letterSpacing: '0.1em',
          lineHeight: 1.2,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          zIndex: 0,
        }}>
          {BAYBAYIN}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Available */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(74,202,139,0.07)', border: '1px solid rgba(74,202,139,0.25)', padding: '7px 14px', marginBottom: 44, alignSelf: 'flex-start' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, animation: 'glow 2.5s infinite' }} />
            <span style={{ fontFamily: F.mono, fontSize: 'clamp(9px,1.5vw,10px)', color: C.green, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Available · Open to Work</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.22,1,0.36,1] }}
            style={{ fontFamily: F.display, fontSize: 'clamp(60px,9vw,104px)', color: C.white, fontWeight: 600, lineHeight: 0.92, letterSpacing: '0.06em', margin: '0 0 12px' }}>
            MJP
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.72 }} transition={{ delay: 0.55, duration: 0.9 }}
            style={{ fontFamily: F.bay, fontSize: 'clamp(12px,2vw,15px)', color: C.accent, letterSpacing: '0.14em', marginBottom: 28 }}>
            {BAYBAYIN}
          </motion.div>

          <div style={{ height: 22, overflow: 'hidden', marginBottom: 22 }}>
            <AnimatePresence mode="wait">
              <motion.div key={roleIdx} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.28 }}
                style={{ fontFamily: F.mono, fontSize: 'clamp(10px,1.4vw,11px)', color: C.accent, letterSpacing: '0.08em' }}>
                {roles[roleIdx]}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.7, transformOrigin: 'left' }}
            style={{ width: 32, height: 1, background: C.accent, marginBottom: 26 }} />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.62 }}
            style={{ fontFamily: F.body, fontSize: 'clamp(13px,1.4vw,15px)', color: C.textDim, lineHeight: 1.85, marginBottom: 40, maxWidth: 400, fontWeight: 300 }}>
            {YEARS}+ years in clinical systems and enterprise integrations.
            Building toward backend engineering.{' '}
            <span style={{ color: C.text, fontWeight: 400 }}>The support engineer who learned to read the source.</span>
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.78 }}
            style={{ display: 'flex', gap: 'clamp(16px,3.5vw,28px)', flexWrap: 'wrap' }}>
            {[
              { label: 'GitHub',   href: 'https://github.com/markjpdev' },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/jaysonpunsalan' },
              { label: 'Email',    href: 'mailto:mark@markjp.dev' },
            ].map(s => (
              <a key={s.label} href={s.href} target={s.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                style={{ fontFamily: F.body, fontSize: 'clamp(12px,1.5vw,14px)', fontWeight: 400, color: C.textDim, textDecoration: 'none', borderBottom: `1px solid ${C.line}`, paddingBottom: 3, transition: 'all 0.2s', cursor: 'none' }}
                onMouseOver={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accent + '50' }}
                onMouseOut={e => { e.currentTarget.style.color = C.textDim; e.currentTarget.style.borderColor = C.line }}>
                {s.label}
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* RIGHT — Navigation */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? 'clamp(24px,5vw,36px) clamp(20px,6vw,48px) clamp(52px,10vw,72px)' : '80px clamp(28px,5vw,64px)', position: 'relative', zIndex: 2 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginBottom: 28 }}>
          <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Navigate</span>
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map((item, i) => (
            <motion.button key={item.id}
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.32 + i * 0.09, duration: 0.55, ease: [0.22,1,0.36,1] }}
              onClick={() => onNavigate(item.id)}
              style={{ background: 'transparent', border: `1px solid ${C.line}`, cursor: 'none', textAlign: 'left', padding: 'clamp(16px,2.5vw,22px) clamp(16px,3vw,28px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.22s', minHeight: 'clamp(62px,9vw,76px)' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.lineHover; e.currentTarget.style.background = C.bgCard }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = 'transparent' }}>
              <div>
                <div style={{ fontFamily: F.display, fontSize: 'clamp(20px,2.8vw,30px)', color: C.white, fontWeight: 600, lineHeight: 1, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontFamily: F.mono, fontSize: 'clamp(9px,1.1vw,10px)', color: C.textMute, letterSpacing: '0.08em' }}>{item.sub}</div>
              </div>
              <span style={{ color: C.accent, fontSize: 16, opacity: 0.45 }}>→</span>
            </motion.button>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 14, height: 1, background: C.line }} />
          <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.1em' }}>Quezon City, PH · UTC+8</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  SCREEN SHELL
// ─────────────────────────────────────────────────────────
const ENTRANCE = {
  about:    { initial: { opacity: 0, x: -28 },      animate: { opacity: 1, x: 0 } },
  skills:   { initial: { opacity: 0, y: -20 },      animate: { opacity: 1, y: 0 } },
  projects: { initial: { opacity: 0, scale: 0.985 },animate: { opacity: 1, scale: 1 } },
  contact:  { initial: { opacity: 0, y: 28 },       animate: { opacity: 1, y: 0 } },
}

function ScreenShell({ children, title, index, sectionId }) {
  const e = ENTRANCE[sectionId] || ENTRANCE.about
  return (
    <motion.div initial={e.initial} animate={e.animate} exit={{ opacity: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'fixed', inset: 0, background: C.bg, overflowY: 'auto', paddingTop: 56, paddingBottom: 50 }}>
      <LightSource />
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <GhostNum num={index} />
      </div>
      <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(32px,5vw,56px) clamp(20px,6vw,80px) clamp(40px,6vw,56px)', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
          style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 52 }}>
          <span style={{ fontFamily: F.display, fontSize: 13, color: C.textMute, letterSpacing: '0.04em' }}>{index}</span>
          <div style={{ width: 1, height: 14, background: C.line }} />
          <span style={{ fontFamily: F.mono, fontSize: 11, color: C.accent, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{title}</span>
          <div style={{ width: 36, height: 1, background: C.line }} />
          <span style={{ fontFamily: F.bay, fontSize: 11, color: C.accent, opacity: 0.28 }}>{BAYBAYIN.split(' ')[0]}</span>
        </motion.div>
        {children}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  ABOUT
// ─────────────────────────────────────────────────────────
const TIMELINE = [
  { period: '2023 — Present', role: 'Business Analyst & App Support Engineer', company: 'RxPx Health',                                     color: C.accent },
  { period: '2020 — 2023',    role: 'Clinical Systems Support Specialist',      company: 'Thermo Fisher Scientific (PPD)',                  color: '#6BBFEF' },
  { period: '2019',           role: 'B.S. Information Technology',              company: 'Best Thesis Finalist — IoT Flood Monitoring',     color: C.green },
]

function AboutScreen() {
  const isMobile = useIsMobile()
  return (
    <ScreenShell title="About" index="01" sectionId="about">
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1.2fr) minmax(0,0.8fr)', gap: 'clamp(28px,5vw,72px)', paddingBottom: 40 }}>
        <div>
          <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.7, ease: [0.22,1,0.36,1] }}
            style={{ fontFamily: F.display, fontSize: 'clamp(30px,4.5vw,54px)', color: C.white, fontWeight: 600, lineHeight: 1.12, letterSpacing: '0.01em', marginBottom: 32 }}>
            I've spent a decade inside systems most engineers never touch.{' '}
            <span style={{ color: C.accent }}>Now I'm building them.</span>
          </motion.h2>

          {[
            `Clinical trial platforms. Enterprise integrations. Federated authentication across regulated environments. Most engineers read about these systems. I kept them running — under SLA pressure, across timezones, inside GxP compliance frameworks that leave no room for error.`,
            `The transition to backend engineering is not a pivot. It is a natural extension. Python, Go, Docker, FastAPI — not new directions, but new instruments in a toolkit built over ${YEARS} years.`,
          ].map((text, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 + i * 0.1 }}
              style={{ fontFamily: F.body, fontSize: 'clamp(14px,1.5vw,15px)', color: C.textDim, lineHeight: 1.9, marginBottom: 18, fontWeight: 300 }}>
              {text}
            </motion.p>
          ))}

          {/* Timeline */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ marginTop: 44, borderTop: `1px solid ${C.line}`, paddingTop: 32 }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 28 }}>Experience</div>
            {TIMELINE.map((entry, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.08 }}
                style={{ display: 'flex', gap: 'clamp(14px,2vw,24px)', alignItems: 'center', padding: 'clamp(14px,2vw,18px) 0', borderBottom: `1px solid ${C.line}` }}>
                <div style={{ width: 2, height: 'clamp(16px,2.5vw,20px)', background: entry.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F.display, fontSize: 'clamp(15px,1.8vw,18px)', color: C.text, fontWeight: 600, lineHeight: 1.2, marginBottom: 3 }}>{entry.role}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 'clamp(9px,1.2vw,10px)', color: entry.color, letterSpacing: '0.08em' }}>{entry.company}</div>
                </div>
                <div style={{ fontFamily: F.mono, fontSize: 'clamp(9px,1.2vw,10px)', color: C.textMute, letterSpacing: '0.06em', flexShrink: 0 }}>{entry.period}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Status + Resume */}
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
            style={{ background: C.bgCard, border: `1px solid ${C.line}`, padding: 'clamp(20px,3vw,28px)', marginBottom: 3 }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 22 }}>Status</div>
            {[
              { l: 'Full Name', v: 'Mark Jayson Punsalan' },
              { l: 'Handle',    v: 'MJP' },
              { l: 'Role',      v: 'Engineer / Analyst' },
              { l: 'Location',  v: 'Quezon City, PH' },
              { l: 'Status',    v: 'Available', c: C.green },
              { l: 'Focus',     v: 'Backend Engineering', c: C.accent },
            ].map(row => (
              <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: `1px solid ${C.line}` }}>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute }}>{row.l}</span>
                <span style={{ fontFamily: F.body, fontSize: 13, color: row.c || C.textDim, fontWeight: 400 }}>{row.v}</span>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <a href="/resume.pdf" download
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.bgCard, border: `1px solid ${C.line}`, padding: 'clamp(14px,2vw,20px) clamp(16px,2.5vw,24px)', textDecoration: 'none', transition: 'all 0.2s', cursor: 'none' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.accent + '44'; e.currentTarget.style.background = C.bgHover }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = C.bgCard }}>
              <div>
                <div style={{ fontFamily: F.body, fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 3 }}>Download CV</div>
                <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMute, letterSpacing: '0.08em' }}>PDF · Updated 2025</div>
              </div>
              <span style={{ color: C.accent, fontSize: 18 }}>↓</span>
            </a>
          </motion.div>
        </div>
      </div>
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────
//  SKILLS — Depth left, Direction right. Correct fonts.
// ─────────────────────────────────────────────────────────
const DEPTH = [
  { domain: 'Clinical SaaS Operations',  tools: 'Veeva Vault · Medidata Rave · Chameleon IRT' },
  { domain: 'System Integration',        tools: 'REST APIs · SOAP · SFTP · Webhooks · OAuth2' },
  { domain: 'Identity & Access',         tools: 'SSO · SAML · Federated Auth · Role Management' },
  { domain: 'Data & Compliance',         tools: 'SQL · PostgreSQL · GxP · Audit Trails · UAT' },
  { domain: 'Project & Documentation',   tools: 'Jira · Confluence · ServiceNow · Git' },
]

// Direction uses F.mono — tool names belong in monospace
const DIRECTION = ['Python', 'FastAPI', 'Docker', 'Linux / CLI', 'Go', 'Kubernetes', 'Next.js', 'PostgreSQL']

function SkillsScreen() {
  const isMobile = useIsMobile()
  return (
    <ScreenShell title="Skills" index="02" sectionId="skills">
      <div style={{ paddingBottom: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 'clamp(24px,4vw,60px)' }}>

          {/* LEFT — Depth */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 2, height: 12, background: C.accent }} />
              What I know deeply
            </div>
            {DEPTH.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 + i * 0.08 }}
                style={{ padding: 'clamp(14px,2vw,18px) 0', borderBottom: `1px solid ${C.line}` }}>
                <div style={{ fontFamily: F.display, fontSize: 'clamp(16px,2vw,20px)', color: C.text, fontWeight: 600, lineHeight: 1, marginBottom: 7 }}>{item.domain}</div>
                <div style={{ fontFamily: F.mono, fontSize: 'clamp(9px,1.2vw,10px)', color: C.textMute, letterSpacing: '0.06em', lineHeight: 1.7 }}>{item.tools}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* RIGHT — Direction. F.mono on tech names. */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 2, height: 12, background: C.green }} />
              What I'm building with
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
              {DIRECTION.map((tech, i) => (
                <motion.div key={tech}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  style={{ background: C.bgCard, border: `1px solid ${C.line}`, padding: 'clamp(14px,2vw,18px)', transition: 'all 0.2s', cursor: 'default' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = C.green + '44'; e.currentTarget.style.background = C.bgHover }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = C.bgCard }}>
                  {/* Tool names in monospace — correct */}
                  <div style={{ fontFamily: F.mono, fontSize: 'clamp(11px,1.5vw,13px)', color: C.text, fontWeight: 400, letterSpacing: '0.04em' }}>{tech}</div>
                </motion.div>
              ))}
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
              style={{ fontFamily: F.body, fontSize: 13, color: C.textMute, lineHeight: 1.8, marginTop: 24, fontWeight: 300, paddingLeft: 14, borderLeft: `1px solid ${C.line}` }}>
              Not declaring mastery — declaring direction. The clinical domain knowledge behind these tools is what makes the combination rare.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────
//  PROJECTS — Featured card + secondary list
// ─────────────────────────────────────────────────────────
function ProjectsScreen() {
  const [open, setOpen] = useState(null)
  const isMobile = useIsMobile()

  const SECONDARY = [
    {
      num: '02', title: 'markjp.dev', status: 'Live', sc: C.accent,
      summary: 'Designed and built from scratch. Cinematic entry, Baybayin identity, full-screen architecture. Nine iterations. Still going.',
      tags: ['Next.js', 'Framer Motion', 'Netlify'], link: 'https://markjp.dev',
    },
    {
      num: '03', title: 'Clinical REST API', status: 'In Progress', sc: '#6BBFEF',
      summary: 'Healthcare SaaS integrations built by engineers who have never touched the data. I have. This API reflects how clinical data actually flows.',
      tags: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'], link: null, note: 'GitHub and live demo on deploy.',
    },
    {
      num: '04', title: 'Next Project', status: 'Planned', sc: C.textMute,
      summary: 'Something worth building. Details when it\'s ready to talk about.',
      tags: [], link: null, ghost: true,
    },
  ]

  return (
    <ScreenShell title="Projects" index="03" sectionId="projects">
      <div style={{ paddingBottom: 40 }}>

        {/* FEATURED — IoT Thesis. Full width. Solid presence. */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          style={{ background: C.bgCard, border: `1px solid ${C.green}33`, padding: 'clamp(24px,4vw,40px)', marginBottom: 3, position: 'relative', overflow: 'hidden' }}>
          {/* Background accent */}
          <div aria-hidden style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', background: `radial-gradient(ellipse 80% 80% at 100% 50%, ${C.green}06 0%, transparent 70%)`, pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20, position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.green, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10 }}>Featured · Shipped</div>
              <h3 style={{ fontFamily: F.display, fontSize: 'clamp(24px,3.5vw,38px)', color: C.white, fontWeight: 600, margin: 0, lineHeight: 1.1 }}>
                IoT Flood Monitoring System
              </h3>
            </div>
            <span style={{ fontFamily: F.mono, fontSize: 10, color: C.green, border: `1px solid ${C.green}55`, padding: '5px 14px', letterSpacing: '0.1em', flexShrink: 0, alignSelf: 'flex-start' }}>
              Best Thesis Finalist
            </span>
          </div>

          <p style={{ fontFamily: F.body, fontSize: 'clamp(13px,1.5vw,15px)', color: C.textDim, lineHeight: 1.85, marginBottom: 20, maxWidth: 580, fontWeight: 300, position: 'relative', zIndex: 1 }}>
            Flood-prone communities lack affordable real-time monitoring. Built a low-cost IoT sensor network — end to end — with automated data ingestion, threshold-based alerting, and a live dashboard designed to run on minimal infrastructure. Demonstrated that enterprise-grade monitoring principles scale down to community level.
          </p>

          <div style={{ display: 'flex', gap: 'clamp(5px,1vw,8px)', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            {['IoT', 'Embedded Systems', 'Real-time Sensors', 'Alert Pipeline', 'Dashboard'].map(t => (
              <span key={t} style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, border: `1px solid ${C.line}`, padding: '4px 10px', letterSpacing: '0.06em' }}>{t}</span>
            ))}
          </div>
        </motion.div>

        {/* SECONDARY — remaining projects */}
        {SECONDARY.map((p, i) => (
          <motion.div key={p.num} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 + i * 0.09 }} style={{ marginBottom: 3 }}>
            <div
              onClick={() => !p.ghost && setOpen(open === i ? null : i)}
              style={{ background: open === i ? C.bgCard : 'transparent', border: `1px solid ${open === i ? p.sc + '30' : C.line}`, padding: 'clamp(16px,2.5vw,24px)', cursor: p.ghost ? 'default' : 'none', transition: 'all 0.22s', opacity: p.ghost ? 0.45 : 1 }}
              onMouseOver={e => { if (!p.ghost && open !== i) e.currentTarget.style.borderColor = C.lineHover }}
              onMouseOut={e => { if (!p.ghost && open !== i) e.currentTarget.style.borderColor = C.line }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px,2vw,20px)', flexWrap: 'wrap', marginBottom: open === i ? 16 : 0 }}>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, flexShrink: 0 }}>{p.num}</span>
                <h3 style={{ flex: 1, fontFamily: F.display, fontSize: 'clamp(17px,2.2vw,22px)', color: p.ghost ? C.textMute : C.white, fontWeight: 600, margin: 0, minWidth: 120 }}>{p.title}</h3>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: p.sc, border: `1px solid ${p.sc}44`, padding: '3px 10px', letterSpacing: '0.08em', flexShrink: 0 }}>{p.status}</span>
                {!p.ghost && <span style={{ color: C.textMute, fontSize: 13, transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>→</span>}
              </div>
              <AnimatePresence>
                {(open === i || p.ghost) && !p.ghost && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', paddingLeft: 28 }}>
                    <p style={{ fontFamily: F.body, fontSize: 'clamp(13px,1.4vw,14px)', color: C.textDim, lineHeight: 1.8, marginBottom: 14, fontWeight: 300, maxWidth: 520 }}>{p.summary}</p>
                    {p.note && <p style={{ fontFamily: F.mono, fontSize: 11, color: C.textMute, marginBottom: 12, letterSpacing: '0.04em' }}>{p.note}</p>}
                    {p.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 'clamp(5px,1vw,7px)', flexWrap: 'wrap', marginBottom: p.link ? 12 : 0 }}>
                        {p.tags.map(t => <span key={t} style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, border: `1px solid ${C.line}`, padding: '4px 10px', letterSpacing: '0.06em' }}>{t}</span>)}
                      </div>
                    )}
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontFamily: F.mono, fontSize: 11, color: C.accent, textDecoration: 'none', letterSpacing: '0.06em', cursor: 'none' }}>↗ {p.link.replace('https://', '')}</a>}
                  </motion.div>
                )}
                {p.ghost && (
                  <p style={{ fontFamily: F.body, fontSize: 14, color: C.textMute, margin: '8px 0 0', fontWeight: 300 }}>{p.summary}</p>
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
//  CONTACT — Elevated. Not a form page.
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
  const inp = { width: '100%', background: C.bgCard, border: `1px solid ${C.line}`, padding: 'clamp(10px,1.5vw,13px) clamp(12px,2vw,16px)', fontFamily: F.body, fontSize: 'clamp(13px,1.5vw,14px)', color: C.text, outline: 'none', transition: 'border-color 0.2s', fontWeight: 300 }
  const lbl = { fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.16em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }

  return (
    <ScreenShell title="Contact" index="04" sectionId="contact">
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) minmax(0,1fr)', gap: 'clamp(28px,5vw,72px)', paddingBottom: 40 }}>

        {/* LEFT — Statement, not a heading */}
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <p style={{ fontFamily: F.mono, fontSize: 10, color: C.textMute, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>The right fit</p>
            <h2 style={{ fontFamily: F.display, fontSize: 'clamp(32px,4.5vw,56px)', color: C.white, fontWeight: 600, lineHeight: 1.08, letterSpacing: '0.01em', marginBottom: 28 }}>
              If you're building something that matters,<br />
              <span style={{ color: C.accent }}>I want to be in that room.</span>
            </h2>
            <p style={{ fontFamily: F.body, fontSize: 'clamp(13px,1.5vw,15px)', color: C.textDim, lineHeight: 1.9, marginBottom: 40, fontWeight: 300, maxWidth: 420 }}>
              Backend engineering roles. Clinical systems architecture. Problems at the intersection of technology and regulated industries. If the work is serious, so am I.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>
            {[
              { l: 'Email',    v: 'mark@markjp.dev',      h: 'mailto:mark@markjp.dev' },
              { l: 'GitHub',   v: 'github.com/markjpdev', h: 'https://github.com/markjpdev' },
              { l: 'LinkedIn', v: 'in/jaysonpunsalan',    h: 'https://linkedin.com/in/jaysonpunsalan' },
            ].map(item => (
              <div key={item.l} style={{ padding: 'clamp(12px,1.8vw,16px) 0', borderBottom: `1px solid ${C.line}` }}>
                <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMute, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 5 }}>{item.l}</div>
                <a href={item.h} target={item.h.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                  style={{ fontFamily: F.body, fontSize: 'clamp(13px,1.5vw,15px)', color: C.textDim, textDecoration: 'none', fontWeight: 300, transition: 'color 0.2s', cursor: 'none' }}
                  onMouseOver={e => e.currentTarget.style.color = C.accent}
                  onMouseOut={e => e.currentTarget.style.color = C.textDim}>
                  {item.v}
                </a>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
          {sent ? (
            <div style={{ background: C.bgCard, border: `1px solid ${C.line}`, padding: 'clamp(40px,6vw,56px) clamp(24px,4vw,36px)', textAlign: 'center' }}>
              <div style={{ fontFamily: F.display, fontSize: 'clamp(24px,3.5vw,36px)', color: C.white, fontWeight: 600, marginBottom: 14 }}>Sent.</div>
              <p style={{ fontFamily: F.body, fontSize: 14, color: C.textDim, lineHeight: 1.8, fontWeight: 300 }}>Your mail client should have opened. I'll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px,2vw,18px)' }}>
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
                <textarea style={{ ...inp, minHeight: 'clamp(90px,12vw,120px)', resize: 'vertical' }} placeholder="Tell me about the work." value={form.message} required
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = C.line} />
              </div>
              <button type="submit"
                style={{ background: C.accent, border: 'none', padding: 'clamp(11px,1.5vw,13px) clamp(22px,3vw,30px)', fontFamily: F.mono, fontSize: 11, color: C.bg, fontWeight: 700, letterSpacing: '0.14em', cursor: 'none', transition: 'opacity 0.2s', textTransform: 'uppercase', alignSelf: 'flex-start' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                Send →
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
  const [flash, setFlash] = useState(null)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const navigate = id => {
    if (id !== 'home' && section !== id) {
      const num = { about: '01', skills: '02', projects: '03', contact: '04' }[id]
      if (num) { setFlash(num); setTimeout(() => setFlash(null), 600) }
    }
    setSection(id === 'home' ? null : id)
  }

  const SCREENS = { about: AboutScreen, skills: SkillsScreen, projects: ProjectsScreen, contact: ContactScreen }
  const ActiveScreen = section ? SCREENS[section] : null

  return (
    <>
      <Head>
        <title>MJP — Mark Jayson Punsalan</title>
        <meta name="description" content="MJP — Mark Jayson Punsalan. Engineer, Analyst, Builder. Quezon City, Philippines." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#12131A" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&family=Noto+Sans+Tagalog&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next { background: ${C.bg}; min-height: 100%; height: 100%; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; cursor: none; }
        a { color: inherit; }
        button { outline: none; -webkit-tap-highlight-color: transparent; }
        @media (hover: none) { body { cursor: auto; } }

        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.accent}44; }
        ::selection { background: ${C.accentDim}; color: ${C.white}; }

        input, textarea { -webkit-appearance: none; border-radius: 0; cursor: none; }
        input::placeholder, textarea::placeholder {
          color: ${C.textMute};
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 300;
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 6px ${C.green}88, 0 0 12px ${C.green}22; }
          50%       { box-shadow: 0 0 2px ${C.green}44; }
        }
      `}} />

      {/* Global layers */}
      <GrainOverlay />
      <CustomCursor />

      <AnimatePresence mode="wait">
        {phase === 'intro' && <Intro key="intro" onDone={() => setPhase('title')} />}
        {phase === 'title' && <TitleScreen key="title" onEnter={() => setPhase('transition')} />}
        {phase === 'transition' && <CinematicFade key="fade" onDone={() => setPhase('main')} />}
        {phase === 'main' && (
          <motion.div key="main" style={{ position: 'fixed', inset: 0 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {section && <TopBar currentSection={section} onNavigate={navigate} />}
            {section && <BottomNav currentSection={section} onNavigate={navigate} />}

            {/* Section transition flash */}
            <AnimatePresence>
              {flash && <SectionFlash key={flash} num={flash} />}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!section && <HomeScreen key="home" onNavigate={navigate} />}
              {section && ActiveScreen && (
                <SwipeWrapper key={section} currentSection={section} onNavigate={navigate}>
                  <ActiveScreen />
                </SwipeWrapper>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
