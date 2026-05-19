export default function Layout({ children }) {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position:        'fixed',
          top: 0, left: 0, right: 0,
          height:          1,
          background:      'linear-gradient(90deg, transparent, #C4956A 30%, #C4956A 70%, transparent)',
          transformOrigin: 'center',
          transform:       'scaleX(0)',
          animation:       'lineGrow 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s forwards',
          zIndex:          9997,
        }}
      />
      {children}
    </>
  )
}
