import Head from 'next/head'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { useEffect, useState, useCallback, useRef } from 'react'

// ─────────────────────────────────────────────────────────
//  MJP — v9.8  |  15/10 Square Enix Standard
//  Boot sequence · Living grid · Ambient audio · Secret
//  Character reveal · Mastery map · Studio archive
//  Transmission contact · Section flash · Nav hierarchy
// ─────────────────────────────────────────────────────────

const YEARS = new Date().getFullYear() - 2014
const BAY   = '\u1D0B\u1D0D\u1D0A\u1D04 \u1D10\u1D18\u1D22\u1D09\u1D19\u1D22 \u1D1B\u1D18\u1D22\u1D1A\u1D19\u1D09\u1D22'

const C = {
  bg:'#0D0E14', bgCard:'#131420', bgHover:'#181926', bgDeep:'#090A0F',
  line:'rgba(255,255,255,0.065)', lineHover:'rgba(255,255,255,0.14)',
  text:'#E9EBF3', textDim:'rgba(233,235,243,0.64)', textMute:'rgba(233,235,243,0.33)',
  textGhost:'rgba(233,235,243,0.052)',
  accent:'#5B8DEF', accentDim:'rgba(91,141,239,0.09)',
  white:'#F5F6FC', green:'#4ACA8B', gold:'#C4A44A',
}
const F = {
  display:"'Cormorant Garamond', serif",
  body:"'Inter', sans-serif",
  mono:"'JetBrains Mono', monospace",
  bay:"'Noto Sans Tagalog', sans-serif",
}
const SECTIONS = ['about','skills','projects','contact']
const BAYBAYIN = 'ᜋᜍᜃ᜔ ᜇᜒᜐᜓᜈ᜔ ᜉᜓᜈ᜔ᜐᜎᜈ᜔'

// ─── HOOKS ───────────────────────────────────────────────
function useIsMobile() {
  const [m,setM]=useState(false)
  useEffect(()=>{ const fn=()=>setM(window.innerWidth<768); fn(); window.addEventListener('resize',fn); return ()=>window.removeEventListener('resize',fn) },[])
  return m
}

function useAudio() {
  const ctx=useRef(null), masterGain=useRef(null)
  const [on,setOn]=useState(false)
  const start=useCallback(()=>{
    if(ctx.current)return
    const ac=new(window.AudioContext||window.webkitAudioContext)()
    ctx.current=ac
    const mg=ac.createGain(); mg.gain.setValueAtTime(0,ac.currentTime); mg.connect(ac.destination); masterGain.current=mg
    const len=ac.sampleRate*3, ir=ac.createBuffer(2,len,ac.sampleRate)
    for(let c=0;c<2;c++){ const d=ir.getChannelData(c); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.2) }
    const rev=ac.createConvolver(); rev.buffer=ir; rev.connect(mg)
    ;[65.4,98.0,130.8,196.0,261.6,130.8].forEach((f,i)=>{
      const o=ac.createOscillator(), g=ac.createGain()
      o.type=i%2===0?'sine':'triangle'; o.frequency.setValueAtTime(f,ac.currentTime)
      g.gain.setValueAtTime(0.013-i*0.0015,ac.currentTime)
      o.connect(g); g.connect(rev); o.start()
    })
    mg.gain.linearRampToValueAtTime(1,ac.currentTime+2.5)
  },[])
  const toggle=useCallback(()=>{
    if(!on){start();setOn(true)}
    else{
      if(ctx.current&&masterGain.current){ masterGain.current.gain.linearRampToValueAtTime(0,ctx.current.currentTime+1.5); setTimeout(()=>{ctx.current?.close();ctx.current=null;masterGain.current=null},1700) }
      setOn(false)
    }
  },[on,start])
  return{on,toggle}
}

function useSecret(onUnlock){
  const count=useRef(0), timer=useRef(null)
  return useCallback(()=>{ count.current++; clearTimeout(timer.current); if(count.current>=5){count.current=0;onUnlock()}else timer.current=setTimeout(()=>{count.current=0},2000) },[onUnlock])
}

// ─── CURSOR ──────────────────────────────────────────────
function Cursor(){
  const [dot,setDot]=useState({x:-200,y:-200}), [ring,setRing]=useState({x:-200,y:-200}), [hot,setHot]=useState(false)
  const mob=useIsMobile(), raf=useRef(), cur=useRef({x:-200,y:-200}), tgt=useRef({x:-200,y:-200})
  useEffect(()=>{
    if(mob)return
    const mv=e=>{tgt.current={x:e.clientX,y:e.clientY};setDot({x:e.clientX,y:e.clientY})}
    const ov=e=>setHot(!!e.target.closest('button,a,input,textarea'))
    const tick=()=>{ cur.current.x+=(tgt.current.x-cur.current.x)*0.1; cur.current.y+=(tgt.current.y-cur.current.y)*0.1; setRing({x:cur.current.x,y:cur.current.y}); raf.current=requestAnimationFrame(tick) }
    window.addEventListener('mousemove',mv); window.addEventListener('mouseover',ov); raf.current=requestAnimationFrame(tick)
    return()=>{ window.removeEventListener('mousemove',mv); window.removeEventListener('mouseover',ov); cancelAnimationFrame(raf.current) }
  },[mob])
  if(mob)return null
  const rs=hot?38:26
  return(<>
    <div style={{position:'fixed',zIndex:9999,pointerEvents:'none',left:dot.x-3,top:dot.y-3,width:6,height:6,borderRadius:'50%',background:hot?C.accent:C.white,transition:'background 0.15s',mixBlendMode:'difference'}}/>
    <div style={{position:'fixed',zIndex:9998,pointerEvents:'none',left:ring.x-rs/2,top:ring.y-rs/2,width:rs,height:rs,borderRadius:'50%',border:`1px solid ${hot?C.accent:'rgba(255,255,255,0.2)'}`,transition:'width 0.22s,height 0.22s,border-color 0.22s'}}/>
  </>)
}

// ─── GRAIN ───────────────────────────────────────────────
function Grain(){
  return <div aria-hidden style={{position:'fixed',inset:0,zIndex:8999,pointerEvents:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,backgroundSize:'200px 200px',opacity:0.05,mixBlendMode:'screen'}}/>
}

