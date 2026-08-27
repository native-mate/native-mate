// Theme
export { ThemeProvider } from './theme/ThemeProvider'
export { useTheme } from './theme/useTheme'
export { makeStyles } from './theme/makeStyles'

// Tokens
export { presets, resolveTokens, normalizeOverrides, fontStyle, textLineHeight, collapseMotion, monoFontFamily, zinc, slate, rose, midnight } from './tokens'
export type {
  TokenSet, ResolvedTheme, ThemePreset,
  NativeMateConfig, NativeMateTokenOverrides, ThemeOverrides,
  TokenColors, ColorToken, ResolvedColors,
  FontFamilyTokens, FontWeightKey,
} from './tokens/types'

// Primitives
export { Text } from './primitives/Text/Text'
export { Icon } from './primitives/Icon/Icon'
export { Spinner } from './primitives/Spinner/Spinner'
export { Separator } from './primitives/Separator/Separator'
export type { TextProps, TextVariant, TextSize, TextWeight } from './primitives/Text/Text.types'
export type { IconProps } from './primitives/Icon/Icon.types'
export type { SpinnerProps } from './primitives/Spinner/Spinner.types'
export type { SeparatorProps } from './primitives/Separator/Separator.types'

// Utils
export { shadow } from './utils/platform'
export { useBreakpoint } from './utils/useBreakpoint'
export { useReducedMotion } from './utils/useReducedMotion'
export { useMotion } from './utils/useMotion'
export type { Motion, SpeedKey } from './utils/useMotion'
export { withAlpha, parseColor } from './utils/withAlpha'
export { readableOn, relativeLuminance } from './utils/readableOn'

// Shared prop contracts (v0.5)
export type { ErrorProp, HapticProp, HapticStyle, IconProp } from './types/props'
export { resolveError, resolveHaptic } from './types/props'
export { useHaptics, HapticsEnabledContext } from './utils/useHaptics'
export type { HapticsApi } from './utils/useHaptics'
export { devWarn, deprecatedProp } from './utils/devWarn'

// i18n
export { useStrings, StringsContext } from './i18n/StringsContext'
export { defaultStrings, mergeStrings } from './i18n/strings'
export type { NativeMateStrings } from './i18n/strings'

// RTL
export { isRTL, directionalIcon, useDirection } from './utils/direction'
export type { Breakpoint } from './utils/useBreakpoint'
