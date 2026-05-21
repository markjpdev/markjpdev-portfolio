import Head from 'next/head'
import { useState, useEffect } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { meta } from '../lib/content'
import Timeline from '../components/Timeline'
import Icon from '../components/Icon'

const SECTIONS = ['projects', 'writing', 'about', 'contact', 'tools']

const PROJECTS = [
  {
    num: '01', title: 'Veeva Vault CTMS',
    desc: 'Clinical trial management configuration and GxP-aligned workflows for life sciences operations.',
    tags: ['Veeva', 'GxP', 'CTMS', 'Life Sciences'],
  },
  {
    num: '02', title: 'AI Automation Studio',
    desc: 'End-to-end workflows built with n8n, Make, and Claude APIs. Practical tooling for small teams.',
    tags: ['n8n', 'Make', 'Claude API', 'Automation'],
  },
  {
    num: '03', title: 'Healthcare SaaS Ops',
    desc: 'Application support and business analysis across enterprise platforms. Production environments and configuration.',
    tags: ['SaaS', 'Healthcare', 'BA', 'Support'],
  },
]

const WRITING_TIMELINE = [
  { timestamp: '2026.04', title: 'On bridges and long arcs',                          state: 'active'    },
  { timestamp: '2026.02', title: 'What BPO actually teaches you about software',       state: 'completed' },
  { timestamp: '2025.11', title: 'Automation as a craft, not a hustle',                state: 'completed' },
  { timestamp: '2025.09', title: 'The slow path into deep tech',                       state: 'completed' },
]

const CAREER = [
  {
    timestamp: '2024 – present',
    title: 'Business Analyst and Application Support',
    description: 'Regulated healthcare SaaS at RxPx Health. Requirements gathering, configuration, UAT, and triaging production incidents as they happen.',
    state: 'active', icon: 'Zap',
  },
  {
    timestamp: '2021 – 2024',
    title: 'Clinical Systems Support',
    description: 'Thermo Fisher Scientific. Application support for clinical trial platforms across Veeva Vault, Medidata Rave, Oracle goBalto and others, inside GxP regulated environments.',
    state: 'completed', icon: 'Briefcase',
  },
  {
    timestamp: '2013 – 2020',
    title: 'Technical Support, BPO',
    description: 'VXI Global, Convergys, Alorica, Cybersoft. Tier 1 and Tier 2 across telecom and enterprise back office work, where I learned systematic troubleshooting under pressure.',
    state: 'completed',
  },
]

const TOOLS = [
  { label: 'AI & Automation', chips: ['Claude API', 'n8n', 'Make', 'Cursor'] },
  { label: 'Enterprise',      chips: ['Veeva Vault', 'CTMS', 'GxP', 'SaaS Ops'] },
  { label: 'Build',           chips: ['Next.js', 'React', 'Python', 'REST APIs'] },
]

