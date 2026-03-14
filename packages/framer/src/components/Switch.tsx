import * as React from 'react'
import { addPropertyControls, ControlType } from 'framer'
import { presets, spacing, type Preset } from '../tokens'

interface SwitchProps {
  value: boolean
  label: string
  disabled: boolean
  preset: Preset
}

export function Switch({ value = false, label = 'Enable notifications', disabled = false, preset = 'zinc' }: SwitchProps) {
  const t = presets[preset]

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.sm,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          width: 44,
          height: 26,
          borderRadius: 13,
          background: value ? t.primary : t.border,
          position: 'relative',
          flexShrink: 0,
          transition: 'background 0.2s',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: value ? 21 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: value ? t.primaryForeground : t.foreground,
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        />
      </div>
      {label && (
        <span style={{ fontSize: 14, color: t.foreground, lineHeight: 1 }}>{label}</span>
      )}
    </div>
  )
}

addPropertyControls(Switch, {
  value: { type: ControlType.Boolean, title: 'Value', defaultValue: false },
  label: { type: ControlType.String, title: 'Label', defaultValue: 'Enable notifications' },
  disabled: { type: ControlType.Boolean, title: 'Disabled', defaultValue: false },
  preset: {
    type: ControlType.Enum,
    title: 'Preset',
    options: ['zinc', 'slate', 'rose', 'midnight'],
    defaultValue: 'zinc',
  },
})
