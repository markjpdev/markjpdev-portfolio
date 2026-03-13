import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { meta, tagline, waypoints, status, links } from '../lib/content'

// ─────────────────────────────────────────────
//  Mark JP — Personal Site
// ─────────────────────────────────────────────

const PATH_D = `M 40,140 C 95,144 140,114 190,112 C 245,110 310,86 370,84 C 430,82 480,58 540,56`
const DOT_DELAYS = [1500, 2200, 2900, 3600]

// ── Mobile: vertical timeline ─────────────────

function VerticalJourney({ visible, hovered, setHovered }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative' }}>
        {waypoints.map((wp, i) => {
          const isLast = i === waypoints.length - 1
          return (
            <div key={wp.label}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '2px 0', position: 'relative', zIndex: 1 }}
                onMouseEnter={() => visible[i] && setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onTouchStart={() => visible[i] && setHovered(i)}
                onTouchEnd={() => setTimeout(() => setHovered(null), 1400)}
              >
                <div style={{ width: 16, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                  {isLast ? (
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#c4956a',
                      boxShadow: visible[i] ? '0 0 0 4px rgba(196,149,106,0.1)' : 'none',
                      opacity: visible[i] ? 1 : 0,
                      transition: 'opacity 0.5s ease, box-shadow 0.5s ease',
                    }} />
                  ) : (
                    <div style={{
                      width: 1.5, height: 10,
                      background: 'rgba(240,235,227,0.28)',
                      opacity: visible[i] ? 1 : 0,
                      transition: 'opacity 0.4s ease',
                    }} />
                  )}
                </div>

                <span style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  color: isLast ? '#c4956a' : 'rgba(240,235,227,0.25)',
                  opacity: visible[i] ? 1 : 0,
                  transition: 'opacity 0.7s ease',
                  minWidth: 100,
                  textAlign: 'left',
                }}>
                  {wp.label.toUpperCase()}
                </span>
              </div>

              {/* Tooltip inline on mobile */}
              <div style={{
                paddingLeft: 34,
                maxHeight: hovered === i ? 30 : 0,
                overflow: 'hidden',
                opacity: hovered === i ? 1 : 0,
                transition: 'max-height 0.2s ease, opacity 0.2s ease',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                color: 'rgba(240,235,227,0.45)',
                letterSpacing: '0.06em',
              }}>
                {wp.tooltip}
              </div>

              {!isLast && (
                <div style={{
                  marginLeft: 7, width: 1.5, height: 20,
                  background: 'rgba(240,235,227,0.1)',
                  animation: visible[i] ? `growDown 0.3s ease ${DOT_DELAYS[i] + 300}ms both` : 'none',
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Desktop: horizontal SVG path ─────────────

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
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ghost path */}
        <path d={PATH_D} fill="none" stroke="rgba(240,235,227,0.05)" strokeWidth={1.5} strokeLinecap="round" />

        {/* Animated draw */}
        <path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="rgba(240,235,227,0.4)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={pathLen}
          strokeDashoffset={pathLen}
          style={{ animation: 'drawPath 1.8s cubic-bezier(0.4,0,0.2,1) 1s forwards' }}
        />

        {/* Ink tip — travels the path as it draws */}
        <circle r={3.5} fill="#c4956a" filter="url(#tip-glow)">
          <animateMotion dur="1.8s" begin="1s" fill="freeze" path={PATH_D} />
          <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.04;0.86;1" dur="1.8s" begin="1s" fill="freeze" />
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
                  {/* Static ring */}
                  <circle
                    cx={wp.x} cy={wp.y} r={10}
                    fill="none" stroke="#c4956a" strokeWidth={0.75}
                    style={{ opacity: visible[i] ? 0.2 : 0, transition: 'opacity 1s ease' }}
                  />
                  {/* Sonar ping — fires once when dot appears */}
                  {visible[i] && (
                    <circle
                      cx={wp.x} cy={wp.y} r={4}
                      fill="none" stroke="#c4956a" strokeWidth={0.75}
                      style={{
                        animation: 'sonarPing 1.4s ease-out forwards',
                        transformBox: 'fill-box',
                        transformOrigin: 'center',
                      }}
                    />
                  )}
                  {/* Dot */}
                  <circle
                    cx={wp.x} cy={wp.y} r={3.5}
                    fill="#c4956a"
                    style={{ opacity: visible[i] ? 1 : 0, transition: 'opacity 0.5s ease' }}
                  />
                </>
              ) : (
                <line
                  x1={wp.x} y1={wp.y - 5} x2={wp.x} y2={wp.y + 5}
                  stroke="rgba(240,235,227,0.28)" strokeWidth={1.5} strokeLinecap="round"
                  style={{ opacity: visible[i] ? 1 : 0, transition: 'opacity 0.4s ease' }}
                />
              )}

              <text
                x={wp.x} y={wp.y + 24}
                textAnchor="middle"
                fill={isLast ? '#c4956a' : 'rgba(240,235,227,0.25)'}
                fontSize={isLast ? 11 : 10}
                fontFamily="var(--font-mono), monospace"
                letterSpacing="0.1em"
                style={{ opacity: visible[i] ? 1 : 0, transition: 'opacity 0.7s ease' }}
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
            position: 'absolute',
            left: `${(wp.x / 580) * 100}%`,
            top: `${(wp.y / 200) * 100}%`,
            transform: 'translate(-50%, -210%)',
            background: 'rgba(13,11,9,0.94)',
            border: '1px solid rgba(196,149,106,0.12)',
            borderRadius: 4,
            padding: '6px 10px',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 10,
            letterSpacing: '0.06em',
            color: 'rgba(240,235,227,0.6)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: hovered === i ? 1 : 0,
            transition: 'opacity 0.15s ease',
            zIndex: 10,
          }}
        >
          {wp.tooltip}
        </div>
      ))}
    </div>
  )
}

