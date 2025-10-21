import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

/**
 * pages/index.js
 * Clean, darker aesthetic with subtle particle background and ambient audio (starts on user action).
 * - Replaces lego tiles with soft particles
 * - Ambient audio starts on first gesture (respecting browser autoplay rules)
 * - Smooth scroll for Playground button
 * - Removes body margins so background is edge-to-edge
 */

export default function Home() {
  const ACCENT = '#00E5A5' // neon green (CTA)
  const ACCENT2 = '#00C8FF' // cyan (details)

  // UI state
  const [showProjects, setShowProjects] = useState(false)
  const [tagIn, setTagIn] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)
  const audioCtxRef = useRef(null)
  const gainRef = useRef(null)

  // sample projects
  const sampleProjects = [
    { title: 'Streamline', desc: 'Realtime ingestion + processing pipeline', tech: 'Go • Kafka • Kubernetes' },
    { title: 'Builder', desc: 'Dev tooling for faster builds', tech: 'TypeScript • Node • Docker' },
  ]

  useEffect(()=>{ const t = setTimeout(()=> setTagIn(true), 220); return ()=>clearTimeout(t) }, [])

  // ----------------------
  // Audio: ambient loop, started on first user action
  // ----------------------
  function setupAudioIfNeeded() {
    if (audioCtxRef.current) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      // main oscillator pair for subtle drone
      const o1 = ctx.createOscillator()
      const o2 = ctx.createOscillator()
      const g = ctx.createGain()

      o1.type = 'sine'; o1.frequency.value = 110
      o2.type = 'sine'; o2.frequency.value = 220; o2.detune.value = 6

      // very low gain for ambient background
      g.gain.value = 0.0008

      o1.connect(g); o2.connect(g); g.connect(ctx.destination)
      o1.start(); o2.start()

      audioCtxRef.current = { ctx, o1, o2 }
      gainRef.current = g
    } catch (e) {
      audioCtxRef.current = null
    }
  }

  function startAudio() {
    if (audioStarted) return
    setupAudioIfNeeded()
    if (!audioCtxRef.current) return
    try {
      audioCtxRef.current.ctx.resume && audioCtxRef.current.ctx.resume()
      // fade in
      gainRef.current.gain.cancelScheduledValues(0)
      gainRef.current.gain.setValueAtTime(0, audioCtxRef.current.ctx.currentTime)
      gainRef.current.gain.linearRampToValueAtTime(0.0008, audioCtxRef.current.ctx.currentTime + 1.2)
      setAudioStarted(true)
    } catch(e) { /* ignore */ }
  }

  function stopAudio() {
    if (!audioCtxRef.current) return
    try {
      gainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.ctx.currentTime + 0.6)
      setAudioStarted(false)
    } catch(e) {}
  }

  // ----------------------
  // Particle background (pure CSS + pseudo elements)
  // ----------------------
  const particleLayer = (
    <div aria-hidden className="particle-layer-wrapper">
      <style>{`
        /* remove default margins and ensure full-bleed */
        html, body, #__next { height:100%; margin:0; background:transparent; }

        .particle-layer-wrapper {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .particle-layer {
          position:absolute; inset: 0;
          background:
            radial-gradient(600px 400px at 10% 10%, rgba(11,18,32,0.55), transparent),
            linear-gradient(180deg, #071018 0%, #041018 100%);
          mix-blend-mode: screen;
          opacity: 0.98;
        }
        .particle-layer::before, .particle-layer::after {
          content:"";
          position:absolute; left:-50%; top:-50%;
          width:200%; height:200%;
          background-image:
            radial-gradient(circle at 8% 20%, rgba(0,230,165,0.06) 0 6px, transparent 7px),
            radial-gradient(circle at 70% 40%, rgba(0,200,255,0.05) 0 4px, transparent 5px),
            radial-gradient(circle at 50% 80%, rgba(0,230,165,0.04) 0 5px, transparent 6px);
          animation: floatLayer 16s linear infinite;
        }
        .particle-layer::after { animation-duration: 28s; transform: rotate(45deg); opacity:0.85; }
        @keyframes floatLayer {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-5%) translateX(4%); }
          100% { transform: translateY(0) translateX(0); }
        }
      `}</style>
      <div className="particle-layer" />
    </div>
  )

  // ----------------------
  // Smooth scroll helper for "Playground"
  // ----------------------
  function goToPlayground() {
    const el = document.getElementById('playground')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ----------------------
  // Small helper for Explore Projects click: start audio + show projects
  // ----------------------
  function handleExplore() {
    startAudio()
    setShowProjects(true)
  }

  // ----------------------
  // JSX output
  // ----------------------
  return (
    <div style={{ minHeight: '100vh', color: '#e6eef6', fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial', background: 'linear-gradient(180deg, #071018 0%, #041018 100%)', position:'relative', overflowX:'hidden' }}>

      {/* Fonts (google) */}
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Poppins:wght@400;600&display=swap');` }} />

      {/* Tiny helpers */}
      <style>{`
        :root { --accent: ${ACCENT}; --accent2: ${ACCENT2}; }
        .cta { background: var(--accent); color: #021014; border-radius: 10px; padding: 10px 16px; font-weight:700; cursor:pointer; border:none }
        .btn-ghost { color: rgba(230,238,246,0.9); text-decoration:underline; background:transparent; border:none; cursor:pointer }
        .card { background: #0b1224; border: 1px solid rgba(255,255,255,0.03); border-radius:12px }
        header, footer { z-index: 30; position:relative }
        main { position:relative; z-index:20 }
      `}</style>

      {/* Particle background */}
      {particleLayer}

      {/* Header */}
      <header style={{ padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', backdropFilter:'blur(6px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight:700 }}>Mark JP</div>

          <nav style={{ display:'flex', gap:18, alignItems:'center' }}>
            <button onClick={handleExplore} className="btn-ghost">Projects</button>
            <button className="btn-ghost" onClick={goToPlayground}>Playground</button>
            <button className="btn-ghost" onClick={() => { const el = document.getElementById('contact'); if (el) el.scrollIntoView({behavior:'smooth'}) }}>Contact</button>
            <button onClick={() => { if (!audioStarted) startAudio(); else stopAudio() }} title="Toggle ambient sound" style={{ border:'1px solid rgba(255,255,255,0.04)', padding:'6px 10px', borderRadius:8 }}>
              {audioStarted ? '🔉' : '🔈'}
            </button>
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

            <motion.p initial={{ opacity:0, y:8 }} animate={tagIn? { opacity:1, y:0 } : {}} transition={{ duration:0.6 }} style={{ marginTop:18, color:'rgba(230,238,246,0.9)', maxWidth:720, fontSize:18, lineHeight:1.6 }}>
              Exploring automation, AI, and robotics — <span style={{ color:ACCENT2 }}>where ideas take form</span>.
            </motion.p>

            <div style={{ marginTop:28, display:'flex', gap:12 }}>
              <button onClick={handleExplore} className="cta">Explore Projects</button>
              <button className="btn-ghost" onClick={goToPlayground}>Playground</button>
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

        {/* Projects assembly */}
        <AnimatePresence>
          {showProjects && (
            <motion.section initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} style={{ marginTop:28 }}>
              <h2 style={{ fontSize:20, marginBottom:12 }}>Selected Projects</h2>
              <div style={{ display:'grid', gap:12 }}>
                {sampleProjects.map((p, idx) => (
                  <motion.div key={p.title} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: idx*0.08 }} className="card" style={{ padding:16, borderRadius:12 }}>
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
          <p style={{ color:'rgba(230,238,246,0.72)' }}>Interactive experiments live here — click around, explore demos.</p>
        </section>

        {/* Contact */}
        <section id="contact" style={{ marginTop:40 }}>
          <h3 style={{ fontSize:18 }}>Contact</h3>
          <p style={{ color:'rgba(230,238,246,0.72)' }}>Email: <a href="mailto:mark@markjp.dev" style={{ color:ACCENT, textDecoration:'underline' }}>mark@markjp.dev</a></p>
        </section>

      </main>

      {/* confetti (kept for konami if wanted) */}
      <div aria-hidden style={{ position:'fixed', inset:0, pointerEvents:'none' }} />

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.02)', padding: '24px 0', textAlign:'center', color:'rgba(230,238,246,0.48)' }}>
        © {new Date().getFullYear()} Mark JP
      </footer>
    </div>
  )
}