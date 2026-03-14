import { Platform } from 'react-native'
import { shadow } from '../utils/platform'

describe('shadow()', () => {
  it('returns elevation on Android', () => {
    Object.defineProperty(Platform, 'OS', { get: () => 'android', configurable: true })
    const s = shadow(2)
    expect(s).toHaveProperty('elevation')
    expect((s as { elevation: number }).elevation).toBe(4)
  })

  it('returns shadowColor and shadowOffset on iOS', () => {
    Object.defineProperty(Platform, 'OS', { get: () => 'ios', configurable: true })
    const s = shadow(1)
    expect(s).toHaveProperty('shadowColor')
    expect(s).toHaveProperty('shadowOffset')
    expect(s).toHaveProperty('shadowOpacity')
    expect(s).toHaveProperty('shadowRadius')
  })

  it('level 1 has lower shadow than level 4', () => {
    Object.defineProperty(Platform, 'OS', { get: () => 'android', configurable: true })
    const s1 = shadow(1) as { elevation: number }
    const s4 = shadow(4) as { elevation: number }
    expect(s4.elevation).toBeGreaterThan(s1.elevation)
  })

  it('returns elevation object on non-ios (android fallback)', () => {
    Object.defineProperty(Platform, 'OS', { get: () => 'android', configurable: true })
    const s = shadow(3) as { elevation: number }
    expect(s.elevation).toBe(8)
  })
})
