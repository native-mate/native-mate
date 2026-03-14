// native-mate: card@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { View } from 'react-native'
import { useTheme, makeStyles, shadow } from '@native-mate/core'
import type { CardProps } from './card.types'

const useStyles = makeStyles((theme) => ({
  base: {
    backgroundColor: theme.colors.surfaceRaised,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...shadow(2),
  },
  none: { padding: 0 },
  sm:   { padding: theme.spacing.sm },
  md:   { padding: theme.spacing.md },
  lg:   { padding: theme.spacing.lg },
}))

export const Card: React.FC<CardProps> = ({ children, padding = 'md', style, ...rest }) => {
  const styles = useStyles()
  return (
    <View style={[styles.base, styles[padding], style]} {...rest}>
      {children}
    </View>
  )
}
