import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from './useTheme'
import type { ResolvedTheme } from '../tokens/types'

type StyleFactory<T extends StyleSheet.NamedStyles<T>> = (theme: ResolvedTheme) => T

export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: StyleFactory<T>,
): () => T {
  return function useStyles(): T {
    const theme = useTheme()
    return useMemo(() => StyleSheet.create(factory(theme)), [theme])
  }
}
