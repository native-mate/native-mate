import * as React from 'react'
import { addPropertyControls, ControlType } from 'framer'
import { presets, radius, spacing, typography, type Preset } from '../tokens'

interface TabsProps {
  tabs: string
  activeIndex: number
  preset: Preset
}

export function Tabs({ tabs = 'Overview,Analytics,Settings', activeIndex = 0, preset = 'zinc' }: TabsProps) {
  const t = presets[preset]
  const tabList = tabs.split(',').map((s) => s.trim()).filter(Boolean)

  return (
    <div
      style={{
        display: 'flex',
        gap: 2,
        padding: 4,
        background: t.surface,
        borderRadius: radius.md,
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        border: `1px solid ${t.border}`,
      }}
    >
      {tabList.map((tab, i) => {
        const isActive = i === activeIndex
        return (
          <div
            key={i}
            style={{
              paddingLeft: spacing.md,
              paddingRight: spacing.md,
              paddingTop: spacing.sm,
              paddingBottom: spacing.sm,
              borderRadius: radius.sm,
              background: isActive ? t.background : 'transparent',
              color: isActive ? t.foreground : t.mutedForeground,
              fontSize: typography.size.sm,
              fontWeight: isActive ? typography.weight.semibold : typography.weight.regular,
              cursor: 'pointer',
              transition: 'all 0.15s',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {tab}
          </div>
        )
      })}
    </div>
  )
}

addPropertyControls(Tabs, {
  tabs: { type: ControlType.String, title: 'Tabs', defaultValue: 'Overview,Analytics,Settings' },
  activeIndex: { type: ControlType.Number, title: 'Active', defaultValue: 0, min: 0, step: 1 },
  preset: {
    type: ControlType.Enum,
    title: 'Preset',
    options: ['zinc', 'slate', 'rose', 'midnight'],
    defaultValue: 'zinc',
  },
})
