import type { TokenSet, ResolvedTheme, NativeMateTokenOverrides, ThemeOverrides, FontWeightKey } from './types'
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
  const typography = overrides?.typography?.family
    ? { ...preset.typography, family: overrides.typography.family }
    : preset.typography
  const animation = overrides?.animation?.speed
    ? { ...preset.animation, speed: { ...preset.animation.speed, ...overrides.animation.speed } }
    : preset.animation

  return { colors, spacing, radius, typography, animation, colorScheme: mode }
}

// A flat override set (no light/dark keys) applies to both color schemes.
export function normalizeOverrides(
  overrides: ThemeOverrides | undefined,
  mode: 'light' | 'dark',
): NativeMateTokenOverrides | undefined {
  if (!overrides) return undefined
  if ('light' in overrides || 'dark' in overrides) {
    return (overrides as { light?: NativeMateTokenOverrides; dark?: NativeMateTokenOverrides })[mode]
  }
  return overrides as NativeMateTokenOverrides
}

// When a font family is themed, Android needs the per-weight family name alone —
// pairing it with fontWeight makes Android fall back to a synthetic weight.
export function fontStyle(
  typography: ResolvedTheme['typography'],
  weight: FontWeightKey,
): { fontFamily: string } | { fontWeight: string } {
  return typography.family
    ? { fontFamily: typography.family[weight] }
    : { fontWeight: typography.weight[weight] }
}
