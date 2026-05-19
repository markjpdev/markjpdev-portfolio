import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { Mail, ArrowRight, MapPin, Briefcase, Zap } from 'lucide-react'
import { meta } from '../lib/content'

const SECTIONS = ['projects', 'writing', 'about', 'contact', 'tools']
const KEY_MAP = { '1': 'projects', '2': 'writing', '3': 'about', '4': 'contact', '5': 'tools' }

const PROJECTS = [
  {
    num: '01', title: 'Veeva Vault CTMS',
    desc: 'Clinical trial management configuration and GxP aligned workflows for life sciences operations.',
    tags: ['Veeva', 'GxP', 'CTMS', 'Life Sciences'],
  },
  {
    num: '02', title: 'AI Automation Studio',
    desc: 'End to end workflows built with n8n, Make, and Claude APIs. Practical tooling for small teams.',
    tags: ['n8n', 'Make', 'Claude API', 'Automation'],
  },
  {
    num: '03', title: 'Healthcare SaaS Ops',
    desc: 'Application support and business analysis across enterprise platforms. Production environments and configuration.',
    tags: ['SaaS', 'Healthcare', 'BA', 'Support'],
  },
]

const WRITING = [
  { date: '2026.04', title: 'On bridges and long arcs' },
  { date: '2026.02', title: 'What BPO actually teaches you about software' },
  { date: '2025.11', title: 'Automation as a craft, not a hustle' },
  { date: '2025.09', title: 'The slow path into deep tech' },
]

const TOOLS = [
  { label: 'AI & Automation', chips: ['Claude API', 'n8n', 'Make', 'Cursor'] },
  { label: 'Enterprise',      chips: ['Veeva Vault', 'CTMS', 'GxP', 'SaaS Ops'] },
  { label: 'Build',           chips: ['Next.js', 'React', 'Python', 'REST APIs'] },
]

