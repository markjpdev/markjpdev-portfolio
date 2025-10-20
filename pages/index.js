import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

// Improved interactive portfolio preview for markjp.dev
// Upgrades applied:
// - Layered radial background (dark, not pure black)
// - Dual accent color system (neonGreen = CTA, cyan = detail)
// - Tagline reveal animation and staggered project assembly
// - Magnetic hover for CTAs (subtle) and card lift
// - Optional sound effect toggle (assembly click)
// - Konami-code easter egg -> confetti burst

export default function PortfolioPreview() {
  const [showProjects, setShowProjects] = useState(false)
  const [tiles, setTiles] = useState([])
  const [confetti, setConfetti] = useState([])
  const [soundOn, setSoundOn] = useState(false)
  const TILE_COUNT = 40

  const ACCENT = '#00E5A5' // neon green (CTA)
  const ACCENT2 = '#00C8FF' // cyan (details)

  // sample projects
  const sampleProjects = [
    { title: 'Streamline', desc: 'Realtime ingestion + processing pipeline', tech: 'Go • Kafka • Kubernetes' },
    { title: 'Builder', desc: 'Dev tooling for faster builds', tech: 'TypeScript • Node • Docker' },
  ]

  // spawn lego tiles animation overlay
  function spawnTiles(count = TILE_COUNT) {
    const t = Array.from({ length: count }).map((_, i) => ({ id: i }))
    setTiles(t)
    if (soundOn) playClickSound(count)
    setTimeout(() => setTiles([]), 1400)
  }

  // sound using Web Audio API
  function playClickSound(count = 20) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      for (let i = 0; i < Math.min(6, Math.round(count/6)); i++) {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'
        o.frequency.value = 600 - i*60
        g.gain.value = 0.02
        o.connect(g)
        g.connect(ctx.destination)
        o.start()
        o.stop(ctx.currentTime + 0.08 + i*0.02)
      }
    } catch (e) { /* ignore on unsupported */ }
  }

  // Konami code detection
  useEffect(() => {
    const konami = [38,38,40,40,37,39,37,39,66,65]
    let idx = 0
    function onKey(e) {
      if (e.keyCode === konami[idx]) idx++
      else idx = 0
      if (idx === konami.length) {
        idx = 0
        triggerConfetti()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // create confetti burst
  function triggerConfetti() {
    const c = Array.from({ length: 28 }).map((_, i) => ({ id: i, left: Math.random()*100, bg: i%2?ACCENT:ACCENT2 }))
    setConfetti(c)
    setTimeout(() => setConfetti([]), 2400)
  }

  // tile animation variants
  const tileContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.01 } } }
  const tileItem = { hidden: { scale: 0, rotate: 45, opacity: 0 }, show: i => ({ scale: 1, rotate: 0, opacity: 1, transition: { type: 'spring', damping: 12, stiffness: 220, delay: i*0.005 } }), exit: { scale: 0, opacity: 0, transition: { duration: 0.28 } } }

  // CTA magnetic hover helper (translate based on mouse position)
  function useMagnet() {
    const ref = useRef(null)
    useEffect(() => {
      const el = ref.current
      if (!el) return
      function onMove(e) {
        const rect = el.getBoundingClientRect()
        const dx = (e.clientX - (rect.left + rect.width/2)) / 20
        const dy = (e.clientY - (rect.top + rect.height/2)) / 20
        el.style.transform = `translate(${dx}px, ${dy}px)`
      }
      function onLeave() { el.style.transform = '' }
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
    }, [])
    return ref
  }

  const magnetRef = useMagnet()

  // Tagline reveal control
  const [tagIn, setTagIn] = useState(false)
  useEffect(()=>{ const t = setTimeout(()=> setTagIn(true), 220); return ()=>clearTimeout(t) }, [])

  return (
    <div style={{ minHeight: '100vh', color: '#e6eef6', fontFamily: 'Satoshi, Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial', background: 'radial-gradient(600px 400px at 10% 10%, rgba(11,18,32,0.55), transparent), linear-gradient(180deg, #0b1220 0%, #071018 100%)' }}>

      {/* Fonts */}
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Poppins:wght@400;600&display=swap');` }} />

      {/* Tiny CSS helpers */}
      <style>{`
        .cta { background: ${ACCENT}; color: #021014; border-radius: 10px; padding: 10px 16px; font-weight:700; cursor:pointer; border:none }
        .btn-ghost { color: rgba(230,238,246,0.9); text-decoration:underline; background:transparent; border:none }
        .card { background: #0b1224; border: 1px solid rgba(255,255,255,0.03); border-radius:12px }
        .magnet { transition: transform .06s linear }
      `}</style>

      {/* Header */}
      <header style={{ padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', backdropFilter: 'blur(6px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight:700 }}>Mark JP</div>

          <nav style={{ display:'flex', gap:18, alignItems:'center' }}>
            <button onClick={() => { spawnTiles(TILE_COUNT); setTimeout(()=> setShowProjects(true), 420) }} className="magnet" style={{ background:'transparent', border:'none', color:'rgba(230,238,246,0.9)', cursor:'pointer' }}>Projects</button>
            <a href="#playground" style={{ color:'rgba(230,238,246,0.9)', textDecoration:'none' }}>Playground</a>
            <a href="#contact" style={{ color:'rgba(230,238,246,0.9)', textDecoration:'none' }}>Contact</a>
            <button onClick={()=> setSoundOn(s => !s)} title="Toggle sound" style={{ border:'1px solid rgba(255,255,255,0.04)', padding:'6px 10px', borderRadius:8 }}>{soundOn? '🔉' : '🔈'}</button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth:1100, margin:'0 auto', padding:'48px 24px' }}>
        <section style={{ display:'grid', gridTemplateColumns: '1fr 320px', gap:32, alignItems:'start' }}>

          {/* Hero */}
          <div>
            <h1 style={{ fontSize:56, margin:0, lineHeight:1.02, fontWeight:700, fontFamily: 'Poppins, Inter, sans-serif' }}>
              <span style={{ color:'#e6eef6' }}>Hi — I’m </span>
              <span style={{ color:ACCENT, textShadow: `0 0 14px ${ACCENT}33` }}>Mark.</span>
            </h1>

            <motion.p initial={{ opacity:0, y:8 }} animate={tagIn? { opacity:1, y:0 } : {}} transition={{ duration:0.6, ease:[0.2,0.8,0.2,1] }} style={{ marginTop:18, color:'rgba(230,238,246,0.9)', maxWidth:720, fontSize:18, lineHeight:1.6 }}>
              Exploring automation, AI, and robotics — <span style={{ color:ACCENT2 }}>where ideas take form</span>.
            </motion.p>

            <div style={{ marginTop:28, display:'flex', gap:12 }}>
              <button ref={magnetRef} onMouseEnter={() => {}} onClick={() => { spawnTiles(TILE_COUNT); setTimeout(()=> setShowProjects(true),420) }} className="cta magnet">Explore Projects</button>
              <button className="btn-ghost">Playground</button>
            </div>

          </div>

          {/* Snapshot / card */}
          <aside>
            <div className="card" style={{ width:'100%', padding:18 }}>
              <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                <div style={{ width:56, height:56, borderRadius:10, background:`linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#021014', fontWeight:800 }}>MJ</div>
                <div>
                  <div style={{ fontWeight:700 }}>Mark JP</div>
                  <div style={{ fontSize:12, color:'rgba(230,238,246,0.7)' }}>Engineer · AI · Automation</div>
                </div>
              </div>

              <div style={{ marginTop:14, color:'rgba(230,238,246,0.78)', fontSize:13 }}>
                <div>Exploring automation, AI, and robotics — where ideas take form.</div>
                <div style={{ marginTop:10, fontSize:12 }}><a href="#contact" style={{ color:ACCENT, textDecoration:'underline' }}>Contact</a> • <a href="https://github.com/markjpdev" target="_blank" rel="noreferrer" style={{ color:'rgba(230,238,246,0.9)' }}>GitHub</a></div>
              </div>
            </div>

          </aside>
        </section>

        {/* Tiles overlay (lego) */}
        <div aria-hidden style={{ position:'fixed', inset:0, pointerEvents:'none' }}>
          <AnimatePresence>
            {tiles.length > 0 && (
              <motion.div initial="hidden" animate="show" exit="hidden" variants={tileContainer} style={{ position:'absolute', left:0, top:0, width:'100%', height:'100%', display:'grid', gridTemplateColumns:'repeat(12, 1fr)', gap:8, padding:24 }}>
                {tiles.map((t, i) => (
                  <motion.div key={t.id} custom={i} variants={tileItem} exit="exit" className="tile" style={{ height: 28, borderRadius:6, boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Projects assembly + modal intent */}
        <AnimatePresence>
          {showProjects && (
            <motion.section initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} style={{ marginTop:28 }}>
              <h2 style={{ fontSize:20, marginBottom:12 }}>Selected Projects</h2>
              <div style={{ display:'grid', gap:12 }}>
                {sampleProjects.map((p, idx) => (
                  <motion.div key={p.title} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: idx*0.08 }} className="card" style={{ padding:16, borderRadius:12, background:'#0b1224', border:'1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div>
                        <div style={{ fontWeight:700 }}>{p.title}</div>
                        <div style={{ color:'rgba(230,238,246,0.75)', fontSize:13 }}>{p.desc}</div>
                      </div>
                      <div style={{ color:'rgba(230,238,246,0.6)', fontSize:12 }}>{p.tech}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div style={{ marginTop:12 }}>
                <button onClick={() => setShowProjects(false)} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.04)', padding:'8px 12px', borderRadius:8, color:'#d2e7f0' }}>Close</button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Playground */}
        <section id="playground" style={{ marginTop:40 }}>
          <h3 style={{ fontSize:18 }}>Playground</h3>
          <p style={{ color:'rgba(230,238,246,0.72)' }}>Interactive experiments live here — click tiles, spawn assembly, and explore demos.</p>
        </section>

        {/* Contact */}
        <section id="contact" style={{ marginTop:40 }}>
          <h3 style={{ fontSize:18 }}>Contact</h3>
          <p style={{ color:'rgba(230,238,246,0.72)' }}>Email: <a href="mailto:mark@markjp.dev" style={{ color:ACCENT, textDecoration:'underline' }}>mark@markjp.dev</a></p>
        </section>

      </main>

      {/* confetti */}
      <div aria-hidden style={{ position:'fixed', inset:0, pointerEvents:'none' }}>
        {confetti.map(c => (
          <div key={c.id} style={{ position:'absolute', left: `${c.left}%`, top: '10%', width:10, height:10, borderRadius:4, background: c.bg, transform: 'translateY(-10vh)', animation: 'fall 1.6s linear forwards' }} />
        ))}
      </div>

      {/* confetti animation */}
      <style>{`@keyframes fall { to { transform: translateY(110vh) rotate(200deg); opacity: 0 } }`}</style>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.02)', padding: '24px 0', textAlign:'center', color:'rgba(230,238,246,0.48)' }}>
        © {new Date().getFullYear()} Mark JP
      </footer>
    </div>
  )
}
