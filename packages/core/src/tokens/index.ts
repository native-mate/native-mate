import type { TokenSet, ResolvedTheme, NativeMateTokenOverrides } from './types'
import { zinc } from './presets/zinc'
import { slate } from './presets/slate'
import { rose } from './presets/rose'
import { midnight } from './presets/midnight'

export { zinc, slate, rose, midnight }
export * from './types'

export const presets = { zinc, slate, rose, midnight } as const

export function resolveTokens(
  preset: TokenSet,
  mode: 'light' | 'dark',
  overrides?: NativeMateTokenOverrides,
): ResolvedTheme {
  const resolvedColors = Object.fromEntries(
    Object.entries(preset.colors).map(([key, token]) => [key, token[mode]])
  ) as ResolvedTheme['colors']

  const colors = overrides?.colors ? { ...resolvedColors, ...overrides.colors } : resolvedColors
  const spacing = overrides?.spacing ? { ...preset.spacing, ...overrides.spacing } : preset.spacing
  const radius = overrides?.radius ? { ...preset.radius, ...overrides.radius } : preset.radius
  const animation = overrides?.animation?.speed
    ? { ...preset.animation, speed: { ...preset.animation.speed, ...overrides.animation.speed } }
    : preset.animation

  return { colors, spacing, radius, typography: preset.typography, animation, colorScheme: mode }
}
