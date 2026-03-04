import Head from 'next/head'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { useEffect, useState, useCallback, useRef } from 'react'

// ─────────────────────────────────────────────────────────
//  MJP — Portfolio v9.7
//  Principal Designer Audit — Square Enix Final Fantasy
//  & Octopath Traveler hiring standard.
//
//  Audit applied in full:
//  · Craft philosophy woven through
//  · "Why Square Enix" answered
//  · Section-specific atmospheres
//  · Nav card hierarchy
//  · Skills framed as direction, not apology
//  · Particles on entry
//  · Every surface earns its place
// ─────────────────────────────────────────────────────────

const YEARS = new Date().getFullYear() - 2014
const BAY   = 'ᜋᜍᜃ᜔ ᜇᜒᜐᜓᜈ᜔ ᜉᜓᜈ᜔ᜐᜎᜈ᜔'

const C = {
  bg:         '#0D0E14',
  bgWarm:     '#100F18',
  bgCard:     '#131420',
  bgHover:    '#181926',
  bgDeep:     '#090A0F',
  line:       'rgba(255,255,255,0.065)',
  lineHover:  'rgba(255,255,255,0.13)',
  text:       '#E9EBF3',
  textDim:    'rgba(233,235,243,0.64)',
  textMute:   'rgba(233,235,243,0.33)',
  textGhost:  'rgba(233,235,243,0.052)',
  accent:     '#5B8DEF',
  accentDim:  'rgba(91,141,239,0.09)',
  white:      '#F5F6FC',
  green:      '#4ACA8B',
  gold:       '#C4A44A',
  goldDim:    'rgba(196,164,74,0.10)',
  amber:      'rgba(196,164,74,0.06)',
}

const F = {
  display: "'Cormorant Garamond', serif",
  body:    "'Inter', sans-serif",
  mono:    "'JetBrains Mono', monospace",
  bay:     "'Noto Sans Tagalog', sans-serif",
}

const SECTIONS = ['about','skills','projects','contact']

// ─────────────────────────────────────────────────────────
//  HOOKS
// ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [m, setM] = useState(false)
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768)
    fn(); window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return m
}

