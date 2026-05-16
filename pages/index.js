import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { meta, tagline, waypoints, status, links, about, projects, skills } from '../lib/content'
import Nav from '../components/Nav'
import ScrollReveal from '../components/ScrollReveal'

// ─────────────────────────────────────────────
//  Mark JP — Personal Site  (light theme)
// ─────────────────────────────────────────────

const PATH_D     = `M 40,140 C 95,144 140,114 190,112 C 245,110 310,86 370,84 C 430,82 480,58 540,56`
const DOT_DELAYS = [1500, 2200, 2900, 3600]
const SECTION_IDS = ['hero', 'about', 'projects', 'skills']

// Light-theme palette
const T = {
  bg:          '#faf9f7',
  text:        '#1a1814',
  secondary:   '#6b6560',
  dim:         'rgba(26,24,20,0.4)',
  accent:      '#c4956a',
  border:      'rgba(26,24,20,0.08)',
  borderMed:   'rgba(26,24,20,0.18)',
}

// ── Section header ─────────────────────────────

function SectionHeader({ number, title }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <span style={{
        fontFamily:    'var(--font-mono), monospace',
        fontSize:      11,
        letterSpacing: '0.14em',
        color:         T.accent,
        fontWeight:    300,
        display:       'block',
        marginBottom:  8,
      }}>
        {number}
      </span>
      <h2 style={{
        fontFamily:    'var(--font-display), serif',
        fontSize:      'clamp(32px, 5vw, 48px)',
        fontWeight:    700,
        letterSpacing: '-0.02em',
        color:         T.text,
        lineHeight:    1,
        marginBottom:  20,
      }}>
        {title}
      </h2>
      <div style={{ height: 1, background: T.border }} />
    </div>
  )
}

// ── Project card ───────────────────────────────

function ProjectCard({ project: p }) {
  const [hovered, setHovered] = useState(false)

  const isBuilding   = p.status === 'building'
  const statusColor  = isBuilding ? '#b07d3a' : '#4a7c59'
  const statusBg     = isBuilding ? 'rgba(176,125,58,0.1)' : 'rgba(74,124,89,0.1)'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding:    '28px 28px 24px',
        background: hovered ? '#fff' : '#f5f2ee',
        border:     `1px solid ${hovered ? T.borderMed : T.border}`,
        borderTop:  `3px solid ${hovered ? T.accent : T.border}`,
        borderRadius: 6,
        transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow:  hovered ? '0 4px 20px rgba(26,24,20,0.07)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{
          fontFamily:    'var(--font-mono), monospace',
          fontSize:      11,
          letterSpacing: '0.08em',
          color:         T.secondary,
          fontWeight:    300,
        }}>
          {p.tag}
        </span>
        <span style={{
          fontFamily:    'var(--font-mono), monospace',
          fontSize:      10,
          letterSpacing: '0.08em',
          color:         statusColor,
          background:    statusBg,
          padding:       '2px 8px',
          borderRadius:  20,
          fontWeight:    400,
        }}>
          {p.status}
        </span>
      </div>

      <h3 style={{
        fontFamily:    'var(--font-display), serif',
        fontSize:      'clamp(22px, 2.8vw, 28px)',
        fontWeight:    700,
        letterSpacing: '-0.02em',
        color:         T.text,
        marginBottom:  10,
        lineHeight:    1.1,
      }}>
        {p.name}
      </h3>

      <p style={{
        fontFamily:   'var(--font-inter), sans-serif',
        fontSize:     14,
        fontWeight:   400,
        lineHeight:   1.7,
        color:        T.secondary,
        marginBottom: 20,
      }}>
        {p.description}
      </p>

      <a
        href={p.github}
        target="_blank"
        rel="noreferrer"
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            6,
          fontFamily:     'var(--font-inter), sans-serif',
          fontSize:       13,
          fontWeight:     500,
          color:          hovered ? T.accent : T.dim,
          textDecoration: 'none',
          transition:     'color 0.2s ease',
        }}
      >
        View on GitHub ↗
      </a>
    </div>
  )
}

// ── Skill group ────────────────────────────────

function SkillItem({ item }) {
  const [hov, setHov] = useState(false)
  return (
    <li
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily:    'var(--font-inter), sans-serif',
        fontSize:      14,
        fontWeight:    400,
        color:         hov ? T.text : T.secondary,
        transition:    'color 0.15s ease',
        cursor:        'default',
        paddingBottom: 2,
      }}
    >
      {item}
    </li>
  )
}