// ─── SCANLINES ───────────────────────────────────────────
function Scanlines({opacity=0.025}){
  return <div aria-hidden style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:2,backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,${opacity}) 2px,rgba(0,0,0,${opacity}) 4px)`}}/>
}

// ─── LIVING GRID ─────────────────────────────────────────
function LivingGrid(){
  const mob=useIsMobile(), canvas=useRef(), mouse=useRef({x:-999,y:-999})
  useEffect(()=>{ if(mob)return; const mv=e=>{mouse.current={x:e.clientX,y:e.clientY}}; window.addEventListener('mousemove',mv); return()=>window.removeEventListener('mousemove',mv) },[mob])
  useEffect(()=>{
    const el=canvas.current; if(!el||mob)return
    const ctx=el.getContext('2d'); let raf; const step=80
    const resize=()=>{ el.width=window.innerWidth; el.height=window.innerHeight }
    resize(); window.addEventListener('resize',resize)
    const draw=()=>{
      el.width=el.width
      const W=el.width,H=el.height,mx=mouse.current.x,my=mouse.current.y
      const cols=Math.ceil(W/step)+2,rows=Math.ceil(H/step)+2
      for(let c=0;c<cols;c++) for(let r=0;r<rows;r++){
        const x=c*step,y=r*step,dist=Math.sqrt(Math.pow(x-mx,2)+Math.pow(y-my,2))
        const alpha=0.065+Math.max(0,1-dist/200)*0.16
        ctx.strokeStyle=`rgba(255,255,255,${alpha})`; ctx.lineWidth=0.5
        if(c>0){ctx.beginPath();ctx.moveTo((c-1)*step,y);ctx.lineTo(x,y);ctx.stroke()}
        if(r>0){ctx.beginPath();ctx.moveTo(x,(r-1)*step);ctx.lineTo(x,y);ctx.stroke()}
      }
      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',resize) }
  },[mob])
  if(mob)return <div aria-hidden style={{position:'absolute',inset:0,pointerEvents:'none',backgroundImage:`linear-gradient(${C.line} 1px,transparent 1px),linear-gradient(90deg,${C.line} 1px,transparent 1px)`,backgroundSize:'80px 80px',maskImage:'radial-gradient(ellipse 75% 75% at 50% 50%,black 20%,transparent 100%)',WebkitMaskImage:'radial-gradient(ellipse 75% 75% at 50% 50%,black 20%,transparent 100%)'}}/>
  return <canvas ref={canvas} aria-hidden style={{position:'absolute',inset:0,pointerEvents:'none'}}/>
}

// ─── PARTICLES ───────────────────────────────────────────
function Particles({count=18,color=C.accent}){
  const mob=useIsMobile()
  const pts=useRef(Array.from({length:count},()=>({x:Math.random()*100,y:Math.random()*100,s:Math.random()*1.8+0.4,d:8+Math.random()*14,dl:Math.random()*-20})))
  if(mob)return null
  return(
    <div aria-hidden style={{position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:1}}>
      {pts.current.map((p,i)=><div key={i} style={{position:'absolute',left:`${p.x}%`,top:`${p.y}%`,width:p.s,height:p.s,borderRadius:'50%',background:color,opacity:0.28,animation:`pp${i%3} ${p.d}s ${p.dl}s infinite ease-in-out`}}/>)}
      <style>{`@keyframes pp0{0%,100%{transform:translate(0,0)}50%{transform:translate(6px,-9px)}}@keyframes pp1{0%,100%{transform:translate(0,0)}50%{transform:translate(-8px,7px)}}@keyframes pp2{0%,100%{transform:translate(0,0)}50%{transform:translate(5px,10px)}}`}</style>
    </div>
  )
}

// ─── ATMOSPHERE ──────────────────────────────────────────
const ATMO={
  home:`radial-gradient(ellipse 65% 55% at -8% -12%,rgba(91,141,239,0.07) 0%,transparent 60%),radial-gradient(ellipse 40% 40% at 108% 108%,rgba(91,141,239,0.03) 0%,transparent 55%)`,
  about:`radial-gradient(ellipse 70% 50% at -10% -10%,rgba(196,164,74,0.06) 0%,transparent 55%),radial-gradient(ellipse 50% 60% at 105% 105%,rgba(91,141,239,0.04) 0%,transparent 60%)`,
  skills:`radial-gradient(ellipse 80% 50% at -12% 50%,rgba(91,141,239,0.07) 0%,transparent 55%),radial-gradient(ellipse 35% 35% at 108% 0%,rgba(74,202,139,0.04) 0%,transparent 50%)`,
  projects:`radial-gradient(ellipse 60% 60% at 110% -10%,rgba(74,202,139,0.06) 0%,transparent 55%),radial-gradient(ellipse 40% 40% at -8% 105%,rgba(196,164,74,0.04) 0%,transparent 50%)`,
  contact:`radial-gradient(ellipse 80% 65% at -15% 115%,rgba(91,141,239,0.09) 0%,transparent 60%)`,
  secret:`radial-gradient(ellipse 100% 100% at 50% 50%,rgba(196,164,74,0.14) 0%,rgba(91,141,239,0.06) 45%,transparent 70%)`,
}
function Atmo({v='home'}){ return <div aria-hidden style={{position:'absolute',inset:0,pointerEvents:'none',background:ATMO[v]||ATMO.home}}/> }

// ─── GHOST NUMERAL ───────────────────────────────────────
function Ghost({num}){
  return <div aria-hidden style={{position:'absolute',right:'-0.08em',top:'50%',transform:'translateY(-54%)',fontFamily:F.display,fontSize:'clamp(230px,36vw,420px)',color:C.textGhost,fontWeight:600,lineHeight:1,letterSpacing:'-0.06em',pointerEvents:'none',userSelect:'none',zIndex:0}}>{num}</div>
}

// ─── SECTION FLASH ───────────────────────────────────────
function SectionFlash({num,onDone}){
  useEffect(()=>{const t=setTimeout(onDone,500);return()=>clearTimeout(t)},[onDone])
  return(
    <motion.div initial={{opacity:0.18}} animate={{opacity:0}} transition={{duration:0.5,ease:'easeOut'}} style={{position:'fixed',inset:0,zIndex:600,pointerEvents:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <span style={{fontFamily:F.display,fontSize:'clamp(120px,25vw,300px)',color:C.white,fontWeight:600,letterSpacing:'-0.06em',lineHeight:1}}>{num}</span>
    </motion.div>
  )
}

// ─── SWIPE — horizontal only, no scroll conflict ─────────
function Swipe({section,onNav,children}){
  const idx=SECTIONS.indexOf(section), x=useMotionValue(0)
  const end=(_,i)=>{
    const hDom=Math.abs(i.offset.x)>Math.abs(i.offset.y)*1.5
    if(!hDom){x.set(0);return}
    if((i.offset.x<-80||i.velocity.x<-500)&&idx<3)onNav(SECTIONS[idx+1])
    else if((i.offset.x>80||i.velocity.x>500)&&idx>0)onNav(SECTIONS[idx-1])
    x.set(0)
  }
  return <motion.div drag="x" dragConstraints={{left:0,right:0}} dragElastic={0.05} onDragEnd={end} style={{x,position:'fixed',inset:0}} whileDrag={{cursor:'grabbing'}}>{children}</motion.div>
}

// ─── AUDIO BUTTON ────────────────────────────────────────
function AudioBtn({on,toggle}){
  return(
    <motion.button initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}} onClick={toggle} aria-label={on?'Mute audio':'Enable audio'}
      style={{position:'fixed',bottom:58,right:'clamp(16px,3vw,32px)',zIndex:160,background:'none',border:`1px solid ${on?C.accent+'55':C.line}`,cursor:'none',padding:'7px 12px',display:'flex',alignItems:'center',gap:6,transition:'border-color 0.2s'}}
      onMouseOver={e=>e.currentTarget.style.borderColor=C.accent+'55'} onMouseOut={e=>e.currentTarget.style.borderColor=on?C.accent+'55':C.line}>
      <div style={{display:'flex',gap:2,alignItems:'flex-end',height:12}}>
        {[4,7,5,9,6].map((h,i)=><div key={i} style={{width:2,background:on?C.accent:C.textMute,borderRadius:1,height:h,animation:on?`ab${i} ${0.6+i*0.12}s infinite ease-in-out alternate`:'none',transition:'background 0.3s'}}/>)}
      </div>
      <span style={{fontFamily:F.mono,fontSize:9,color:on?C.accent:C.textMute,letterSpacing:'0.1em',transition:'color 0.2s'}}>{on?'SND ON':'SND OFF'}</span>
      <style>{`@keyframes ab0{to{height:10px}}@keyframes ab1{to{height:4px}}@keyframes ab2{to{height:12px}}@keyframes ab3{to{height:5px}}@keyframes ab4{to{height:10px}}`}</style>
    </motion.button>
  )
}

// ─── SECRET SCREEN ───────────────────────────────────────
function SecretScreen({onClose}){
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.6}} onClick={onClose}
      style={{position:'fixed',inset:0,zIndex:800,background:C.bg,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'none',overflow:'hidden'}}>
      <Atmo v="secret"/><Scanlines opacity={0.04}/><Particles count={30} color={C.gold}/>
      <motion.div initial={{opacity:0,y:30,filter:'blur(12px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{delay:0.3,duration:1.0,ease:[0.22,1,0.36,1]}}
        style={{textAlign:'center',padding:'0 clamp(24px,6vw,64px)',position:'relative',zIndex:3,maxWidth:600}}>
        <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:0.2,duration:0.8}}
          style={{fontFamily:F.bay,fontSize:'clamp(28px,6vw,64px)',color:C.gold,letterSpacing:'0.2em',marginBottom:32,opacity:0.9}}>{BAYBAYIN}</motion.div>
        <div style={{width:40,height:1,background:C.gold,margin:'0 auto 32px',opacity:0.4}}/>
        <p style={{fontFamily:F.display,fontSize:'clamp(16px,2.2vw,22px)',color:C.textDim,fontWeight:400,lineHeight:1.85,marginBottom:28}}>
          You found this.<br/>That means you pay attention.<br/><span style={{color:C.white}}>That is exactly the kind of person we are looking for.</span>
        </p>
        <div style={{width:24,height:1,background:C.gold,margin:'0 auto 24px',opacity:0.3}}/>
        <div style={{fontFamily:F.mono,fontSize:'clamp(10px,1.5vw,13px)',color:C.gold,letterSpacing:'0.14em',marginBottom:10}}>mark@markjp.dev</div>
        <div style={{fontFamily:F.mono,fontSize:'clamp(9px,1.3vw,10px)',color:C.textMute,letterSpacing:'0.1em',marginBottom:52}}>If you are reading this — you already know.</div>
        <motion.div initial={{opacity:0}} animate={{opacity:[0,0.45,0.45,0.1,0.45]}} transition={{delay:1.5,duration:3,repeat:Infinity}}
          style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.18em',textTransform:'uppercase'}}>Click anywhere to return</motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── GAME BOOT INTRO ─────────────────────────────────────
const BOOT=[
  {text:'MJP SYSTEMS  v9.8.0',               delay:200,  color:C.textMute},
  {text:'DISPLAY DRIVER ............... OK',  delay:650,  color:C.green},
  {text:'CLINICAL SYSTEMS ............. OK',  delay:1100, color:C.green},
  {text:'SYSTEM INTEGRATION ........... OK',  delay:1500, color:C.green},
  {text:'BACKEND ARCHITECTURE ... INITIALIZING', delay:1950, color:C.accent},
  {text:'BAYBAYIN CORE ................ ACTIVE', delay:2500, color:C.gold},
  {text:'IDENTITY VERIFIED ............ MJP',    delay:2900, color:C.white},
]
function Intro({onDone}){
  const [lines,setLines]=useState([]), [phase,setPhase]=useState('boot')
  useEffect(()=>{
    const ts=[]
    BOOT.forEach(l=>ts.push(setTimeout(()=>setLines(p=>[...p,l]),l.delay)))
    ts.push(setTimeout(()=>setPhase('name'),3400))
    ts.push(setTimeout(()=>onDone(),4900))
    return()=>ts.forEach(clearTimeout)
  },[onDone])
  return(
    <motion.div exit={{opacity:0,filter:'blur(8px)'}} transition={{duration:0.9}}
      style={{position:'fixed',inset:0,zIndex:1000,background:C.bgDeep,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
      <Scanlines opacity={0.055}/><Particles count={10} color={C.accent}/>
      <AnimatePresence mode="wait">
        {phase==='boot'&&(
          <motion.div key="boot" exit={{opacity:0,y:-10}} transition={{duration:0.35}}
            style={{position:'relative',zIndex:3,width:'clamp(280px,60vw,520px)',padding:'0 24px'}}>
            <div style={{fontFamily:F.mono,fontSize:'clamp(9px,1.3vw,11px)',color:C.textMute,letterSpacing:'0.14em',marginBottom:24}}>■ SYSTEM INITIALIZE</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {lines.map((l,i)=><motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{duration:0.25}} style={{fontFamily:F.mono,fontSize:'clamp(9px,1.3vw,11px)',color:l.color,letterSpacing:'0.1em'}}>{l.text}</motion.div>)}
              {lines.length<BOOT.length&&<motion.span animate={{opacity:[1,0]}} transition={{duration:0.6,repeat:Infinity}} style={{fontFamily:F.mono,fontSize:'clamp(9px,1.3vw,11px)',color:C.textMute}}>_</motion.span>}
            </div>
          </motion.div>
        )}
        {phase==='name'&&(
          <motion.div key="name" initial={{opacity:0,y:24,filter:'blur(14px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} transition={{duration:1.0,ease:[0.22,1,0.36,1]}}
            style={{position:'relative',zIndex:3,textAlign:'center',padding:'0 24px'}}>
            <div style={{fontFamily:F.display,fontSize:'clamp(80px,16vw,136px)',color:C.white,fontWeight:600,letterSpacing:'0.08em',lineHeight:1,marginBottom:18}}>MJP</div>
            <motion.div initial={{opacity:0}} animate={{opacity:0.72}} transition={{delay:0.5,duration:1.0}} style={{fontFamily:F.bay,fontSize:'clamp(13px,2.5vw,18px)',color:C.accent,letterSpacing:'0.14em',marginBottom:28}}>{BAYBAYIN}</motion.div>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7}} style={{fontFamily:F.mono,fontSize:'clamp(9px,1.4vw,11px)',color:C.textMute,letterSpacing:'0.22em',textTransform:'uppercase'}}>Engineer · Analyst · Builder</motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{position:'absolute',bottom:'clamp(20px,4vw,32px)',right:'clamp(20px,4vw,40px)',fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.1em'}}>v9.8.0</div>
    </motion.div>
  )
}

// ─── CINEMATIC FADE ──────────────────────────────────────
function Fade({onDone}){
  useEffect(()=>{const t=setTimeout(onDone,1400);return()=>clearTimeout(t)},[onDone])
  return <motion.div initial={{opacity:0}} animate={{opacity:[0,1,1,0]}} transition={{duration:1.4,times:[0,0.25,0.75,1]}} style={{position:'fixed',inset:0,zIndex:950,background:'#000',pointerEvents:'none'}}/>
}

// ─── TITLE SCREEN ────────────────────────────────────────
function TitleScreen({onEnter}){
  const [ready,setReady]=useState(false), [going,setGoing]=useState(false)
  useEffect(()=>{const t=setTimeout(()=>setReady(true),700);return()=>clearTimeout(t)},[])
  const go=useCallback(()=>{if(going)return;setGoing(true);setTimeout(onEnter,300)},[going,onEnter])
  useEffect(()=>{
    if(!ready)return
    const h=e=>{if(!['Tab','Shift','Control','Alt','Meta'].includes(e.key))go()}
    window.addEventListener('keydown',h,{once:true}); return()=>window.removeEventListener('keydown',h)
  },[ready,go])
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.7}} onClick={ready?go:undefined}
      style={{position:'fixed',inset:0,zIndex:900,background:C.bg,cursor:'none',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
      <LivingGrid/><Atmo v="home"/><Scanlines/><Particles count={24} color={C.accent}/>
      <div style={{position:'absolute',top:'clamp(28px,4vw,42px)',left:'clamp(20px,4vw,52px)',display:'flex',alignItems:'center',gap:10,zIndex:3}}>
        <div style={{width:4,height:4,background:C.accent,borderRadius:'50%'}}/><span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.16em'}}>MARKJP.DEV</span>
      </div>
      <div style={{textAlign:'center',position:'relative',zIndex:3,padding:'0 24px'}}>
        <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:1.1,delay:0.2,ease:[0.22,1,0.36,1]}}>
          <div style={{fontFamily:F.display,fontSize:'clamp(96px,20vw,210px)',color:C.white,fontWeight:600,letterSpacing:'0.1em',lineHeight:0.86,marginBottom:22}}>MJP</div>
          <motion.div initial={{opacity:0}} animate={{opacity:0.8}} transition={{delay:0.85,duration:1.1}} style={{fontFamily:F.bay,fontSize:'clamp(15px,3vw,24px)',color:C.accent,letterSpacing:'0.2em',marginBottom:50}}>{BAYBAYIN}</motion.div>
        </motion.div>
        <motion.div initial={{scaleY:0}} animate={{scaleY:1}} transition={{delay:0.75,duration:1.0}} style={{width:1,height:'clamp(32px,5vw,52px)',background:`linear-gradient(to bottom,${C.accent}99,transparent)`,margin:'0 auto 38px'}}/>
        {ready&&<motion.div initial={{opacity:0}} animate={{opacity:[0,0.55,0.55,0.12,0.55]}} transition={{duration:3.2,repeat:Infinity}} style={{fontFamily:F.mono,fontSize:'clamp(9px,1.6vw,11px)',color:C.textMute,letterSpacing:'0.26em',textTransform:'uppercase'}}>Press any key to continue</motion.div>}
      </div>
      <div style={{position:'absolute',bottom:'clamp(20px,4vw,32px)',left:0,right:0,padding:'0 clamp(20px,4vw,52px)',display:'flex',justifyContent:'space-between',zIndex:3}}>
        <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.1em'}}>Quezon City, PH</span>
        <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.1em'}}>© {new Date().getFullYear()} MJP</span>
      </div>
    </motion.div>
  )
}

// ─── TOP BAR ─────────────────────────────────────────────
function TopBar({section,onNav,onLogoTap}){
  const mob=useIsMobile(), [menu,setMenu]=useState(false)
  return(
    <motion.div initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.4}}
      style={{position:'fixed',top:0,left:0,right:0,zIndex:200,height:56,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 clamp(16px,5vw,64px)',background:'rgba(13,14,20,0.96)',backdropFilter:'blur(28px)',borderBottom:`1px solid ${C.line}`}}>
      <button onClick={()=>{onNav('home');setMenu(false);if(onLogoTap)onLogoTap()}} aria-label="Home"
        style={{background:'none',border:'none',cursor:'none',display:'flex',alignItems:'center',gap:10,padding:0}}>
        <div style={{width:28,height:28,border:`1px solid ${C.accent}44`,display:'flex',alignItems:'center',justifyContent:'center',transition:'border-color 0.2s'}} onMouseOver={e=>e.currentTarget.style.borderColor=C.accent+'99'} onMouseOut={e=>e.currentTarget.style.borderColor=C.accent+'44'}>
          <span style={{fontFamily:F.display,fontSize:13,color:C.accent,fontWeight:600}}>MJP</span>
        </div>
        {!mob&&<span style={{fontFamily:F.mono,fontSize:11,color:C.textMute,letterSpacing:'0.08em'}}>markjp.dev</span>}
      </button>
      {mob?(
        <>
          <button onClick={()=>setMenu(o=>!o)} style={{background:'none',border:`1px solid ${C.line}`,cursor:'pointer',padding:'6px 14px',fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.08em',textTransform:'uppercase'}}>{menu?'Close':'Menu'}</button>
          <AnimatePresence>
            {menu&&<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} style={{position:'absolute',top:56,left:0,right:0,background:'rgba(13,14,20,0.98)',borderBottom:`1px solid ${C.line}`,zIndex:300}}>
              {SECTIONS.map(s=><button key={s} onClick={()=>{onNav(s);setMenu(false)}} style={{width:'100%',background:section===s?C.accentDim:'none',border:'none',borderBottom:`1px solid ${C.line}`,cursor:'pointer',padding:'16px clamp(16px,5vw,64px)',textAlign:'left',fontFamily:F.mono,fontSize:12,color:section===s?C.accent:C.textDim,letterSpacing:'0.08em',textTransform:'uppercase'}}>{s}</button>)}
              <a href="/resume.pdf" download style={{display:'block',padding:'16px clamp(16px,5vw,64px)',fontFamily:F.mono,fontSize:12,color:C.accent,textDecoration:'none',letterSpacing:'0.08em'}}>↓ Resume</a>
            </motion.div>}
          </AnimatePresence>
        </>
      ):(
        <div style={{display:'flex',gap:2,alignItems:'center'}}>
          {SECTIONS.map(s=>{const a=section===s; return(
            <button key={s} onClick={()=>onNav(s)} style={{background:a?C.accentDim:'none',border:'none',cursor:'none',fontFamily:F.mono,fontSize:11,color:a?C.accent:C.textMute,letterSpacing:'0.08em',textTransform:'uppercase',padding:'6px 14px',transition:'color 0.2s'}} onMouseOver={e=>{if(!a)e.currentTarget.style.color=C.textDim}} onMouseOut={e=>{if(!a)e.currentTarget.style.color=C.textMute}}>{s}</button>
          )})}
          <div style={{width:1,height:14,background:C.line,margin:'0 6px'}}/>
          <a href="/resume.pdf" download style={{fontFamily:F.mono,fontSize:11,color:C.textMute,letterSpacing:'0.08em',textDecoration:'none',padding:'6px 12px',border:`1px solid ${C.line}`,transition:'all 0.2s',cursor:'none'}} onMouseOver={e=>{e.currentTarget.style.color=C.text;e.currentTarget.style.borderColor=C.lineHover}} onMouseOut={e=>{e.currentTarget.style.color=C.textMute;e.currentTarget.style.borderColor=C.line}}>↓ CV</a>
          <div style={{width:1,height:14,background:C.line,margin:'0 6px'}}/>
          <a href="mailto:mark@markjp.dev" style={{fontFamily:F.mono,fontSize:11,color:C.accent,letterSpacing:'0.08em',textDecoration:'none',padding:'6px 14px',border:`1px solid ${C.accent}33`,transition:'background 0.2s',cursor:'none'}} onMouseOver={e=>e.currentTarget.style.background=C.accentDim} onMouseOut={e=>e.currentTarget.style.background='transparent'}>hire</a>
        </div>
      )}
    </motion.div>
  )
}

// ─── BOTTOM NAV ──────────────────────────────────────────
function BottomNav({section,onNav}){
  const i=SECTIONS.indexOf(section), p=i>0?SECTIONS[i-1]:null, n=i<3?SECTIONS[i+1]:null
  return(
    <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.3}} style={{position:'fixed',bottom:0,left:0,right:0,zIndex:150,height:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 clamp(16px,5vw,64px)',background:'rgba(13,14,20,0.96)',backdropFilter:'blur(28px)',borderTop:`1px solid ${C.line}`}}>
      <button onClick={()=>p&&onNav(p)} style={{background:'none',border:'none',cursor:p?'none':'default',display:'flex',alignItems:'center',gap:8,opacity:p?1:0.16,padding:0,transition:'opacity 0.2s'}} onMouseOver={e=>{if(p)e.currentTarget.style.opacity='0.55'}} onMouseOut={e=>{if(p)e.currentTarget.style.opacity='1'}}>
        <span style={{color:C.accent,fontSize:14}}>←</span><span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.1em',textTransform:'uppercase'}}>{p||''}</span>
      </button>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        {SECTIONS.map(s=><button key={s} onClick={()=>onNav(s)} style={{width:s===section?24:5,height:4,background:s===section?C.accent:C.line,border:'none',cursor:'none',transition:'all 0.3s',padding:0,borderRadius:2}}/>)}
      </div>
      <button onClick={()=>n&&onNav(n)} style={{background:'none',border:'none',cursor:n?'none':'default',display:'flex',alignItems:'center',gap:8,opacity:n?1:0.16,padding:0,transition:'opacity 0.2s'}} onMouseOver={e=>{if(n)e.currentTarget.style.opacity='0.55'}} onMouseOut={e=>{if(n)e.currentTarget.style.opacity='1'}}>
        <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.1em',textTransform:'uppercase'}}>{n||''}</span><span style={{color:C.accent,fontSize:14}}>→</span>
      </button>
    </motion.div>
  )
}

// ─── HOME SCREEN — true hierarchy ────────────────────────
function HomeScreen({onNav}){
  const mob=useIsMobile()
  const roles=['Business Analyst','Application Support Engineer','Clinical Systems Specialist','Backend Engineer']
  const [ri,setRi]=useState(0)
  useEffect(()=>{const t=setInterval(()=>setRi(i=>(i+1)%4),3400);return()=>clearInterval(t)},[])
  const NAV=[
    {id:'about',    label:'About',    sub:'Background & Story', h:'clamp(80px,12vw,100px)', fs:'clamp(22px,3vw,32px)',   accent:C.accent },
    {id:'projects', label:'Projects', sub:'Work & Builds',      h:'clamp(72px,11vw,90px)',  fs:'clamp(20px,2.8vw,29px)', accent:C.green  },
    {id:'skills',   label:'Skills',   sub:'Stack & Expertise',  h:'clamp(64px,10vw,80px)',  fs:'clamp(18px,2.5vw,26px)', accent:'#6BBFEF'},
    {id:'contact',  label:'Contact',  sub:'Get in Touch',       h:'clamp(56px,9vw,70px)',   fs:'clamp(16px,2.2vw,22px)', accent:C.gold   },
  ]
  return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.5}}
      style={{position:'fixed',inset:0,background:C.bg,display:'flex',flexDirection:mob?'column':'row',overflowY:mob?'auto':'hidden'}}>
      <LivingGrid/><Atmo v="home"/><Scanlines/>
      {/* LEFT */}
      <div style={{width:mob?'100%':'clamp(300px,46%,580px)',display:'flex',flexDirection:'column',justifyContent:mob?'flex-start':'center',padding:mob?'clamp(80px,12vw,100px) clamp(20px,6vw,48px) 36px':'80px clamp(28px,5vw,64px)',position:'relative',zIndex:2,borderRight:mob?'none':`1px solid ${C.line}`,borderBottom:mob?`1px solid ${C.line}`:'none',overflow:'hidden'}}>
        <div aria-hidden style={{position:'absolute',bottom:'-8%',left:'-3%',fontFamily:F.bay,fontSize:'clamp(96px,17vw,190px)',color:'rgba(91,141,239,0.038)',letterSpacing:'0.1em',lineHeight:1.2,pointerEvents:'none',userSelect:'none',whiteSpace:'nowrap',zIndex:0}}>{BAYBAYIN}</div>
        <Particles count={8} color={C.accent}/>
        <div style={{position:'relative',zIndex:1}}>
          <motion.div initial={{opacity:0,x:-14}} animate={{opacity:1,x:0}} transition={{delay:0.2}} style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(74,202,139,0.07)',border:'1px solid rgba(74,202,139,0.24)',padding:'7px 14px',marginBottom:44}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:C.green,animation:'pulse 2.5s infinite'}}/><span style={{fontFamily:F.mono,fontSize:'clamp(9px,1.5vw,10px)',color:C.green,letterSpacing:'0.14em',textTransform:'uppercase'}}>Available · Open to Work</span>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.3,duration:0.9,ease:[0.22,1,0.36,1]}} style={{fontFamily:F.display,fontSize:'clamp(60px,9vw,108px)',color:C.white,fontWeight:600,lineHeight:0.9,letterSpacing:'0.06em',margin:'0 0 14px'}}>MJP</motion.h1>
          <motion.div initial={{opacity:0}} animate={{opacity:0.72}} transition={{delay:0.55,duration:0.9}} style={{fontFamily:F.bay,fontSize:'clamp(12px,2vw,15px)',color:C.accent,letterSpacing:'0.14em',marginBottom:28}}>{BAYBAYIN}</motion.div>
          <div style={{height:22,overflow:'hidden',marginBottom:24}}>
            <AnimatePresence mode="wait">
              <motion.div key={ri} initial={{y:12,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-12,opacity:0}} transition={{duration:0.26}} style={{fontFamily:F.mono,fontSize:'clamp(10px,1.4vw,11px)',color:C.accent,letterSpacing:'0.08em'}}>{roles[ri]}</motion.div>
            </AnimatePresence>
          </div>
          <motion.div initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:0.5,duration:0.7,transformOrigin:'left'}} style={{width:32,height:1,background:C.accent,marginBottom:28}}/>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.64}} style={{fontFamily:F.body,fontSize:'clamp(13px,1.4vw,15px)',color:C.textDim,lineHeight:1.88,marginBottom:40,maxWidth:400,fontWeight:300}}>
            {YEARS}+ years keeping critical systems running across regulated industries. Now building them — and moving toward the intersection of{' '}<span style={{color:C.text,fontWeight:400}}>systems engineering and interactive craft.</span>
          </motion.p>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.78}} style={{display:'flex',gap:'clamp(16px,3.5vw,28px)',flexWrap:'wrap'}}>
            {[{l:'GitHub',h:'https://github.com/markjpdev'},{l:'LinkedIn',h:'https://linkedin.com/in/jaysonpunsalan'},{l:'Email',h:'mailto:mark@markjp.dev'}].map(s=>(
              <a key={s.l} href={s.h} target={s.h.startsWith('mailto')?undefined:'_blank'} rel="noreferrer" style={{fontFamily:F.body,fontSize:'clamp(12px,1.5vw,14px)',fontWeight:400,color:C.textDim,textDecoration:'none',borderBottom:`1px solid ${C.line}`,paddingBottom:3,transition:'all 0.2s',cursor:'none'}} onMouseOver={e=>{e.currentTarget.style.color=C.accent;e.currentTarget.style.borderColor=C.accent+'50'}} onMouseOut={e=>{e.currentTarget.style.color=C.textDim;e.currentTarget.style.borderColor=C.line}}>{s.l}</a>
            ))}
          </motion.div>
        </div>
      </div>
      {/* RIGHT — hierarchy */}
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:mob?'clamp(24px,5vw,36px) clamp(20px,6vw,48px) clamp(52px,10vw,72px)':'80px clamp(28px,5vw,64px)',position:'relative',zIndex:2}}>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}} style={{marginBottom:24}}>
          <span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.2em',textTransform:'uppercase'}}>Navigate</span>
        </motion.div>
        <div style={{display:'flex',flexDirection:'column',gap:3}}>
          {NAV.map((item,i)=>(
            <motion.button key={item.id} initial={{opacity:0,x:28}} animate={{opacity:1,x:0}} transition={{delay:0.33+i*0.09,duration:0.55,ease:[0.22,1,0.36,1]}} onClick={()=>onNav(item.id)}
              style={{background:'transparent',border:`1px solid ${C.line}`,cursor:'none',textAlign:'left',padding:`0 clamp(16px,3vw,28px)`,display:'flex',alignItems:'center',justifyContent:'space-between',transition:'all 0.22s',height:item.h}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=item.accent+'55';e.currentTarget.style.background=item.accent+'07'}}
              onMouseOut={e=>{e.currentTarget.style.borderColor=C.line;e.currentTarget.style.background='transparent'}}>
              <div>
                <div style={{fontFamily:F.display,fontSize:item.fs,color:C.white,fontWeight:600,lineHeight:1,marginBottom:4}}>{item.label}</div>
                <div style={{fontFamily:F.mono,fontSize:'clamp(9px,1.1vw,10px)',color:C.textMute,letterSpacing:'0.08em'}}>{item.sub}</div>
              </div>
              <span style={{color:item.accent,fontSize:15,opacity:0.5}}>→</span>
            </motion.button>
          ))}
        </div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.92}} style={{marginTop:24,display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:14,height:1,background:C.line}}/><span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.1em'}}>Quezon City, PH · UTC+8</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── SHELL ───────────────────────────────────────────────
const ENT={about:{initial:{opacity:0,x:-30},animate:{opacity:1,x:0}},skills:{initial:{opacity:0,y:-22},animate:{opacity:1,y:0}},projects:{initial:{opacity:0,scale:.983},animate:{opacity:1,scale:1}},contact:{initial:{opacity:0,y:30},animate:{opacity:1,y:0}}}
function Shell({children,title,num,sid}){
  const e=ENT[sid]||ENT.about
  return(
    <motion.div initial={e.initial} animate={e.animate} exit={{opacity:0}} transition={{duration:0.44,ease:[0.22,1,0.36,1]}} style={{position:'fixed',inset:0,background:C.bg,overflowY:'auto',paddingTop:56,paddingBottom:50}}>
      <Atmo v={sid}/>
      <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}><Ghost num={num}/></div>
      <div style={{position:'relative',zIndex:1,padding:'clamp(32px,5vw,56px) clamp(20px,6vw,80px) clamp(40px,6vw,56px)',maxWidth:1100,margin:'0 auto'}}>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}} style={{display:'flex',alignItems:'center',gap:14,marginBottom:52}}>
          <span style={{fontFamily:F.display,fontSize:13,color:C.textMute}}>{num}</span>
          <div style={{width:1,height:14,background:C.line}}/>
          <span style={{fontFamily:F.mono,fontSize:11,color:C.accent,letterSpacing:'0.18em',textTransform:'uppercase'}}>{title}</span>
          <div style={{width:36,height:1,background:C.line}}/>
          <span style={{fontFamily:F.bay,fontSize:11,color:C.accent,opacity:0.28}}>{BAYBAYIN.split(' ')[0]}</span>
        </motion.div>
        {children}
      </div>
    </motion.div>
  )
}

// ─── ABOUT — Character Reveal ────────────────────────────
const CHAPTERS=[
  {label:'Chapter III',period:'2023 — Present',role:'Business Analyst & Application Support Engineer',company:'RxPx Health',color:C.accent},
  {label:'Chapter II', period:'2020 — 2023',   role:'Clinical Systems Support Specialist',           company:'Thermo Fisher Scientific (PPD)',color:'#6BBFEF'},
  {label:'Chapter I',  period:'2019',           role:'B.S. Information Technology',                  company:'Best Thesis Finalist — IoT Flood Monitoring',color:C.green},
]
function AboutPage(){
  const mob=useIsMobile()
  return(
    <Shell title="About" num="01" sid="about">
      <div style={{paddingBottom:40}}>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.16,duration:0.8,ease:[0.22,1,0.36,1]}} style={{marginBottom:56}}>
          <h2 style={{fontFamily:F.display,fontSize:'clamp(32px,5.5vw,68px)',color:C.white,fontWeight:600,lineHeight:1.06,letterSpacing:'0.01em',maxWidth:860,marginBottom:20}}>
            I've spent a decade inside systems most engineers never touch.{' '}<span style={{color:C.accent}}>Now I'm building them.</span>
          </h2>
          <div style={{width:'clamp(40px,6vw,60px)',height:1,background:C.line}}/>
        </motion.div>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'minmax(0,1.2fr) minmax(0,0.8fr)',gap:'clamp(28px,5vw,72px)'}}>
          <div>
            {['Clinical trial platforms. Enterprise integrations. Federated authentication across GxP-regulated environments. Most engineers read about these systems. I kept them running — under SLA pressure, across timezones, with no margin for error.','The move to backend engineering is not a pivot. It is the natural next step of someone who has always needed to understand the whole system — not just their part of it.'].map((t,i)=>(
              <motion.p key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.24+i*0.1}} style={{fontFamily:F.body,fontSize:'clamp(14px,1.5vw,15px)',color:C.textDim,lineHeight:1.9,marginBottom:18,fontWeight:300}}>{t}</motion.p>
            ))}
            <motion.div initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:0.42}} style={{borderLeft:`2px solid ${C.gold}`,paddingLeft:20,marginTop:32,marginBottom:24}}>
              <div style={{fontFamily:F.mono,fontSize:9,color:C.gold,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:10}}>Craft Philosophy</div>
              <p style={{fontFamily:F.body,fontSize:'clamp(13px,1.5vw,14px)',color:C.textDim,lineHeight:1.88,fontWeight:300,maxWidth:480}}>The best systems are invisible. The user feels the care without being able to name it. This applies equally to a clinical data pipeline and a battle system in a JRPG — the craft behind the surface is what creates trust. That principle is why I do this work.</p>
            </motion.div>
            <motion.div initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:0.52}} style={{borderLeft:`2px solid ${C.accent}`,paddingLeft:20,marginBottom:40}}>
              <div style={{fontFamily:F.mono,fontSize:9,color:C.accent,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:10}}>Why Square Enix</div>
              <p style={{fontFamily:F.body,fontSize:'clamp(13px,1.5vw,14px)',color:C.textDim,lineHeight:1.88,fontWeight:300,maxWidth:480}}>[Placeholder — one specific sentence: what a particular Final Fantasy or Octopath system showed you about your own work that you could not have seen any other way. Make it true. Make it specific. This is the most important sentence on the site.]</p>
            </motion.div>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}} style={{borderTop:`1px solid ${C.line}`,paddingTop:32}}>
              <div style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:28}}>Story So Far</div>
              {CHAPTERS.map((ch,i)=>(
                <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.65+i*0.08}} style={{display:'flex',gap:'clamp(14px,2vw,24px)',alignItems:'flex-start',padding:'clamp(14px,2vw,20px) 0',borderBottom:`1px solid ${C.line}`}}>
                  <div style={{flexShrink:0,paddingTop:3}}>
                    <div style={{fontFamily:F.mono,fontSize:9,color:ch.color,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:4}}>{ch.label}</div>
                    <div style={{width:2,height:24,background:ch.color}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:F.display,fontSize:'clamp(15px,1.8vw,20px)',color:C.text,fontWeight:600,lineHeight:1.2,marginBottom:4}}>{ch.role}</div>
                    <div style={{fontFamily:F.mono,fontSize:'clamp(9px,1.2vw,10px)',color:ch.color,letterSpacing:'0.08em',marginBottom:2}}>{ch.company}</div>
                    <div style={{fontFamily:F.mono,fontSize:'clamp(9px,1.2vw,10px)',color:C.textMute,letterSpacing:'0.06em'}}>{ch.period}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:3}}>
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.24}} style={{background:C.bgCard,border:`1px solid ${C.line}`,padding:'clamp(22px,3vw,32px)'}}>
              <div style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:22}}>Currently</div>
              <div style={{display:'flex',flexDirection:'column',gap:16}}>
                {[{label:'Building',value:'Clinical REST API — FastAPI · Docker · PostgreSQL',color:C.green},{label:'Learning',value:'Go · Kubernetes · System Design at scale',color:C.accent},{label:'Exploring',value:'Game systems architecture · Narrative UX · Shaders',color:C.gold},{label:'Playing',value:'[Placeholder — current Square Enix title]',color:C.textMute}].map(row=>(
                  <div key={row.label} style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                    <div style={{width:2,height:'clamp(14px,2vw,16px)',background:row.color,flexShrink:0,marginTop:3}}/>
                    <div>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.textMute,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:3}}>{row.label}</div>
                      <div style={{fontFamily:F.body,fontSize:'clamp(12px,1.4vw,13px)',color:row.label==='Playing'?C.textMute:C.textDim,fontWeight:300,lineHeight:1.5}}>{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.36}} style={{background:C.bgCard,border:`1px solid ${C.gold}22`,padding:'clamp(18px,2.5vw,26px)'}}>
              <div style={{fontFamily:F.mono,fontSize:10,color:C.gold,letterSpacing:'0.18em',textTransform:'uppercase',marginBottom:18}}>Drawn To</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {['Final Fantasy series','Octopath Traveler','HD-2D aesthetic','ATB & turn systems','Narrative systems','Baybayin & Filipino heritage','World-building','Interactive craft'].map(tag=>(
                  <span key={tag} style={{fontFamily:F.mono,fontSize:'clamp(8px,1.1vw,9px)',color:C.textMute,border:`1px solid ${C.line}`,padding:'4px 10px',letterSpacing:'0.06em'}}>{tag}</span>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.46}}>
              <a href="/resume.pdf" download style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:C.bgCard,border:`1px solid ${C.line}`,padding:'clamp(14px,2vw,20px) clamp(16px,2.5vw,24px)',textDecoration:'none',transition:'all 0.2s',cursor:'none'}} onMouseOver={e=>{e.currentTarget.style.borderColor=C.accent+'44';e.currentTarget.style.background=C.bgHover}} onMouseOut={e=>{e.currentTarget.style.borderColor=C.line;e.currentTarget.style.background=C.bgCard}}>
                <div><div style={{fontFamily:F.body,fontSize:13,color:C.text,fontWeight:500,marginBottom:3}}>Download CV</div><div style={{fontFamily:F.mono,fontSize:9,color:C.textMute,letterSpacing:'0.08em'}}>PDF · Updated 2025</div></div>
                <span style={{color:C.accent,fontSize:18}}>↓</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </Shell>
  )
}

// ─── SKILLS — Mastery Map ────────────────────────────────
const FOUNDATION=[
  {domain:'Clinical SaaS Operations', tools:'Veeva Vault · Medidata Rave · Chameleon IRT',  yrs:4},
  {domain:'System Integration',       tools:'REST APIs · SOAP · SFTP · Webhooks · OAuth2',  yrs:6},
  {domain:'Identity & Access',        tools:'SSO · SAML · Federated Auth · Role Management',yrs:5},
  {domain:'Data & Compliance',        tools:'SQL · PostgreSQL · GxP · Audit Trails · UAT',  yrs:7},
  {domain:'Project & Process',        tools:'Jira · Confluence · ServiceNow · Git',          yrs:8},
]
const ACTIVE_STACK=['Python','FastAPI','Docker','Linux / CLI','Next.js','PostgreSQL']
const DIRECTION_STACK=['Go','Kubernetes','Game Systems','Unity','Shader Fundamentals','Narrative UX']
function SkillsPage(){
  const mob=useIsMobile(), maxYrs=Math.max(...FOUNDATION.map(f=>f.yrs))
  return(
    <Shell title="Skills" num="02" sid="skills">
      <div style={{paddingBottom:40}}>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:'clamp(24px,4vw,64px)'}}>
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.18}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:28}}><div style={{width:2,height:14,background:C.accent}}/><span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.2em',textTransform:'uppercase'}}>Foundation — What I Know Deeply</span></div>
            {FOUNDATION.map((item,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.22+i*0.08}} style={{padding:'clamp(14px,2vw,18px) 0',borderBottom:`1px solid ${C.line}`}}>
                <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:6}}>
                  <div style={{fontFamily:F.display,fontSize:'clamp(16px,2vw,21px)',color:C.text,fontWeight:600,lineHeight:1}}>{item.domain}</div>
                  <div style={{fontFamily:F.mono,fontSize:9,color:C.textMute,letterSpacing:'0.08em',flexShrink:0,marginLeft:10}}>{item.yrs}y</div>
                </div>
                <div style={{height:2,background:C.line,marginBottom:7,overflow:'hidden'}}>
                  <motion.div initial={{width:0}} animate={{width:`${(item.yrs/maxYrs)*100}%`}} transition={{delay:0.5+i*0.08,duration:0.8,ease:[0.22,1,0.36,1]}} style={{height:'100%',background:C.accent,opacity:0.6}}/>
                </div>
                <div style={{fontFamily:F.mono,fontSize:'clamp(9px,1.2vw,10px)',color:C.textMute,letterSpacing:'0.06em',lineHeight:1.7}}>{item.tools}</div>
              </motion.div>
            ))}
          </motion.div>
          <div style={{display:'flex',flexDirection:'column',gap:3}}>
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.26}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}><div style={{width:2,height:12,background:C.green}}/><span style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.2em',textTransform:'uppercase'}}>Active Stack</span></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,marginBottom:3}}>
                {ACTIVE_STACK.map((tech,i)=>(
                  <motion.div key={tech} initial={{opacity:0,scale:0.94}} animate={{opacity:1,scale:1}} transition={{delay:0.3+i*0.05}} style={{background:C.bgCard,border:`1px solid ${C.green}33`,padding:'clamp(12px,1.8vw,16px)',transition:'all 0.2s',position:'relative'}} onMouseOver={e=>{e.currentTarget.style.borderColor=C.green+'66';e.currentTarget.style.background=C.bgHover}} onMouseOut={e=>{e.currentTarget.style.borderColor=C.green+'33';e.currentTarget.style.background=C.bgCard}}>
                    <div style={{position:'absolute',top:8,right:8,width:4,height:4,borderRadius:'50%',background:C.green,opacity:0.7}}/>
                    <div style={{fontFamily:F.mono,fontSize:'clamp(11px,1.4vw,12px)',color:C.text,fontWeight:400}}>{tech}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.55}} style={{background:C.bgCard,border:`1px solid ${C.gold}33`,padding:'clamp(16px,2.2vw,22px)'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}><div style={{width:2,height:12,background:C.gold}}/><span style={{fontFamily:F.mono,fontSize:9,color:C.gold,letterSpacing:'0.18em',textTransform:'uppercase'}}>The Direction — Game & Interactive</span></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,marginBottom:18}}>
                {DIRECTION_STACK.map(tech=>(
                  <div key={tech} style={{padding:'clamp(10px,1.5vw,13px)',border:`1px dashed ${C.gold}33`,opacity:0.6,position:'relative'}}>
                    <div style={{position:'absolute',top:7,right:8,fontFamily:F.mono,fontSize:8,color:C.gold,opacity:0.5}}>◈</div>
                    <div style={{fontFamily:F.mono,fontSize:'clamp(10px,1.3vw,11px)',color:C.textDim}}>{tech}</div>
                  </div>
                ))}
              </div>
              <p style={{fontFamily:F.body,fontSize:12,color:C.textMute,lineHeight:1.8,fontWeight:300,paddingLeft:12,borderLeft:`1px solid ${C.gold}33`}}>[Placeholder — one sentence bridging clinical systems discipline to game systems thinking. The sentence that makes a Square Enix engineer nod.]</p>
            </motion.div>
          </div>
        </div>
      </div>
    </Shell>
  )
}

// ─── PROJECTS — Studio Archive ───────────────────────────
const CASE_FILES=[
  {num:'02',title:'markjp.dev',status:'Live',statusColor:C.accent,barStyle:'solid',summary:'Designed and built from scratch across nine iterations. Cinematic entry sequence, Baybayin identity mark, full-screen section architecture. The site you are reading is the proof.',tags:['Next.js','Framer Motion','Netlify'],link:'https://markjp.dev',atmo:`radial-gradient(ellipse 50% 40% at 100% 50%,rgba(91,141,239,0.06) 0%,transparent 60%)`},
  {num:'03',title:'Clinical REST API',status:'In Progress',statusColor:'#6BBFEF',barStyle:'pulse',summary:'Healthcare integrations built by engineers who have never touched the data. I have. This API reflects how clinical data actually flows — realistic models, OpenAPI documentation, containerized deployment.',tags:['Python','FastAPI','PostgreSQL','Docker'],note:'GitHub and live demo on deploy.',atmo:`radial-gradient(ellipse 50% 50% at 0% 50%,rgba(107,191,239,0.05) 0%,transparent 60%)`},
  {num:'04',title:'Game Systems Experiment',status:'Planned',statusColor:C.gold,barStyle:'dashed',summary:'[Placeholder] — An interactive experience applying backend systems thinking to game mechanics. Architecture in design. Scheduled alongside game stack development.',tags:['Placeholder','Game Dev','Interactive Systems'],placeholder:true,atmo:`radial-gradient(ellipse 50% 50% at 50% 0%,rgba(196,164,74,0.05) 0%,transparent 60%)`},
  {num:'05',title:'Next Project',status:'Unknown',statusColor:C.textMute,barStyle:'ghost',summary:'Something worth building. Details when it is ready.',tags:[],ghost:true,atmo:'none'},
]
function ProjectsPage(){
  const [open,setOpen]=useState(null)
  return(
    <Shell title="Projects" num="03" sid="projects">
      <div style={{paddingBottom:40}}>
        {/* HERO */}
        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.18}} style={{background:C.bgCard,border:`1px solid ${C.green}44`,padding:'clamp(28px,5vw,52px)',marginBottom:3,position:'relative',overflow:'hidden'}}>
          <div aria-hidden style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 70% 70% at 100% 50%,${C.green}07 0%,transparent 65%),radial-gradient(ellipse 40% 40% at 0% 0%,rgba(91,141,239,0.04) 0%,transparent 55%)`,pointerEvents:'none'}}/>
          <div style={{position:'absolute',top:'clamp(16px,3vw,24px)',right:'clamp(16px,3vw,24px)',fontFamily:F.mono,fontSize:10,color:C.green,border:`1px solid ${C.green}55`,padding:'5px 14px',letterSpacing:'0.14em',textTransform:'uppercase',zIndex:2}}>✓ SHIPPED</div>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{fontFamily:F.mono,fontSize:10,color:C.green,letterSpacing:'0.16em',textTransform:'uppercase',marginBottom:12}}>Featured · 01</div>
            <h3 style={{fontFamily:F.display,fontSize:'clamp(24px,4vw,48px)',color:C.white,fontWeight:600,margin:'0 0 20px',lineHeight:1.08,maxWidth:600}}>IoT Flood Monitoring System</h3>
            <p style={{fontFamily:F.body,fontSize:'clamp(13px,1.5vw,15px)',color:C.textDim,lineHeight:1.88,marginBottom:24,maxWidth:580,fontWeight:300}}>Flood-prone communities lack affordable real-time monitoring. Built a complete IoT sensor network from scratch — data ingestion pipeline, threshold-based alerting, live dashboard — designed to run on minimal infrastructure. Enterprise-grade monitoring principles applied at community scale.</p>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
              <div style={{display:'flex',gap:'clamp(5px,1vw,8px)',flexWrap:'wrap'}}>
                {['IoT','Embedded Systems','Real-time Sensors','Alert Pipeline','Dashboard'].map(t=><span key={t} style={{fontFamily:F.mono,fontSize:10,color:C.textMute,border:`1px solid ${C.line}`,padding:'4px 10px',letterSpacing:'0.06em'}}>{t}</span>)}
              </div>
              <span style={{fontFamily:F.mono,fontSize:10,color:C.green,letterSpacing:'0.1em'}}>Best Thesis Finalist</span>
            </div>
          </div>
        </motion.div>
        {/* CASE FILES */}
        {CASE_FILES.map((p,i)=>(
          <motion.div key={p.num} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.26+i*0.09}} style={{marginBottom:3}}>
            <div onClick={()=>!p.ghost&&setOpen(open===i?null:i)} style={{background:open===i?C.bgCard:'transparent',border:`1px solid ${open===i?p.statusColor+'33':p.placeholder?p.statusColor+'18':C.line}`,padding:'clamp(16px,2.5vw,26px)',cursor:p.ghost?'default':'none',transition:'all 0.22s',opacity:p.ghost?0.38:1,position:'relative',overflow:'hidden'}} onMouseOver={e=>{if(!p.ghost&&open!==i)e.currentTarget.style.borderColor=p.statusColor+'33'}} onMouseOut={e=>{if(!p.ghost&&open!==i)e.currentTarget.style.borderColor=p.placeholder?p.statusColor+'18':C.line}}>
              {open===i&&p.atmo!=='none'&&<div aria-hidden style={{position:'absolute',inset:0,background:p.atmo,pointerEvents:'none',zIndex:0}}/>}
              <div style={{position:'relative',zIndex:1,display:'flex',gap:'clamp(10px,2vw,20px)',alignItems:'flex-start',flexWrap:'wrap'}}>
                <div style={{flexShrink:0,paddingTop:4,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                  <span style={{fontFamily:F.mono,fontSize:9,color:C.textMute}}>{p.num}</span>
                  <div style={{width:2,height:p.barStyle==='ghost'?16:24,background:p.barStyle==='ghost'?C.textMute:p.statusColor,opacity:p.barStyle==='ghost'?0.3:1,animation:p.barStyle==='pulse'?'statusPulse 2s infinite':undefined}}/>
                </div>
                <div style={{flex:1,minWidth:120}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',marginBottom:(open===i||p.ghost)?14:0}}>
                    <h3 style={{fontFamily:F.display,fontSize:'clamp(17px,2.2vw,24px)',color:p.ghost?C.textMute:C.white,fontWeight:600,margin:0,flex:1}}>{p.title}</h3>
                    <span style={{fontFamily:F.mono,fontSize:10,color:p.statusColor,border:`1px solid ${p.statusColor}44`,padding:'3px 10px',letterSpacing:'0.08em',flexShrink:0}}>{p.status}</span>
                    {!p.ghost&&<span style={{color:C.textMute,fontSize:13,transform:open===i?'rotate(90deg)':'none',transition:'transform 0.2s',flexShrink:0}}>→</span>}
                  </div>
                  {p.ghost&&<p style={{fontFamily:F.body,fontSize:13,color:C.textMute,fontWeight:300,margin:0}}>{p.summary}</p>}
                  <AnimatePresence>
                    {open===i&&!p.ghost&&(
                      <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{overflow:'hidden'}}>
                        {p.placeholder&&<div style={{fontFamily:F.mono,fontSize:9,color:p.statusColor,letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:10}}>Placeholder — in planning</div>}
                        <p style={{fontFamily:F.body,fontSize:'clamp(13px,1.4vw,14px)',color:C.textDim,lineHeight:1.82,marginBottom:14,fontWeight:300,maxWidth:540}}>{p.summary}</p>
                        {p.note&&<p style={{fontFamily:F.mono,fontSize:11,color:C.textMute,marginBottom:12}}>{p.note}</p>}
                        {p.tags.length>0&&<div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:p.link?12:0}}>{p.tags.map(t=><span key={t} style={{fontFamily:F.mono,fontSize:10,color:C.textMute,border:`1px solid ${C.line}`,padding:'4px 10px',letterSpacing:'0.06em'}}>{t}</span>)}</div>}
                        {p.link&&<a href={p.link} target="_blank" rel="noreferrer" style={{fontFamily:F.mono,fontSize:11,color:C.accent,textDecoration:'none',cursor:'none'}}>↗ {p.link.replace('https://','')}</a>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Shell>
  )
}

// ─── CONTACT — Transmission ──────────────────────────────
function ContactPage(){
  const mob=useIsMobile(), [form,setForm]=useState({name:'',email:'',message:''}), [sent,setSent]=useState(false)
  const sub=e=>{ e.preventDefault(); window.open(`mailto:mark@markjp.dev?subject=${encodeURIComponent(`Message from ${form.name}`)}&body=${encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`); setSent(true) }
  const inp={width:'100%',background:C.bgCard,border:`1px solid ${C.line}`,padding:'clamp(10px,1.5vw,13px) clamp(12px,2vw,16px)',fontFamily:F.body,fontSize:'clamp(13px,1.5vw,14px)',color:C.text,outline:'none',transition:'border-color 0.2s',fontWeight:300}
  const lbl={fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.16em',textTransform:'uppercase',display:'block',marginBottom:8}
  return(
    <Shell title="Contact" num="04" sid="contact">
      <div style={{paddingBottom:40}}>
        <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.18,duration:0.8,ease:[0.22,1,0.36,1]}} style={{marginBottom:52}}>
          <p style={{fontFamily:F.mono,fontSize:10,color:C.textMute,letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:20}}>The Right Fit</p>
          <h2 style={{fontFamily:F.display,fontSize:'clamp(32px,4.5vw,58px)',color:C.white,fontWeight:600,lineHeight:1.08,letterSpacing:'0.01em',maxWidth:760,marginBottom:0}}>
            If you are building something that demands craft,{' '}<span style={{color:C.accent}}>I want to be in that room.</span>
          </h2>
          <div style={{width:'clamp(40px,6vw,60px)',height:1,background:C.line,marginTop:20}}/>
        </motion.div>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'minmax(0,1fr) minmax(0,1fr)',gap:'clamp(28px,5vw,72px)'}}>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.28}}>
            <p style={{fontFamily:F.body,fontSize:'clamp(13px,1.5vw,15px)',color:C.textDim,lineHeight:1.9,marginBottom:18,fontWeight:300,maxWidth:420}}>Backend engineering. Clinical systems architecture. Interactive product development. Problems where the craft behind the surface is as important as the surface itself.</p>
            <p style={{fontFamily:F.body,fontSize:'clamp(13px,1.5vw,15px)',color:C.textDim,lineHeight:1.9,marginBottom:40,fontWeight:300,maxWidth:420}}>A decade making sure the systems that matter keep running. Now building them — with teams who care about what they ship as much as I do.</p>
            {[{l:'Email',v:'mark@markjp.dev',h:'mailto:mark@markjp.dev'},{l:'GitHub',v:'github.com/markjpdev',h:'https://github.com/markjpdev'},{l:'LinkedIn',v:'in/jaysonpunsalan',h:'https://linkedin.com/in/jaysonpunsalan'}].map(item=>(
              <div key={item.l} style={{padding:'clamp(12px,1.8vw,16px) 0',borderBottom:`1px solid ${C.line}`}}>
                <div style={{fontFamily:F.mono,fontSize:9,color:C.textMute,letterSpacing:'0.16em',textTransform:'uppercase',marginBottom:5}}>{item.l}</div>
                <a href={item.h} target={item.h.startsWith('mailto')?undefined:'_blank'} rel="noreferrer" style={{fontFamily:F.body,fontSize:'clamp(13px,1.5vw,15px)',color:C.textDim,textDecoration:'none',fontWeight:300,transition:'color 0.2s',cursor:'none'}} onMouseOver={e=>e.currentTarget.style.color=C.accent} onMouseOut={e=>e.currentTarget.style.color=C.textDim}>{item.v}</a>
              </div>
            ))}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}} style={{marginTop:32,paddingTop:24,borderTop:`1px solid ${C.line}`}}>
              <span style={{fontFamily:F.mono,fontSize:'clamp(9px,1.3vw,11px)',color:C.gold,letterSpacing:'0.12em'}}>[Placeholder — the last line they remember. One sentence. Make it true.]</span>
            </motion.div>
          </motion.div>
          <motion.div initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{delay:0.32}}>
            {sent?(
              <div style={{background:C.bgCard,border:`1px solid ${C.line}`,padding:'clamp(40px,6vw,60px) clamp(24px,4vw,40px)',textAlign:'center'}}>
                <div style={{fontFamily:F.display,fontSize:'clamp(24px,3.5vw,40px)',color:C.white,fontWeight:600,marginBottom:14}}>Sent.</div>
                <p style={{fontFamily:F.body,fontSize:14,color:C.textDim,lineHeight:1.8,fontWeight:300}}>Your mail client should have opened. I'll be in touch.</p>
              </div>
            ):(
              <form onSubmit={sub} style={{display:'flex',flexDirection:'column',gap:'clamp(14px,2vw,18px)'}}>
                {[{k:'name',l:'Name',t:'text',p:'Your name'},{k:'email',l:'Email',t:'email',p:'your@email.com'}].map(f=>(
                  <div key={f.k}><label style={lbl}>{f.l}</label><input style={inp} type={f.t} placeholder={f.p} value={form[f.k]} required onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.line}/></div>
                ))}
                <div><label style={lbl}>Message</label><textarea style={{...inp,minHeight:'clamp(90px,12vw,120px)',resize:'vertical'}} placeholder="Tell me about the work." value={form.message} required onChange={e=>setForm(p=>({...p,message:e.target.value}))} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.line}/></div>
                <button type="submit" style={{background:C.accent,border:'none',padding:'clamp(11px,1.5vw,13px) clamp(22px,3vw,32px)',fontFamily:F.mono,fontSize:11,color:C.bg,fontWeight:700,letterSpacing:'0.14em',cursor:'none',transition:'opacity 0.2s',textTransform:'uppercase',alignSelf:'flex-start'}} onMouseOver={e=>e.currentTarget.style.opacity='0.78'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>Send →</button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </Shell>
  )
}

