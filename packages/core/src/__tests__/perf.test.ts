import { describe, it, expect } from 'vitest'
import { resolveTokens, zinc, slate, rose, midnight, presets } from '../tokens'

describe('performance', () => {
  it('resolveTokens runs 10,000 times under 200ms', () => {
    const start = performance.now()
    for (let i = 0; i < 10_000; i++) {
      resolveTokens(zinc, i % 2 === 0 ? 'dark' : 'light')
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(200)
  })

  it('resolveTokens with overrides runs 10,000 times under 300ms', () => {
    const overrides = { colors: { primary: '#6366f1' }, spacing: { lg: 20 } }
    const start = performance.now()
    for (let i = 0; i < 10_000; i++) {
      resolveTokens(zinc, 'dark', overrides)
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(300)
  })

  it('all 4 presets × 2 modes (80,000 calls) under 1s', () => {
    const allPresets = [zinc, slate, rose, midnight]
    const start = performance.now()
    for (let i = 0; i < 10_000; i++) {
      for (const preset of allPresets) {
        resolveTokens(preset, 'dark')
        resolveTokens(preset, 'light')
      }
    }
    const elapsed = performance.now() - start
    expect(elapsed).toBeLessThan(1000)
  })

  it('resolved theme object is consistently shaped', () => {
    const theme = resolveTokens(zinc, 'dark')
    const colorKeys = Object.keys(theme.colors)
    // Verify across all presets
    for (const preset of Object.values(presets)) {
      const t = resolveTokens(preset, 'dark')
      expect(Object.keys(t.colors).sort()).toEqual(colorKeys.sort())
    }
  })
})