function SkillGroup({ label, items }) {
  return (
    <div style={{ minWidth: 160 }}>
      <div style={{
        fontFamily:    'var(--font-mono), monospace',
        fontSize:      10,
        letterSpacing: '0.14em',
        color:         T.accent,
        fontWeight:    300,
        marginBottom:  16,
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(item => <SkillItem key={item} item={item} />)}
      </ul>
    </div>
  )
}

// ── Mobile vertical journey ────────────────────

function VerticalJourney({ visible, hovered, setHovered }) {
  return (
    <div>
      {waypoints.map((wp, i) => {
        const isLast = i === waypoints.length - 1
        return (
          <div key={wp.label}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '2px 0', position: 'relative' }}
              onMouseEnter={() => visible[i] && setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onTouchStart={() => visible[i] && setHovered(i)}
              onTouchEnd={() => setTimeout(() => setHovered(null), 1400)}
            >
              <div style={{ width: 16, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                {isLast ? (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: T.accent,
                    opacity:    visible[i] ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                  }} />
                ) : (
                  <div style={{
                    width: 1.5, height: 10,
                    background: T.borderMed,
                    opacity:    visible[i] ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                  }} />
                )}
              </div>
              <span style={{
                fontFamily:    'var(--font-mono), monospace',
                fontSize:      11,
                letterSpacing: '0.1em',
                color:         isLast ? T.accent : T.dim,
                opacity:       visible[i] ? 1 : 0,
                transition:    'opacity 0.7s ease',
                minWidth:      100,
              }}>
                {wp.label.toUpperCase()}
              </span>
            </div>

            <div style={{
              paddingLeft: 32,
              maxHeight:   hovered === i ? 30 : 0,
              overflow:    'hidden',
              opacity:     hovered === i ? 1 : 0,
              transition:  'max-height 0.2s ease, opacity 0.2s ease',
              fontFamily:  'var(--font-mono), monospace',
              fontSize:    10,
              color:       T.secondary,
              letterSpacing: '0.06em',
            }}>
              {wp.tooltip}
            </div>

            {!isLast && (
              <div style={{
                marginLeft: 7, width: 1.5, height: 20,
                background: T.border,
                animation:  visible[i] ? `growDown 0.3s ease ${DOT_DELAYS[i] + 300}ms both` : 'none',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Desktop horizontal journey ─────────────────

function HorizontalJourney({ visible, hovered, setHovered, pathLen, pathRef }) {
  return (
    <div style={{ position: 'relative' }}>
      <svg
        viewBox="0 0 580 200"
        style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="tip-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ghost path */}
        <path d={PATH_D} fill="none" stroke="rgba(26,24,20,0.07)" strokeWidth={1.5} strokeLinecap="round" />

        {/* Animated draw */}
        <path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="rgba(26,24,20,0.25)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={pathLen}
          strokeDashoffset={pathLen}
          style={{ animation: 'drawPath 1.8s cubic-bezier(0.4,0,0.2,1) 0.5s forwards' }}
        />

        {/* Traveling tip */}
        <circle r={3} fill={T.accent} filter="url(#tip-glow)">
          <animateMotion dur="1.8s" begin="0.5s" fill="freeze" path={PATH_D} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.85;1" dur="1.8s" begin="0.5s" fill="freeze" />
        </circle>

        {waypoints.map((wp, i) => {
          const isLast = i === waypoints.length - 1
          return (
            <g
              key={wp.label}
              onMouseEnter={() => visible[i] && setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle cx={wp.x} cy={wp.y} r={18} fill="transparent" />

              {isLast ? (
                <>
                  <circle
                    cx={wp.x} cy={wp.y} r={10}
                    fill="none" stroke={T.accent} strokeWidth={0.75}
                    style={{ opacity: visible[i] ? 0.25 : 0, transition: 'opacity 1s ease' }}
                  />
                  {visible[i] && (
                    <circle
                      cx={wp.x} cy={wp.y} r={4}
                      fill="none" stroke={T.accent} strokeWidth={0.75}
                      style={{ animation: 'sonarPing 1.4s ease-out forwards', transformBox: 'fill-box', transformOrigin: 'center' }}
                    />
                  )}
                  <circle
                    cx={wp.x} cy={wp.y} r={3.5}
                    fill={T.accent}
                    style={{ opacity: visible[i] ? 1 : 0, transition: 'opacity 0.5s ease' }}
                  />
                </>
              ) : (
                <line
                  x1={wp.x} y1={wp.y - 5} x2={wp.x} y2={wp.y + 5}
                  stroke="rgba(26,24,20,0.3)" strokeWidth={1.5} strokeLinecap="round"
                  style={{ opacity: visible[i] ? 1 : 0, transition: 'opacity 0.4s ease' }}
                />
              )}

              <text
                x={wp.x} y={wp.y + 24}
                textAnchor="middle"
                fill={isLast ? T.accent : T.dim}
                fontSize={isLast ? 11 : 10}
                fontFamily="var(--font-mono), monospace"
                letterSpacing="0.1em"
                style={{
                  opacity:    visible[i] ? 1 : 0,
                  transition: 'opacity 0.7s ease',
                  transform:  hovered === i ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                {wp.label.toUpperCase()}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Tooltips */}
      {waypoints.map((wp, i) => (
        <div
          key={wp.label}
          style={{
            position:  'absolute',
            left:      `${(wp.x / 580) * 100}%`,
            top:       `${(wp.y / 200) * 100}%`,
            transform: 'translate(-50%, -220%)',
            background:   '#fff',
            border:       `1px solid ${T.border}`,
            borderRadius: 4,
            padding:      '6px 10px',
            fontFamily:   'var(--font-mono), monospace',
            fontSize:     10,
            letterSpacing: '0.06em',
            color:         T.secondary,
            whiteSpace:    'nowrap',
            pointerEvents: 'none',
            boxShadow:     '0 2px 8px rgba(26,24,20,0.08)',
            opacity:       hovered === i ? 1 : 0,
            transition:    'opacity 0.15s ease',
            zIndex:        10,
          }}
        >
          {wp.tooltip}
        </div>
      ))}
    </div>
  )
}

// ── Journey path (responsive) ──────────────────

function JourneyPath() {
  const pathRef                      = useRef(null)
  const [pathLen, setPathLen]        = useState(720)
  const [visible, setVisible]        = useState(waypoints.map(() => false))
  const [hovered, setHovered]        = useState(null)
  const [isMobile, setIsMobile]      = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 560)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength())
  }, [isMobile])

  useEffect(() => {
    const timers = DOT_DELAYS.map((delay, i) =>
      setTimeout(() =>
        setVisible(prev => { const n = [...prev]; n[i] = true; return n }), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  if (isMobile) {
    return <VerticalJourney visible={visible} hovered={hovered} setHovered={setHovered} />
  }
  return (
    <HorizontalJourney
      visible={visible} hovered={hovered}
      setHovered={setHovered} pathLen={pathLen} pathRef={pathRef}
    />
  )
}

// ── Icons ──────────────────────────────────────

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={18} height={18} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
)

const CodedexIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={18} height={18} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
  </svg>
)

// ── Page ───────────────────────────────────────

export default function Home() {
  const h1Ref    = useRef(null)
  const iconRefs = useRef([])
  const [activeSection, setActiveSection] = useState('hero')

  // Subtle parallax on hero name
  useEffect(() => {
    const handleMouse = (e) => {
      if (!h1Ref.current) return
      const cx = window.innerWidth  / 2
      const cy = window.innerHeight / 2
      const nx = (e.clientX - cx) / cx
      const ny = (e.clientY - cy) / cy
      h1Ref.current.style.transform = `translate(${nx * 4}px, ${ny * 4}px)`

      // Magnetic social icons
      iconRefs.current.forEach(el => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const icx  = rect.left + rect.width  / 2
        const icy  = rect.top  + rect.height / 2
        const dx   = e.clientX - icx
        const dy   = e.clientY - icy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 80) {
          const pull = (1 - dist / 80) * 6
          el.style.transform = `translate(${(dx / dist) * pull}px, ${(dy / dist) * pull}px)`
        } else {
          el.style.transform = 'translate(0,0)'
        }
      })
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  // Active section for nav
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    )
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const socialLinks = [
    { icon: <GitHubIcon />,   href: links.github,   label: 'GitHub'   },
    { icon: <LinkedInIcon />, href: links.linkedin, label: 'LinkedIn' },
    { icon: <CodedexIcon />,  href: links.codedex,  label: 'Codedex'  },
  ]

  const container = {
    maxWidth: 900,
    margin:   '0 auto',
    padding:  '0 clamp(24px, 6vw, 72px)',
  }

  const sectionStyle = {
    scrollMarginTop: 56,
    padding:         'clamp(72px, 12vh, 112px) 0',
    borderTop:       `1px solid ${T.border}`,
  }

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="viewport"    content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />

        <meta property="og:title"       content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={meta.url} />
        <meta name="twitter:card"        content="summary" />
        <meta name="twitter:title"       content={meta.title} />
        <meta name="twitter:description" content={meta.description} />

        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          html { scroll-behavior: smooth; }

          html, body {
            width:      100%;
            min-height: 100%;
            background: #faf9f7;
            color:      #1a1814;
            -webkit-font-smoothing:  antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          @media (hover: hover) {
            html, body, * { cursor: none !important; }
          }

          a { text-decoration: none; color: inherit; }

          :focus-visible {
            outline:        2px solid #c4956a;
            outline-offset: 3px;
            border-radius:  3px;
          }

          @keyframes settle {
            from { letter-spacing: 0.04em; opacity: 0; }
            to   { letter-spacing: -0.03em; opacity: 1; }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }

          @keyframes lineGrow {
            from { transform: scaleX(0); }
            to   { transform: scaleX(1); }
          }

          @keyframes drawPath {
            to { stroke-dashoffset: 0; }
          }

          @keyframes sonarPing {
            0%   { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(8); opacity: 0;   }
          }

          @keyframes growDown {
            from { height: 0;    opacity: 0; }
            to   { height: 20px; opacity: 1; }
          }

          @keyframes blink {
            0%,  49% { opacity: 0.7; }
            50%, 100% { opacity: 0;  }
          }
        `}</style>
      </Head>

      <Nav activeSection={activeSection} />

      <div style={container}>

        {/* ── HERO ── */}
        <section
          id="hero"
          style={{
            minHeight:     'calc(90vh - 56px)',
            display:       'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding:       'clamp(100px, 18vh, 160px) 0 clamp(64px, 10vh, 96px)',
          }}
        >
          {/* Role label */}
          <p style={{
            fontFamily:    'var(--font-mono), monospace',
            fontSize:      12,
            letterSpacing: '0.14em',
            color:         T.accent,
            fontWeight:    300,
            marginBottom:  20,
            animation:     'fadeIn 0.5s ease 0.1s both',
          }}>
            SOFTWARE ENGINEER
          </p>

          {/* Name */}
          <h1
            ref={h1Ref}
            style={{
              fontFamily:    'var(--font-display), serif',
              fontSize:      'clamp(56px, 10vw, 100px)',
              fontWeight:    700,
              lineHeight:    0.95,
              letterSpacing: '-0.03em',
              color:         T.text,
              marginBottom:  32,
              animation:     'settle 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s both',
              willChange:    'transform',
              transition:    'transform 0.1s ease-out',
            }}
          >
            {meta.title}
          </h1>

          {/* Copper divider */}
          <div style={{
            width:        44,
            height:       2,
            background:   T.accent,
            marginBottom: 28,
            animation:    'fadeIn 0.5s ease 0.5s both',
          }} />

          {/* Tagline */}
          <p style={{
            fontFamily:   'var(--font-inter), sans-serif',
            fontSize:     'clamp(16px, 2.2vw, 20px)',
            fontWeight:   400,
            lineHeight:   1.5,
            color:        T.secondary,
            marginBottom: 12,
            animation:    'fadeIn 0.6s ease 0.6s both',
          }}>
            {tagline}
          </p>

          {/* Brief bio */}
          <p style={{
            fontFamily:   'var(--font-inter), sans-serif',
            fontSize:     'clamp(14px, 1.6vw, 16px)',
            fontWeight:   400,
            lineHeight:   1.75,
            color:        'rgba(107,101,96,0.8)',
            maxWidth:     520,
            marginBottom: 44,
            animation:    'fadeIn 0.6s ease 0.7s both',
          }}>
            A decade in IT — helpdesk, sysadmin, and business analysis — before making the shift to software engineering.
          </p>

          {/* CTAs */}
          <div style={{
            display:    'flex',
            gap:        28,
            alignItems: 'center',
            flexWrap:   'wrap',
            animation:  'fadeIn 0.6s ease 0.9s both',
          }}>
            <a
              href={links.email}
              style={{
                fontFamily:  'var(--font-inter), sans-serif',
                fontSize:    15,
                fontWeight:  500,
                color:       T.accent,
                transition:  'opacity 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'   }}
            >
              Say hello →
            </a>
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily:  'var(--font-inter), sans-serif',
                fontSize:    15,
                fontWeight:  400,
                color:       T.secondary,
                transition:  'color 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = T.text }}
              onMouseLeave={e => { e.currentTarget.style.color = T.secondary }}
            >
              GitHub ↗
            </a>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" style={sectionStyle}>
          <ScrollReveal>
            <SectionHeader number="01" title="About" />
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(40px, 6vw, 80px)' }}>
            {/* Bio */}
            <ScrollReveal delay="80ms">
              <div>
                <p style={{
                  fontFamily:   'var(--font-inter), sans-serif',
                  fontSize:     'clamp(14px, 1.6vw, 16px)',
                  fontWeight:   400,
                  lineHeight:   1.8,
                  color:        T.secondary,
                  marginBottom: 20,
                }}>
                  {about.intro}
                </p>
                <p style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize:   'clamp(14px, 1.6vw, 16px)',
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color:      'rgba(107,101,96,0.75)',
                }}>
                  {about.detail}
                </p>

                {/* Status lines */}
                <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {status.map(({ label, value }, idx) => (
                    <div key={label} style={{
                      display:    'flex',
                      gap:        14,
                      alignItems: 'baseline',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize:   12,
                      fontWeight: 300,
                    }}>
                      <span style={{ color: T.dim, letterSpacing: '0.08em', minWidth: 64 }}>
                        {label}
                      </span>
                      <span style={{ color: T.accent, fontSize: 10 }}>—</span>
                      <span style={{ color: T.secondary, letterSpacing: '0.04em' }}>
                        {value}
                        {idx === status.length - 1 && (
                          <span style={{ marginLeft: 3, color: T.accent, animation: 'blink 1.1s step-end infinite' }}>▌</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Journey path */}
            <ScrollReveal delay="160ms">
              <div>
                <p style={{
                  fontFamily:    'var(--font-mono), monospace',
                  fontSize:      10,
                  letterSpacing: '0.14em',
                  color:         T.dim,
                  fontWeight:    300,
                  textTransform: 'uppercase',
                  marginBottom:  16,
                }}>
                  Career path
                </p>
                <JourneyPath />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" style={sectionStyle}>
          <ScrollReveal>
            <SectionHeader number="02" title="Projects" />
          </ScrollReveal>
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap:                 24,
          }}>
            {projects.map((p, i) => (
              <ScrollReveal key={p.name} delay={`${i * 100}ms`}>
                <ProjectCard project={p} />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" style={sectionStyle}>
          <ScrollReveal>
            <SectionHeader number="03" title="Skills" />
          </ScrollReveal>
          <ScrollReveal delay="80ms">
            <div style={{ display: 'flex', gap: 'clamp(40px, 7vw, 80px)', flexWrap: 'wrap' }}>
              <SkillGroup label="Building Now"  items={skills.building}   />
              <SkillGroup label="Familiar With" items={skills.familiar}   />
              <SkillGroup label="Background"    items={skills.background} />
            </div>
          </ScrollReveal>
        </section>

      </div>{/* /container */}

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop:  `1px solid ${T.border}`,
        marginTop:  'clamp(40px, 6vh, 64px)',
        padding:    'clamp(32px, 5vh, 48px) clamp(24px, 6vw, 72px)',
      }}>
        <div style={{
          maxWidth:       900,
          margin:         '0 auto',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          flexWrap:       'wrap',
          gap:            24,
        }}>
          {/* Social icons */}
          <div style={{ display: 'flex', gap: 20 }}>
            {socialLinks.map(({ icon, href, label }, i) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                ref={el => { iconRefs.current[i] = el }}
                style={{
                  color:      T.dim,
                  transition: 'color 0.2s ease, transform 0.15s ease-out',
                  display:    'flex',
                  alignItems: 'center',
                  willChange: 'transform',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = T.accent }}
                onMouseLeave={e => {
                  e.currentTarget.style.color     = T.dim
                  e.currentTarget.style.transform = 'translate(0,0)'
                }}
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Email */}
          <a
            href={links.email}
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           8,
              fontFamily:    'var(--font-inter), sans-serif',
              fontSize:      14,
              fontWeight:    400,
              color:         T.secondary,
              transition:    'color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = T.accent }}
            onMouseLeave={e => { e.currentTarget.style.color = T.secondary }}
          >
            <EmailIcon />
            markpunsalan@icloud.com
          </a>

          {/* Copyright */}
          <span style={{
            fontFamily:    'var(--font-mono), monospace',
            fontSize:      11,
            letterSpacing: '0.06em',
            color:         T.dim,
          }}>
            © mark jp · markjp.dev
          </span>
        </div>
      </footer>
    </>
  )
}
