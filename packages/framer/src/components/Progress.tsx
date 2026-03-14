import * as React from 'react'
import { addPropertyControls, ControlType } from 'framer'
import { presets, radius, type Preset } from '../tokens'

interface ProgressProps {
  value: number
  variant: 'linear' | 'circular'
  preset: Preset
}

export function Progress({ value = 60, variant = 'linear', preset = 'zinc' }: ProgressProps) {
  const t = presets[preset]
  const pct = Math.max(0, Math.min(100, value))

  if (variant === 'circular') {
    const size = 64
    const stroke = 6
    const r = (size - stroke) / 2
    const circumference = 2 * Math.PI * r
    const offset = circumference - (pct / 100) * circumference

    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={t.border} strokeWidth={stroke} />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={t.primary}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <span style={{ fontSize: 12, color: t.mutedForeground, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
          {pct}%
        </span>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div
        style={{
          width: '100%',
          height: 8,
          background: t.border,
          borderRadius: radius.full,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: t.primary,
            borderRadius: radius.full,
            transition: 'width 0.3s',
          }}
        />
      </div>
    </div>
  )
}

addPropertyControls(Progress, {
  value: { type: ControlType.Number, title: 'Value', defaultValue: 60, min: 0, max: 100, step: 1 },
  variant: {
    type: ControlType.Enum,
    title: 'Variant',
    options: ['linear', 'circular'],
    defaultValue: 'linear',
  },
  preset: {
    type: ControlType.Enum,
    title: 'Preset',
    options: ['zinc', 'slate', 'rose', 'midnight'],
    defaultValue: 'zinc',
  },
})
