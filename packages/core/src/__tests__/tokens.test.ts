import { describe, it, expect } from 'vitest'
import { resolveTokens, normalizeOverrides, fontStyle, textLineHeight, zinc, slate, rose, midnight, presets } from '../tokens'

const POPPINS = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
}

describe('resolveTokens', () => {
  it('resolves zinc dark mode correctly', () => {
    const theme = resolveTokens(zinc, 'dark')
    expect(theme.colors.background).toBe('#070709')
    expect(theme.colors.foreground).toBe('#fafafa')
    expect(theme.colorScheme).toBe('dark')
  })

  it('resolves zinc light mode correctly', () => {
    const theme = resolveTokens(zinc, 'light')
    expect(theme.colors.background).toBe('#ffffff')
    expect(theme.colors.foreground).toBe('#09090b')
    expect(theme.colorScheme).toBe('light')
  })

  it('returns non-color tokens unchanged', () => {
    const theme = resolveTokens(zinc, 'dark')
    expect(theme.spacing.lg).toBe(16)
    expect(theme.spacing.xl).toBe(24)
    expect(theme.radius.md).toBe(10)
    expect(theme.typography.size.md).toBe(15)
    expect(theme.typography.weight.bold).toBe('700')
  })

  it('lineHeight values are absolute pixels, not multipliers', () => {
    const theme = resolveTokens(zinc, 'dark')
    expect(theme.typography.lineHeight.tight).toBe(18)
    expect(theme.typography.lineHeight.normal).toBe(22)
    expect(theme.typography.lineHeight.relaxed).toBe(28)
  })

  it('applies color overrides', () => {
    const theme = resolveTokens(zinc, 'dark', {
      colors: { primary: '#6366f1' },
    })
    expect(theme.colors.primary).toBe('#6366f1')
    expect(theme.colors.background).toBe('#070709') // unchanged
  })

  it('applies spacing overrides', () => {
    const theme = resolveTokens(zinc, 'dark', {
      spacing: { lg: 20 },
    })
    expect(theme.spacing.lg).toBe(20)
    expect(theme.spacing.sm).toBe(8) // unchanged
  })

  it('applies radius overrides', () => {
    const theme = resolveTokens(zinc, 'dark', {
      radius: { md: 8 },
    })
    expect(theme.radius.md).toBe(8)
    expect(theme.radius.full).toBe(9999) // unchanged
  })

  it('applies typography family overrides', () => {
    const theme = resolveTokens(zinc, 'dark', {
      typography: { family: POPPINS },
    })
    expect(theme.typography.family).toEqual(POPPINS)
    expect(theme.typography.size.md).toBe(15) // unchanged
    expect(theme.typography.weight.bold).toBe('700') // unchanged
  })

  it('typography.family is undefined when not overridden', () => {
    const theme = resolveTokens(zinc, 'dark')
    expect(theme.typography.family).toBeUndefined()
  })

  it('applies animation speed overrides', () => {
    const theme = resolveTokens(zinc, 'dark', {
      animation: { speed: { fast: 100 } },
    })
    expect(theme.animation.speed.fast).toBe(100)
    expect(theme.animation.speed.normal).toBe(250) // unchanged
  })
})

describe('normalizeOverrides', () => {
  it('returns undefined for undefined input', () => {
    expect(normalizeOverrides(undefined, 'light')).toBeUndefined()
  })

  it('picks the current mode from per-scheme overrides', () => {
    const perScheme = {
      light: { colors: { primary: '#111111' } },
      dark: { colors: { primary: '#222222' } },
    }
    expect(normalizeOverrides(perScheme, 'light')).toBe(perScheme.light)
    expect(normalizeOverrides(perScheme, 'dark')).toBe(perScheme.dark)
  })

  it('per-scheme overrides with only one scheme yield undefined for the other', () => {
    const perScheme = { dark: { colors: { primary: '#222222' } } }
    expect(normalizeOverrides(perScheme, 'light')).toBeUndefined()
    expect(normalizeOverrides(perScheme, 'dark')).toBe(perScheme.dark)
  })

  it('applies a flat overrides object to both modes', () => {
    const flat = { colors: { primary: '#0f766e' } }
    expect(normalizeOverrides(flat, 'light')).toBe(flat)
    expect(normalizeOverrides(flat, 'dark')).toBe(flat)
  })

  it('flat shape works end-to-end through resolveTokens', () => {
    const flat = { colors: { primary: '#0f766e' } }
    const light = resolveTokens(zinc, 'light', normalizeOverrides(flat, 'light'))
    const dark = resolveTokens(zinc, 'dark', normalizeOverrides(flat, 'dark'))
    expect(light.colors.primary).toBe('#0f766e')
    expect(dark.colors.primary).toBe('#0f766e')
  })
})

