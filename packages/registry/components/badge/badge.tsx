// native-mate: badge@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { View } from 'react-native'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { BadgeProps, BadgeVariant } from './badge.types'

const useStyles = makeStyles((theme) => ({
  base: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderRadius: theme.radius.full, paddingVertical: 2, paddingHorizontal: theme.spacing.sm },
  default:     { backgroundColor: theme.colors.primary },
  secondary:   { backgroundColor: theme.colors.surface },
  destructive: { backgroundColor: theme.colors.destructive },
  outline:     { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.border },
  success:     { backgroundColor: theme.colors.success },
}))

const textColorMap: Record<BadgeVariant, string> = {
  default: 'onPrimary', secondary: 'onSurface', destructive: 'onDestructive', outline: 'foreground', success: 'onSuccess',
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children }) => {
  const theme = useTheme()
  const styles = useStyles()
  const textColor = theme.colors[textColorMap[variant] as keyof typeof theme.colors]

  return (
    <View style={[styles.base, styles[variant]]}>
      <Text variant="caption" weight="medium" color={textColor}>{children}</Text>
    </View>
  )
}
