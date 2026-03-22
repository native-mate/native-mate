// native-mate: screen@0.1.0 | hash:3a4e461df6c1709e
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@native-mate/core'
import type { ScreenProps } from './screen.types'

export const Screen: React.FC<ScreenProps> = ({ children, backgroundColor, style, ...rest }) => {
  const theme = useTheme()
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: backgroundColor ?? theme.colors.background }, style]}
      {...rest}
    >
      {children}
    </SafeAreaView>
  )
}
