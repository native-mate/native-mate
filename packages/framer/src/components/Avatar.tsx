import * as React from 'react'
import { addPropertyControls, ControlType } from 'framer'
import { presets, typography, type Preset } from '../tokens'

interface AvatarProps {
  initials: string
  size: number
  preset: Preset
}

export function Avatar({ initials = 'AB', size = 40, preset = 'zinc' }: AvatarProps) {
  const t = presets[preset]
  const fontSize = size * 0.38

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: t.surface,
        border: `1px solid ${t.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontSize,
        fontWeight: typography.weight.semibold,
        color: t.foreground,
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  )
}

addPropertyControls(Avatar, {
  initials: { type: ControlType.String, title: 'Initials', defaultValue: 'AB' },
  size: { type: ControlType.Number, title: 'Size', defaultValue: 40, min: 24, max: 96, step: 4 },
  preset: {
    type: ControlType.Enum,
    title: 'Preset',
    options: ['zinc', 'slate', 'rose', 'midnight'],
    defaultValue: 'zinc',
  },
})
