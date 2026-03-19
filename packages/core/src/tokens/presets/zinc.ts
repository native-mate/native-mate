import type { TokenSet } from '../types'

export const zinc: TokenSet = {
  colors: {
    background:    { light: '#ffffff', dark: '#070709' },
    surface:       { light: '#e4e4e7', dark: '#0f0f11' },
    surfaceRaised: { light: '#f4f4f5', dark: '#161619' },
    border:        { light: '#d4d4d8', dark: '#252529' },
    primary:       { light: '#18181b', dark: '#fafafa' },
    onPrimary:     { light: '#fafafa', dark: '#18181b' },
    foreground:    { light: '#09090b', dark: '#fafafa' },
    onBackground:  { light: '#09090b', dark: '#fafafa' },
    onSurface:     { light: '#18181b', dark: '#e4e4e7' },
    muted:         { light: '#71717a', dark: '#71717a' },
    destructive:   { light: '#ef4444', dark: '#f87171' },
    onDestructive: { light: '#ffffff', dark: '#ffffff' },
    success:       { light: '#22c55e', dark: '#4ade80' },
    onSuccess:     { light: '#ffffff', dark: '#000000' },
    warning:       { light: '#f59e0b', dark: '#fbbf24' },
    onWarning:     { light: '#ffffff', dark: '#000000' },
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48 },
  radius:  { sm: 6, md: 10, lg: 16, xl: 24, full: 9999 },
  typography: {
    size:       { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, '2xl': 24, '3xl': 30 },
    weight:     { regular: '400', medium: '500', semibold: '600', bold: '700' },
    lineHeight: { tight: 18, normal: 22, relaxed: 28 },
  },
  animation: {
    speed:  { fast: 150, normal: 250, slow: 400 },
    easing: {
      standard:   [0.4, 0.0, 0.2, 1],
      decelerate: [0.0, 0.0, 0.2, 1],
      spring:     { damping: 15, stiffness: 200, mass: 1 },
    },
  },
}
