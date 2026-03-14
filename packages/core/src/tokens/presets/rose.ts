import type { TokenSet } from '../types'
import { zinc } from './zinc'

export const rose: TokenSet = {
  ...zinc,
  colors: {
    background:    { light: '#ffffff',  dark: '#0c0a0b' },
    surface:       { light: '#fff1f2',  dark: '#1c1115' },
    surfaceRaised: { light: '#ffffff',  dark: '#2d1a1f' },
    border:        { light: '#fecdd3',  dark: '#4c2030' },
    primary:       { light: '#e11d48',  dark: '#fb7185' },
    onPrimary:     { light: '#ffffff',  dark: '#1c0a0f' },
    foreground:    { light: '#0f0a0b',  dark: '#fef2f4' },
    onBackground:  { light: '#0f0a0b',  dark: '#fef2f4' },
    onSurface:     { light: '#881337',  dark: '#fecdd3' },
    muted:         { light: '#9f4258',  dark: '#be738a' },
    destructive:   { light: '#dc2626',  dark: '#f87171' },
    onDestructive: { light: '#ffffff',  dark: '#ffffff' },
    success:       { light: '#22c55e',  dark: '#4ade80' },
    onSuccess:     { light: '#ffffff',  dark: '#000000' },
    warning:       { light: '#f59e0b',  dark: '#fbbf24' },
    onWarning:     { light: '#ffffff',  dark: '#000000' },
  },
}
