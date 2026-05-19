import * as LucideIcons from 'lucide-react'

function Node({ state, icon }) {
  const Glyph = icon ? LucideIcons[icon] : null
  return (
    <div className={`tl-node tl-node--${state ?? 'pending'}${Glyph ? ' tl-node--icon' : ''}`}>
      {Glyph && (
        <Glyph width={11} height={11} strokeWidth={2.2} aria-hidden="true" focusable="false" />
      )}
    </div>
  )
}

function Body({ ev }) {
  return (
    <div className="tl-body">
      {ev.timestamp && <span className="tl-time">{ev.timestamp}</span>}
      <p className="tl-title">{ev.title}</p>
      {ev.description && <p className="tl-desc">{ev.description}</p>}
    </div>
  )
}

export default function Timeline({
  events = [],
  orientation = 'vertical',
  alternating = false,
}) {
  const isAlt = alternating && orientation === 'vertical'
  const isH   = orientation === 'horizontal'

  return (
    <div
      className={[
        'timeline',
        `timeline--${orientation}`,
        isAlt ? 'timeline--alt' : '',
      ].filter(Boolean).join(' ')}
      role="list"
    >
      {events.map((ev, i) => {
        const state  = ev.state ?? 'pending'
        const isLast = i === events.length - 1

        /* ── Horizontal ── */
        if (isH) {
          return (
            <div key={i} className={`tl-item tl-item--${state}`} role="listitem">
              <div className="tl-spine">
                <Node state={state} icon={ev.icon} />
                {!isLast && <div className="tl-connector" />}
              </div>
              <Body ev={ev} />
            </div>
          )
        }

        /* ── Alternating vertical ── */
        if (isAlt) {
          const toRight = i % 2 === 0
          return (
            <div key={i} className={`tl-item tl-item--${state}`} role="listitem">
              <div className="tl-slot tl-slot--left">
                {!toRight && <Body ev={ev} />}
              </div>
              <div className="tl-spine tl-spine--center">
                <Node state={state} icon={ev.icon} />
                {!isLast && <div className="tl-connector" />}
              </div>
              <div className="tl-slot tl-slot--right">
                {toRight && <Body ev={ev} />}
              </div>
            </div>
          )
        }

        /* ── Standard vertical ── */
        return (
          <div key={i} className={`tl-item tl-item--${state}`} role="listitem">
            <div className="tl-spine">
              <Node state={state} icon={ev.icon} />
              {!isLast && <div className="tl-connector" />}
            </div>
            <Body ev={ev} />
          </div>
        )
      })}
    </div>
  )
}