// ─────────────────────────────────────────────────────────
//  CUSTOM CURSOR
// ─────────────────────────────────────────────────────────
function Cursor() {
  const [dot,  setDot]  = useState({ x: -200, y: -200 })
  const [ring, setRing] = useState({ x: -200, y: -200 })
  const [hot,  setHot]  = useState(false)
  const mob = useIsMobile()
  const raf = useRef(); const cur = useRef({ x:-200,y:-200 }); const tgt = useRef({ x:-200,y:-200 })
  useEffect(() => {
    if (mob) return
    const mv = e => { tgt.current = {x:e.clientX,y:e.clientY}; setDot({x:e.clientX,y:e.clientY}) }
    const ov = e => setHot(!!e.target.closest('button,a,input,textarea,[role="button"]'))
    const tick = () => {
      cur.current.x += (tgt.current.x - cur.current.x) * 0.1
      cur.current.y += (tgt.current.y - cur.current.y) * 0.1
      setRing({ x: cur.current.x, y: cur.current.y })
      raf.current = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', mv)
    window.addEventListener('mouseover', ov)
    raf.current = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseover', ov); cancelAnimationFrame(raf.current) }
  }, [mob])
  if (mob) return null
  const rs = hot ? 38 : 26
  return (
    <>
      <div style={{ position:'fixed', zIndex:9999, pointerEvents:'none', left:dot.x-3, top:dot.y-3, width:6, height:6, borderRadius:'50%', background: hot ? C.accent : C.white, transition:'background 0.15s', mixBlendMode:'difference' }} />
      <div style={{ position:'fixed', zIndex:9998, pointerEvents:'none', left:ring.x-rs/2, top:ring.y-rs/2, width:rs, height:rs, borderRadius:'50%', border:`1px solid ${hot ? C.accent : 'rgba(255,255,255,0.2)'}`, transition:'width 0.22s,height 0.22s,border-color 0.22s' }} />
    </>
  )
}

// ─────────────────────────────────────────────────────────
//  GRAIN — felt, not invisible
// ─────────────────────────────────────────────────────────
function Grain() {
  return (
    <div aria-hidden style={{
      position:'fixed',inset:0,zIndex:8999,pointerEvents:'none',
      backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize:'200px 200px', opacity:0.05, mixBlendMode:'screen',
    }} />
  )
}

// ─────────────────────────────────────────────────────────
//  PARTICLES — FF crystal dust
// ─────────────────────────────────────────────────────────
function Particles({ count = 18, color = C.accent }) {
  const mob = useIsMobile()
  const pts = useRef(
    Array.from({ length: count }, (_, i) => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      dur: 8 + Math.random() * 14,
      delay: Math.random() * -20,
      dx: (Math.random() - 0.5) * 6,
      dy: (Math.random() - 0.5) * 6,
    }))
  )
  if (mob) return null
  return (
    <div aria-hidden style={{ position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:1 }}>
      {pts.current.map((p, i) => (
        <div key={i} style={{
          position:'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          borderRadius:'50%', background: color, opacity: 0.3,
          animation: `float${i % 3} ${p.dur}s ${p.delay}s infinite ease-in-out`,
        }} />
      ))}
      <style>{`
        @keyframes float0 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(6px,-9px)} }
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-8px,7px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(5px,10px)} }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  GRID
// ─────────────────────────────────────────────────────────
function Grid({ cx='50%', cy='50%', size='62%', color=C.line }) {
  return (
    <div aria-hidden style={{
      position:'absolute',inset:0,pointerEvents:'none',
      backgroundImage:`linear-gradient(${color} 1px,transparent 1px),linear-gradient(90deg,${color} 1px,transparent 1px)`,
      backgroundSize:'80px 80px',
      maskImage:`radial-gradient(ellipse ${size} ${size} at ${cx} ${cy},black 20%,transparent 100%)`,
      WebkitMaskImage:`radial-gradient(ellipse ${size} ${size} at ${cx} ${cy},black 20%,transparent 100%)`,
    }} />
  )
}

// ─────────────────────────────────────────────────────────
//  SECTION ATMOSPHERES — each page breathes differently
// ─────────────────────────────────────────────────────────
// About  = Study / warm amber tones
// Skills = Workshop / steel blue precision
// Projects = Gallery / spotlight warmth
// Contact = Chamber / deep dramatic

const ATMO = {
  home: `radial-gradient(ellipse 65% 55% at -8% -12%, rgba(91,141,239,0.07) 0%,transparent 60%),
         radial-gradient(ellipse 40% 40% at 108% 108%, rgba(91,141,239,0.03) 0%,transparent 55%)`,
  about: `radial-gradient(ellipse 70% 50% at -10% -10%, rgba(196,164,74,0.06) 0%,transparent 55%),
          radial-gradient(ellipse 50% 60% at 105% 105%, rgba(91,141,239,0.04) 0%,transparent 60%)`,
  skills: `radial-gradient(ellipse 80% 50% at -12% 50%, rgba(91,141,239,0.07) 0%,transparent 55%),
           radial-gradient(ellipse 35% 35% at 108% 0%, rgba(74,202,139,0.04) 0%,transparent 50%)`,
  projects: `radial-gradient(ellipse 60% 60% at 110% -10%, rgba(74,202,139,0.06) 0%,transparent 55%),
             radial-gradient(ellipse 40% 40% at -8% 105%, rgba(196,164,74,0.04) 0%,transparent 50%)`,
  contact: `radial-gradient(ellipse 80% 65% at -15% 115%, rgba(91,141,239,0.09) 0%,transparent 60%),
            radial-gradient(ellipse 30% 30% at 108% -8%, rgba(91,141,239,0.03) 0%,transparent 50%)`,
}

function Atmo({ variant='home' }) {
  return <div aria-hidden style={{ position:'absolute',inset:0,pointerEvents:'none', background: ATMO[variant] || ATMO.home }} />
}

// ─────────────────────────────────────────────────────────
//  GHOST NUMERAL — visible at proper opacity
// ─────────────────────────────────────────────────────────
function Ghost({ num }) {
  return (
    <div aria-hidden style={{
      position:'absolute', right:'-0.08em', top:'50%',
      transform:'translateY(-54%)',
      fontFamily:F.display,
      fontSize:'clamp(230px,36vw,420px)',
      color:C.textGhost, fontWeight:600,
      lineHeight:1, letterSpacing:'-0.06em',
      pointerEvents:'none', userSelect:'none', zIndex:0,
    }}>{num}</div>
  )
}

// ─────────────────────────────────────────────────────────
//  SWIPE
// ─────────────────────────────────────────────────────────
function Swipe({ section, onNav, children }) {
  const idx = SECTIONS.indexOf(section)
  const x = useMotionValue(0)
  const end = (_,i) => {
    if ((i.offset.x < -80 || i.velocity.x < -500) && idx < 3) onNav(SECTIONS[idx+1])
    else if ((i.offset.x > 80 || i.velocity.x > 500) && idx > 0) onNav(SECTIONS[idx-1])
    x.set(0)
  }
  return (
    <motion.div drag="x" dragConstraints={{left:0,right:0}} dragElastic={0.05}
      onDragEnd={end} style={{x, position:'fixed', inset:0}} whileDrag={{cursor:'grabbing'}}>
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  INTRO
// ─────────────────────────────────────────────────────────
function Intro({ onDone }) {
  const [s, setS] = useState(0)
  useEffect(() => {
    const ts = [[200,1],[900,2],[1700,3],[2900,'d']].map(([t,v])=>setTimeout(()=>v==='d'?onDone():setS(v),t))
    return () => ts.forEach(clearTimeout)
  }, [onDone])
  return (
    <motion.div exit={{opacity:0}} transition={{duration:1.0}}
      style={{position:'fixed',inset:0,zIndex:1000,background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
      <Grid size="52%" />
      <Atmo variant="home" />
      <Particles count={14} color={C.accent} />
      <div style={{position:'relative',textAlign:'center',padding:'0 24px',zIndex:2}}>
        <div style={{width:'clamp(100px,16vw,140px)',height:1,background:C.line,margin:'0 auto 52px'}}>
          <motion.div initial={{width:0}} animate={{width:s>=1?'100%':0}} transition={{duration:2.2,ease:[0.22,1,0.36,1]}}
            style={{height:'100%',background:C.accent}} />
        </div>
        <AnimatePresence>
          {s>=2&&(
            <motion.div initial={{opacity:0,y:22,filter:'blur(14px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{duration:1.1,ease:[0.22,1,0.36,1]}}>
              <div style={{fontFamily:F.display,fontSize:'clamp(78px,16vw,136px)',color:C.white,fontWeight:600,letterSpacing:'0.08em',lineHeight:1,marginBottom:18}}>MJP</div>
              <motion.div initial={{opacity:0}} animate={{opacity:0.72}} transition={{delay:0.55,duration:1.1}}
                style={{fontFamily:F.bay,fontSize:'clamp(13px,2.5vw,18px)',color:C.accent,letterSpacing:'0.14em'}}>
                {BAY}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {s>=3&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8}}
            style={{fontFamily:F.mono,fontSize:'clamp(9px,1.4vw,11px)',color:C.textMute,letterSpacing:'0.22em',textTransform:'uppercase',marginTop:36}}>
            Engineer · Analyst · Builder
          </motion.div>
        )}
      </div>
      <motion.div initial={{opacity:0}} animate={{opacity:s>=1?1:0}}
        style={{position:'absolute',bottom:'clamp(20px,4vw,32px)',right:'clamp(20px,4vw,40px)',fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.1em'}}>
        v9.7.0
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  CINEMATIC FADE
// ─────────────────────────────────────────────────────────
function Fade({ onDone }) {
  useEffect(()=>{const t=setTimeout(onDone,1400);return()=>clearTimeout(t)},[onDone])
  return <motion.div initial={{opacity:0}} animate={{opacity:[0,1,1,0]}} transition={{duration:1.4,times:[0,0.25,0.75,1]}}
    style={{position:'fixed',inset:0,zIndex:950,background:'#000',pointerEvents:'none'}} />
}

// ─────────────────────────────────────────────────────────
//  TITLE SCREEN
// ─────────────────────────────────────────────────────────
function TitleScreen({ onEnter }) {
  const [ready,setReady]=useState(false)
  const [going,setGoing]=useState(false)
  useEffect(()=>{const t=setTimeout(()=>setReady(true),700);return()=>clearTimeout(t)},[])
  const go=useCallback(()=>{if(going)return;setGoing(true);setTimeout(onEnter,300)},[going,onEnter])
  useEffect(()=>{
    if(!ready)return
    const h=e=>{if(!['Tab','Shift','Control','Alt','Meta'].includes(e.key))go()}
    window.addEventListener('keydown',h,{once:true})
    return()=>window.removeEventListener('keydown',h)
  },[ready,go])
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.7}}
      onClick={ready?go:undefined}
      style={{position:'fixed',inset:0,zIndex:900,background:C.bg,cursor:'none',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
      <Grid size="74%" />
      <Atmo variant="home" />
      <Particles count={22} color={C.accent} />
      <div style={{position:'absolute',top:'clamp(28px,4vw,42px)',left:'clamp(20px,4vw,52px)',display:'flex',alignItems:'center',gap:10,zIndex:2}}>
        <div style={{width:4,height:4,background:C.accent,borderRadius:'50%'}} />
        <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.16em'}}>MARKJP.DEV</span>
      </div>
      <div style={{textAlign:'center',position:'relative',zIndex:2,padding:'0 24px'}}>
        <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:1.1,delay:0.2,ease:[0.22,1,0.36,1]}}>
          <div style={{fontFamily:F.display,fontSize:'clamp(96px,20vw,210px)',color:C.white,fontWeight:600,letterSpacing:'0.1em',lineHeight:0.86,marginBottom:22}}>MJP</div>
          <motion.div initial={{opacity:0}} animate={{opacity:0.8}} transition={{delay:0.85,duration:1.1}}
            style={{fontFamily:F.bay,fontSize:'clamp(15px,3vw,24px)',color:C.accent,letterSpacing:'0.2em',marginBottom:50}}>
            {BAY}
          </motion.div>
        </motion.div>
        <motion.div initial={{scaleY:0}} animate={{scaleY:1}} transition={{delay:0.75,duration:1.0}}
          style={{width:1,height:'clamp(32px,5vw,52px)',background:`linear-gradient(to bottom,${C.accent}99,transparent)`,margin:'0 auto 38px'}} />
        {ready&&(
          <motion.div initial={{opacity:0}} animate={{opacity:[0,0.55,0.55,0.12,0.55]}} transition={{duration:3.2,repeat:Infinity}}
            style={{fontFamily:F.mono,fontSize:'clamp(9px,1.6vw,11px)',color:C.textMute,letterSpacing:'0.26em',textTransform:'uppercase'}}>
            Press any key to continue
          </motion.div>
        )}
      </div>
      <div style={{position:'absolute',bottom:'clamp(20px,4vw,32px)',left:0,right:0,padding:'0 clamp(20px,4vw,52px)',display:'flex',justifyContent:'space-between',zIndex:2}}>
        <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.1em'}}>Quezon City, PH</span>
        <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.1em'}}>© {new Date().getFullYear()} MJP</span>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  TOP BAR
// ─────────────────────────────────────────────────────────
function TopBar({ section, onNav }) {
  const mob=useIsMobile(); const [menu,setMenu]=useState(false)
  return (
    <motion.div initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.4}}
      style={{position:'fixed',top:0,left:0,right:0,zIndex:200,height:56,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 clamp(16px,5vw,64px)',background:'rgba(13,14,20,0.96)',backdropFilter:'blur(28px)',borderBottom:`1px solid ${C.line}`}}>
      <button onClick={()=>{onNav('home');setMenu(false)}}
        style={{background:'none',border:'none',cursor:'none',display:'flex',alignItems:'center',gap:10,padding:0}}>
        <div style={{width:28,height:28,border:`1px solid ${C.accent}44`,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{fontFamily:F.display,fontSize:13,color:C.accent,fontWeight:600}}>MJP</span>
        </div>
        {!mob&&<span style={{fontFamily:F.mono,fontSize:11,color:C.textMute,letterSpacing:'0.08em'}}>markjp.dev</span>}
      </button>
      {mob?(
        <>
          <button onClick={()=>setMenu(o=>!o)} style={{background:'none',border:`1px solid ${C.line}`,cursor:'pointer',padding:'6px 14px',fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.08em',textTransform:'uppercase'}}>{menu?'Close':'Menu'}</button>
          <AnimatePresence>
            {menu&&(
              <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
                style={{position:'absolute',top:56,left:0,right:0,background:'rgba(13,14,20,0.98)',borderBottom:`1px solid ${C.line}`,zIndex:300}}>
                {SECTIONS.map(s=>(
                  <button key={s} onClick={()=>{onNav(s);setMenu(false)}}
                    style={{width:'100%',background:section===s?C.accentDim:'none',border:'none',borderBottom:`1px solid ${C.line}`,cursor:'pointer',padding:'16px clamp(16px,5vw,64px)',textAlign:'left',fontFamily:F.mono,fontSize:12,color:section===s?C.accent:C.textDim,letterSpacing:'0.08em',textTransform:'uppercase'}}>
                    {s}
                  </button>
                ))}
                <a href="/resume.pdf" download style={{display:'block',padding:'16px clamp(16px,5vw,64px)',fontFamily:F.mono,fontSize:12,color:C.accent,textDecoration:'none',letterSpacing:'0.08em'}}>↓ Resume</a>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ):(
        <div style={{display:'flex',gap:2,alignItems:'center'}}>
          {SECTIONS.map(s=>{
            const a=section===s
            return (
              <button key={s} onClick={()=>onNav(s)}
                style={{background:a?C.accentDim:'none',border:'none',cursor:'none',fontFamily:F.mono,fontSize:11,color:a?C.accent:C.textMute,letterSpacing:'0.08em',textTransform:'uppercase',padding:'6px 14px',transition:'color 0.2s'}}
                onMouseOver={e=>{if(!a)e.currentTarget.style.color=C.textDim}}
                onMouseOut={e=>{if(!a)e.currentTarget.style.color=C.textMute}}>
                {s}
              </button>
            )
          })}
          <div style={{width:1,height:14,background:C.line,margin:'0 6px'}} />
          <a href="/resume.pdf" download style={{fontFamily:F.mono,fontSize:11,color:C.textMute,letterSpacing:'0.08em',textDecoration:'none',padding:'6px 12px',border:`1px solid ${C.line}`,transition:'all 0.2s',cursor:'none'}}
            onMouseOver={e=>{e.currentTarget.style.color=C.text;e.currentTarget.style.borderColor=C.lineHover}}
            onMouseOut={e=>{e.currentTarget.style.color=C.textMute;e.currentTarget.style.borderColor=C.line}}>↓ CV</a>
          <div style={{width:1,height:14,background:C.line,margin:'0 6px'}} />
          <a href="mailto:mark@markjp.dev" style={{fontFamily:F.mono,fontSize:11,color:C.accent,letterSpacing:'0.08em',textDecoration:'none',padding:'6px 14px',border:`1px solid ${C.accent}33`,transition:'background 0.2s',cursor:'none'}}
            onMouseOver={e=>e.currentTarget.style.background=C.accentDim}
            onMouseOut={e=>e.currentTarget.style.background='transparent'}>hire</a>
        </div>
      )}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  BOTTOM NAV
// ─────────────────────────────────────────────────────────
function BottomNav({ section, onNav }) {
  const i=SECTIONS.indexOf(section); const p=i>0?SECTIONS[i-1]:null; const n=i<3?SECTIONS[i+1]:null
  return (
    <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.3}}
      style={{position:'fixed',bottom:0,left:0,right:0,zIndex:150,height:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 clamp(16px,5vw,64px)',background:'rgba(13,14,20,0.96)',backdropFilter:'blur(28px)',borderTop:`1px solid ${C.line}`}}>
      <button onClick={()=>p&&onNav(p)} style={{background:'none',border:'none',cursor:p?'none':'default',display:'flex',alignItems:'center',gap:8,opacity:p?1:0.16,padding:0,transition:'opacity 0.2s'}}
        onMouseOver={e=>{if(p)e.currentTarget.style.opacity='0.55'}} onMouseOut={e=>{if(p)e.currentTarget.style.opacity='1'}}>
        <span style={{color:C.accent,fontSize:14}}>←</span>
        <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.1em',textTransform:'uppercase'}}>{p||''}</span>
      </button>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        {SECTIONS.map(s=>(
          <button key={s} onClick={()=>onNav(s)}
            style={{width:s===section?24:5,height:4,background:s===section?C.accent:C.line,border:'none',cursor:'none',transition:'all 0.3s',padding:0,borderRadius:2}} />
        ))}
      </div>
      <button onClick={()=>n&&onNav(n)} style={{background:'none',border:'none',cursor:n?'none':'default',display:'flex',alignItems:'center',gap:8,opacity:n?1:0.16,padding:0,transition:'opacity 0.2s'}}
        onMouseOver={e=>{if(n)e.currentTarget.style.opacity='0.55'}} onMouseOut={e=>{if(n)e.currentTarget.style.opacity='1'}}>
        <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.1em',textTransform:'uppercase'}}>{n||''}</span>
        <span style={{color:C.accent,fontSize:14}}>→</span>
      </button>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  HOME SCREEN — nav card hierarchy
// ─────────────────────────────────────────────────────────
function HomeScreen({ onNav }) {
  const mob=useIsMobile()
  const roles=['Business Analyst','Application Support Engineer','Clinical Systems Specialist','Backend Engineer']
  const [ri,setRi]=useState(0)
  useEffect(()=>{const t=setInterval(()=>setRi(i=>(i+1)%4),3400);return()=>clearInterval(t)},[])

  // Nav cards have hierarchy — About is primary, Contact is smallest
  const NAV=[
    {id:'about',    label:'About',    sub:'Background & Story',    h:'clamp(70px,11vw,90px)', accent:C.accent,   weight:1},
    {id:'projects', label:'Projects', sub:'Work & Builds',         h:'clamp(64px,10vw,82px)', accent:C.green,    weight:2},
    {id:'skills',   label:'Skills',   sub:'Stack & Expertise',     h:'clamp(58px,9vw,74px)',  accent:'#6BBFEF',  weight:3},
    {id:'contact',  label:'Contact',  sub:'Get in Touch',          h:'clamp(52px,8vw,66px)',  accent:C.gold,     weight:4},
  ]

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.5}}
      style={{position:'fixed',inset:0,background:C.bg,display:'flex',flexDirection:mob?'column':'row',overflowY:mob?'auto':'hidden'}}>
      <Grid cx="15%" cy="50%" size="88%" />
      <Atmo variant="home" />

      {/* LEFT */}
      <div style={{width:mob?'100%':'clamp(300px,46%,580px)',display:'flex',flexDirection:'column',justifyContent:mob?'flex-start':'center',padding:mob?'clamp(80px,12vw,100px) clamp(20px,6vw,48px) 36px':'80px clamp(28px,5vw,64px)',position:'relative',zIndex:2,borderRight:mob?'none':`1px solid ${C.line}`,borderBottom:mob?`1px solid ${C.line}`:'none',overflow:'hidden'}}>
        <div aria-hidden style={{position:'absolute',bottom:'-8%',left:'-3%',fontFamily:F.bay,fontSize:'clamp(96px,17vw,190px)',color:'rgba(91,141,239,0.038)',letterSpacing:'0.1em',lineHeight:1.2,pointerEvents:'none',userSelect:'none',whiteSpace:'nowrap',zIndex:0}}>
          {BAY}
        </div>
        <Particles count={8} color={C.accent} />
        <div style={{position:'relative',zIndex:1}}>
          <motion.div initial={{opacity:0,x:-14}} animate={{opacity:1,x:0}} transition={{delay:0.2}}
            style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(74,202,139,0.07)',border:'1px solid rgba(74,202,139,0.24)',padding:'7px 14px',marginBottom:44}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:C.green,animation:'pulse 2.5s infinite'}} />
            <span style={{fontFamily:F.mono,fontSize:'clamp(9px,1.5vw,10px)',color:C.green,letterSpacing:'0.14em',textTransform:'uppercase'}}>Available · Open to Work</span>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.3,duration:0.9,ease:[0.22,1,0.36,1]}}
            style={{fontFamily:F.display,fontSize:'clamp(60px,9vw,108px)',color:C.white,fontWeight:600,lineHeight:0.9,letterSpacing:'0.06em',margin:'0 0 14px'}}>MJP</motion.h1>
          <motion.div initial={{opacity:0}} animate={{opacity:0.72}} transition={{delay:0.55,duration:0.9}}
            style={{fontFamily:F.bay,fontSize:'clamp(12px,2vw,15px)',color:C.accent,letterSpacing:'0.14em',marginBottom:28}}>{BAY}</motion.div>
          <div style={{height:22,overflow:'hidden',marginBottom:24}}>
            <AnimatePresence mode="wait">
              <motion.div key={ri} initial={{y:12,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-12,opacity:0}} transition={{duration:0.26}}
                style={{fontFamily:F.mono,fontSize:'clamp(10px,1.4vw,11px)',color:C.accent,letterSpacing:'0.08em'}}>
                {roles[ri]}
              </motion.div>
            </AnimatePresence>
          </div>
          <motion.div initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:0.5,duration:0.7,transformOrigin:'left'}}
            style={{width:32,height:1,background:C.accent,marginBottom:28}} />
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.64}}
            style={{fontFamily:F.body,fontSize:'clamp(13px,1.4vw,15px)',color:C.textDim,lineHeight:1.88,marginBottom:40,maxWidth:400,fontWeight:300}}>
            {YEARS}+ years keeping critical systems running across regulated industries.
            Now building them — and moving toward the intersection of{' '}
            <span style={{color:C.text,fontWeight:400}}>systems engineering and interactive craft.</span>
          </motion.p>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.78}}
            style={{display:'flex',gap:'clamp(16px,3.5vw,28px)',flexWrap:'wrap'}}>
            {[{l:'GitHub',h:'https://github.com/markjpdev'},{l:'LinkedIn',h:'https://linkedin.com/in/jaysonpunsalan'},{l:'Email',h:'mailto:mark@markjp.dev'}].map(s=>(
              <a key={s.l} href={s.h} target={s.h.startsWith('mailto')?undefined:'_blank'} rel="noreferrer"
                style={{fontFamily:F.body,fontSize:'clamp(12px,1.5vw,14px)',fontWeight:400,color:C.textDim,textDecoration:'none',borderBottom:`1px solid ${C.line}`,paddingBottom:3,transition:'all 0.2s',cursor:'none'}}
                onMouseOver={e=>{e.currentTarget.style.color=C.accent;e.currentTarget.style.borderColor=C.accent+'50'}}
                onMouseOut={e=>{e.currentTarget.style.color=C.textDim;e.currentTarget.style.borderColor=C.line}}>
                {s.l}
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* RIGHT — hierarchy in nav */}
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:mob?'clamp(24px,5vw,36px) clamp(20px,6vw,48px) clamp(52px,10vw,72px)':'80px clamp(28px,5vw,64px)',position:'relative',zIndex:2}}>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}} style={{marginBottom:24}}>
          <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.2em',textTransform:'uppercase'}}>Navigate</span>
        </motion.div>
        <div style={{display:'flex',flexDirection:'column',gap:3}}>
          {NAV.map((item,i)=>(
            <motion.button key={item.id}
              initial={{opacity:0,x:28}} animate={{opacity:1,x:0}}
              transition={{delay:0.33+i*0.09,duration:0.55,ease:[0.22,1,0.36,1]}}
              onClick={()=>onNav(item.id)}
              style={{background:'transparent',border:`1px solid ${C.line}`,cursor:'none',textAlign:'left',padding:`0 clamp(16px,3vw,28px)`,display:'flex',alignItems:'center',justifyContent:'space-between',transition:'all 0.22s',height:item.h,position:'relative',overflow:'hidden'}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=item.accent+'55';e.currentTarget.style.background=item.accent+'07'}}
              onMouseOut={e=>{e.currentTarget.style.borderColor=C.line;e.currentTarget.style.background='transparent'}}>
              <div>
                <div style={{fontFamily:F.display,fontSize:`clamp(${18+i*(-1)}px,${2.8-i*0.2}vw,${30-i*2}px)`,color:C.white,fontWeight:600,lineHeight:1,marginBottom:4}}>{item.label}</div>
                <div style={{fontFamily:F.mono,fontSize:'clamp(9px,1.1vw,10px)',color:C.textMute,letterSpacing:'0.08em'}}>{item.sub}</div>
              </div>
              <span style={{color:item.accent,fontSize:15,opacity:0.5}}>→</span>
            </motion.button>
          ))}
        </div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.92}}
          style={{marginTop:24,display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:14,height:1,background:C.line}} />
          <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.1em'}}>Quezon City, PH · UTC+8</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  SHELL — section-specific atmosphere
// ─────────────────────────────────────────────────────────
const ENT={
  about:   {initial:{opacity:0,x:-30},   animate:{opacity:1,x:0}},
  skills:  {initial:{opacity:0,y:-22},   animate:{opacity:1,y:0}},
  projects:{initial:{opacity:0,scale:.983},animate:{opacity:1,scale:1}},
  contact: {initial:{opacity:0,y:30},    animate:{opacity:1,y:0}},
}
function Shell({ children, title, num, sid }) {
  const e=ENT[sid]||ENT.about
  return (
    <motion.div initial={e.initial} animate={e.animate} exit={{opacity:0}}
      transition={{duration:0.44,ease:[0.22,1,0.36,1]}}
      style={{position:'fixed',inset:0,background:C.bg,overflowY:'auto',paddingTop:56,paddingBottom:50}}>
      <Atmo variant={sid} />
      <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
        <Ghost num={num} />
      </div>
      <div style={{position:'relative',zIndex:1,padding:'clamp(32px,5vw,56px) clamp(20px,6vw,80px) clamp(40px,6vw,56px)',maxWidth:1100,margin:'0 auto'}}>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}}
          style={{display:'flex',alignItems:'center',gap:14,marginBottom:52}}>
          <span style={{fontFamily:F.display,fontSize:13,color:C.textMute}}>{num}</span>
          <div style={{width:1,height:14,background:C.line}} />
          <span style={{fontFamily:F.mono,fontSize:11,color:C.accent,letterSpacing:'0.18em',textTransform:'uppercase'}}>{title}</span>
          <div style={{width:36,height:1,background:C.line}} />
          <span style={{fontFamily:F.bay,fontSize:11,color:C.accent,opacity:0.28}}>{BAY.split(' ')[0]}</span>
        </motion.div>
        {children}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
//  ABOUT — craft philosophy + why Square Enix
// ─────────────────────────────────────────────────────────
const TL=[
  {period:'2023—Present',role:'Business Analyst & Application Support Engineer',company:'RxPx Health',color:C.accent},
  {period:'2020—2023',   role:'Clinical Systems Support Specialist',            company:'Thermo Fisher Scientific (PPD)',color:'#6BBFEF'},
  {period:'2019',        role:'B.S. Information Technology',                   company:'Best Thesis Finalist — IoT Flood Monitoring',color:C.green},
]
function AboutPage() {
  const mob=useIsMobile()
  return (
    <Shell title="About" num="01" sid="about">
      <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'minmax(0,1.15fr) minmax(0,0.85fr)',gap:'clamp(28px,5vw,72px)',paddingBottom:40}}>
        <div>
          {/* The statement */}
          <motion.h2 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.18,duration:0.72,ease:[0.22,1,0.36,1]}}
            style={{fontFamily:F.display,fontSize:'clamp(28px,4.2vw,52px)',color:C.white,fontWeight:600,lineHeight:1.1,letterSpacing:'0.01em',marginBottom:32}}>
            I've spent a decade inside systems most engineers never touch.{' '}
            <span style={{color:C.accent}}>Now I'm building them.</span>
          </motion.h2>

          {/* Career narrative */}
          {[
            `Clinical trial platforms. Enterprise integrations. Federated authentication across GxP-regulated environments. Most engineers read about these systems. I kept them running — under SLA pressure, across timezones, with no margin for error.`,
            `The move to backend engineering is not a pivot. It is what happens when a decade of operational depth meets the deliberate decision to own the thing you've been supporting.`,
          ].map((t,i)=>(
            <motion.p key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.25+i*0.1}}
              style={{fontFamily:F.body,fontSize:'clamp(14px,1.5vw,15px)',color:C.textDim,lineHeight:1.9,marginBottom:18,fontWeight:300}}>
              {t}
            </motion.p>
          ))}

          {/* Craft philosophy — what Square Enix needs to see */}
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.44}}
            style={{borderLeft:`2px solid ${C.gold}`,paddingLeft:20,marginTop:28,marginBottom:28}}>
            <div style={{fontFamily:F.mono,fontSize:9,color:C.gold,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:10}}>Craft Philosophy</div>
            <p style={{fontFamily:F.body,fontSize:'clamp(13px,1.5vw,14px)',color:C.textDim,lineHeight:1.88,fontWeight:300,maxWidth:480}}>
              The best systems are invisible. The user feels the care without being able to name it. I believe this applies equally to a clinical data pipeline and a battle system in a JRPG — the craft behind the surface is what creates trust. That principle is why I do this work.
            </p>
          </motion.div>

          {/* Why Square Enix — answered directly */}
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.52}}
            style={{borderLeft:`2px solid ${C.accent}`,paddingLeft:20,marginBottom:36}}>
            <div style={{fontFamily:F.mono,fontSize:9,color:C.accent,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:10}}>Why Square Enix</div>
            <p style={{fontFamily:F.body,fontSize:'clamp(13px,1.5vw,14px)',color:C.textDim,lineHeight:1.88,fontWeight:300,maxWidth:480}}>
              Final Fantasy and Octopath Traveler are not just games I admire — they are the clearest examples I know of systems and craft being unified. The HD-2D engine is a backend decision that became a visual identity. The ATB system is a data structure that became an emotional experience. That is the kind of work I want to do. The clinical background gives me the systems discipline. The transition gives me the direction.{' '}
              <span style={{color:C.textMute,fontFamily:F.mono,fontSize:11}}>[Placeholder — expand with specific personal connection to FF/Octopath titles]</span>
            </p>
          </motion.div>

          {/* Timeline */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}
            style={{borderTop:`1px solid ${C.line}`,paddingTop:32}}>
            <div style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:28}}>Experience</div>
            {TL.map((e,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.65+i*0.08}}
                style={{display:'flex',gap:'clamp(14px,2vw,24px)',alignItems:'center',padding:'clamp(14px,2vw,18px) 0',borderBottom:`1px solid ${C.line}`}}>
                <div style={{width:2,height:'clamp(16px,2.5vw,22px)',background:e.color,flexShrink:0}} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:F.display,fontSize:'clamp(15px,1.8vw,19px)',color:C.text,fontWeight:600,lineHeight:1.2,marginBottom:4}}>{e.role}</div>
                  <div style={{fontFamily:F.mono,fontSize:'clamp(9px,1.2vw,10px)',color:e.color,letterSpacing:'0.08em'}}>{e.company}</div>
                </div>
                <div style={{fontFamily:F.mono,fontSize:'clamp(9px,1.2vw,10px)',color:C.textMute,letterSpacing:'0.06em',flexShrink:0}}>{e.period}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — character, not a table */}
        <div style={{display:'flex',flexDirection:'column',gap:3}}>
          {/* Currently card */}
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.24}}
            style={{background:C.bgCard,border:`1px solid ${C.line}`,padding:'clamp(22px,3vw,32px)'}}>
            <div style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:22}}>Currently</div>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              {[
                {label:'Building',  value:'Clinical REST API — FastAPI, Docker, PostgreSQL',color:C.green},
                {label:'Learning',  value:'Go · Kubernetes · System Design at scale',       color:C.accent},
                {label:'Exploring', value:'Game systems architecture · Narrative UX · Shader fundamentals', color:C.gold},
                {label:'Playing',   value:'[Placeholder — current Square Enix title]',      color:C.textMute},
              ].map(row=>(
                <div key={row.label} style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                  <div style={{width:2,height:'clamp(14px,2vw,16px)',background:row.color,flexShrink:0,marginTop:3}} />
                  <div>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMute,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:3}}>{row.label}</div>
                    <div style={{fontFamily:F.body,fontSize:'clamp(12px,1.4vw,13px)',color:row.label==='Playing'?C.textMute:C.textDim,fontWeight:300,lineHeight:1.5}}>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Drawn to — game signals Square Enix wants */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.36}}
            style={{background:C.bgCard,border:`1px solid ${C.gold}22`,padding:'clamp(18px,2.5vw,26px)'}}>
            <div style={{fontFamily:F.mono,fontSize:10,color:C.gold,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:18}}>Drawn to</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {['Final Fantasy series','Octopath Traveler','HD-2D aesthetic','ATB & turn systems','Narrative systems','Baybayin & Filipino heritage','World-building','Interactive storytelling'].map(tag=>(
                <span key={tag} style={{fontFamily:F.mono,fontSize:'clamp(8px,1.1vw,9px)',color:C.textMute,border:`1px solid ${C.line}`,padding:'4px 10px',letterSpacing:'0.06em'}}>{tag}</span>
              ))}
            </div>
          </motion.div>

          {/* Resume */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.46}}>
            <a href="/resume.pdf" download
              style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:C.bgCard,border:`1px solid ${C.line}`,padding:'clamp(14px,2vw,20px) clamp(16px,2.5vw,24px)',textDecoration:'none',transition:'all 0.2s',cursor:'none'}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=C.accent+'44';e.currentTarget.style.background=C.bgHover}}
              onMouseOut={e=>{e.currentTarget.style.borderColor=C.line;e.currentTarget.style.background=C.bgCard}}>
              <div>
                <div style={{fontFamily:F.body,fontSize:13,color:C.text,fontWeight:500,marginBottom:3}}>Download CV</div>
                <div style={{fontFamily:F.mono,fontSize:9,color:C.textMute,letterSpacing:'0.08em'}}>PDF · Updated 2025</div>
              </div>
              <span style={{color:C.accent,fontSize:18}}>↓</span>
            </a>
          </motion.div>
        </div>
      </div>
    </Shell>
  )
}

