import { describe, it, expect } from 'vitest'
import { withAlpha } from '../utils/withAlpha'

describe('withAlpha', () => {
  it('handles 6-digit hex (the old string-concat case)', () => {
    expect(withAlpha('#18181b', 0.1)).toBe('rgba(24, 24, 27, 0.1)')
  })

  it('handles 3-digit hex', () => {
    expect(withAlpha('#fff', 0.5)).toBe('rgba(255, 255, 255, 0.5)')
  })

  it('multiplies into an existing 8-digit hex alpha', () => {
    expect(withAlpha('#00000080', 0.5)).toBe('rgba(0, 0, 0, 0.251)')
  })

  it('handles rgb() and rgba() brand overrides', () => {
    expect(withAlpha('rgb(255, 0, 0)', 0.2)).toBe('rgba(255, 0, 0, 0.2)')
    expect(withAlpha('rgba(0, 128, 255, 0.5)', 0.5)).toBe('rgba(0, 128, 255, 0.25)')
  })

  it('handles named colors', () => {
    expect(withAlpha('white', 0.25)).toBe('rgba(255, 255, 255, 0.25)')
    expect(withAlpha('transparent', 1)).toBe('rgba(0, 0, 0, 0)')
  })

  it('clamps alpha to 0..1', () => {
    expect(withAlpha('#000000', 5)).toBe('rgba(0, 0, 0, 1)')
    expect(withAlpha('#000000', -2)).toBe('rgba(0, 0, 0, 0)')
  })

  it('returns the original color when it cannot be parsed', () => {
    expect(withAlpha('rebeccapurple', 0.5)).toBe('rebeccapurple')
    expect(withAlpha('#12', 0.5)).toBe('#12')
  })
})
