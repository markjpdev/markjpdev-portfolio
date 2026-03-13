import { useEffect, useRef, useState } from 'react'

// Custom cursor — copper dot, ring on hover
// Uses direct DOM manipulation for position (no React re-render lag)
// Disabled on touch devices

export default function Cursor() {
  const dotRef = useRef(null)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Skip on touch-only devices
    if (window.matchMedia('(hover: none)').matches) return

    const dot = dotRef.current
    if (!dot) return

    const move = e => {
      if (!visible) setVisible(true)
      // Direct DOM for zero-lag position tracking
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    const over = e => {
      if (e.target.closest('a, button, [role="button"]')) setActive(true)
    }

    const out = e => {
      if (e.target.closest('a, button, [role="button"]')) setActive(false)
    }

    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    document.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)

    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
    }
  }, [visible])

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: active ? 28 : 8,
        height: active ? 28 : 8,
        borderRadius: '50%',
        background: active ? 'transparent' : '#c4956a',
        border: active ? '1px solid rgba(196,149,106,0.55)' : 'none',
        // Offset to center on cursor tip
        marginLeft: active ? -14 : -4,
        marginTop: active ? -14 : -4,
        pointerEvents: 'none',
        zIndex: 999999,
        opacity: visible ? 1 : 0,
        transition: 'width 0.18s ease, height 0.18s ease, background 0.18s ease, border 0.18s ease, margin 0.18s ease, opacity 0.3s ease',
      }}
    />
  )
}
