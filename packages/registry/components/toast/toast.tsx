// native-mate: toast@0.1.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { ToastProps, ToastVariant } from './toast.types'

const variantIcon: Record<ToastVariant, string> = { default: 'ℹ', success: '✓', destructive: '✕', warning: '⚠' }

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute', left: theme.spacing.lg, right: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceRaised, borderRadius: theme.radius.lg,
    padding: theme.spacing.md, flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm,
    borderWidth: 1, borderColor: theme.colors.border,
    ...require('@native-mate/core').shadow(3),
  },
  icon: { width: 20, height: 20, borderRadius: theme.radius.full, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 2 },
}))

export const Toast: React.FC<ToastProps> = ({ message, description, variant = 'default', duration = 3000, visible, onHide, position = 'bottom' }) => {
  const theme = useTheme()
  const styles = useStyles()
  const translateY = useSharedValue(position === 'bottom' ? 100 : -100)
  const opacity = useSharedValue(0)

  const hide = () => onHide()

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, theme.animation.easing.spring)
      opacity.value = withTiming(1, { duration: theme.animation.speed.fast })
      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: theme.animation.speed.fast })
        translateY.value = withSpring(position === 'bottom' ? 100 : -100, theme.animation.easing.spring, () => runOnJS(hide)())
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [visible])

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }], opacity: opacity.value }))
  const iconBg = { default: theme.colors.muted, success: theme.colors.success, destructive: theme.colors.destructive, warning: theme.colors.warning }[variant]
  const iconColor = { default: '#fff', success: theme.colors.onSuccess, destructive: theme.colors.onDestructive, warning: theme.colors.onWarning }[variant]

  if (!visible && opacity.value === 0) return null

  return (
    <Animated.View style={[styles.container, { [position === 'top' ? 'top' : 'bottom']: 48 }, animatedStyle]} accessibilityRole="alert">
      <View style={[styles.icon, { backgroundColor: iconBg }]}>
        <Text style={{ color: iconColor, fontSize: 11, fontWeight: '700' }}>{variantIcon[variant]}</Text>
      </View>
      <View style={styles.content}>
        <Text variant="label">{message}</Text>
        {description && <Text variant="caption" muted>{description}</Text>}
      </View>
    </Animated.View>
  )
}
