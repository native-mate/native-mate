// native-mate: dialog@0.1.0 | hash:PLACEHOLDER
import React, { useState, useEffect, useCallback } from 'react'
import { Modal, View, Pressable, StyleSheet, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { DialogProps, HapticStyle } from './dialog.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const triggerHaptic = (style: HapticStyle) => {
  if (!Haptics || style === 'none') return
  const map = { light: 'Light', medium: 'Medium', heavy: 'Heavy' } as const
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[map[style]])
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border + '60',
    width: '100%',
    maxWidth: 340,
    overflow: 'hidden',
  },
  body: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    minHeight: 48,
  },
  btnDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
}))

export const Dialog: React.FC<DialogProps> = ({
  visible,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  icon,
  dismissible = true,
  haptic = 'medium',
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [modalVisible, setModalVisible] = useState(visible)

  const scale = useSharedValue(0.9)
  const opacity = useSharedValue(0)
  const backdropOpacity = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      setModalVisible(true)
      scale.value = withSpring(1, { damping: 18, stiffness: 260 })
      opacity.value = withTiming(1, { duration: 180 })
      backdropOpacity.value = withTiming(1, { duration: 200 })
    } else {
      scale.value = withSpring(0.9, { damping: 18, stiffness: 260 })
      backdropOpacity.value = withTiming(0, { duration: 160 })
      opacity.value = withTiming(0, { duration: 140 }, () => {
        runOnJS(setModalVisible)(false)
      })
    }
  }, [visible])

  const cardAnim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const backdropAnim = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  const handleConfirm = useCallback(() => {
    triggerHaptic(haptic)
    onConfirm?.()
    onClose()
  }, [haptic, onConfirm, onClose])

  const handleCancel = useCallback(() => {
    triggerHaptic(haptic)
    onCancel?.()
    onClose()
  }, [haptic, onCancel, onClose])

  const isDestructive = variant === 'destructive'
  const accentColor = isDestructive ? theme.colors.destructive : theme.colors.primary
  const iconBg = accentColor + '18'

  const defaultIcon = isDestructive ? 'alert-circle' : 'information-circle'

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismissible ? onClose : undefined}
    >
      <Animated.View style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }, backdropAnim]}>
        {dismissible && (
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        )}

        <Animated.View
          style={[styles.card, cardAnim, style]}
          accessibilityRole="alert"
        >
          {/* Prevent inner press from dismissing */}
          <Pressable onPress={() => {}}>
            <View style={styles.body}>
              {/* Icon */}
              {icon !== undefined && (
                <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
                  <Ionicons
                    name={(icon || defaultIcon) as any}
                    size={24}
                    color={accentColor}
                  />
                </View>
              )}

              {/* Title */}
              <Text
                variant="heading"
                style={{ textAlign: 'center', fontSize: 17 }}
              >
                {title}
              </Text>

              {/* Description */}
              {description && (
                <Text
                  variant="body"
                  muted
                  style={{ textAlign: 'center', fontSize: 14, lineHeight: 20 }}
                >
                  {description}
                </Text>
              )}
            </View>

            {/* Action buttons */}
            <View style={styles.footer}>
              <Pressable
                style={({ pressed }) => [styles.btn, pressed && { backgroundColor: theme.colors.surface }]}
                onPress={handleCancel}
                accessibilityRole="button"
                accessibilityLabel={cancelLabel}
              >
                <Text style={{ fontSize: 15, fontWeight: '500', color: theme.colors.muted }}>
                  {cancelLabel}
                </Text>
              </Pressable>
              <View style={styles.btnDivider} />
              <Pressable
                style={({ pressed }) => [styles.btn, pressed && { backgroundColor: theme.colors.surface }]}
                onPress={handleConfirm}
                accessibilityRole="button"
                accessibilityLabel={confirmLabel}
              >
                <Text style={{ fontSize: 15, fontWeight: '600', color: accentColor }}>
                  {confirmLabel}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}
