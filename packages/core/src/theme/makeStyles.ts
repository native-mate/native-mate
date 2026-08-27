import { StyleSheet } from 'react-native'
import { useTheme } from './useTheme'
import type { ResolvedTheme } from '../tokens/types'

type StyleFactory<T extends StyleSheet.NamedStyles<T>> = (theme: ResolvedTheme) => T

// Exported for tests; not part of the public package surface.
export function stylesForTheme<T extends StyleSheet.NamedStyles<T>>(
  cache: WeakMap<ResolvedTheme, T>,
  factory: StyleFactory<T>,
  theme: ResolvedTheme,
): T {
  let styles = cache.get(theme)
  if (!styles) {
    styles = StyleSheet.create(factory(theme))
    cache.set(theme, styles)
  }
  return styles
}

export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: StyleFactory<T>,
): () => T {
  // Cached per resolved theme, not per component instance: 200 mounted rows share
  // one StyleSheet.create per theme. The WeakMap self-cleans when a theme object
  // is replaced.
  const cache = new WeakMap<ResolvedTheme, T>()
  return function useStyles(): T {
    return stylesForTheme(cache, factory, useTheme())
  }
}
