import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'

// ─────────────────────────────────────────────────────────
//  MJP — Portfolio v9.1
//  Cormorant Garamond · Baybayin · Cinematic fade
// ─────────────────────────────────────────────────────────

const C = {
  bg:        '#0F1014',
  bgCard:    '#15161C',
  bgHover:   '#1A1B22',
  line:      'rgba(255,255,255,0.09)',
  lineHover: 'rgba(255,255,255,0.18)',
  text:      '#E8EAF0',
  textDim:   'rgba(232,234,240,0.68)',
  textMute:  'rgba(232,234,240,0.38)',
  accent:    '#5B8DEF',
  accentDim: 'rgba(91,141,239,0.14)',
  white:     '#F6F7FA',
  green:     '#4ACA8B',
}

const BAYBAYIN = 'ᜋᜀᜇ᜔ᜃ ᜌᜒᜐᜓᜈ᜔ ᜉᜓᜈ᜔ᜐᜀᜎᜀᜈ᜔'

// ─────────────────────────────────────────────────────────
//  FADE TRANSITION — black fade, invisible seam
// ─────────────────────────────────────────────────────────
function FadeTransition({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 900)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.9, times: [0, 0.3, 0.7, 1], ease: 'easeInOut' }}
      style={{ position: 'fixed', inset: 0, zIndex: 950, background: '#000', pointerEvents: 'none' }}
    />
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
      [800,  () => setStep(2)],
      [1600, () => setStep(3)],
      [2500, () => setStep(4)],
      [3400, () => onDone()],
    ]
    const timers = ts.map(([t, fn]) => setTimeout(fn, t))
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000, background: C.bg,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse 55% 55% at 50% 50%, black 20%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 55% 55% at 50% 50%, black 20%, transparent 100%)',
      }} />

      <div style={{ position: 'relative', textAlign: 'center', zIndex: 2 }}>
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 16, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(72px, 12vw, 140px)',
                color: C.white, fontWeight: 700,
                letterSpacing: '0.12em', lineHeight: 1, marginBottom: 16,
              }}>MJP</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{
                fontFamily: "'Noto Sans Tagalog', sans-serif",
                fontSize: 'clamp(16px, 2.5vw, 22px)',
                color: C.textMute, letterSpacing: '0.18em', marginBottom: 36,
              }}>{BAYBAYIN}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {step >= 1 && (
          <div style={{ width: 'clamp(120px, 20vw, 180px)', height: 1, background: C.line, margin: '0 auto' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: step >= 4 ? '100%' : step >= 3 ? '75%' : step >= 2 ? '45%' : '10%' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ height: '100%', background: C.accent }}
            />
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 32, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.12em' }}>
        markjp.dev
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  TITLE SCREEN
// ─────────────────────────────────────────────────────────
function TitleScreen({ onEnter }) {
  const [ready, setReady] = useState(false)
  const [entering, setEntering] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 500)
    return () => clearTimeout(t)
  }, [])

  const handleEnter = useCallback(() => {
    if (entering) return
    setEntering(true)
    setTimeout(onEnter, 100)
  }, [entering, onEnter])

  useEffect(() => {
    if (!ready) return
    const h = e => { if (!['Tab','Shift','Control','Alt','Meta'].includes(e.key)) handleEnter() }
    window.addEventListener('keydown', h, { once: true })
    return () => window.removeEventListener('keydown', h)
  }, [ready, handleEnter])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={ready ? handleEnter : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 900, background: C.bg,
        cursor: ready ? 'pointer' : 'default',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black 10%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black 10%, transparent 100%)',
      }} />

      <div aria-hidden style={{
        position: 'absolute', width: '40vw', height: '40vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(91,141,239,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'absolute', top: 36, left: 48, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 5, height: 5, background: C.accent, borderRadius: '50%' }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.14em' }}>MARKJP.DEV</span>
      </div>

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(80px, 14vw, 160px)',
            color: C.white, fontWeight: 700,
            letterSpacing: '0.14em', lineHeight: 1, marginBottom: 18,
          }}>MJP</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ fontFamily: "'Noto Sans Tagalog', sans-serif", fontSize: 'clamp(15px, 2vw, 20px)', color: C.textMute, letterSpacing: '0.2em', marginBottom: 48 }}
        >{BAYBAYIN}</motion.div>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 48, height: 1, background: C.accent, margin: '0 auto 40px' }}
        />

        <AnimatePresence>
          {ready && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0.7, 0.2, 0.7] }}
              transition={{ duration: 2.8, repeat: Infinity }}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: C.textDim, letterSpacing: '0.18em', textTransform: 'uppercase' }}
            >Press any key to continue</motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, padding: '0 48px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.1em' }}>Engineer · Analyst · Builder</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.1em' }}>© {new Date().getFullYear()}</span>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  TOP BAR
