import { zinc, slate, rose, midnight, resolveTokens, presets } from '../src/tokens'

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
