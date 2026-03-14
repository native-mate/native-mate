import * as React from 'react'
import { addPropertyControls, ControlType } from 'framer'
import { presets, radius, type Preset } from '../tokens'

interface BadgeProps {
  label: string
  variant: 'default' | 'secondary' | 'outline' | 'success' | 'destructive'
  dot: boolean
  preset: Preset
}

export function Badge({ label = 'Badge', variant = 'default', dot = false, preset = 'zinc' }: BadgeProps) {
  const t = presets[preset]

  const variantStyles: React.CSSProperties =
    variant === 'default'
      ? { background: t.primary, color: t.primaryForeground }
      : variant === 'secondary'
      ? { background: t.surface, color: t.foreground }
      : variant === 'outline'
      ? { background: 'transparent', color: t.foreground, border: `1px solid ${t.border}` }
      : variant === 'success'
      ? { background: '#166534', color: '#bbf7d0' }
      : { background: '#7f1d1d', color: '#fecaca' }

  const dotColor =
    variant === 'success' ? '#4ade80' : variant === 'destructive' ? '#f87171' : t.mutedForeground

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 22,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: radius.full,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        ...variantStyles,
      }}
    >
      {dot && (
        <span
          style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, flexShrink: 0 }}
        />
      )}
      {label}
    </div>
  )
}

addPropertyControls(Badge, {
  label: { type: ControlType.String, title: 'Label', defaultValue: 'Badge' },
  variant: {
    type: ControlType.Enum,
    title: 'Variant',
    options: ['default', 'secondary', 'outline', 'success', 'destructive'],
    defaultValue: 'default',
  },
  dot: { type: ControlType.Boolean, title: 'Dot', defaultValue: false },
  preset: {
    type: ControlType.Enum,
    title: 'Preset',
    options: ['zinc', 'slate', 'rose', 'midnight'],
    defaultValue: 'zinc',
  },
})
