// native-mate: icon@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@native-mate/core'
import type { IconProps, IconSize, IconColor } from './icon.types'

// ─── Size map ──────────────────────────────────────────────────────────────────

const SIZE_MAP: Record<Exclude<IconSize, number>, number> = {
  xs:   12,
  sm:   16,
  md:   20,
  lg:   24,
  xl:   32,
  '2xl': 40,
}

function resolveSize(size: IconSize): number {
  return typeof size === 'number' ? size : SIZE_MAP[size]
}

// ─── Color resolution ──────────────────────────────────────────────────────────

function resolveColor(color: IconColor, colors: Record<string, string>): string {
  const TOKEN_MAP: Record<string, string> = {
    foreground:  colors.foreground  ?? '#fafafa',
    muted:       colors.muted       ?? '#71717a',
    primary:     colors.primary     ?? '#6366f1',
    destructive: colors.destructive ?? '#ef4444',
    success:     colors.success     ?? '#22c55e',
    warning:     colors.warning     ?? '#f59e0b',
    border:      colors.border      ?? '#27272a',
  }
  return TOKEN_MAP[color] ?? color
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'foreground',
  opacity = 1,
  style,
  accessibilityLabel,
  decorative = true,
}) => {
  const theme = useTheme()
  const resolvedSize  = resolveSize(size)
  const resolvedColor = resolveColor(color, theme.colors as Record<string, string>)

  return (
    <Ionicons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name={name as any}
      size={resolvedSize}
      color={resolvedColor}
      style={[{ opacity }, style] as any}
      accessibilityLabel={decorative ? undefined : accessibilityLabel}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'auto'}
    />
  )
}