// ─────────────────────────────────────────────────────────
//  SKILLS — direction not apology
// ─────────────────────────────────────────────────────────
const DEPTH=[
  {domain:'Clinical SaaS Operations',  tools:'Veeva Vault · Medidata Rave · Chameleon IRT'},
  {domain:'System Integration',        tools:'REST APIs · SOAP · SFTP · Webhooks · OAuth2'},
  {domain:'Identity & Access',         tools:'SSO · SAML · Federated Auth · Role Management'},
  {domain:'Data & Compliance',         tools:'SQL · PostgreSQL · GxP · Audit Trails · UAT'},
  {domain:'Project & Process',         tools:'Jira · Confluence · ServiceNow · Git'},
]
const DIR=[
  {name:'Python',       note:'Primary backend language'},
  {name:'FastAPI',      note:'API framework of choice'},
  {name:'Docker',       note:'Containerization'},
  {name:'Linux / CLI',  note:'Daily driver'},
  {name:'Go',           note:'In active learning'},
  {name:'Kubernetes',   note:'In active learning'},
  {name:'Next.js',      note:'Frontend — this site'},
  {name:'PostgreSQL',   note:'Database'},
]
// Game stack — framed as declared direction, not apology
const GAME=[
  {name:'Game Systems',       note:'Architecture study — in progress'},
  {name:'Unity',              note:'Placeholder — on the roadmap'},
  {name:'Shader fundamentals',note:'Placeholder — visual systems interest'},
  {name:'Narrative UX',       note:'Placeholder — interactive storytelling'},
]
function SkillsPage() {
  const mob=useIsMobile()
  return (
    <Shell title="Skills" num="02" sid="skills">
      <div style={{paddingBottom:40}}>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:'clamp(24px,4vw,64px)'}}>
          {/* LEFT — Depth */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.18}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:28}}>
              <div style={{width:2,height:14,background:C.accent}} />
              <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.2em',textTransform:'uppercase'}}>What I know deeply</span>
            </div>
            {DEPTH.map((item,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.22+i*0.08}}
                style={{padding:'clamp(14px,2vw,18px) 0',borderBottom:`1px solid ${C.line}`}}>
                <div style={{fontFamily:F.display,fontSize:'clamp(16px,2vw,21px)',color:C.text,fontWeight:600,lineHeight:1,marginBottom:7}}>{item.domain}</div>
                <div style={{fontFamily:F.mono,fontSize:'clamp(9px,1.2vw,10px)',color:C.textMute,letterSpacing:'0.06em',lineHeight:1.7}}>{item.tools}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* RIGHT — Direction + Game stack */}
          <div style={{display:'flex',flexDirection:'column',gap:3}}>
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.26}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:22}}>
                <div style={{width:2,height:14,background:C.green}} />
                <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.2em',textTransform:'uppercase'}}>What I'm building with</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,marginBottom:3}}>
                {DIR.map((tech,i)=>(
                  <motion.div key={tech.name} initial={{opacity:0,scale:0.94}} animate={{opacity:1,scale:1}} transition={{delay:0.3+i*0.05}}
                    style={{background:C.bgCard,border:`1px solid ${C.line}`,padding:'clamp(12px,1.8vw,16px)',transition:'all 0.2s'}}
                    onMouseOver={e=>{e.currentTarget.style.borderColor=C.green+'44';e.currentTarget.style.background=C.bgHover}}
                    onMouseOut={e=>{e.currentTarget.style.borderColor=C.line;e.currentTarget.style.background=C.bgCard}}>
                    <div style={{fontFamily:F.mono,fontSize:'clamp(11px,1.4vw,12px)',color:C.text,fontWeight:400,marginBottom:3}}>{tech.name}</div>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMute,letterSpacing:'0.06em'}}>{tech.note}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Game stack — declared direction */}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}
              style={{background:C.bgCard,border:`1px solid ${C.gold}33`,padding:'clamp(16px,2.2vw,22px)'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                <div style={{width:2,height:12,background:C.gold}} />
                <span style={{fontFamily:F.mono,fontSize:9,color:C.gold,letterSpacing:'0.18em',textTransform:'uppercase'}}>The Direction — Game & Interactive</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,marginBottom:16}}>
                {GAME.map(tech=>(
                  <div key={tech.name} style={{padding:'clamp(10px,1.5vw,13px)',border:`1px solid ${C.line}`,opacity:0.7}}>
                    <div style={{fontFamily:F.mono,fontSize:'clamp(10px,1.3vw,11px)',color:C.textDim,marginBottom:3}}>{tech.name}</div>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMute,letterSpacing:'0.06em'}}>{tech.note}</div>
                  </div>
                ))}
              </div>
              <p style={{fontFamily:F.body,fontSize:12,color:C.textMute,lineHeight:1.8,fontWeight:300,paddingLeft:12,borderLeft:`1px solid ${C.gold}44`}}>
                Clinical systems discipline meets game systems architecture. A backend engineer who understands that the most important code is code that nobody sees — and everything the player feels.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </Shell>
  )
}