// ─────────────────────────────────────────────────────────
function TopBar({ currentSection, onNavigate }) {
  const SECTIONS = ['about', 'skills', 'projects', 'contact']
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 58,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(24px, 5vw, 64px)',
        background: 'rgba(15,16,20,0.90)', backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      <button onClick={() => onNavigate('home')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: 0 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: C.white, fontWeight: 700, letterSpacing: '0.1em' }}>MJP</span>
        <div style={{ width: 1, height: 16, background: C.line }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.1em' }}>markjp.dev</span>
      </button>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {SECTIONS.map(s => {
          const active = currentSection === s
          return (
            <button key={s} onClick={() => onNavigate(s)}
              style={{
                background: active ? C.accentDim : 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: active ? C.accent : C.textDim,
                letterSpacing: '0.08em', textTransform: 'uppercase', padding: '7px 16px', transition: 'all 0.2s',
              }}
              onMouseOver={e => { if (!active) e.currentTarget.style.color = C.text }}
              onMouseOut={e => { if (!active) e.currentTarget.style.color = C.textDim }}
            >{s}</button>
          )
        })}
        <div style={{ width: 1, height: 16, background: C.line, margin: '0 8px' }} />
        <a href="mailto:mark@markjp.dev"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.accent, letterSpacing: '0.08em', textDecoration: 'none', padding: '7px 16px', border: `1px solid ${C.accent}33`, transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background = C.accentDim }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent' }}
        >hire</a>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  HOME SCREEN
// ─────────────────────────────────────────────────────────
function HomeScreen({ onNavigate }) {
  const roles = ['Business Analyst', 'Application Support Engineer', 'Clinical Systems Specialist', 'Backend Engineer']
  const [roleIdx, setRoleIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % roles.length), 3200)
    return () => clearInterval(t)
  }, [])

  const NAV = [
    { id: 'about',    label: 'About',    sub: 'Background & story' },
    { id: 'skills',   label: 'Skills',   sub: 'Stack & expertise' },
    { id: 'projects', label: 'Projects', sub: 'Work & builds' },
    { id: 'contact',  label: 'Contact',  sub: "Let's talk" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: 'fixed', inset: 0, background: C.bg, display: 'flex' }}
    >
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse 70% 90% at 12% 50%, black 0%, transparent 65%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 90% at 12% 50%, black 0%, transparent 65%)',
      }} />
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 45% 50% at 8% 50%, rgba(91,141,239,0.055) 0%, transparent 70%)',
      }} />

      {/* LEFT */}
      <div style={{
        width: 'clamp(300px, 46%, 560px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '80px clamp(24px, 5vw, 64px)',
        position: 'relative', zIndex: 2,
        borderRight: `1px solid ${C.line}`,
      }}>
        {/* Available badge */}
        <motion.div
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 44, alignSelf: 'flex-start' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(74,202,139,0.10)',
            border: '1px solid rgba(74,202,139,0.30)',
            padding: '8px 16px',
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%', background: C.green,
              boxShadow: `0 0 8px ${C.green}, 0 0 16px rgba(74,202,139,0.4)`,
              animation: 'statusPulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.green, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
              Available · Open to Work
            </span>
          </div>
        </motion.div>

        {/* MJP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 8 }}
        >
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(52px, 7vw, 88px)', color: C.white, fontWeight: 700, lineHeight: 1, letterSpacing: '0.08em' }}>
            MJP
          </div>
        </motion.div>

        {/* Full name */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          style={{ marginBottom: 20 }}
        >
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: C.textDim, letterSpacing: '0.06em' }}>
            Mark Jayson Punsalan
          </div>
        </motion.div>

        {/* Role */}
        <div style={{ height: 26, overflow: 'hidden', marginBottom: 24 }}>
          <AnimatePresence mode="wait">
            <motion.div key={roleIdx}
              initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: C.accent, letterSpacing: '0.06em' }}
            >{roles[roleIdx]}</motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.5, transformOrigin: 'left' }}
          style={{ width: 36, height: 1, background: C.accent, marginBottom: 28 }}
        />

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: C.textDim, lineHeight: 1.85, marginBottom: 44, maxWidth: 400 }}
        >
          10+ years in clinical systems and enterprise integrations.
          Now building toward backend engineering — Python, Go, Docker, Kubernetes.{' '}
          <span style={{ color: C.text }}>The support engineer who learned to read the source.</span>
        </motion.p>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ display: 'flex', gap: 2, borderTop: `1px solid ${C.line}`, paddingTop: 28 }}
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
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.textDim,
                textDecoration: 'none', letterSpacing: '0.08em',
                padding: '10px 20px', border: `1px solid ${C.line}`, transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accent + '55'; e.currentTarget.style.background = C.accentDim }}
              onMouseOut={e => { e.currentTarget.style.color = C.textDim; e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = 'transparent' }}
            >{s.label}</a>
          ))}
        </motion.div>
      </div>

      {/* RIGHT — Navigation */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '80px clamp(24px, 5vw, 64px)', position: 'relative', zIndex: 2,
      }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Navigate</span>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map((item, i) => (
            <motion.button key={item.id}
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onNavigate(item.id)}
              style={{
                background: 'transparent', border: `1px solid ${C.line}`,
                cursor: 'pointer', textAlign: 'left',
                padding: 'clamp(22px, 3vw, 30px) clamp(24px, 3.5vw, 36px)',
                display: 'flex', alignItems: 'center', gap: 20, transition: 'all 0.25s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = C.lineHover; e.currentTarget.style.background = C.bgCard }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3vw, 34px)', color: C.white, fontWeight: 600, letterSpacing: '0.02em', lineHeight: 1, marginBottom: 6 }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.06em' }}>
                  {item.sub}
                </div>
              </div>
              <span style={{ color: C.accent, fontSize: 20, opacity: 0.7 }}>→</span>
            </motion.button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 20, height: 1, background: C.line }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.1em' }}>
            Quezon City, PH · UTC+8
          </span>
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
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ position: 'fixed', inset: 0, background: C.bg, overflowY: 'auto', paddingTop: 58 }}
    >
      <div style={{ padding: 'clamp(40px, 6vw, 72px) clamp(24px, 6vw, 80px) 80px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.12em' }}>{index}</span>
          <div style={{ width: 1, height: 14, background: C.line }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: C.accent, fontWeight: 600, letterSpacing: '0.06em' }}>{title}</span>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: C.line }} />
        </motion.div>
        {children}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  ABOUT
