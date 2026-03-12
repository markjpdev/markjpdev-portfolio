import Head from 'next/head'
import { useEffect, useState } from 'react'

const YEARS    = new Date().getFullYear() - 2014
const BAYBAYIN = 'ᜋᜍᜃ᜔ ᜇᜒᜐᜓᜈ᜔ ᜉᜓᜈ᜔ᜐᜎᜈ᜔'

const C = {
  bg:     '#0D0E14',
  text:   '#E9EBF3',
  dim:    'rgba(233,235,243,0.55)',
  mute:   'rgba(233,235,243,0.28)',
  line:   'rgba(255,255,255,0.07)',
  accent: '#5B8DEF',
}

const F = {
  display: "'Cormorant Garamond', serif",
  body:    "'Inter', sans-serif",
  mono:    "'JetBrains Mono', monospace",
  bay:     "'Noto Sans Tagalog', sans-serif",
}

// ── Grain overlay ──────────────────────────────────────────────────────────────
function Grain() {
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '200px 200px', opacity: 0.035, mixBlendMode: 'screen',
    }} />
  )
}

// ── Minimal cursor ─────────────────────────────────────────────────────────────
function Cursor() {
  const [pos,   setPos]   = useState({ x: -100, y: -100 })
  const [hot,   setHot]   = useState(false)
  const [touch, setTouch] = useState(false)

  useEffect(() => {
    setTouch(window.matchMedia('(hover: none)').matches)
    const mv = e => setPos({ x: e.clientX, y: e.clientY })
    const ov = e => setHot(!!e.target.closest('a,button'))
    window.addEventListener('mousemove', mv)
    window.addEventListener('mouseover', ov)
    return () => {
      window.removeEventListener('mousemove', mv)
      window.removeEventListener('mouseover', ov)
    }
  }, [])

  if (touch) return null
  return (
    <div aria-hidden style={{
      position: 'fixed',
      left: pos.x, top: pos.y,
      transform: 'translate(-50%, -50%)',
      width:  hot ? 28 : 6,
      height: hot ? 28 : 6,
      borderRadius: '50%',
      border:     hot ? `1px solid rgba(91,141,239,0.5)` : 'none',
      background: hot ? 'transparent' : C.text,
      zIndex: 9999, pointerEvents: 'none',
      transition: 'width 0.15s, height 0.15s',
      mixBlendMode: 'difference',
    }} />
  )
}

// ── Section divider ────────────────────────────────────────────────────────────
function Divider() {
  return <hr style={{ border: 'none', borderTop: `1px solid ${C.line}`, margin: '56px 0' }} />
}

// ── Data ──────────────────────────────────────────────────────────────────────
const WORK = [
  {
    period:  '2023 — Now',
    role:    'Business Analyst · Application Support Engineer',
    company: 'RxPx Health',
  },
  {
    period:  '2020 — 2023',
    role:    'Clinical Systems Support Specialist',
    company: 'Thermo Fisher Scientific (PPD)',
  },
  {
    period:  '2019',
    role:    'B.S. Information Technology',
    company: 'Best Thesis Finalist — IoT Flood Monitoring',
  },
]

const NOW = [
  { label: 'Building', value: 'Clinical REST API — FastAPI · Docker · PostgreSQL' },
  { label: 'Learning', value: 'Go · Kubernetes · System Design at scale'          },
]