describe('fontStyle', () => {
  it('falls back to fontWeight when no family is set', () => {
    const theme = resolveTokens(zinc, 'light')
    expect(fontStyle(theme.typography, 'semibold')).toEqual({ fontWeight: '600' })
    expect(fontStyle(theme.typography, 'regular')).toEqual({ fontWeight: '400' })
  })

  it('resolves fontFamily and omits fontWeight when family is set', () => {
    const theme = resolveTokens(zinc, 'light', { typography: { family: POPPINS } })
    expect(fontStyle(theme.typography, 'semibold')).toEqual({ fontFamily: 'Poppins-SemiBold' })
    expect(fontStyle(theme.typography, 'bold')).toEqual({ fontFamily: 'Poppins-Bold' })
  })
})

describe('textLineHeight', () => {
  it('keeps the normal lineHeight for body-range sizes (unchanged behavior)', () => {
    const theme = resolveTokens(zinc, 'light')
    for (const size of [11, 13, 15, 17]) {
      expect(textLineHeight(theme.typography, size)).toBe(22)
    }
  })

  it('scales lineHeight above fontSize for large variants so text never clips', () => {
    const theme = resolveTokens(zinc, 'light')
    for (const size of [20, 24, 30]) {
      expect(textLineHeight(theme.typography, size)).toBeGreaterThan(size)
    }
  })
})

describe('info tokens', () => {
  it('every preset resolves info and onInfo in both modes', () => {
    for (const preset of Object.values(presets)) {
      for (const mode of ['light', 'dark'] as const) {
        const theme = resolveTokens(preset, mode)
        expect(theme.colors.info).toMatch(/^#/)
        expect(theme.colors.onInfo).toMatch(/^#/)
      }
    }
  })
})

describe('presets', () => {
  it('exports all 4 presets', () => {
    expect(presets).toHaveProperty('zinc')
    expect(presets).toHaveProperty('slate')
    expect(presets).toHaveProperty('rose')
    expect(presets).toHaveProperty('midnight')
  })

  it('slate dark background differs from zinc', () => {
    const zincTheme = resolveTokens(zinc, 'dark')
    const slateTheme = resolveTokens(slate, 'dark')
    expect(slateTheme.colors.background).not.toBe(zincTheme.colors.background)
  })

  it('rose primary differs from zinc primary in dark mode', () => {
    const zincTheme = resolveTokens(zinc, 'dark')
    const roseTheme = resolveTokens(rose, 'dark')
    expect(roseTheme.colors.primary).not.toBe(zincTheme.colors.primary)
  })

  it('all presets share same spacing, radius, and typography', () => {
    const zincTheme = resolveTokens(zinc, 'dark')
    const midnightTheme = resolveTokens(midnight, 'dark')
    expect(midnightTheme.spacing).toEqual(zincTheme.spacing)
    expect(midnightTheme.radius).toEqual(zincTheme.radius)
    expect(midnightTheme.typography).toEqual(zincTheme.typography)
  })

  it('every preset color token resolves to a hex string', () => {
    for (const preset of Object.values(presets)) {
      const theme = resolveTokens(preset, 'dark')
      for (const [key, value] of Object.entries(theme.colors)) {
        expect(typeof value).toBe('string')
        expect(value.startsWith('#')).toBe(true)
      }
    }
  })
})
