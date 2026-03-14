import * as React from 'react'
import { addPropertyControls, ControlType } from 'framer'
import { presets, radius, spacing, type Preset } from '../tokens'

interface AlertProps {
  title: string
  description: string
  variant: 'info' | 'success' | 'warning' | 'destructive'
  preset: Preset
}

export function Alert({ title = 'Heads up', description = 'You can update your settings in the profile page.', variant = 'info', preset = 'zinc' }: AlertProps) {
  const t = presets[preset]

  const variantColor = {
    info: t.primary,
    success: t.success,
    warning: t.warning,
    destructive: t.destructive,
  }[variant]

  const icon = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    destructive: '✕',
  }[variant]

  return (
    <div
      style={{
        display: 'flex',
        gap: spacing.md,
        padding: spacing.lg,
        borderRadius: radius.md,
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderLeft: `3px solid ${variantColor}`,
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <span style={{ fontSize: 16, color: variantColor, lineHeight: 1.4, flexShrink: 0 }}>{icon}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {title && (
          <span style={{ fontSize: 14, fontWeight: 600, color: t.foreground }}>{title}</span>
        )}
        {description && (
          <span style={{ fontSize: 13, color: t.mutedForeground, lineHeight: 1.5 }}>{description}</span>
        )}
      </div>
    </div>
  )
}

addPropertyControls(Alert, {
  title: { type: ControlType.String, title: 'Title', defaultValue: 'Heads up' },
  description: { type: ControlType.String, title: 'Description', defaultValue: 'You can update your settings in the profile page.' },
  variant: {
    type: ControlType.Enum,
    title: 'Variant',
    options: ['info', 'success', 'warning', 'destructive'],
    defaultValue: 'info',
  },
  preset: {
    type: ControlType.Enum,
    title: 'Preset',
    options: ['zinc', 'slate', 'rose', 'midnight'],
    defaultValue: 'zinc',
  },
})
