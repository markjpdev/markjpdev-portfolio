import { useEffect, useState } from 'react'
import { links } from '../lib/content'

const NAV_LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills',   href: '#skills'   },
]

export default function Nav({ activeSection }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      aria-label="Site navigation"
      style={{
        position:   'fixed',
        top: 0, left: 0, right: 0,
        height:     56,
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding:    '0 clamp(24px, 6vw, 72px)',
        background: scrolled
          ? 'rgba(250,249,247,0.94)'
          : 'rgba(250,249,247,0.0)',
        backdropFilter:       scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(26,24,20,0.07)' : '1px solid transparent',
        transition:   'background 0.3s ease, border-color 0.3s ease',
        zIndex:       9996,
      }}
    >
      {/* Logo */}
      <a
        href="#hero"
        aria-label="Back to top"
        style={{
          fontFamily:     'var(--font-display), serif',
          fontSize:       20,
          fontWeight:     700,
          letterSpacing:  '-0.02em',
          color:          '#1a1814',
          textDecoration: 'none',
          transition:     'color 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#c4956a' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#1a1814' }}
      >
        Mark JP
      </a>

      {/* Links + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 3.5vw, 36px)' }}>
        {NAV_LINKS.map(({ label, href }) => {
          const active = activeSection === href.slice(1)
          return (
            <a
              key={label}
              href={href}
              style={{
                fontFamily:     'var(--font-inter), sans-serif',
                fontSize:       14,
                fontWeight:     400,
                color:          active ? '#c4956a' : 'rgba(26,24,20,0.55)',
                textDecoration: 'none',
                transition:     'color 0.2s ease',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#1a1814' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(26,24,20,0.55)' }}
            >
              {label}
            </a>
          )
        })}

        <a
          href={links.email}
          style={{
            fontFamily:    'var(--font-inter), sans-serif',
            fontSize:      13,
            fontWeight:    500,
            color:         '#1a1814',
            border:        '1px solid rgba(26,24,20,0.25)',
            borderRadius:  4,
            padding:       '6px 14px',
            textDecoration: 'none',
            transition:    'border-color 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#c4956a'
            e.currentTarget.style.color       = '#c4956a'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(26,24,20,0.25)'
            e.currentTarget.style.color       = '#1a1814'
          }}
        >
          Say hello
        </a>
      </div>
    </nav>
  )
}
