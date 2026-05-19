import * as LucideIcons from 'lucide-react'

const SIZES = { sm: 14, md: 18, lg: 24, xl: 32 }

export default function Icon({
  name,
  size = 'md',
  color,
  strokeWidth = 1.6,
  decorative = false,
  interactive = false,
  tooltip,
  onClick,
  className = '',
}) {
  const Glyph = LucideIcons[name]
  if (!Glyph) return null

  const px = typeof size === 'number' ? size : (SIZES[size] ?? SIZES.md)

  const svg = (
    <Glyph
      width={px}
      height={px}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      focusable="false"
    />
  )

  if (interactive) {
    return (
      <button
        type="button"
        className={`icon-btn${className ? ` ${className}` : ''}`}
        onClick={onClick}
        aria-label={tooltip ?? name}
        title={tooltip}
        style={color ? { color } : undefined}
      >
        {svg}
        {tooltip && <span className="icon-tip" aria-hidden="true">{tooltip}</span>}
      </button>
    )
  }

  return (
    <span
      className={`icon${className ? ` ${className}` : ''}`}
      aria-hidden={decorative ? 'true' : undefined}
      style={color ? { color } : undefined}
    >
      {svg}
    </span>
  )
}
