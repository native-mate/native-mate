// native-mate: banner@0.1.0 | hash:PLACEHOLDER
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, Pressable, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { BannerProps, BannerVariant, HapticStyle } from './banner.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const triggerHaptic = (style: HapticStyle) => {
  if (!Haptics || style === 'none') return
  const map = { light: 'Light', medium: 'Medium', heavy: 'Heavy' } as const
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[map[style]])
}

type IconName = React.ComponentProps<typeof Ionicons>['name']

const variantConfig: Record<BannerVariant, { icon: IconName; colorKey: string; hardColor?: string }> = {
  info:    { icon: 'information-circle', colorKey: 'info' },
  warning: { icon: 'warning',           colorKey: 'warning' },
  success: { icon: 'checkmark-circle',  colorKey: 'success' },
  error:   { icon: 'close-circle',      colorKey: 'destructive' },
}

const useStyles = makeStyles((theme) => ({
  container: {
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
}))

export const Banner: React.FC<BannerProps> = ({
  message,
  description,
  variant = 'info',
  position = 'top',
  icon,
  action,
  dismissible = false,
  onDismiss,
  visible = true,
  autoDismiss = 0,
  haptic = 'light',
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [mounted, setMounted] = useState(visible)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const config = variantConfig[variant]
  const accentColor = config.hardColor ?? ((theme.colors[config.colorKey as keyof typeof theme.colors] as string) ?? '#3b82f6')

  const translateY = useSharedValue(visible ? 0 : (position === 'top' ? -100 : 100))
  const opacity = useSharedValue(visible ? 1 : 0)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      if (!isFirstRender.current) {
        translateY.value = withSpring(0, { damping: 18, stiffness: 200 })
        opacity.value = withTiming(1, { duration: 200 })
      }

      if (autoDismiss > 0) {
        timerRef.current = setTimeout(() => {
          onDismiss?.()
        }, autoDismiss)
      }
    } else {
      const targetY = position === 'top' ? -100 : 100
      translateY.value = withSpring(targetY, { damping: 18, stiffness: 200 })
      opacity.value = withTiming(0, { duration: 180 }, () => {
        runOnJS(setMounted)(false)
      })
    }

    isFirstRender.current = false

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [visible, position, autoDismiss])

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }))

  const handleDismiss = useCallback(() => {
    triggerHaptic(haptic)
    onDismiss?.()
  }, [haptic, onDismiss])

  const handleAction = useCallback(() => {
    triggerHaptic(haptic)
    action?.onPress()
  }, [haptic, action])

  if (!mounted) return null

  const iconName = icon ?? config.icon

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: accentColor + '14',
          borderBottomWidth: position === 'top' ? 1 : 0,
          borderTopWidth: position === 'bottom' ? 1 : 0,
          borderColor: accentColor + '30',
        },
        animStyle,
        style,
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={styles.inner}>
        {/* Icon */}
        <Ionicons name={iconName as any} size={20} color={accentColor} style={{ marginTop: 1 }} />

        {/* Content */}
        <View style={styles.content}>
          <Text variant="label" style={{ color: accentColor, fontSize: 14 }}>
            {message}
          </Text>
          {description && (
            <Text variant="body" style={{ color: accentColor, opacity: 0.8, fontSize: 13, lineHeight: 18 }}>
              {description}
            </Text>
          )}
          {action && (
            <Pressable
              onPress={handleAction}
              style={[styles.actionBtn, { borderColor: accentColor + '50' }]}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <Text style={{ color: accentColor, fontSize: 12, ...fontStyle(theme.typography, 'semibold') }}>
                {action.label}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Dismiss */}
        {dismissible && (
          <Pressable
            onPress={handleDismiss}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Dismiss"
          >
            <Ionicons name="close" size={18} color={accentColor} style={{ opacity: 0.7, marginTop: 1 }} />
          </Pressable>
        )}
      </View>
    </Animated.View>
  )
}