// ─────────────────────────────────────────────────────────
function AboutScreen() {
  return (
    <ScreenShell title="About" index="01">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: 'clamp(32px, 6vw, 80px)' }}>
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 4vw, 48px)', color: C.white, fontWeight: 700, letterSpacing: '0.01em', lineHeight: 1.2, marginBottom: 32 }}
          >
            Engineer who learned<br /><span style={{ color: C.accent }}>to read the source.</span>
          </motion.h2>

          {[
            '10+ years at the intersection of technology and healthcare — managing clinical trial platforms, designing system integrations, and keeping enterprise-grade tools running without incident.',
            'My background spans Veeva Vault, Medidata Rave, federated SSO/SAML architecture, SQL database management, and API integrations across GxP-regulated environments.',
            'Now building toward backend engineering — writing Python and Go, containerizing with Docker, learning Kubernetes. Not a career change. The next level.',
          ].map((text, i) => (
            <motion.p key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.1 }}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: C.textDim, lineHeight: 1.9, marginBottom: 18 }}
            >{text}</motion.p>
          ))}

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ marginTop: 36, borderTop: `1px solid ${C.line}`, paddingTop: 28 }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>Highlights</div>
            {[
              'Best Thesis Finalist — IoT Flood Monitoring System',
              'SAML/SSO federation architecture across enterprise platforms',
              '3+ years GxP-regulated clinical trial system support',
              'Cross-platform API integration specialist',
            ].map((h, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.07 }}
                style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}
              >
                <div style={{ width: 4, height: 4, background: C.accent, borderRadius: '50%', marginTop: 7, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textDim, lineHeight: 1.7 }}>{h}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: C.bgCard, border: `1px solid ${C.line}`, padding: '28px 24px', marginBottom: 3 }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 24 }}>Status</div>
            {[
              { l: 'Name',     v: 'Mark Jayson Punsalan' },
              { l: 'Role',     v: 'Engineer / Analyst' },
              { l: 'Location', v: 'Quezon City, PH' },
              { l: 'Status',   v: 'Available', c: C.green },
              { l: 'Focus',    v: 'Backend Eng.', c: C.accent },
            ].map(row => (
              <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: `1px solid ${C.line}` }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute }}>{row.l}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: row.c || C.textDim }}>{row.v}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ background: C.bgCard, border: `1px solid ${C.line}`, padding: '24px', textAlign: 'center' }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Name in Baybayin</div>
            <div style={{ fontFamily: "'Noto Sans Tagalog', sans-serif", fontSize: 24, color: C.textDim, letterSpacing: '0.14em', marginBottom: 8 }}>{BAYBAYIN}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.06em' }}>Mark Jayson Punsalan</div>
          </motion.div>
        </div>
      </div>
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────
//  SKILLS
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
  { name: 'Linux / CLI',          level: 70, cat: 'Engineering' },
]
const CAT_COLORS = { Core: C.accent, Platforms: '#6BBFEF', Engineering: C.green }

