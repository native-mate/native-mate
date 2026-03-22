import { describe, it, expect } from 'vitest'
import { defaultTheme, ThemeContext } from '../theme/ThemeContext'
import { resolveTokens, zinc, presets } from '../tokens'

describe('ThemeContext', () => {
  it('defaultTheme is zinc light', () => {
    const expected = resolveTokens(zinc, 'light')
    expect(defaultTheme.colorScheme).toBe('light')
    expect(defaultTheme.colors.background).toBe(expected.colors.background)
    expect(defaultTheme.colors.foreground).toBe(expected.colors.foreground)
  })

  it('defaultTheme has all required token categories', () => {
    expect(defaultTheme).toHaveProperty('colors')
    expect(defaultTheme).toHaveProperty('spacing')
    expect(defaultTheme).toHaveProperty('radius')
    expect(defaultTheme).toHaveProperty('typography')
    expect(defaultTheme).toHaveProperty('animation')
    expect(defaultTheme).toHaveProperty('colorScheme')
  })

  it('ThemeContext is a valid React context', () => {
    expect(ThemeContext).toHaveProperty('Provider')
    expect(ThemeContext).toHaveProperty('Consumer')
  })
})

describe('ThemeProvider logic', () => {
  it('forcedColorScheme dark resolves dark tokens', () => {
    const theme = resolveTokens(presets.zinc, 'dark')
    expect(theme.colorScheme).toBe('dark')
    expect(theme.colors.background).toBe('#070709')
  })

  it('forcedColorScheme light resolves light tokens', () => {
    const theme = resolveTokens(presets.zinc, 'light')
    expect(theme.colorScheme).toBe('light')
    expect(theme.colors.background).toBe('#ffffff')
  })

  it('each preset resolves to different primary colors', () => {
    const themes = Object.entries(presets).map(([name, preset]) => ({
      name,
      primary: resolveTokens(preset, 'dark').colors.primary,
    }))
    const primaries = new Set(themes.map((t) => t.primary))
    // At least 3 unique primaries across 4 presets (zinc and slate may share)
    expect(primaries.size).toBeGreaterThanOrEqual(3)
  })

  it('overrides are applied per-mode', () => {
    const darkOverrides = { colors: { primary: '#ff0000' } }
    const darkTheme = resolveTokens(presets.zinc, 'dark', darkOverrides)
    const lightTheme = resolveTokens(presets.zinc, 'light')
    expect(darkTheme.colors.primary).toBe('#ff0000')
    expect(lightTheme.colors.primary).not.toBe('#ff0000')
  })
})
