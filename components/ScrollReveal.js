import { useEffect, useRef, useState } from 'react'

// Fade-only reveal — no movement, just opacity.
// Movement-based transitions felt jarring; a clean fade is enough.
export default function ScrollReveal({ children, delay = '0ms', threshold = 0.1, style = {} }) {
  const ref            = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      style={{
        transition: `opacity 0.6s ease ${delay}`,
        opacity:    visible ? 1 : 0,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
