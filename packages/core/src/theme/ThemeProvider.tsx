import React, { useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { ThemeContext } from './ThemeContext'
import { presets, resolveTokens, normalizeOverrides, collapseMotion } from '../tokens'
import { useReducedMotion } from '../utils/useReducedMotion'
import { HapticsEnabledContext } from '../utils/useHaptics'
import { StringsContext } from '../i18n/StringsContext'
import { mergeStrings } from '../i18n/strings'
import type { NativeMateStrings } from '../i18n/strings'
import type { ThemePreset, ThemeOverrides } from '../tokens/types'

interface ThemeProviderProps {
  preset?: ThemePreset
  forcedColorScheme?: 'light' | 'dark'
  overrides?: ThemeOverrides
  // When the OS reduce-motion setting is on, animation.speed collapses to 0 so
  // timing-based animations across the registry become instant. Opt out per app.
  respectReducedMotion?: boolean
  /** App-wide haptics kill switch. Components can still opt out individually. */
  haptics?: boolean
  /** Overrides for the library's user-facing copy, merged over English. */
  strings?: Partial<NativeMateStrings>
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  preset = 'zinc',
  forcedColorScheme,
  overrides,
  respectReducedMotion = true,
  haptics = true,
  strings,
  children,
}) => {
  const systemColorScheme = useColorScheme()
  const mode = forcedColorScheme ?? systemColorScheme ?? 'light'
  // Overrides are small plain-JSON objects; keying the memo on their content
  // keeps the theme referentially stable when callers pass them inline, so a
  // parent re-render doesn't restyle the whole app.
  const overridesKey = overrides ? JSON.stringify(overrides) : ''
  const reducedMotion = useReducedMotion()
  const theme = useMemo(() => {
    const resolved = resolveTokens(presets[preset], mode, normalizeOverrides(overrides, mode))
    return respectReducedMotion && reducedMotion ? collapseMotion(resolved) : resolved
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, mode, overridesKey, respectReducedMotion, reducedMotion])
  const resolvedStrings = useMemo(() => mergeStrings(strings), [strings])

  return (
    <ThemeContext.Provider value={theme}>
      <StringsContext.Provider value={resolvedStrings}>
        <HapticsEnabledContext.Provider value={haptics}>
          {children}
        </HapticsEnabledContext.Provider>
      </StringsContext.Provider>
    </ThemeContext.Provider>
  )
}
