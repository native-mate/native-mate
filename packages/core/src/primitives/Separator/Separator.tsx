import React from 'react'
import { View } from 'react-native'
import { useTheme } from '../../theme/useTheme'
import type { SeparatorProps } from './Separator.types'

export const Separator: React.FC<SeparatorProps> = ({ orientation = 'horizontal', style }) => {
  const theme = useTheme()
  return (
    <View
      accessible={false}
      style={[
        {
          backgroundColor: theme.colors.border,
          ...(orientation === 'horizontal'
            ? { height: 1, width: '100%' }
            : { width: 1, height: '100%' }),
        },
        style,
      ]}
    />
  )
}
