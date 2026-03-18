'use client'

import React from 'react'
import { ThemeProvider } from '@native-mate/core'

/**
 * Wraps preview components with ThemeProvider (zinc dark preset)
 * so that native-mate components can access the theme via useTheme().
 */
export function PreviewWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider preset="zinc" forcedColorScheme="dark">
      {children}
    </ThemeProvider>
  )
}