// ─── ROOT ────────────────────────────────────────────────
export default function Portfolio(){
  const [mounted,setMounted]=useState(false), [phase,setPhase]=useState('intro'), [section,setSection]=useState(null)
  const [flash,setFlash]=useState(null), [secret,setSecret]=useState(false)
  const {on:audioOn,toggle:audioToggle}=useAudio()
  useEffect(()=>setMounted(true),[])
  if(!mounted)return null
  const NUMS={about:'01',skills:'02',projects:'03',contact:'04'}
  const onNav=id=>{ const dest=id==='home'?null:id; if(dest&&dest!==section){const n=NUMS[dest];if(n)setFlash(n)} ; setSection(dest) }
  const onLogoTap=useSecret(()=>setSecret(true))
  const PAGES={about:AboutPage,skills:SkillsPage,projects:ProjectsPage,contact:ContactPage}
  const Page=section?PAGES[section]:null
  return(<>
    <Head>
      <title>MJP — Mark Jayson Punsalan</title>
      <meta name="description" content="MJP — Backend engineer and clinical systems specialist. Building at the intersection of systems discipline and interactive craft. Quezon City, Philippines."/>
      <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
      <meta name="theme-color" content="#0D0E14"/>
      <meta property="og:title" content="MJP — Mark Jayson Punsalan"/>
      <meta property="og:description" content="Backend engineer. Clinical systems specialist. Building at the intersection of systems discipline and interactive craft."/>
      <meta property="og:url" content="https://markjp.dev"/>
      <meta property="og:type" content="website"/>
      <meta property="og:image" content="https://markjp.dev/og-image.png"/>
      <meta name="twitter:card" content="summary_large_image"/>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@300;400;500&family=Noto+Sans+Tagalog&display=swap" rel="stylesheet"/>
    </Head>
    <style dangerouslySetInnerHTML={{__html:`
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html,body,#__next{background:#0D0E14;min-height:100%;height:100%}
      body{-webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:none}
      a,button,input,textarea,select{cursor:none}
      @media(hover:none){body,a,button,input,textarea{cursor:auto}}
      ::-webkit-scrollbar{width:2px} ::-webkit-scrollbar-track{background:#0D0E14} ::-webkit-scrollbar-thumb{background:rgba(91,141,239,0.27)}
      ::selection{background:rgba(91,141,239,0.09);color:#F5F6FC}
      input,textarea{-webkit-appearance:none;border-radius:0}
      input::placeholder,textarea::placeholder{color:rgba(233,235,243,0.33);font-family:'Inter',sans-serif;font-size:13px;font-weight:300}
      @keyframes pulse{0%,100%{box-shadow:0 0 7px rgba(74,202,139,0.53),0 0 14px rgba(74,202,139,0.13)}50%{box-shadow:0 0 2px rgba(74,202,139,0.27)}}
      @keyframes statusPulse{0%,100%{opacity:1}50%{opacity:0.35}}
    `}}/>
    <Grain/><Cursor/>
    <AnimatePresence>{secret&&<SecretScreen key="secret" onClose={()=>setSecret(false)}/>}</AnimatePresence>
    <AnimatePresence>{flash&&<SectionFlash key={flash} num={flash} onDone={()=>setFlash(null)}/>}</AnimatePresence>
    <AnimatePresence mode="wait">
      {phase==='intro'&&<Intro key="intro" onDone={()=>setPhase('title')}/>}
      {phase==='title'&&<TitleScreen key="title" onEnter={()=>setPhase('fade')}/>}
      {phase==='fade'&&<Fade key="fade" onDone={()=>setPhase('main')}/>}
      {phase==='main'&&(
        <motion.div key="main" style={{position:'fixed',inset:0}} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}}>
          {section&&<TopBar section={section} onNav={onNav} onLogoTap={onLogoTap}/>}
          {section&&<BottomNav section={section} onNav={onNav}/>}
          {section&&<AudioBtn on={audioOn} toggle={audioToggle}/>}
          <AnimatePresence mode="wait">
            {!section&&<HomeScreen key="home" onNav={onNav}/>}
            {section&&Page&&<Swipe key={section} section={section} onNav={onNav}><Page/></Swipe>}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  </>)
}
