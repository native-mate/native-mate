import React from 'react'
import { Text as RNText } from 'react-native'
import type { TextStyle } from 'react-native'
import { useTheme } from '../../theme/useTheme'
import type { TextProps, TextVariant, TextSize, TextWeight } from './Text.types'

const variantMap: Record<TextVariant, { sizeKey: string; weightKey: string }> = {
  body:    { sizeKey: 'md',  weightKey: 'regular' },
  label:   { sizeKey: 'sm',  weightKey: 'medium'  },
  caption: { sizeKey: 'xs',  weightKey: 'regular' },
  heading: { sizeKey: 'xl',  weightKey: 'bold'    },
  title:   { sizeKey: '2xl', weightKey: 'bold'    },
  display: { sizeKey: '3xl', weightKey: 'bold'    },
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  size,
  weight,
  color,
  muted = false,
  style,
  children,
  ...rest
}) => {
  const theme = useTheme()
  const { sizeKey, weightKey } = variantMap[variant]

  return (
    <RNText
      style={[
        {
          color: color ?? (muted ? theme.colors.muted : theme.colors.foreground),
          fontSize: theme.typography.size[size ?? sizeKey as TextSize],
          fontWeight: theme.typography.weight[weight ?? weightKey as TextWeight] as TextStyle['fontWeight'],
          lineHeight: theme.typography.lineHeight.normal,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  )
}
