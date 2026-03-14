import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'
import type { ResolvedTheme } from '../tokens/types'

export function useTheme(): ResolvedTheme {
  return useContext(ThemeContext)
}
