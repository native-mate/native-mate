import { useMemo } from 'react'
import { useTheme } from '../theme/useTheme'
import { useReducedMotion } from './useReducedMotion'
import type { ResolvedTheme } from '../tokens/types'

export type SpeedKey = keyof ResolvedTheme['animation']['speed']

export interface Motion {
  /** OS reduce-motion is on: skip infinite loops, render final states. */
  reduced: boolean
  /** Timing config for a speed token — duration 0 when motion is reduced. */
  timing: (speed?: SpeedKey) => { duration: number }
  /** Spring config from tokens — near-instant when motion is reduced. */
  spring: () => { damping: number; stiffness: number; mass: number }
  /** Repeat count for looping animations: 1 (single pass) when reduced, else -1. */
  loops: (count?: number) => number
}

// One place for every component to ask "may I animate, and how fast?".
// Durations come from animation.speed tokens, so a ThemeProvider that collapsed
// them for reduced motion already yields 0 here too.
export function useMotion(): Motion {
  const theme = useTheme()
  const reduced = useReducedMotion()

  return useMemo(() => {
    const { speed, easing } = theme.animation
    return {
      reduced,
      timing: (key: SpeedKey = 'normal') => ({ duration: reduced ? 0 : speed[key] }),
      spring: () =>
        reduced
          ? { damping: 100, stiffness: 1000, mass: 0.1 }
          : { ...easing.spring },
      loops: (count = -1) => (reduced ? 1 : count),
    }
  }, [theme, reduced])
}
