import { describe, it, expect } from 'vitest'
import { resolveTokens, zinc, slate, rose, midnight, presets } from '../tokens'

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

  it('applies animation speed overrides', () => {
    const theme = resolveTokens(zinc, 'dark', {
      animation: { speed: { fast: 100 } },
    })
    expect(theme.animation.speed.fast).toBe(100)
    expect(theme.animation.speed.normal).toBe(250) // unchanged
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
