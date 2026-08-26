// native-mate: biometric-prompt@0.1.0 | hash:PLACEHOLDER
import React, { useState, useCallback, useEffect } from 'react'
import { View, Pressable, Modal, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  withDelay,
  interpolate,
  Easing,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { BiometricPromptProps, BiometricType } from './biometric-prompt.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 32,
    alignItems: 'center',
    gap: 20,
    width: '100%',
    maxWidth: 320,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary + '12',
  },
  pulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.success + '15',
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.destructive + '15',
  },
  title: {
    fontSize: 20,
    ...fontStyle(theme.typography, 'bold'),
    color: theme.colors.foreground,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  authButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    width: '100%',
  },
  authLabel: {
    fontSize: theme.typography.size.md,
    ...fontStyle(theme.typography, 'semibold'),
    color: theme.colors.onPrimary,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelLabel: {
    fontSize: theme.typography.size.md,
    color: theme.colors.muted,
    ...fontStyle(theme.typography, 'medium'),
  },
  fallbackButton: {
    paddingVertical: 10,
  },
  fallbackLabel: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.primary,
    ...fontStyle(theme.typography, 'medium'),
  },
}))

function getBiometricIcon(type: BiometricType): string {
  if (type === 'faceId') return 'scan-outline'
  if (type === 'fingerprint') return 'finger-print'
  return Platform.OS === 'ios' ? 'scan-outline' : 'finger-print'
}

export const BiometricPrompt: React.FC<BiometricPromptProps> = ({
  visible,
  onAuthenticate,
  onCancel,
  title = 'Authenticate',
  subtitle = 'Use biometrics to verify your identity',
  type = 'auto',
  fallbackLabel = 'Use Passcode',
  onFallback,
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [state, setState] = useState<'idle' | 'success' | 'error'>('idle')

  const pulseScale = useSharedValue(1)
  const pulseOpacity = useSharedValue(0.6)
  const iconScale = useSharedValue(1)
  // Initialized from the current `visible` prop (not a fixed "hidden" baseline)
  // since RN's Modal may only mount this content once `visible` first becomes
  // true, making the very first open a fresh mount that can't rely solely on
  // the entry-animation effect below to have run yet.
  const cardScale = useSharedValue(visible ? 1 : 0.9)
  const cardOpacity = useSharedValue(visible ? 1 : 0)

  // Pulse animation
  useEffect(() => {
    if (visible && state === 'idle') {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1.5, { duration: 1200, easing: Easing.out(Easing.ease) }),
        ),
        -1,
        false,
      )
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 0 }),
          withTiming(0, { duration: 1200, easing: Easing.out(Easing.ease) }),
        ),
        -1,
        false,
      )
    }
  }, [visible, state])

  // Entry animation
  useEffect(() => {
    if (visible) {
      setState('idle')
      cardScale.value = withSpring(1, { damping: 15, stiffness: 200 })
      cardOpacity.value = withTiming(1, { duration: 200 })
    } else {
      cardScale.value = withTiming(0.9, { duration: 150 })
      cardOpacity.value = withTiming(0, { duration: 150 })
    }
  }, [visible])

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }))

  const pulseAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }))

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }))

  const handleAuthenticate = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    onAuthenticate?.()
  }, [haptic, onAuthenticate])

  const handleCancel = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onCancel?.()
  }, [haptic, onCancel])

  const biometricIcon = getBiometricIcon(type)

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay} {...rest}>
        <Animated.View style={[styles.card, cardAnimStyle, style]}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {state === 'idle' && (
              <>
                <Animated.View style={[styles.pulse, pulseAnimStyle]} />
                <Animated.View style={[styles.iconContainer, iconAnimStyle]}>
                  <Ionicons
                    name={biometricIcon as any}
                    size={36}
                    color={theme.colors.primary}
                  />
                </Animated.View>
              </>
            )}
            {state === 'success' && (
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={40} color={theme.colors.success} />
              </View>
            )}
            {state === 'error' && (
              <View style={styles.errorIcon}>
                <Ionicons name="close-circle" size={40} color={theme.colors.destructive} />
              </View>
            )}
          </View>

          <Text variant="title" style={styles.title}>
            {title}
          </Text>
          <Text variant="body" style={styles.subtitle}>
            {subtitle}
          </Text>

          <Pressable
            onPress={handleAuthenticate}
            style={styles.authButton}
            accessibilityRole="button"
            accessibilityLabel="Authenticate with biometrics"
          >
            <Text variant="label" style={styles.authLabel}>
              Authenticate
            </Text>
          </Pressable>

          {onFallback != null && (
            <Pressable
              onPress={onFallback}
              style={styles.fallbackButton}
              accessibilityRole="button"
              accessibilityLabel={fallbackLabel}
            >
              <Text variant="body" style={styles.fallbackLabel}>
                {fallbackLabel}
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleCancel}
            style={styles.cancelButton}
            accessibilityRole="button"
            accessibilityLabel="Cancel authentication"
          >
            <Text variant="body" style={styles.cancelLabel}>
              Cancel
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  )
}
