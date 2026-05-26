import Head from 'next/head'
import { useState, useEffect } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { meta } from '../lib/content'
import Timeline from '../components/Timeline'

const SECTIONS = ['projects', 'solutions', 'about', 'contact', 'tools']

const PROJECTS = [
  {
    category: 'Automation & Intelligence',
    items: [
      {
        num: '01', title: 'AI Automation Studio',
        desc: 'End-to-end workflows built with n8n, Make, and Claude APIs. Practical tooling designed for backend operational efficiency.',
        tags: ['n8n', 'Make', 'Claude API', 'Automation']
      }
    ]
  },
  {
    category: 'Enterprise SaaS Configurations',
    items: [
      {
        num: '02', title: 'Clinical Operations Architecture',
        desc: 'Deep-tier configuration of business rules, object lifecycles, and data validation logic across regulated life sciences schemas.',
        tags: ['Veeva Vault', 'CTMS', 'GxP', 'SaaS Ops']
      }
    ]
  },
  {
    category: 'System Integrations & Hardware',
    items: [
      {
        num: '03', title: 'Flood Alarm Monitoring System',
        desc: 'Academic capstone utilizing a 3-level water sensor configuration feeding data to a custom VB.NET application, orchestrating automated SMS emergency alerts based on localized evacuation protocols.',
        tags: ['VB.NET', 'SQL', 'SCADA Fundamentals', 'Hardware Integration']
      }
    ]
  }
]

const SOLUTIONS_KB = [
  {
    category: 'INCIDENT-POST-MORTEM',
    title: 'Cross-Platform Document Sync Failure',
    tech: 'Veeva Vault · Oracle · CTMS',
    desc: 'Isolated a recurring document integration breakdown spanning a multi-vendor lifecycle workflow by tracing and auditing silent data-state discrepancies across integration pipelines.'
  },
  {
    category: 'LOGIC-RUNBOOK',
    title: 'Data Integrity & Schema Mismatch Mitigation',
    tech: 'SQL · API Logs · Postman',
    desc: 'Authored structural logic queries to identify user access sync mismatches and clean corrupted database states locally, significantly reducing systemic dependencies on external vendor patches.'
  }
]

const CAREER = [
  {
    timestamp: '2024 – present',
    title: 'AI Integration & Automation',
    description: 'Engineering workflows with n8n, Make, and LLM APIs. Architecting custom data validation logic and platform-wide business rules.',
    state: 'active', icon: 'Zap'
  },
  {
    timestamp: '2020 – 2024',
    title: 'Enterprise Application Support',
    description: 'Managed critical incident channels and drove complex data analytics under strict severity tiers. Led systemic platform migrations and audited knowledge frameworks.',
    state: 'completed', icon: 'Briefcase'
  },
  {
    timestamp: '2013 – 2020',
    title: 'Technical Operations at Scale',
    description: 'Built a deep foundation in network routing, line signal diagnostics, and analytical troubleshooting. Performed user acceptance testing (UAT) on internally built software tools.',
    state: 'completed', icon: 'Terminal'
  }
]

const TOOLS = [
  { label: 'Automation & Data Ops',   chips: ['n8n', 'Make', 'Postman', 'Celigo Integration Flows'] },
  { label: 'Languages & Scripting',  chips: ['Python', 'SQL', 'PowerShell', 'JavaScript', 'VB.NET'] },
  { label: 'Development Ecosystem', chips: ['Visual Studio Code', 'Cursor', 'Git', 'GitHub'] },
  { label: 'Enterprise Platforms',    chips: ['ServiceNow', 'Jira', 'Veeva Vault Admin', 'Azure AD'] }
]

export default function Home() {
  const [active, setActive]     = useState(null)
  const [visible, setVisible]   = useState(false)
  const [leaving, setLeaving]   = useState(false)

  function open(id) {
    if (visible && active === id) return
    if (visible) {
      setLeaving(true)
      setTimeout(() => { setActive(id); setLeaving(false) }, 380)
    } else {
      setVisible(true)
      setTimeout(() => setActive(id), 340)
    }
  }

  function close() {
    setLeaving(true)
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

          {/* Projects Section */}
          <article id="projects" className={active === 'projects' && !leaving ? 'active' : ''} onClick={e => e.stopPropagation()}>
            <h2 className="major">Projects</h2>
            <div className="projects-container">
              {PROJECTS.map((cat) => (
                <div key={cat.category} className="project-category-group" style={{ marginBottom: '2rem' }}>
                  <h4 style={{ letterSpacing: '2px', opacity: 0.5, fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                    {cat.category}
                  </h4>
                  <div className="projects-grid">
                    {cat.items.map(({ num, title, desc, tags }) => (
                      <div key={num} className="project-card" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                          <span className="project-num" style={{ opacity: 0.4, fontSize: '0.9rem' }}>{num}</span>
                          <h3 style={{ margin: 0 }}>{title}</h3>
                        </div>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>{desc}</p>
                        <div className="tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                          {tags.map(t => <span key={t} className="tag" style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{t}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="close" onClick={close} aria-label="Close">Close</button>
          </article>

          {/* Solutions Knowledge Base Section */}
          <article id="solutions" className={active === 'solutions' && !leaving ? 'active' : ''} onClick={e => e.stopPropagation()}>
            <h2 className="major">Solutions</h2>
            <p className="about-lead">An open-source repository of operational knowledge runbooks, engineering breakthroughs, and systemic post-mortems.</p>
            <div className="solutions-kb-stack">
              {SOLUTIONS_KB.map(({ category, title, tech, desc }) => (
                <div key={title} className="kb-item" style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '6px', borderLeft: '3px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', letterSpacing: '1.5px', background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '3px', opacity: 0.7 }}>
                      {category}
                    </span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{tech}</span>
                  </div>
                  <h3 style={{ margin: '0.75rem 0 0.5rem 0', fontSize: '1.1rem', letterSpacing: '0.5px' }}>{title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.5' }}>{desc}</p>
                </div>
              ))}
            </div>
            <button className="close" onClick={close} aria-label="Close">Close</button>
          </article>

          {/* About Section */}
          <article id="about" className={active === 'about' && !leaving ? 'active' : ''} onClick={e => e.stopPropagation()}>
            <h2 className="major">About</h2>
            <p className="about-lead">
              Over a decade across technical operations, enterprise SaaS ecosystems, and integration compliance. 
              Specializing in the stable execution layer where legacy infrastructure meets modern intelligent automation.
            </p>
            <Timeline events={CAREER} orientation="vertical" />
            <button className="close" onClick={close} aria-label="Close">Close</button>
          </article>

          {/* Say Hi Section */}
          <article id="contact" className={active === 'contact' && !leaving ? 'active' : ''} onClick={e => e.stopPropagation()}>
            <h2 className="major">Say Hi</h2>
            <p className="contact-sub">
              Open to interesting contracts, technical collaborations, and automation architecture discussions.
            </p>
            <a className="contact-cta" href="mailto:markpunsalan@icloud.com">
              markpunsalan@icloud.com <ArrowRight size={16} />
            </a>
            <ul className="social-icons">
              <li>
                <a href="mailto:markpunsalan@icloud.com" aria-label="Email">
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.11-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.11 0 1.52-.01 2.75-.01 3.13 0 .31.21.68.81.56C20.72 21.39 24 17.08 24 12c0-6.35-5.15-11.5-11.5-11.5z"/>
                  </svg>
                </a>
              </li>
            </ul>
          </article>
        </div>
      </main>
    </div>
  );
}

export default Home;