import { describe, it, expect } from 'vitest'
import { readableOn, relativeLuminance } from '../utils/readableOn'

describe('readableOn', () => {
  it('picks dark text on light fills', () => {
    expect(readableOn('#ffffff')).toBe('#111111')
    expect(readableOn('#fbbf24')).toBe('#111111') // amber
    expect(readableOn('#4ade80')).toBe('#111111') // light green
  })

  it('picks light text on dark fills', () => {
    expect(readableOn('#000000')).toBe('#ffffff')
    expect(readableOn('#18181b')).toBe('#ffffff') // zinc primary (light mode)
    expect(readableOn('#e11d48')).toBe('#ffffff') // rose
  })

  it('handles rgb() and named colors', () => {
    expect(readableOn('rgb(255,255,255)')).toBe('#111111')
    expect(readableOn('black')).toBe('#ffffff')
  })

  it('assumes a dark accent fill when the color cannot be parsed', () => {
    expect(readableOn('rebeccapurple')).toBe('#ffffff')
  })

  it('relativeLuminance matches known values', () => {
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5)
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5)
    expect(relativeLuminance('nonsense')).toBeNull()
  })
})
