// native-mate: alert@0.1.0 | hash:a99751657eddbe82
import React from 'react'
import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { AlertProps, AlertVariant } from './alert.types'

type IconName = React.ComponentProps<typeof Ionicons>['name']

const variantMeta: Record<AlertVariant, { colorKey: string; icon: IconName; hardColor?: string }> = {
  default:     { colorKey: 'primary',     icon: 'information-circle' },
  info:        { colorKey: '',            icon: 'information-circle', hardColor: '#3b82f6' },
  success:     { colorKey: 'success',     icon: 'checkmark-circle' },
  warning:     { colorKey: 'warning',     icon: 'warning' },
  destructive: { colorKey: 'destructive', icon: 'close-circle' },
}

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderRadius: theme.radius.md,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
}))

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  title,
  description,
  icon,
  onDismiss,
  action,
  children,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const meta = variantMeta[variant]
  const accentColor = meta.hardColor ?? (theme.colors[meta.colorKey as keyof typeof theme.colors] as string)

  return (
    <View
      style={[
        styles.inner,
        {
          backgroundColor: accentColor + '14',
          borderColor: accentColor + '45',
        },
      ]}
      accessibilityRole="alert"
    >
      {/* Icon column */}
      <View style={{ paddingTop: 1 }}>
        {icon ?? <Ionicons name={meta.icon} size={18} color={accentColor} />}
      </View>

      {/* Content */}
      <View style={styles.body}>
        <Text variant="label" style={{ color: accentColor }}>{title}</Text>
        {description != null && (
          <Text variant="body" style={{ color: accentColor, opacity: 0.8, fontSize: 13 }}>
            {description}
          </Text>
        )}
        {children}
        {action != null && (
          <View style={styles.footer}>
            <Pressable
              onPress={action.onPress}
              style={[styles.actionBtn, { borderColor: accentColor + '60' }]}
            >
              <Text style={{ color: accentColor, fontSize: 12, fontWeight: '600' }}>
                {action.label}
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Dismiss */}
      {onDismiss != null && (
        <Pressable onPress={onDismiss} hitSlop={8} style={{ paddingTop: 1 }}>
          <Ionicons name="close" size={16} color={accentColor} style={{ opacity: 0.7 }} />
        </Pressable>
      )}
    </View>
  )
}
