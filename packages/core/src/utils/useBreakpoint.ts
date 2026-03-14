import { useWindowDimensions } from 'react-native'

export type Breakpoint = 'sm' | 'md' | 'lg'

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions()
  if (width >= 1024) return 'lg'
  if (width >= 768) return 'md'
  return 'sm'
}
