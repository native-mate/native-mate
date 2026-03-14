// Design tokens mapped to CSS variables for Framer
// These mirror the native-mate token system so Framer previews look identical to the app

export const presets = {
  zinc: {
    background: '#0a0a0a',
    surface: '#18181b',
    border: '#27272a',
    foreground: '#fafafa',
    mutedForeground: '#a1a1aa',
    primary: '#fafafa',
    primaryForeground: '#09090b',
    destructive: '#f87171',
    success: '#4ade80',
    warning: '#fbbf24',
  },
  slate: {
    background: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    foreground: '#f8fafc',
    mutedForeground: '#94a3b8',
    primary: '#f8fafc',
    primaryForeground: '#0f172a',
    destructive: '#f87171',
    success: '#4ade80',
    warning: '#fbbf24',
  },
  rose: {
    background: '#0a0a0a',
    surface: '#18181b',
    border: '#27272a',
    foreground: '#fafafa',
    mutedForeground: '#a1a1aa',
    primary: '#fb7185',
    primaryForeground: '#0a0a0a',
    destructive: '#f87171',
    success: '#4ade80',
    warning: '#fbbf24',
  },
  midnight: {
    background: '#030303',
    surface: '#0d0d0d',
    border: '#1a1a1a',
    foreground: '#ededed',
    mutedForeground: '#737373',
    primary: '#a78bfa',
    primaryForeground: '#030303',
    destructive: '#f87171',
    success: '#4ade80',
    warning: '#fbbf24',
  },
}

export type Preset = keyof typeof presets
export type Tokens = (typeof presets)['zinc']

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 }
export const radius = { sm: 6, md: 10, lg: 16, xl: 24, full: 9999 }
export const typography = {
  size: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, '2xl': 24 },
  weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
}