// ── Responsive wrapper ────────────────────────

function JourneyPath() {
  const pathRef = useRef(null)
  const [pathLen, setPathLen] = useState(720)
  const [visible, setVisible] = useState(waypoints.map(() => false))
  const [hovered, setHovered] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

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
      visible={visible}
      hovered={hovered}
      setHovered={setHovered}
      pathLen={pathLen}
      pathRef={pathRef}
    />
  )
}

// ── Icons ─────────────────────────────────────

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20} aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20} height={20} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
)

const CodedexIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20} height={20} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
  </svg>
)

// ── Page ──────────────────────────────────────

export default function Home() {
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />

        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />

        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          html, body {
            width: 100%;
            min-height: 100%;
            background: #0d0b09;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          @media (hover: hover) {
            html, body, * { cursor: none !important; }
          }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0);   }
          }

          @keyframes drawPath {
            to { stroke-dashoffset: 0; }
          }

          /* Name finds its position */
          @keyframes settle {
            from { letter-spacing: 0.04em; opacity: 0; transform: translateY(8px); }
            to   { letter-spacing: -0.02em; opacity: 1; transform: translateY(0);  }
          }

          /* Accent line draws from center */
          @keyframes lineGrow {
            from { transform: scaleX(0); }
            to   { transform: scaleX(1); }
          }

          /* Engineering waypoint — single radar pulse */
          @keyframes sonarPing {
            0%   { transform: scale(1);  opacity: 0.6; }
            100% { transform: scale(9);  opacity: 0;   }
          }

          @keyframes growDown {
            from { height: 0; opacity: 0; }
            to   { height: 20px; opacity: 1; }
          }

          a { text-decoration: none; color: inherit; }

          :focus-visible {
            outline: 1.5px solid #c4956a;
            outline-offset: 4px;
            border-radius: 3px;
          }
        `}</style>
      </Head>

      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(48px, 8vh, 96px) clamp(24px, 6vw, 64px)',
        fontFamily: "var(--font-inter), sans-serif",
        color: '#f0ebe3',
        position: 'relative',
      }}>

        {/* Baybayin watermark — cultural identity, fills the negative space */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          <div style={{
            fontFamily: "'Noto Sans Tagalog', serif",
            fontSize: 'clamp(88px, 16vw, 140px)',
            color: '#c4956a',
            opacity: 0.016,
            letterSpacing: '0.25em',
            userSelect: 'none',
            lineHeight: 1,
            animation: 'fadeUp 2.5s ease 1.5s both',
          }}>
            ᜋᜍᜃ
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 560, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Name — Cormorant display serif, settles into position */}
          <h1 style={{
            fontFamily: "var(--font-display), serif",
            fontSize: 'clamp(72px, 13vw, 116px)',
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            color: '#f0ebe3',
            animation: 'settle 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s both',
          }}>
            {meta.title}
          </h1>

          {/* Tagline */}
          <p style={{
            marginTop: 18,
            fontFamily: "var(--font-mono), monospace",
            fontSize: 'clamp(11px, 1.5vw, 13px)',
            fontWeight: 300,
            color: 'rgba(240,235,227,0.36)',
            letterSpacing: '0.07em',
            animation: 'fadeUp 0.7s ease 0.5s both',
          }}>
            {tagline}
          </p>

          {/* Journey path */}
          <div style={{ marginTop: 56, animation: 'fadeUp 0.6s ease 0.9s both' }}>
            <JourneyPath />
          </div>

          {/* Status board */}
          <div style={{
            marginTop: 32,
            display: 'inline-flex',
            flexDirection: 'column',
            gap: 6,
            animation: 'fadeUp 0.7s ease 4.0s both',
          }}>
            {status.map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex',
                gap: 16,
                alignItems: 'baseline',
                fontFamily: "var(--font-mono), monospace",
                fontSize: 'clamp(10px, 1.3vw, 12px)',
                fontWeight: 300,
              }}>
                <span style={{
                  color: 'rgba(240,235,227,0.2)',
                  letterSpacing: '0.08em',
                  minWidth: 64,
                  textAlign: 'right',
                }}>
                  {label}
                </span>
                <span style={{ color: 'rgba(196,149,106,0.35)', fontSize: 10 }}>—</span>
                <span style={{
                  color: 'rgba(240,235,227,0.5)',
                  letterSpacing: '0.04em',
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Social icons */}
          <div style={{
            marginTop: 52,
            display: 'flex',
            gap: 32,
            justifyContent: 'center',
            alignItems: 'center',
            animation: 'fadeUp 0.7s ease 4.4s both',
          }}>
            {[
              { icon: <GitHubIcon />,   href: links.github,   label: 'GitHub'   },
              { icon: <LinkedInIcon />, href: links.linkedin, label: 'LinkedIn' },
              { icon: <CodedexIcon />,  href: links.codedex,  label: 'Codedex'  },
            ].map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: 'rgba(240,235,227,0.4)',
                  transition: 'color 0.2s ease, transform 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#c4956a'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(240,235,227,0.4)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Primary CTA — copper text, no border */}
          <div style={{ marginTop: 24, animation: 'fadeUp 0.7s ease 4.7s both' }}>
            <a
              href={links.email}
              aria-label="Send email"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: "var(--font-mono), monospace",
                fontSize: 12,
                fontWeight: 300,
                letterSpacing: '0.08em',
                color: 'rgba(196,149,106,0.6)',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#c4956a' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(196,149,106,0.6)' }}
            >
              <EmailIcon />
              say hello
            </a>
          </div>

        </div>
      </main>
    </>
  )
}
