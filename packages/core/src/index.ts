// Theme
export { ThemeProvider } from './theme/ThemeProvider'
export { useTheme } from './theme/useTheme'
export { makeStyles } from './theme/makeStyles'

// Tokens
export { presets, resolveTokens, zinc, slate, rose, midnight } from './tokens'
export type {
  TokenSet, ResolvedTheme, ThemePreset,
  NativeMateConfig, NativeMateTokenOverrides,
  TokenColors, ColorToken, ResolvedColors,
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
export type { Breakpoint } from './utils/useBreakpoint'
