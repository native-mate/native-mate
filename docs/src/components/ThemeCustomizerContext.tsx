'use client'

import React, { createContext, useContext, useState, useMemo } from 'react'
import { presets, resolveTokens } from '@native-mate/core'
import type { ThemePreset, ResolvedTheme } from '@native-mate/core'

export interface ThemeCustomizerState {
  preset: ThemePreset
  mode: 'light' | 'dark'
  colorOverrides: Record<string, string>   // any token key → hex value
  radiusMultiplier: number                 // 1.0 = default, 0 = sharp, 2.0 = very round
}

interface ThemeCustomizerContextValue {
  state: ThemeCustomizerState
  resolvedTheme: ResolvedTheme
  setPreset: (p: ThemePreset) => void
  setMode: (m: 'light' | 'dark') => void
  setColorOverride: (key: string, value: string) => void
  clearColorOverride: (key: string) => void
  resetColorOverrides: () => void
  setRadiusMultiplier: (v: number) => void
  reset: () => void
}

export const ThemeCustomizerContext = createContext<ThemeCustomizerContextValue | null>(null)

const DEFAULT: ThemeCustomizerState = {
  preset: 'zinc',
  mode: 'dark',
  colorOverrides: {},
  radiusMultiplier: 1,
}

export function ThemeCustomizerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ThemeCustomizerState>(DEFAULT)

  const resolvedTheme = useMemo((): ResolvedTheme => {
    const base = presets[state.preset]
    const baseResolved = resolveTokens(base, state.mode)
    const { colorOverrides, radiusMultiplier } = state

    const hasColors = Object.keys(colorOverrides).length > 0
    const hasRadius = radiusMultiplier !== 1

    if (!hasColors && !hasRadius) return baseResolved

    const colors = hasColors
      ? { ...baseResolved.colors, ...colorOverrides }
      : baseResolved.colors

    const radius = hasRadius
      ? Object.fromEntries(
          Object.entries(baseResolved.radius).map(([k, v]) => [
            k,
            k === 'full' ? v : Math.max(0, Math.round(v * radiusMultiplier)),
          ]),
        ) as ResolvedTheme['radius']
      : baseResolved.radius

    return { ...baseResolved, colors, radius }
  }, [state])

  return (
    <ThemeCustomizerContext.Provider value={{
      state,
      resolvedTheme,
      setPreset: (preset) => setState(s => ({ ...s, preset, colorOverrides: {} })),
      setMode: (mode) => setState(s => ({ ...s, mode })),
      setColorOverride: (key, value) =>
        setState(s => ({ ...s, colorOverrides: { ...s.colorOverrides, [key]: value } })),
      clearColorOverride: (key) =>
        setState(s => {
          const next = { ...s.colorOverrides }
          delete next[key]
          return { ...s, colorOverrides: next }
        }),
      resetColorOverrides: () => setState(s => ({ ...s, colorOverrides: {} })),
      setRadiusMultiplier: (radiusMultiplier) => setState(s => ({ ...s, radiusMultiplier })),
      reset: () => setState(DEFAULT),
    }}>
      {children}
    </ThemeCustomizerContext.Provider>
  )
}

export function useThemeCustomizer() {
  return useContext(ThemeCustomizerContext)
}
