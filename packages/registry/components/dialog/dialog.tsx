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
import {
  useTheme, useMotion, Text, makeStyles, fontStyle, withAlpha,
  useHaptics, useStrings, deprecatedProp,
} from '@native-mate/core'
import type { DialogProps } from './dialog.types'

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
    borderColor: withAlpha(theme.colors.border, 0.38),
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
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'default',
  icon,
  dismissible = true,
  haptic = 'medium',
  style,
}) => {
  const theme = useTheme()
  const motion = useMotion()
  const styles = useStyles()
  const haptics = useHaptics()
  const strings = useStrings()
  const [modalVisible, setModalVisible] = useState(visible)

  // Per-component label props stay the higher-priority override.
  const confirmText = confirmLabel ?? strings.confirm
  const cancelText = cancelLabel ?? strings.cancel

  const scale = useSharedValue(0.9)
  const opacity = useSharedValue(0)
  const backdropOpacity = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      setModalVisible(true)
      scale.value = withSpring(1, { damping: 18, stiffness: 260 })
      opacity.value = withTiming(1, motion.timing('normal'))
      backdropOpacity.value = withTiming(1, motion.timing('normal'))
    } else {
      scale.value = withSpring(0.9, { damping: 18, stiffness: 260 })
      backdropOpacity.value = withTiming(0, motion.timing('fast'))
      opacity.value = withTiming(0, motion.timing('fast'), () => {
        runOnJS(setModalVisible)(false)
      })
    }
  }, [visible, motion])

  const cardAnim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const backdropAnim = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  const handleConfirm = useCallback(() => {
    haptics.trigger(haptic)
    onConfirm?.()
    onClose()
  }, [haptic, onConfirm, onClose, haptics])

  const handleCancel = useCallback(() => {
    haptics.trigger(haptic)
    onCancel?.()
    onClose()
  }, [haptic, onCancel, onClose, haptics])

  const isDestructive = variant === 'destructive'
  const accentColor = isDestructive ? theme.colors.destructive : theme.colors.primary
  const iconBg = withAlpha(accentColor, 0.09)

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
              {icon !== null && (
                <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
                  {icon === undefined ? (
                    <Ionicons name={defaultIcon} size={24} color={accentColor} />
                  ) : typeof icon === 'string' ? (
                    <Ionicons
                      name={deprecatedProp('Dialog icon (string)', 'Dialog icon (ReactNode)', icon) as any}
                      size={24}
                      color={accentColor}
                    />
                  ) : (
                    icon
                  )}
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
                accessibilityLabel={cancelText}
              >
                <Text style={{ fontSize: 15, ...fontStyle(theme.typography, 'medium'), color: theme.colors.muted }}>
                  {cancelText}
                </Text>
              </Pressable>
              <View style={styles.btnDivider} />
              <Pressable
                style={({ pressed }) => [styles.btn, pressed && { backgroundColor: theme.colors.surface }]}
                onPress={handleConfirm}
                accessibilityRole="button"
                accessibilityLabel={confirmText}
              >
                <Text style={{ fontSize: 15, ...fontStyle(theme.typography, 'semibold'), color: accentColor }}>
                  {confirmText}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}
