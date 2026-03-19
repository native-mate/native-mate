'use client'

import React from 'react'
import { ThemeProvider as NativeMateThemeProvider, resolveTokens, presets } from '@native-mate/core'
import type { NativeMateTokenOverrides, ThemePreset } from '@native-mate/core'
import { useThemeCustomizer } from './ThemeCustomizerContext'

// Cast to avoid React version mismatch between @native-mate/core and docs
const ThemeProvider = NativeMateThemeProvider as React.FC<{
  preset?: ThemePreset
  forcedColorScheme?: 'light' | 'dark'
  overrides?: { light?: NativeMateTokenOverrides; dark?: NativeMateTokenOverrides }
  children: React.ReactNode
}>

/**
 * Wraps preview components with ThemeProvider.
 * When inside a ThemeCustomizerProvider the live customizer state is used;
 * otherwise falls back to zinc/dark.
 */
export function PreviewWrapper({ children }: { children: React.ReactNode }) {
  const customizer = useThemeCustomizer()

  if (!customizer) {
    return (
      <ThemeProvider preset="zinc" forcedColorScheme="dark">
        {children}
      </ThemeProvider>
    )
  }

  const { state } = customizer
  const { colorOverrides, radiusMultiplier, preset, mode } = state

  // Build color overrides (also auto-set onPrimary contrast if primary was overridden)
  const colors: Record<string, string> = { ...colorOverrides }
  if (colorOverrides['primary'] && !colorOverrides['onPrimary']) {
    colors['onPrimary'] = getLuminance(colorOverrides['primary']) > 0.5 ? '#000000' : '#ffffff'
  }

  // Build radius overrides: compute final values from base * multiplier
  const baseRadius = resolveTokens(presets[preset], mode).radius
  const radiusEntries = radiusMultiplier !== 1
    ? Object.fromEntries(
        Object.entries(baseRadius).map(([k, v]) => [
          k,
          k === 'full' ? v : Math.max(0, Math.round(v * radiusMultiplier)),
        ]),
      ) as NativeMateTokenOverrides['radius']
    : undefined

  const hasColors = Object.keys(colors).length > 0
  const hasRadius = !!radiusEntries

  const modeOverride: NativeMateTokenOverrides = {
    ...(hasColors && { colors: colors as NativeMateTokenOverrides['colors'] }),
    ...(hasRadius && { radius: radiusEntries }),
  }

  return (
    <ThemeProvider
      preset={preset}
      forcedColorScheme={mode}
      overrides={(hasColors || hasRadius) ? ({ [mode]: modeOverride } as { light?: NativeMateTokenOverrides; dark?: NativeMateTokenOverrides }) : undefined}
    >
      {children}
    </ThemeProvider>
  )
}

function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return 0.299 * r + 0.587 * g + 0.114 * b
}
