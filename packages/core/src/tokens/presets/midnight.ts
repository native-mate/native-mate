import type { TokenSet } from '../types'
import { zinc } from './zinc'

export const midnight: TokenSet = {
  ...zinc,
  colors: {
    background:    { light: '#f8fafc', dark: '#000000' },
    surface:       { light: '#f1f5f9', dark: '#111111' },
    surfaceRaised: { light: '#ffffff', dark: '#1a1a1a' },
    border:        { light: '#e2e8f0', dark: '#2a2a2a' },
    primary:       { light: '#6366f1', dark: '#818cf8' },
    onPrimary:     { light: '#ffffff', dark: '#000000' },
    foreground:    { light: '#0f172a', dark: '#f8fafc' },
    onBackground:  { light: '#0f172a', dark: '#f8fafc' },
    onSurface:     { light: '#1e293b', dark: '#e2e8f0' },
    muted:         { light: '#64748b', dark: '#6b7280' },
    destructive:   { light: '#ef4444', dark: '#f87171' },
    onDestructive: { light: '#ffffff', dark: '#ffffff' },
    success:       { light: '#22c55e', dark: '#4ade80' },
    onSuccess:     { light: '#ffffff', dark: '#000000' },
    warning:       { light: '#f59e0b', dark: '#fbbf24' },
    onWarning:     { light: '#ffffff', dark: '#000000' },
  },
}
