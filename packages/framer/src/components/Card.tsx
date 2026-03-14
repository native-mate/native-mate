import * as React from 'react'
import { addPropertyControls, ControlType } from 'framer'
import { presets, spacing, radius, type Preset } from '../tokens'

interface CardProps {
  title: string
  subtitle: string
  body: string
  showFooter: boolean
  footerLabel: string
  preset: Preset
  width: number
}

export function Card({
  title = 'Card title',
  subtitle = 'Subtitle text',
  body = 'Card body content goes here. Add any description or content.',
  showFooter = true,
  footerLabel = 'View details',
  preset = 'zinc',
  width = 320,
}: CardProps) {
  const t = presets[preset]

  return (
    <div
      style={{
        width,
        background: t.surface,
        borderRadius: radius.lg,
        border: `1px solid ${t.border}`,
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ padding: `${spacing.lg}px ${spacing.lg}px ${spacing.sm}px` }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: t.foreground, marginBottom: 2 }}>
          {title}
        </div>
        <div style={{ fontSize: 13, color: t.mutedForeground }}>{subtitle}</div>
      </div>

      {/* Body */}
      <div style={{ padding: `${spacing.sm}px ${spacing.lg}px`, fontSize: 14, color: t.foreground, lineHeight: 1.6 }}>
        {body}
      </div>

      {/* Footer */}
      {showFooter && (
        <div
          style={{
            padding: `${spacing.md}px ${spacing.lg}px`,
            borderTop: `1px solid ${t.border}`,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: t.primary, cursor: 'pointer' }}>
            {footerLabel} →
          </span>
        </div>
      )}
    </div>
  )
}

addPropertyControls(Card, {
  title: { type: ControlType.String, title: 'Title', defaultValue: 'Card title' },
  subtitle: { type: ControlType.String, title: 'Subtitle', defaultValue: 'Subtitle text' },
  body: { type: ControlType.String, title: 'Body', defaultValue: 'Card body content.' },
  showFooter: { type: ControlType.Boolean, title: 'Show footer', defaultValue: true },
  footerLabel: { type: ControlType.String, title: 'Footer label', defaultValue: 'View details' },
  preset: {
    type: ControlType.Enum,
    title: 'Preset',
    options: ['zinc', 'slate', 'rose', 'midnight'],
    defaultValue: 'zinc',
  },
  width: { type: ControlType.Number, title: 'Width', defaultValue: 320, min: 200, max: 600 },
})
