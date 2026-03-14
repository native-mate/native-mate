export interface ColorToken {
  light: string
  dark: string
}

export interface TokenColors {
  background: ColorToken
  surface: ColorToken
  surfaceRaised: ColorToken
  border: ColorToken
  primary: ColorToken
  onPrimary: ColorToken
  foreground: ColorToken
  onBackground: ColorToken
  onSurface: ColorToken
  muted: ColorToken
  destructive: ColorToken
  onDestructive: ColorToken
  success: ColorToken
  onSuccess: ColorToken
  warning: ColorToken
  onWarning: ColorToken
}

export interface TokenSet {
  colors: TokenColors
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; '2xl': number; '3xl': number }
  radius: { sm: number; md: number; lg: number; xl: number; full: number }
  typography: {
    size: { xs: number; sm: number; md: number; lg: number; xl: number; '2xl': number; '3xl': number }
    weight: { regular: string; medium: string; semibold: string; bold: string }
    lineHeight: { tight: number; normal: number; relaxed: number }
  }
  animation: {
    speed: { fast: number; normal: number; slow: number }
    easing: {
      standard: readonly [number, number, number, number]
      decelerate: readonly [number, number, number, number]
      spring: { damping: number; stiffness: number; mass: number }
    }
  }
}

export type ResolvedColors = { [K in keyof TokenColors]: string }

export interface ResolvedTheme {
  colors: ResolvedColors
  spacing: TokenSet['spacing']
  radius: TokenSet['radius']
  typography: TokenSet['typography']
  animation: TokenSet['animation']
  colorScheme: 'light' | 'dark'
}

export type ThemePreset = 'zinc' | 'slate' | 'rose' | 'midnight'

export interface NativeMateTokenOverrides {
  colors?: Partial<ResolvedColors>
  spacing?: Partial<TokenSet['spacing']>
  radius?: Partial<TokenSet['radius']>
  animation?: { speed?: Partial<TokenSet['animation']['speed']> }
}

export interface NativeMateConfig {
  theme: ThemePreset
  componentsDir: string
  registry: string
  tokens?: {
    light?: NativeMateTokenOverrides
    dark?: NativeMateTokenOverrides
  }
}