export default function Home() {
  const [active, setActive]     = useState(null)
  const [visible, setVisible]   = useState(false)
  const [leaving, setLeaving]   = useState(false)

  function open(id) {
    if (visible && active === id) return
    if (visible) {
      // swap: fade current out, then bring new one in
      setLeaving(true)
      setTimeout(() => { setActive(id); setLeaving(false) }, 380)
    } else {
      // header exits first, article enters after header is gone
      setVisible(true)
      setTimeout(() => setActive(id), 340)
    }
  }

  function close() {
    // article exits first
    setLeaving(true)
    // header re-enters only after article is fully gone
    setTimeout(() => {
      setVisible(false)
      setActive(null)
      setLeaving(false)
    }, 460)
  }

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [visible])

  useEffect(() => {
    const opts = { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: false }
    function update() {
      const el = document.getElementById('mjp-time')
      if (el) el.textContent = new Intl.DateTimeFormat('en-GB', opts).format(new Date())
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
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

      <div id="wrapper" className={visible ? 'is-article-visible' : ''}>

        {/* ── Header ── */}
        <header id="header">
          <div className="logo">
            <svg viewBox="0 0 28 24" aria-hidden="true" className="logo-steam">
              <path d="M6,22 C6,16 10,14 6,8 C2,2 6,0 6,0"/>
              <path d="M14,22 C14,16 10,14 14,8 C18,2 14,0 14,0"/>
              <path d="M22,22 C22,16 18,14 22,8 C26,2 22,0 22,0"/>
            </svg>
          </div>

          <div className="content">
            <div className="inner">
              <h1>Mark Jayson Punsalan</h1>
              <p className="baybayin">ᜋᜇ᜔ᜃ ᜑᜒᜐᜓᜈ᜔ ᜉᜓᜈ᜔ᜐᜎᜈ᜔</p>
              <p>quietly building things that work.</p>
            </div>
          </div>

          <nav>
            <ul>
              {SECTIONS.map(s => (
                <li key={s}>
                  <button onClick={() => open(s)}>
                    {s === 'contact' ? 'say hi' : s}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {/* ── Articles ── */}
        <div id="main" onClick={close}>

          <article id="projects" className={active === 'projects' && !leaving ? 'active' : ''} onClick={e => e.stopPropagation()}>
            <h2 className="major">Projects</h2>
            <div className="projects-grid">
              {PROJECTS.map(({ num, title, desc, tags }) => (
                <div key={num} className="project-card">
                  <span className="project-num">{num}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <div className="tags">
                    {tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <button className="close" onClick={close} aria-label="Close">Close</button>
          </article>

          <article id="writing" className={active === 'writing' && !leaving ? 'active' : ''} onClick={e => e.stopPropagation()}>
            <h2 className="major">Writing</h2>
            <ul className="writing-list">
              {WRITING_TIMELINE.map(({ timestamp, title, state }) => (
                <li key={title} className={state === 'active' ? 'is-latest' : ''}>
                  <span className="date">{timestamp}</span>
                  <span className="title">{title}</span>
                  <ArrowRight size={14} className="arrow-icon" />
                </li>
              ))}
            </ul>
            <button className="close" onClick={close} aria-label="Close">Close</button>
          </article>

          <article id="about" className={active === 'about' && !leaving ? 'active' : ''} onClick={e => e.stopPropagation()}>
            <h2 className="major">About</h2>
            <p className="about-lead">
              Ten years in enterprise software. Application support, business analysis &amp; Technical support
            </p>
            <Timeline events={CAREER} orientation="vertical" />
            <button className="close" onClick={close} aria-label="Close">Close</button>
          </article>

          <article id="contact" className={active === 'contact' && !leaving ? 'active' : ''} onClick={e => e.stopPropagation()}>
            <h2 className="major">Say Hi</h2>
            <p className="contact-sub">
              Open to interesting contracts, collaborations, and conversations.
            </p>
            <a className="contact-cta" href="mailto:hello@markjp.dev">
              hello@markjp.dev <ArrowRight size={16} />
            </a>
            <ul className="social-icons">
              <li>
                <a href="mailto:hello@markjp.dev" aria-label="Email">
                  <Mail size={18} strokeWidth={1.6} />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/jaysonpunsalan/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.75 1.75 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                </a>
              </li>
              <li>
                <a href="https://github.com/markjpdev" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.11-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.11 0 1.52-.01 2.75-.01 3.13 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
                </a>
              </li>
              <li>
                <a href="https://x.com/markjp" aria-label="X / Twitter" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </li>
            </ul>
            <button className="close" onClick={close} aria-label="Close">Close</button>
          </article>

          <article id="tools" className={active === 'tools' && !leaving ? 'active' : ''} onClick={e => e.stopPropagation()}>
            <h2 className="major">Tools</h2>
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
            <button className="close" onClick={close} aria-label="Close">Close</button>
          </article>

        </div>

        {/* ── Footer ── */}
        <footer id="footer">
          <p className="copyright">
            mark jayson punsalan &nbsp;·&nbsp; <span id="mjp-time">--:--</span> manila
            &nbsp;·&nbsp; <span className="dot-status" />currently exploring physical ai
          </p>
        </footer>

      </div>

      {/* Background */}
      <div id="bg" />
    </>
  )
}
