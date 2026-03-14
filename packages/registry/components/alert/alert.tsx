// native-mate: alert@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { View } from 'react-native'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { AlertProps, AlertVariant } from './alert.types'

const useStyles = makeStyles((theme) => ({
  base: { borderRadius: theme.radius.md, padding: theme.spacing.md, flexDirection: 'row', gap: theme.spacing.sm },
  leftBorder: { width: 4, borderRadius: theme.radius.sm, position: 'absolute', left: 0, top: 0, bottom: 0 },
  content: { flex: 1, paddingLeft: theme.spacing.sm, gap: 4 },
}))

const variantColor: Record<AlertVariant, string> = {
  default: 'primary', destructive: 'destructive', success: 'success', warning: 'warning',
}

export const Alert: React.FC<AlertProps> = ({ variant = 'default', title, description, children }) => {
  const theme = useTheme()
  const styles = useStyles()
  const accentColor = theme.colors[variantColor[variant] as keyof typeof theme.colors]

  return (
    <View style={[styles.base, { backgroundColor: accentColor + '18', borderWidth: 1, borderColor: accentColor + '40' }]} accessibilityRole="alert">
      <View style={[styles.leftBorder, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <Text variant="label" color={accentColor}>{title}</Text>
        {description && <Text variant="body" muted>{description}</Text>}
        {children}
      </View>
    </View>
  )
}
