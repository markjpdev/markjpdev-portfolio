// Shared layout — grain, vignette, top accent line
// Applied to every page via _app.js

const NOISE_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export default function Layout({ children }) {
  return (
    <>
      {/* Film grain */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: NOISE_URI,
          opacity: 0.038,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      />

      {/* Top accent line — design signature */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: 2,
          background: '#c4956a',
          zIndex: 9997,
        }}
      />

      {children}
    </>
  )
}
