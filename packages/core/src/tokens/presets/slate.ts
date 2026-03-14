import type { TokenSet } from '../types'
import { zinc } from './zinc'

export const slate: TokenSet = {
  ...zinc,
  colors: {
    background:    { light: '#ffffff',  dark: '#0f172a' },
    surface:       { light: '#f1f5f9',  dark: '#1e293b' },
    surfaceRaised: { light: '#ffffff',  dark: '#334155' },
    border:        { light: '#cbd5e1',  dark: '#475569' },
    primary:       { light: '#0f172a',  dark: '#f8fafc' },
    onPrimary:     { light: '#f8fafc',  dark: '#0f172a' },
    foreground:    { light: '#020617',  dark: '#f8fafc' },
    onBackground:  { light: '#020617',  dark: '#f8fafc' },
    onSurface:     { light: '#0f172a',  dark: '#e2e8f0' },
    muted:         { light: '#64748b',  dark: '#94a3b8' },
    destructive:   { light: '#ef4444',  dark: '#f87171' },
    onDestructive: { light: '#ffffff',  dark: '#ffffff' },
    success:       { light: '#22c55e',  dark: '#4ade80' },
    onSuccess:     { light: '#ffffff',  dark: '#000000' },
    warning:       { light: '#f59e0b',  dark: '#fbbf24' },
    onWarning:     { light: '#ffffff',  dark: '#000000' },
  },
}