export default function Home() {
  const [active, setActive] = useState(null)
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)

  function toggle(section) {
    setActive(prev => (prev === section ? null : section))
  }

  useEffect(() => {
    const body = document.body
    if (active) {
      body.classList.add('has-active')
      body.setAttribute('data-section', active)
    } else {
      body.classList.remove('has-active')
      body.removeAttribute('data-section')
    }
  }, [active])

  useEffect(() => {
    function onKey(e) {
      const section = KEY_MAP[e.key]
      if (section) setActive(prev => (prev === section ? null : section))
      if (e.key === 'Escape') setActive(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const opts = { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: false }
    function update() {
      const el = document.getElementById('time')
      if (el) el.textContent = new Intl.DateTimeFormat('en-GB', opts).format(new Date()) + ' · manila'
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0
    let rafId

    function onMouseMove(e) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 30
      targetY = (e.clientY / window.innerHeight - 0.5) * 30
    }

    function animate() {
      currentX += (targetX - currentX) * 0.04
      currentY += (targetY - currentY) * 0.04
      if (orb1Ref.current) orb1Ref.current.style.transform = `translate(${currentX * 0.6}px, ${currentY * 0.6}px)`
      if (orb2Ref.current) orb2Ref.current.style.transform = `translate(${-currentX * 0.4}px, ${-currentY * 0.4}px)`
      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove)
    rafId = requestAnimationFrame(animate)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content="Quietly building things that work." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content="Quietly building things that work." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content="Quietly building things that work." />
        <link rel="canonical" href={meta.url} />
      </Head>

      <div className="orbs">
        <div className="orb orb-1" ref={orb1Ref} />
        <div className="orb orb-2" ref={orb2Ref} />
      </div>

      <div className="stage">
        {/* ── Header ── */}
        <header className="top">
          <div className="signature"><span className="dash">—</span>mark jayson punsalan</div>
          <div className="meta">
            <div className="time" id="time">— : —</div>
            <div className="now"><span className="dot" />currently exploring physical ai</div>
          </div>
        </header>

        {/* ── Main: left = identity, right = nav + panels ── */}
        <main className="center">

          {/* Left: identity */}
          <aside className="id-side">
            <div className="identity">
              <h1>Mark Jayson</h1>
              <p className="surname">Punsalan</p>
              <p className="baybayin">ᜋᜇ᜔ᜃ ᜑᜒᜐᜓᜈ᜔ ᜉᜓᜈ᜔ᜐᜎᜈ᜔</p>
              <p className="tagline">quietly building things that work.</p>
              <svg className="steam-icon" viewBox="0 0 28 24" aria-hidden="true">
                <path d="M6,22 C6,16 10,14 6,8 C2,2 6,0 6,0"/>
                <path d="M14,22 C14,16 10,14 14,8 C18,2 14,0 14,0"/>
                <path d="M22,22 C22,16 18,14 22,8 C26,2 22,0 22,0"/>
              </svg>
            </div>
          </aside>

          {/* Right: nav pills + panels */}
          <div className="panel-side">

            <nav className="pills" role="tablist">
              {SECTIONS.map((s, i) => (
                <button
                  key={s}
                  className={`pill${active === s ? ' is-active' : ''}`}
                  onClick={() => toggle(s)}
                  aria-pressed={active === s}
                >
                  <span className="num">0{i + 1}</span>
                  {s === 'contact' ? 'say hi' : s}
                </button>
              ))}
            </nav>

            {/* Welcome state — shown when nothing is active */}
            <div className={`welcome${active ? ' welcome--hidden' : ''}`}>
              <p className="welcome-intro">
                Ten years in enterprise software — application support, business analysis,
                the quiet middle layer where things either hold together or fall apart.
              </p>
              <p className="welcome-sub">
                Currently bridging healthcare SaaS with AI automation,
                and building toward physical AI and robotics.
              </p>
              <div className="welcome-stats">
                <span className="stat-chip"><MapPin size={13} />Manila, PH</span>
                <span className="stat-chip"><Briefcase size={13} />10 yrs exp</span>
                <span className="stat-chip"><Zap size={13} />open to work</span>
              </div>
            </div>

            {/* Panels */}
            <div className="panel-wrap">

              <div className={`panel${active === 'projects' ? ' is-visible' : ''}`}>
                <div className="projects-grid">
                  {PROJECTS.map(({ num, title, desc, tags }) => (
                    <article key={num} className="project">
                      <span className="project-num">{num}</span>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                      <div className="tags">
                        {tags.map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className={`panel${active === 'writing' ? ' is-visible' : ''}`}>
                <ul className="writing-list">
                  {WRITING.map(({ date, title }) => (
                    <li key={title}>
                      <span className="date">{date}</span>
                      <span className="title">{title}</span>
                      <ArrowRight size={14} className="arrow-icon" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`panel${active === 'about' ? ' is-visible' : ''}`}>
                <div className="about-wrap">
                  <p>Ten years deep in enterprise software. Application support, business analysis, the quiet middle layer where things either hold together or fall apart.</p>
                  <p>These days I split my attention between healthcare SaaS work and <span className="highlight">AI integration</span>, building automations that take the small repeated pain out of how teams operate. It pays the bills and teaches me a lot.</p>
                  <p>Looking further out, I&apos;m building toward <span className="highlight">physical AI, robotics, and simulation</span>. That&apos;s a multi year direction. For now I&apos;m focused on the bridge between here and there.</p>
                </div>
              </div>

              <div className={`panel${active === 'contact' ? ' is-visible' : ''}`}>
                <div className="contact-wrap">
                  <p>open to interesting contracts,<br />collaborations, and conversations.</p>
                  <a className="contact-cta" href="mailto:hello@markjp.dev">
                    hello@markjp.dev
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>

              <div className={`panel${active === 'tools' ? ' is-visible' : ''}`}>
                <div className="tools-wrap">
                  {TOOLS.map(({ label, chips }) => (
                    <div key={label} className="tools-group">
                      <span className="tools-label">{label}</span>
                      <div className="tools-chips">
                        {chips.map(c => <span key={c} className="chip">{c}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </main>

        {/* ── Footer ── */}
        <footer className="bottom">
          <div className="socials">
            <a className="social" href="mailto:hello@markjp.dev" aria-label="Email">
              <Mail size={15} strokeWidth={1.6} />
            </a>
            <a className="social" href="https://www.linkedin.com/in/jaysonpunsalan/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.75 1.75 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
              </svg>
            </a>
            <a className="social" href="https://github.com/markjpdev" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.11-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.11 0 1.52-.01 2.75-.01 3.13 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
              </svg>
            </a>
            <a className="social" href="https://x.com/markjp" aria-label="X" target="_blank" rel="noopener noreferrer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
          <div className="keys">press <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd><kbd>5</kbd> or <kbd>esc</kbd></div>
        </footer>
      </div>
    </>
  )
}