function SkillsScreen() {
  const [active, setActive] = useState('All')
  const cats = ['All', 'Core', 'Platforms', 'Engineering']
  const filtered = active === 'All' ? SKILL_DATA : SKILL_DATA.filter(s => s.cat === active)

  return (
    <ScreenShell title="Skills" index="02">
      <div style={{ display: 'flex', gap: 3, marginBottom: 40 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setActive(c)}
            style={{
              background: active === c ? C.accentDim : 'transparent',
              border: `1px solid ${active === c ? C.accent + '55' : C.line}`,
              cursor: 'pointer', padding: '8px 18px',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: active === c ? C.accent : C.textDim,
              letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s',
            }}
          >{c}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {filtered.map((skill, i) => (
            <motion.div key={skill.name}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{ display: 'grid', gridTemplateColumns: '220px 1fr 52px', gap: 28, alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${C.line}` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 3, height: 3, background: CAT_COLORS[skill.cat], borderRadius: '50%', flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textDim }}>{skill.name}</span>
              </div>
              <div style={{ height: 2, background: C.line, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 + 0.2, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: '100%', background: CAT_COLORS[skill.cat] }}
                />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, textAlign: 'right' }}>{skill.level}%</span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        style={{ marginTop: 48, borderTop: `1px solid ${C.line}`, paddingTop: 36 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>Also worked with</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Jira', 'Confluence', 'ServiceNow', 'Git', 'Next.js', 'REST APIs', 'SOAP', 'PostgreSQL', 'GxP Compliance', 'UAT', 'SSO/SAML', 'SFTP'].map(tag => (
            <span key={tag} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textDim, border: `1px solid ${C.line}`, padding: '6px 14px', letterSpacing: '0.06em' }}>{tag}</span>
          ))}
        </div>
      </motion.div>
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────
//  PROJECTS
// ─────────────────────────────────────────────────────────
const PROJECT_DATA = [
  { num: '01', title: 'IoT Flood Monitoring System', status: 'Completed', sc: C.green, tags: ['IoT', 'Sensors', 'Real-time', 'Embedded Systems'], desc: 'End-to-end flood monitoring system — real-time sensor ingestion, alert pipelines, live monitoring dashboard. Awarded Best Thesis Finalist.', link: null },
  { num: '02', title: 'markjp.dev', status: 'Live', sc: C.accent, tags: ['Next.js', 'Framer Motion', 'Netlify'], desc: 'Personal portfolio designed and built from scratch. Cinematic intro, full-screen sections, scroll-free navigation, deployed via GitHub → Netlify pipeline.', link: 'https://markjp.dev' },
  { num: '03', title: 'Clinical REST API', status: 'In Progress', sc: '#6BBFEF', tags: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'], desc: 'Mock clinical data API leveraging domain knowledge from years in healthcare SaaS. OpenAPI docs, containerized deployment, structured around real eClinical workflows.', link: null, wip: true },
]

function ProjectsScreen() {
  const [open, setOpen] = useState(null)
  return (
    <ScreenShell title="Projects" index="03">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {PROJECT_DATA.map((p, i) => (
          <motion.div key={p.num} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div
              onClick={() => setOpen(open === p.num ? null : p.num)}
              style={{ background: open === p.num ? C.bgCard : 'transparent', border: `1px solid ${open === p.num ? C.lineHover : C.line}`, padding: 'clamp(22px, 3vw, 32px)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => { if (open !== p.num) e.currentTarget.style.borderColor = C.lineHover }}
              onMouseOut={e => { if (open !== p.num) e.currentTarget.style.borderColor = C.line }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, width: 28, flexShrink: 0 }}>{p.num}</span>
                <h3 style={{ flex: 1, fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(20px, 2.5vw, 26px)', color: C.white, fontWeight: 600, letterSpacing: '0.02em', margin: 0 }}>{p.title}</h3>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.sc, border: `1px solid ${p.sc}44`, padding: '4px 12px', letterSpacing: '0.08em', flexShrink: 0 }}>{p.status}</span>
                <span style={{ color: C.textMute, fontSize: 14, transform: open === p.num ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>→</span>
              </div>
              <AnimatePresence>
                {open === p.num && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', paddingLeft: 48, paddingTop: 20 }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textDim, lineHeight: 1.85, marginBottom: 18, maxWidth: 580 }}>{p.desc}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                      {p.tags.map(t => <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, border: `1px solid ${C.line}`, padding: '5px 12px' }}>{t}</span>)}
                    </div>
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.accent, textDecoration: 'none' }}>↗ Visit Site</a>}
                    {p.wip && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.textMute }}>Links available on deploy</span>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.textMute, marginTop: 28, letterSpacing: '0.06em' }}>
        More projects in progress. GitHub links added on deploy.
      </p>
    </ScreenShell>
  )
}

// ─────────────────────────────────────────────────────────
//  CONTACT
// ─────────────────────────────────────────────────────────
function ContactScreen() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const submit = e => {
    e.preventDefault()
    window.open(`mailto:mark@markjp.dev?subject=${encodeURIComponent(`Message from ${form.name}`)}&body=${encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`)
    setSent(true)
  }

  const inp = { width: '100%', background: C.bgCard, border: `1px solid ${C.line}`, padding: '13px 18px', fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.text, outline: 'none', transition: 'border-color 0.2s' }
  const lbl = { fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }

  return (
    <ScreenShell title="Contact" index="04">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 'clamp(32px, 6vw, 80px)' }}>
        <div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 4vw, 48px)', color: C.white, fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.2, marginBottom: 20 }}>
            Let's work<br /><span style={{ color: C.accent }}>together.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: C.textDim, lineHeight: 1.85, marginBottom: 44 }}>
            Open to backend engineering roles, clinical systems consulting, and interesting problems at the intersection of tech and healthcare.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {[
              { l: 'Email',    v: 'mark@markjp.dev',      h: 'mailto:mark@markjp.dev' },
              { l: 'GitHub',   v: 'github.com/markjpdev', h: 'https://github.com/markjpdev' },
              { l: 'LinkedIn', v: 'in/jaysonpunsalan',    h: 'https://linkedin.com/in/jaysonpunsalan' },
            ].map(item => (
              <div key={item.l} style={{ padding: '16px 0', borderBottom: `1px solid ${C.line}` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.textMute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>{item.l}</div>
                <a href={item.h} target={item.h.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: C.textDim, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = C.accent}
                  onMouseOut={e => e.currentTarget.style.color = C.textDim}
                >{item.v}</a>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {sent ? (
            <div style={{ background: C.bgCard, border: `1px solid ${C.line}`, padding: '56px 36px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: C.white, fontWeight: 700, marginBottom: 12, letterSpacing: '0.06em' }}>Sent.</div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.textDim, lineHeight: 1.7 }}>Your mail client should have opened. I'll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
                <textarea style={{ ...inp, minHeight: 120, resize: 'vertical' }} placeholder="What's on your mind?" value={form.message} required
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = C.line} />
              </div>
              <button type="submit"
                style={{ background: C.accent, border: 'none', padding: '14px 32px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: C.bg, fontWeight: 700, letterSpacing: '0.12em', cursor: 'pointer', transition: 'opacity 0.2s', textTransform: 'uppercase', alignSelf: 'flex-start' }}
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
        <meta name="description" content="Mark Jayson Punsalan — Engineer, Analyst, Builder. Based in the Philippines." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&family=Noto+Sans+Tagalog&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next { background: ${C.bg}; height: 100%; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        a { color: inherit; }
        button { outline: none; }

        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.accent}55; }
        ::selection { background: rgba(91,141,239,0.2); color: ${C.white}; }

        input::placeholder, textarea::placeholder {
          color: ${C.textMute};
          font-family: 'Inter', sans-serif;
          font-size: 14px;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px ${C.green}, 0 0 16px rgba(74,202,139,0.4); }
          50% { opacity: 0.5; box-shadow: 0 0 4px ${C.green}; }
        }
      `}} />

      <AnimatePresence mode="wait">
        {phase === 'intro' && <Intro key="intro" onDone={() => setPhase('title')} />}
        {phase === 'title' && <TitleScreen key="title" onEnter={() => setPhase('transition')} />}
        {phase === 'transition' && <FadeTransition key="transition" onDone={() => setPhase('main')} />}
        {phase === 'main' && (
          <motion.div key="main" style={{ position: 'fixed', inset: 0 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {section && <TopBar currentSection={section} onNavigate={navigate} />}
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
