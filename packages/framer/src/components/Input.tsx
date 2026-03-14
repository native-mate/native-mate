import * as React from 'react'
import { addPropertyControls, ControlType } from 'framer'
import { presets, spacing, radius, type Preset } from '../tokens'

interface InputProps {
  label: string
  placeholder: string
  value: string
  error: string
  disabled: boolean
  preset: Preset
  width: number
}

export function Input({
  label = 'Email',
  placeholder = 'Enter your email',
  value = '',
  error = '',
  disabled = false,
  preset = 'zinc',
  width = 300,
}: InputProps) {
  const t = presets[preset]
  const hasError = !!error

  return (
    <div
      style={{
        width,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: t.foreground }}>{label}</label>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 44,
          paddingLeft: spacing.md,
          paddingRight: spacing.md,
          borderRadius: radius.md,
          border: `1px solid ${hasError ? t.destructive : t.border}`,
          background: t.surface,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span style={{ fontSize: 15, color: value ? t.foreground : t.mutedForeground, flex: 1 }}>
          {value || placeholder}
        </span>
      </div>
      {hasError && (
        <span style={{ fontSize: 12, color: t.destructive }}>{error}</span>
      )}
    </div>
  )
}

addPropertyControls(Input, {
  label: { type: ControlType.String, title: 'Label', defaultValue: 'Email' },
  placeholder: { type: ControlType.String, title: 'Placeholder', defaultValue: 'Enter your email' },
  value: { type: ControlType.String, title: 'Value', defaultValue: '' },
  error: { type: ControlType.String, title: 'Error', defaultValue: '' },
  disabled: { type: ControlType.Boolean, title: 'Disabled', defaultValue: false },
  preset: {
    type: ControlType.Enum,
    title: 'Preset',
    options: ['zinc', 'slate', 'rose', 'midnight'],
    defaultValue: 'zinc',
  },
  width: { type: ControlType.Number, title: 'Width', defaultValue: 300, min: 150, max: 600 },
})
