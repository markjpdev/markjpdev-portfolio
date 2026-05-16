// Shared layout — top accent line only.
// Grain and vignette removed; light theme handles readability directly.

export default function Layout({ children }) {
  return (
    <>
      {/* Copper accent line — grows from center on page load */}
      <div
        aria-hidden="true"
        style={{
          position:        'fixed',
          top: 0, left: 0, right: 0,
          height:          2,
          background:      '#c4956a',
          transformOrigin: 'center',
          animation:       'lineGrow 0.6s cubic-bezier(0.4,0,0.2,1) 0s both',
          zIndex:          9997,
        }}
      />
      {children}
    </>
  )
}
