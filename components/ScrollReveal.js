import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({
  children,
  variant   = 'fadeUp',
  delay     = '0ms',
  threshold = 0.12,
  style     = {},
}) {
  const ref      = useRef(null)
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

  const hiddenTransform =
    variant === 'slideLeft' ? 'translateX(-16px)' :
    variant === 'fadeUp'    ? 'translateY(24px)'  : 'none'

  return (
    <div
      ref={ref}
      style={{
        transition: `opacity 0.75s ease ${delay}, transform 0.75s ease ${delay}`,
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translate(0)' : hiddenTransform,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
