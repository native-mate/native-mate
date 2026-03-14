import * as React from 'react'
import { addPropertyControls, ControlType } from 'framer'
import { presets, radius, spacing, type Preset } from '../tokens'

interface CheckboxProps {
  checked: boolean
  label: string
  disabled: boolean
  preset: Preset
}

export function Checkbox({
  checked = false,
  label = 'Checkbox label',
  disabled = false,
  preset = 'zinc',
}: CheckboxProps) {
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
          width: 18,
          height: 18,
          borderRadius: radius.sm,
          border: `2px solid ${checked ? t.primary : t.border}`,
          background: checked ? t.primary : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.15s, border-color 0.15s',
        }}
      >
        {checked && (
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            style={{ display: 'block' }}
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke={t.primaryForeground}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label && (
        <span style={{ fontSize: 14, color: t.foreground, lineHeight: 1 }}>{label}</span>
      )}
    </div>
  )
}

addPropertyControls(Checkbox, {
  checked: { type: ControlType.Boolean, title: 'Checked', defaultValue: false },
  label: { type: ControlType.String, title: 'Label', defaultValue: 'Checkbox label' },
  disabled: { type: ControlType.Boolean, title: 'Disabled', defaultValue: false },
  preset: {
    type: ControlType.Enum,
    title: 'Preset',
    options: ['zinc', 'slate', 'rose', 'midnight'],
    defaultValue: 'zinc',
  },
})
