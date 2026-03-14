import * as React from 'react'
import { addPropertyControls, ControlType } from 'framer'
import { presets, radius, type Preset } from '../tokens'

interface SkeletonProps {
  width: number
  height: number
  borderRadius: number
  preset: Preset
}

export function Skeleton({ width = 200, height = 16, borderRadius = radius.sm, preset = 'zinc' }: SkeletonProps) {
  const t = presets[preset]

  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: `linear-gradient(90deg, ${t.surface} 25%, ${t.border} 50%, ${t.surface} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s infinite',
      }}
    >
      <style>{`
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

addPropertyControls(Skeleton, {
  width: { type: ControlType.Number, title: 'Width', defaultValue: 200, min: 20, max: 600 },
  height: { type: ControlType.Number, title: 'Height', defaultValue: 16, min: 4, max: 200 },
  borderRadius: { type: ControlType.Number, title: 'Radius', defaultValue: radius.sm, min: 0, max: 100 },
  preset: {
    type: ControlType.Enum,
    title: 'Preset',
    options: ['zinc', 'slate', 'rose', 'midnight'],
    defaultValue: 'zinc',
  },
})
