import type { TokenSet, ResolvedTheme, NativeMateTokenOverrides, ThemeOverrides, FontWeightKey } from './types'
import { zinc } from './presets/zinc'
import { slate } from './presets/slate'
import { rose } from './presets/rose'
import { midnight } from './presets/midnight'

export { zinc, slate, rose, midnight }
export * from './types'

export const presets = { zinc, slate, rose, midnight } as const

// Docs-canonical *Foreground spellings → the on* tokens they mirror. The
// resolved theme carries both keys; overrides accept either (canonical wins
// when both are given).
export const COLOR_ALIASES = {
  primaryForeground: 'onPrimary',
  destructiveForeground: 'onDestructive',
  successForeground: 'onSuccess',
  warningForeground: 'onWarning',
  mutedForeground: 'muted',
} as const

const canonicalizeColorOverrides = (
  colors: Partial<ResolvedTheme['colors']>,
): Record<string, string> => {
  const out: Record<string, string> = { ...(colors as Record<string, string>) }
  for (const [alias, canonical] of Object.entries(COLOR_ALIASES)) {
    if (out[alias] !== undefined && out[canonical] === undefined) out[canonical] = out[alias]
    delete out[alias]
  }
  return out
}

const withColorAliases = (colors: Record<string, string>): ResolvedTheme['colors'] => {
  for (const [alias, canonical] of Object.entries(COLOR_ALIASES)) {
    colors[alias] = colors[canonical]
  }
  return colors as unknown as ResolvedTheme['colors']
}

export function resolveTokens(
  preset: TokenSet,
  mode: 'light' | 'dark',
  overrides?: NativeMateTokenOverrides,
): ResolvedTheme {
  const resolvedColors = Object.fromEntries(
    Object.entries(preset.colors).map(([key, token]) => [key, token[mode]])
  ) as Record<string, string>

  const colors = withColorAliases(
    overrides?.colors
      ? { ...resolvedColors, ...canonicalizeColorOverrides(overrides.colors) }
      : resolvedColors,
  )
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

// Body-range sizes keep the normal lineHeight; larger sizes scale at 1.3× so
// ascenders/descenders never clip (fontSize > lineHeight clips, worst on Android).
export function textLineHeight(
  typography: ResolvedTheme['typography'],
  fontSize: number,
): number {
  return Math.max(typography.lineHeight.normal, Math.round(fontSize * 1.3))
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