// ─────────────────────────────────────────────────────────
//  PROJECTS — individual atmosphere per card
// ─────────────────────────────────────────────────────────
const SEC=[
  {num:'02',title:'markjp.dev',status:'Live',sc:C.accent,
   summary:'Designed and built from scratch. Cinematic entry, Baybayin identity mark, full-screen section architecture. Nine iterations. Still going.',
   tags:['Next.js','Framer Motion','Netlify'],link:'https://markjp.dev',
   atmo:`radial-gradient(ellipse 60% 40% at 100% 50%, rgba(91,141,239,0.06) 0%,transparent 60%)`},
  {num:'03',title:'Clinical REST API',status:'In Progress',sc:'#6BBFEF',
   summary:'Healthcare SaaS integrations built by engineers who have never touched the data. I have. This API reflects how clinical data actually flows — realistic models, OpenAPI documentation, containerized deployment.',
   tags:['Python','FastAPI','PostgreSQL','Docker'],note:'GitHub and live demo on deploy.',
   atmo:`radial-gradient(ellipse 50% 50% at 0% 50%, rgba(107,191,239,0.05) 0%,transparent 60%)`},
  {num:'04',title:'Game Systems Experiment',status:'Planned',sc:C.gold,
   summary:'[Placeholder] — An interactive experience applying backend systems thinking to game mechanics. Architecture in design. Build scheduled alongside game stack skill development.',
   tags:['Placeholder','Game Dev','Interactive Systems'],placeholder:true,
   atmo:`radial-gradient(ellipse 50% 50% at 50% 0%, rgba(196,164,74,0.05) 0%,transparent 60%)`},
  {num:'05',title:'Next Project',status:'Unknown',sc:C.textMute,
   summary:'Something worth building. Details when it is ready to talk about.',
   tags:[],ghost:true,atmo:'none'},
]
function ProjectsPage() {
  const [open,setOpen]=useState(null)
  return (
    <Shell title="Projects" num="03" sid="projects">
      <div style={{paddingBottom:40}}>
        {/* FEATURED */}
        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.18}}
          style={{background:C.bgCard,border:`1px solid ${C.green}44`,padding:'clamp(24px,4vw,44px)',marginBottom:3,position:'relative',overflow:'hidden'}}>
          <div aria-hidden style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 65% 70% at 100% 50%,${C.green}07 0%,transparent 65%),radial-gradient(ellipse 40% 40% at 0% 0%,rgba(91,141,239,0.04) 0%,transparent 55%)`,pointerEvents:'none'}} />
          <div style={{position:'relative',zIndex:1}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:16,marginBottom:20}}>
              <div>
                <div style={{fontFamily:F.mono,fontSize:10,color:C.green,letterSpacing:'0.16em',textTransform:'uppercase',marginBottom:10}}>Featured · Shipped</div>
                <h3 style={{fontFamily:F.display,fontSize:'clamp(22px,3.5vw,40px)',color:C.white,fontWeight:600,margin:0,lineHeight:1.1}}>IoT Flood Monitoring System</h3>
              </div>
              <span style={{fontFamily:F.mono,fontSize:10,color:C.green,border:`1px solid ${C.green}55`,padding:'5px 14px',letterSpacing:'0.1em',flexShrink:0,alignSelf:'flex-start'}}>Best Thesis Finalist</span>
            </div>
            <p style={{fontFamily:F.body,fontSize:'clamp(13px,1.5vw,15px)',color:C.textDim,lineHeight:1.88,marginBottom:22,maxWidth:600,fontWeight:300}}>
              Flood-prone communities lack affordable real-time monitoring. Built a complete IoT sensor network from scratch — data ingestion pipeline, threshold-based alerting, live dashboard — designed to run on minimal infrastructure. Demonstrated that enterprise-grade monitoring principles apply at community scale.
            </p>
            <div style={{display:'flex',gap:'clamp(5px,1vw,8px)',flexWrap:'wrap'}}>
              {['IoT','Embedded Systems','Real-time Sensors','Alert Pipeline','Dashboard'].map(t=>(
                <span key={t} style={{fontFamily:F.mono,fontSize:10,color:C.textMute,border:`1px solid ${C.line}`,padding:'4px 10px',letterSpacing:'0.06em'}}>{t}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* SECONDARY — individual atmosphere */}
        {SEC.map((p,i)=>(
          <motion.div key={p.num} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.26+i*0.09}} style={{marginBottom:3}}>
            <div
              onClick={()=>!p.ghost&&setOpen(open===i?null:i)}
              style={{background:open===i?C.bgCard:'transparent',border:`1px solid ${open===i?p.sc+'33':p.placeholder?p.sc+'18':C.line}`,padding:'clamp(16px,2.5vw,26px)',cursor:p.ghost?'default':'none',transition:'all 0.22s',opacity:p.ghost?0.42:1,position:'relative',overflow:'hidden'}}
              onMouseOver={e=>{if(!p.ghost&&open!==i)e.currentTarget.style.borderColor=p.sc+'33'}}
              onMouseOut={e=>{if(!p.ghost&&open!==i)e.currentTarget.style.borderColor=p.placeholder?p.sc+'18':C.line}}>
              {/* Per-card atmosphere on hover */}
              {open===i&&p.atmo!=='none'&&(
                <div aria-hidden style={{position:'absolute',inset:0,background:p.atmo,pointerEvents:'none',zIndex:0}} />
              )}
              <div style={{position:'relative',zIndex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:'clamp(10px,2vw,20px)',flexWrap:'wrap',marginBottom:(open===i||p.ghost)?16:0}}>
                  <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,flexShrink:0}}>{p.num}</span>
                  <h3 style={{flex:1,fontFamily:F.display,fontSize:'clamp(17px,2.2vw,23px)',color:p.ghost?C.textMute:C.white,fontWeight:600,margin:0,minWidth:120}}>{p.title}</h3>
                  <span style={{fontFamily:F.mono,fontSize:10,color:p.sc,border:`1px solid ${p.sc}44`,padding:'3px 10px',letterSpacing:'0.08em',flexShrink:0}}>{p.status}</span>
                  {!p.ghost&&<span style={{color:C.textMute,fontSize:13,transform:open===i?'rotate(90deg)':'none',transition:'transform 0.2s',flexShrink:0}}>→</span>}
                </div>
                {p.ghost&&<p style={{fontFamily:F.body,fontSize:13,color:C.textMute,fontWeight:300}}>{p.summary}</p>}
                <AnimatePresence>
                  {open===i&&!p.ghost&&(
                    <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{overflow:'hidden',paddingLeft:28}}>
                      {p.placeholder&&<div style={{fontFamily:F.mono,fontSize:9,color:p.sc,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:10}}>Placeholder — in planning</div>}
                      <p style={{fontFamily:F.body,fontSize:'clamp(13px,1.4vw,14px)',color:C.textDim,lineHeight:1.82,marginBottom:14,fontWeight:300,maxWidth:540}}>{p.summary}</p>
                      {p.note&&<p style={{fontFamily:F.mono,fontSize:11,color:C.textMute,marginBottom:12}}>{p.note}</p>}
                      {p.tags.length>0&&(
                        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:p.link?12:0}}>
                          {p.tags.map(t=><span key={t} style={{fontFamily:F.mono,fontSize:10,color:C.textMute,border:`1px solid ${C.line}`,padding:'4px 10px',letterSpacing:'0.06em'}}>{t}</span>)}
                        </div>
                      )}
                      {p.link&&<a href={p.link} target="_blank" rel="noreferrer" style={{fontFamily:F.mono,fontSize:11,color:C.accent,textDecoration:'none',cursor:'none'}}>↗ {p.link.replace('https://','')}</a>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Shell>
  )
}

// ─────────────────────────────────────────────────────────
//  CONTACT — closing argument
// ─────────────────────────────────────────────────────────
function ContactPage() {
  const mob=useIsMobile()
  const [form,setForm]=useState({name:'',email:'',message:''})
  const [sent,setSent]=useState(false)
  const sub=e=>{
    e.preventDefault()
    window.open(`mailto:mark@markjp.dev?subject=${encodeURIComponent(`Message from ${form.name}`)}&body=${encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`)
    setSent(true)
  }
  const inp={width:'100%',background:C.bgCard,border:`1px solid ${C.line}`,padding:'clamp(10px,1.5vw,13px) clamp(12px,2vw,16px)',fontFamily:F.body,fontSize:'clamp(13px,1.5vw,14px)',color:C.text,outline:'none',transition:'border-color 0.2s',fontWeight:300}
  const lbl={fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.16em',textTransform:'uppercase',display:'block',marginBottom:8}
  return (
    <Shell title="Contact" num="04" sid="contact">
      <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'minmax(0,1fr) minmax(0,1fr)',gap:'clamp(28px,5vw,72px)',paddingBottom:40}}>
        <div>
          <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.18}}>
            <p style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:22}}>The right fit</p>
            <h2 style={{fontFamily:F.display,fontSize:'clamp(30px,4.2vw,54px)',color:C.white,fontWeight:600,lineHeight:1.08,letterSpacing:'0.01em',marginBottom:28}}>
              If you're building something that demands craft,{' '}
              <span style={{color:C.accent}}>I want to be in that room.</span>
            </h2>
            <p style={{fontFamily:F.body,fontSize:'clamp(13px,1.5vw,15px)',color:C.textDim,lineHeight:1.9,marginBottom:18,fontWeight:300,maxWidth:420}}>
              Backend engineering. Clinical systems architecture. Interactive product development. Problems where the craft behind the surface is as important as the surface itself.
            </p>
            <p style={{fontFamily:F.body,fontSize:'clamp(13px,1.5vw,15px)',color:C.textDim,lineHeight:1.9,marginBottom:40,fontWeight:300,maxWidth:420}}>
              I've spent a decade making sure the systems that matter keep running. Now I want to build them — with teams who care about what they ship as much as I do.
            </p>
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.32}}>
            {[
              {l:'Email',   v:'mark@markjp.dev',     h:'mailto:mark@markjp.dev'},
              {l:'GitHub',  v:'github.com/markjpdev', h:'https://github.com/markjpdev'},
              {l:'LinkedIn',v:'in/jaysonpunsalan',    h:'https://linkedin.com/in/jaysonpunsalan'},
            ].map(item=>(
              <div key={item.l} style={{padding:'clamp(12px,1.8vw,16px) 0',borderBottom:`1px solid ${C.line}`}}>
                <div style={{fontFamily:F.mono,fontSize:9,color:C.textMute,letterSpacing:'0.16em',textTransform:'uppercase',marginBottom:5}}>{item.l}</div>
                <a href={item.h} target={item.h.startsWith('mailto')?undefined:'_blank'} rel="noreferrer"
                  style={{fontFamily:F.body,fontSize:'clamp(13px,1.5vw,15px)',color:C.textDim,textDecoration:'none',fontWeight:300,transition:'color 0.2s',cursor:'none'}}
                  onMouseOver={e=>e.currentTarget.style.color=C.accent}
                  onMouseOut={e=>e.currentTarget.style.color=C.textDim}>
                  {item.v}
                </a>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{delay:0.28}}>
          {sent?(
            <div style={{background:C.bgCard,border:`1px solid ${C.line}`,padding:'clamp(40px,6vw,60px) clamp(24px,4vw,40px)',textAlign:'center'}}>
              <div style={{fontFamily:F.display,fontSize:'clamp(24px,3.5vw,40px)',color:C.white,fontWeight:600,marginBottom:14}}>Sent.</div>
              <p style={{fontFamily:F.body,fontSize:14,color:C.textDim,lineHeight:1.8,fontWeight:300}}>Your mail client should have opened. I'll be in touch.</p>
            </div>
          ):(
            <form onSubmit={sub} style={{display:'flex',flexDirection:'column',gap:'clamp(14px,2vw,18px)'}}>
              {[{k:'name',l:'Name',t:'text',p:'Your name'},{k:'email',l:'Email',t:'email',p:'your@email.com'}].map(f=>(
                <div key={f.k}>
                  <label style={lbl}>{f.l}</label>
                  <input style={inp} type={f.t} placeholder={f.p} value={form[f.k]} required
                    onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}
                    onFocus={e=>e.target.style.borderColor=C.accent}
                    onBlur={e=>e.target.style.borderColor=C.line} />
                </div>
              ))}
              <div>
                <label style={lbl}>Message</label>
                <textarea style={{...inp,minHeight:'clamp(90px,12vw,120px)',resize:'vertical'}} placeholder="Tell me about the work."
                  value={form.message} required
                  onChange={e=>setForm(p=>({...p,message:e.target.value}))}
                  onFocus={e=>e.target.style.borderColor=C.accent}
                  onBlur={e=>e.target.style.borderColor=C.line} />
              </div>
              <button type="submit"
                style={{background:C.accent,border:'none',padding:'clamp(11px,1.5vw,13px) clamp(22px,3vw,32px)',fontFamily:F.mono,fontSize:11,color:C.bg,fontWeight:700,letterSpacing:'0.14em',cursor:'none',transition:'opacity 0.2s',textTransform:'uppercase',alignSelf:'flex-start'}}
                onMouseOver={e=>e.currentTarget.style.opacity='0.78'}
                onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                Send →
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </Shell>
  )
}

// ─────────────────────────────────────────────────────────
//  ROOT
// ─────────────────────────────────────────────────────────
export default function Portfolio() {
  const [mounted,setMounted]=useState(false)
  const [phase,setPhase]=useState('intro')
  const [section,setSection]=useState(null)
  useEffect(()=>setMounted(true),[])
  if(!mounted)return null
  const onNav=id=>setSection(id==='home'?null:id)
  const PAGES={about:AboutPage,skills:SkillsPage,projects:ProjectsPage,contact:ContactPage}
  const Page=section?PAGES[section]:null
  return (
    <>
      <Head>
        <title>MJP — Mark Jayson Punsalan</title>
        <meta name="description" content="MJP — Mark Jayson Punsalan. Engineer, Analyst, Builder. Quezon City, Philippines." />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
        <meta name="theme-color" content="#0D0E14" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&family=Noto+Sans+Tagalog&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body,#__next{background:${C.bg};min-height:100%;height:100%}
        body{-webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:none}
        a,button,input,textarea,select{cursor:none}
        @media(hover:none){body,a,button,input,textarea{cursor:auto}}
        ::-webkit-scrollbar{width:2px}
        ::-webkit-scrollbar-track{background:${C.bg}}
        ::-webkit-scrollbar-thumb{background:${C.accent}44}
        ::selection{background:${C.accentDim};color:${C.white}}
        input,textarea{-webkit-appearance:none;border-radius:0}
        input::placeholder,textarea::placeholder{color:${C.textMute};font-family:'Inter',sans-serif;font-size:13px;font-weight:300}
        @keyframes pulse{0%,100%{box-shadow:0 0 7px ${C.green}88,0 0 14px ${C.green}22}50%{box-shadow:0 0 2px ${C.green}44}}
      `}} />
      <Grain />
      <Cursor />
      <AnimatePresence mode="wait">
        {phase==='intro'&&<Intro key="intro" onDone={()=>setPhase('title')} />}
        {phase==='title'&&<TitleScreen key="title" onEnter={()=>setPhase('fade')} />}
        {phase==='fade'&&<Fade key="fade" onDone={()=>setPhase('main')} />}
        {phase==='main'&&(
          <motion.div key="main" style={{position:'fixed',inset:0}} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}}>
            {section&&<TopBar section={section} onNav={onNav} />}
            {section&&<BottomNav section={section} onNav={onNav} />}
            <AnimatePresence mode="wait">
              {!section&&<HomeScreen key="home" onNav={onNav} />}
              {section&&Page&&(
                <Swipe key={section} section={section} onNav={onNav}>
                  <Page />
                </Swipe>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