const PROJECTS = [
  {
    title: 'IoT Flood Monitoring System',
    desc:  'Complete sensor network built from scratch — data ingestion pipeline, threshold alerting, live dashboard. Enterprise monitoring discipline applied at community scale.',
    meta:  'Best Thesis Finalist · 2019',
    link:  null,
  },
  {
    title: 'Clinical REST API',
    desc:  'Healthcare integrations built by someone who has worked the data. Realistic clinical models, OpenAPI documentation, containerized deployment.',
    meta:  'In Progress · FastAPI · PostgreSQL · Docker',
    link:  null,
  },
  {
    title: 'markjp.dev',
    desc:  'This site.',
    meta:  'Next.js',
    link:  'https://markjp.dev',
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <>
      <Head>
        <title>Mark Jayson Punsalan</title>
        <meta name="description" content="Backend engineer and clinical systems specialist. Quezon City, Philippines." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#0D0E14" />
        <meta property="og:title"       content="Mark Jayson Punsalan" />
        <meta property="og:description" content="Backend engineer. Clinical systems. Quezon City, PH." />
        <meta property="og:url"         content="https://markjp.dev" />
        <meta property="og:type"        content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@300;400&family=JetBrains+Mono:wght@300;400&family=Noto+Sans+Tagalog&display=swap" rel="stylesheet" />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next { background: #0D0E14; min-height: 100%; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        body, a, button { cursor: none; }
        @media (hover: none) { body, a, button { cursor: auto; } }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: #0D0E14; }
        ::-webkit-scrollbar-thumb { background: rgba(91,141,239,0.28); }
        ::selection { background: rgba(91,141,239,0.12); color: #E9EBF3; }
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes pageIn { from { opacity: 0; } to { opacity: 1; } }
        }
      ` }} />

      <Grain />
      <Cursor />

      <main style={{
        maxWidth:  680,
        margin:    '0 auto',
        padding:   'clamp(48px,8vw,96px) clamp(20px,5vw,40px) clamp(64px,10vw,120px)',
        animation: 'pageIn 0.7s ease forwards',
      }}>

        {/* ── Header ── */}
        <header style={{ marginBottom: 'clamp(48px,8vw,72px)' }}>
          <h1 style={{
            fontFamily: F.display,
            fontSize:   'clamp(64px,12vw,108px)',
            color:      C.text,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '0.04em',
            marginBottom: 10,
          }}>
            MJP
          </h1>

          <div style={{
            fontFamily: F.bay,
            fontSize:   14,
            color:      C.accent,
            opacity:    0.5,
            letterSpacing: '0.12em',
            marginBottom: 24,
          }}>
            {BAYBAYIN}
          </div>

          <p style={{
            fontFamily: F.mono,
            fontSize:   12,
            color:      C.mute,
            letterSpacing: '0.08em',
            marginBottom: 28,
            lineHeight: 1.6,
          }}>
            Mark Jayson Punsalan · Backend Engineer · Quezon City, PH
          </p>

          <nav aria-label="Links" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'GitHub',   href: 'https://github.com/markjpdev'           },
              { label: 'LinkedIn', href: 'https://linkedin.com/in/jaysonpunsalan' },
              { label: 'Email',    href: 'mailto:mark@markjp.dev'                 },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noreferrer"
                style={{
                  fontFamily:    F.mono,
                  fontSize:      12,
                  color:         C.dim,
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  transition:    'color 0.18s',
                }}
                onMouseOver={e => e.currentTarget.style.color = C.text}
                onMouseOut={e  => e.currentTarget.style.color = C.dim}
              >
                {label}
              </a>
            ))}
          </nav>
        </header>

        <Divider />

        {/* ── About ── */}
        <section aria-label="About">
          <p style={{
            fontFamily:   F.body,
            fontSize:     'clamp(14px,1.8vw,16px)',
            color:        C.dim,
            lineHeight:   1.9,
            fontWeight:   300,
            marginBottom: 20,
          }}>
            {YEARS}+ years keeping critical systems running across regulated industries —
            clinical trial platforms, enterprise integrations, federated authentication across
            GxP environments. Most engineers read about these systems. I kept them running
            under SLA pressure, across timezones, with no margin for error.
          </p>
          <p style={{
            fontFamily:   F.body,
            fontSize:     'clamp(14px,1.8vw,16px)',
            color:        C.dim,
            lineHeight:   1.9,
            fontWeight:   300,
            marginBottom: 32,
          }}>
            The move to backend engineering is not a pivot. It is the natural next step of
            someone who has always needed to understand the whole system — not just their part of it.
          </p>
          <blockquote style={{ borderLeft: `2px solid ${C.line}`, paddingLeft: 20, margin: 0 }}>
            <p style={{
              fontFamily:  F.body,
              fontSize:    'clamp(13px,1.5vw,14px)',
              color:       C.mute,
              lineHeight:  1.9,
              fontWeight:  300,
              fontStyle:   'normal',
            }}>
              The best systems are invisible. The user feels the care without being able to name
              it — whether it is a clinical data pipeline or the turn logic of a JRPG. That is
              the standard I hold my work to.
            </p>
          </blockquote>
        </section>

        <Divider />

        {/* ── Experience ── */}
        <section aria-label="Experience">
          <div style={{
            fontFamily:    F.mono,
            fontSize:      10,
            color:         C.mute,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom:  28,
          }}>
            Experience
          </div>

          {WORK.map(({ period, role, company }, i) => (
            <div key={i} style={{
              display:             'grid',
              gridTemplateColumns: 'clamp(100px,22%,140px) 1fr',
              gap:                 '0 clamp(16px,3vw,32px)',
              padding:             '18px 0',
              borderBottom:        `1px solid ${C.line}`,
            }}>
              <div style={{
                fontFamily:    F.mono,
                fontSize:      11,
                color:         C.mute,
                letterSpacing: '0.04em',
                paddingTop:    2,
                lineHeight:    1.6,
              }}>
                {period}
              </div>
              <div>
                <div style={{
                  fontFamily:   F.body,
                  fontSize:     'clamp(13px,1.5vw,14px)',
                  color:        C.text,
                  fontWeight:   400,
                  marginBottom: 4,
                }}>
                  {role}
                </div>
                <div style={{
                  fontFamily:    F.mono,
                  fontSize:      11,
                  color:         C.dim,
                  letterSpacing: '0.04em',
                }}>
                  {company}
                </div>
              </div>
            </div>
          ))}
        </section>

        <Divider />

        {/* ── Now ── */}
        <section aria-label="Now">
          <div style={{
            fontFamily:    F.mono,
            fontSize:      10,
            color:         C.mute,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom:  28,
          }}>
            Now
          </div>

          {NOW.map(({ label, value }) => (
            <div key={label} style={{
              display:             'grid',
              gridTemplateColumns: 'clamp(72px,15%,96px) 1fr',
              gap:                 '0 clamp(16px,3vw,32px)',
              padding:             '14px 0',
              borderBottom:        `1px solid ${C.line}`,
            }}>
              <div style={{ fontFamily: F.mono, fontSize: 11, color: C.mute, paddingTop: 2 }}>
                {label}
              </div>
              <div style={{
                fontFamily: F.body,
                fontSize:   'clamp(13px,1.5vw,14px)',
                color:      C.dim,
                fontWeight: 300,
              }}>
                {value}
              </div>
            </div>
          ))}
        </section>

        <Divider />

        {/* ── Projects ── */}
        <section aria-label="Projects">
          <div style={{
            fontFamily:    F.mono,
            fontSize:      10,
            color:         C.mute,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom:  28,
          }}>
            Projects
          </div>

          {PROJECTS.map(({ title, desc, meta, link }) => (
            <div key={title} style={{ padding: '24px 0', borderBottom: `1px solid ${C.line}` }}>
              <div style={{
                display:        'flex',
                alignItems:     'baseline',
                justifyContent: 'space-between',
                gap:            16,
                marginBottom:   10,
                flexWrap:       'wrap',
              }}>
                <div style={{
                  fontFamily: F.body,
                  fontSize:   'clamp(14px,1.6vw,15px)',
                  color:      C.text,
                  fontWeight: 400,
                }}>
                  {title}
                </div>
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily:    F.mono,
                      fontSize:      10,
                      color:         C.accent,
                      textDecoration: 'none',
                      letterSpacing: '0.08em',
                      flexShrink:    0,
                      transition:    'opacity 0.18s',
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.55'}
                    onMouseOut={e  => e.currentTarget.style.opacity = '1'}
                  >
                    ↗ {link.replace('https://', '')}
                  </a>
                )}
              </div>
              <p style={{
                fontFamily:   F.body,
                fontSize:     'clamp(12px,1.4vw,13px)',
                color:        C.dim,
                lineHeight:   1.85,
                fontWeight:   300,
                marginBottom: 10,
              }}>
                {desc}
              </p>
              <div style={{
                fontFamily:    F.mono,
                fontSize:      10,
                color:         C.mute,
                letterSpacing: '0.06em',
              }}>
                {meta}
              </div>
            </div>
          ))}
        </section>

        <Divider />

        {/* ── Footer ── */}
        <footer style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          flexWrap:       'wrap',
          gap:            12,
        }}>
          <a
            href="mailto:mark@markjp.dev"
            style={{
              fontFamily:    F.mono,
              fontSize:      12,
              color:         C.dim,
              textDecoration: 'none',
              letterSpacing: '0.06em',
              transition:    'color 0.18s',
            }}
            onMouseOver={e => e.currentTarget.style.color = C.text}
            onMouseOut={e  => e.currentTarget.style.color = C.dim}
          >
            mark@markjp.dev
          </a>
          <span style={{
            fontFamily:    F.mono,
            fontSize:      11,
            color:         C.mute,
            letterSpacing: '0.06em',
          }}>
            © {new Date().getFullYear()} MJP
          </span>
        </footer>

      </main>
    </>
  )
}
