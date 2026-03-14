import { createContext } from 'react'
import type { ResolvedTheme } from '../tokens/types'
import { resolveTokens, zinc } from '../tokens'

export const defaultTheme: ResolvedTheme = resolveTokens(zinc, 'light')
export const ThemeContext = createContext<ResolvedTheme>(defaultTheme)
