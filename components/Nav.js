import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'about',    href: '#about'    },
  { label: 'projects', href: '#projects' },
  { label: 'skills',   href: '#skills'   },
]

export default function Nav({ activeSection }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      aria-label="Site navigation"
      style={{
        position:   'fixed',
        top: 0, left: 0, right: 0,
        height:     52,
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding:    '0 clamp(24px, 6vw, 64px)',
        background: scrolled ? 'rgba(13,11,9,0.88)' : 'transparent',
        backdropFilter:       scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 0.35s ease',
        zIndex:     9996,
      }}
    >
      <a
        href="#hero"
        aria-label="Back to top"
        style={{
          fontFamily:     'var(--font-display), serif',
          fontSize:       18,
          fontWeight:     700,
          color:          '#c4956a',
          letterSpacing:  '-0.01em',
          textDecoration: 'none',
          transition:     'opacity 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.65' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1'    }}
      >
        MJP
      </a>

      <div style={{ display: 'flex', gap: 'clamp(16px, 3vw, 32px)', alignItems: 'center' }}>
        {NAV_LINKS.map(({ label, href }) => {
          const active = activeSection === href.slice(1)
          return (
            <a
              key={label}
              href={href}
              style={{
                fontFamily:     'var(--font-mono), monospace',
                fontSize:       11,
                fontWeight:     300,
                letterSpacing:  '0.1em',
                color:          active ? '#c4956a' : 'rgba(240,235,227,0.35)',
                textDecoration: 'none',
                transition:     'color 0.2s ease',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(240,235,227,0.8)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = active ? '#c4956a' : 'rgba(240,235,227,0.35)' }}
            >
              {label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
