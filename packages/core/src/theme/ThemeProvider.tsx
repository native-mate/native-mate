import React, { useMemo } from 'react'
import { useColorScheme } from 'react-native'
import { ThemeContext } from './ThemeContext'
import { presets, resolveTokens } from '../tokens'
import type { ThemePreset, NativeMateTokenOverrides } from '../tokens/types'

interface ThemeProviderProps {
  preset?: ThemePreset
  forcedColorScheme?: 'light' | 'dark'
  overrides?: { light?: NativeMateTokenOverrides; dark?: NativeMateTokenOverrides }
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  preset = 'zinc',
  forcedColorScheme,
  overrides,
  children,
}) => {
  const systemColorScheme = useColorScheme()
  const mode = forcedColorScheme ?? systemColorScheme ?? 'light'
  const theme = useMemo(
    () => resolveTokens(presets[preset], mode, overrides?.[mode]),
    [preset, mode, overrides],
  )
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
