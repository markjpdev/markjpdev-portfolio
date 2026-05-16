// ─────────────────────────────────────────────
//  Site content — edit here, not in components
// ─────────────────────────────────────────────

export const meta = {
  title:       'Mark JP',
  description: 'Software engineer. Started in support.',
  url:         'https://markjp.dev',
}

export const tagline = 'Software engineer. Started in support.'

export const waypoints = [
  {
    label:   'Support',
    tooltip: '2014 — IT helpdesk. Where it started.',
    x: 40,  y: 140,
  },
  {
    label:   'Systems',
    tooltip: 'Sysadmin. Infrastructure and ownership.',
    x: 190, y: 112,
  },
  {
    label:   'Analysis',
    tooltip: 'Business analysis. Systems thinking.',
    x: 370, y: 84,
  },
  {
    label:   'Engineering',
    tooltip: 'Now. Building toward backend.',
    x: 540, y: 56,
  },
]

export const status = [
  { label: 'building',  value: 'python game — first project' },
  { label: 'learning',  value: 'backend engineering'         },
]

export const about = {
  intro:  "I started in IT support in 2014 and spent a decade working closer to systems — helpdesk, sysadmin, then business analysis. I think like someone who has had to explain software to people who don't care about software. Now I'm building it.",
  detail: "Currently focused on backend engineering. Python first. Learning in public.",
}

export const projects = [
  {
    name:        'Terminal Game',
    tag:         'python',
    status:      'building',
    description: 'A text-based adventure game built in Python. My first real project — learning by making something that actually runs.',
    github:      'https://github.com/markjpdev',
  },
  {
    name:        'markjp.dev',
    tag:         'next.js',
    status:      'shipped',
    description: 'This site. No CSS frameworks. Pure inline React styles and custom vanilla JS animations. Built to be fast and mine.',
    github:      'https://github.com/markjpdev',
  },
]

export const skills = {
  building:   ['Python', 'JavaScript', 'React', 'Next.js', 'HTML', 'CSS'],
  familiar:   ['Git', 'Linux', 'Bash', 'SQL', 'REST APIs'],
  background: ['IT Support', 'Sysadmin', 'Business Analysis', 'Infrastructure'],
}

export const links = {
  github:   'https://github.com/markjpdev',
  linkedin: 'https://www.linkedin.com/in/jaysonpunsalan/',
  codedex:  'https://www.codedex.io/@Bakuryu',
  email:    'mailto:markpunsalan@icloud.com',
}
