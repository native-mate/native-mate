import { describe, it, expect } from 'vitest'
import { zinc, slate, rose, midnight, resolveTokens, normalizeOverrides, fontStyle, presets } from '../src/tokens'

describe('token presets', () => {
  it('zinc has correct values', () => {
    expect(zinc.spacing.md).toBe(12)
    expect(zinc.radius.full).toBe(9999)
    expect(zinc.typography.size.md).toBe(15)
    expect(zinc.animation.speed.fast).toBe(150)
    expect(zinc.typography.lineHeight.normal).toBe(22)
  })

  it('resolveTokens light mode', () => {
    const theme = resolveTokens(zinc, 'light')
    expect(theme.colors.background).toBe('#ffffff')
    expect(theme.colorScheme).toBe('light')
  })

  it('resolveTokens dark mode', () => {
    const theme = resolveTokens(zinc, 'dark')
    expect(theme.colors.background).toBe('#070709')
    expect(theme.colorScheme).toBe('dark')
  })

  it('resolveTokens applies overrides', () => {
    const theme = resolveTokens(zinc, 'light', { colors: { background: '#ff0000' } })
    expect(theme.colors.background).toBe('#ff0000')
    expect(theme.colors.primary).toBe('#18181b') // unaffected
  })

  it('all 4 presets are valid', () => {
    for (const preset of Object.values(presets)) {
      expect(preset.spacing.md).toBe(12)
      expect(preset.radius.full).toBe(9999)
      expect(preset.colors.background.light).toBeTruthy()
      expect(preset.colors.background.dark).toBeTruthy()
    }
  })

  it('slate, rose, midnight share non-color tokens with zinc', () => {
    expect(slate.spacing).toEqual(zinc.spacing)
    expect(rose.radius).toEqual(zinc.radius)
    expect(midnight.animation).toEqual(zinc.animation)
  })
})

describe('0.2.0 token features', () => {
  it('all presets carry overlay, input, and ring in both modes', () => {
    for (const preset of Object.values(presets)) {
      for (const key of ['overlay', 'input', 'ring'] as const) {
        expect(preset.colors[key].light).toBeTruthy()
        expect(preset.colors[key].dark).toBeTruthy()
      }
    }
  })

  it('resolved theme exposes *Foreground aliases mirroring on* tokens', () => {
    const theme = resolveTokens(zinc, 'light')
    expect(theme.colors.primaryForeground).toBe(theme.colors.onPrimary)
    expect(theme.colors.destructiveForeground).toBe(theme.colors.onDestructive)
    expect(theme.colors.successForeground).toBe(theme.colors.onSuccess)
    expect(theme.colors.warningForeground).toBe(theme.colors.onWarning)
    expect(theme.colors.mutedForeground).toBe(theme.colors.muted)
  })

  it('alias overrides apply to the canonical token and stay mirrored', () => {
    const theme = resolveTokens(zinc, 'light', { colors: { primaryForeground: '#123456' } })
    expect(theme.colors.onPrimary).toBe('#123456')
    expect(theme.colors.primaryForeground).toBe('#123456')
  })

  it('canonical override wins when both spellings are given', () => {
    const theme = resolveTokens(zinc, 'light', {
      colors: { onPrimary: '#111111', primaryForeground: '#222222' },
    })
    expect(theme.colors.onPrimary).toBe('#111111')
    expect(theme.colors.primaryForeground).toBe('#111111')
  })

  it('normalizeOverrides applies a flat set to both modes', () => {
    const flat = { colors: { primary: '#0e8c7f' } }
    expect(normalizeOverrides(flat, 'light')).toBe(flat)
    expect(normalizeOverrides(flat, 'dark')).toBe(flat)
  })

  it('normalizeOverrides picks the per-scheme set', () => {
    const perScheme = {
      light: { colors: { primary: '#111111' } },
      dark: { colors: { primary: '#222222' } },
    }
    expect(normalizeOverrides(perScheme, 'light')).toBe(perScheme.light)
    expect(normalizeOverrides(perScheme, 'dark')).toBe(perScheme.dark)
  })

  it('typography.family override flows into the resolved theme', () => {
    const family = {
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semibold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
    }
    const theme = resolveTokens(zinc, 'light', { typography: { family } })
    expect(theme.typography.family).toEqual(family)
    expect(theme.typography.size.md).toBe(15)
  })

  it('fontStyle emits fontFamily (and no fontWeight) when family is themed', () => {
    const family = {
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semibold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
    }
    const themed = resolveTokens(zinc, 'light', { typography: { family } })
    expect(fontStyle(themed.typography, 'semibold')).toEqual({ fontFamily: 'Poppins-SemiBold' })
    const system = resolveTokens(zinc, 'light')
    expect(fontStyle(system.typography, 'semibold')).toEqual({ fontWeight: '600' })
  })
})
