// native-mate: action-sheet@0.1.0 | hash:ed3407552ccf8e9b
import React, { useState } from 'react'
import { View, Pressable, Modal, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS, Easing,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { makeStyles, Text, useTheme } from '@native-mate/core'
import type { ActionSheetProps } from './action-sheet.types'

const useStyles = makeStyles((theme) => ({
  fill: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetWrap: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    gap: 8,
  },
  sheet: {
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border + '60',
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    marginTop: 10,
    marginBottom: 2,
  },
  header: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    gap: 3,
  },
  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border + '80',
    marginHorizontal: 0,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    minHeight: 54,
  },
  cancelSheet: {
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border + '60',
  },
  cancelRow: {
    alignItems: 'center',
    paddingVertical: 16,
  },
}))

function buildAnimations(
  animation: NonNullable<ActionSheetProps['animation']>,
  translateY: Animated.SharedValue<number>,
  backdropOpacity: Animated.SharedValue<number>,
  sheetScale: Animated.SharedValue<number>,
  dismissY: number,
  onDismiss: () => void,
) {
  const show = () => {
    backdropOpacity.value = withTiming(1, { duration: 220 })
    if (animation === 'fade') {
      sheetScale.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) })
      translateY.value = withTiming(0, { duration: 280, easing: Easing.out(Easing.cubic) })
    } else if (animation === 'spring') {
      translateY.value = withSpring(0, { damping: 20, stiffness: 220, mass: 0.8 })
    } else {
      // slide (default) — same smooth cubic as Sheet
      translateY.value = withTiming(0, { duration: 360, easing: Easing.out(Easing.cubic) })
    }
  }

  const hide = (cb?: () => void) => {
    backdropOpacity.value = withTiming(0, { duration: 220 })
    if (animation === 'fade') {
      sheetScale.value = withTiming(0.95, { duration: 240 })
      translateY.value = withTiming(dismissY, { duration: 240, easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(onDismiss)()
        if (cb) runOnJS(cb)()
      })
    } else {
      translateY.value = withTiming(dismissY, { duration: 260, easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(onDismiss)()
        if (cb) runOnJS(cb)()
      })
    }
  }

  return { show, hide }
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  isOpen,
  onClose,
  title,
  message,
  actions,
  cancelLabel = 'Cancel',
  animation = 'slide',
  showDividers = true,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [modalOpen, setModalOpen] = useState(isOpen)

  const DISMISS_Y = 600
  const translateY = useSharedValue(DISMISS_Y)
  const backdropOpacity = useSharedValue(0)
  const sheetScale = useSharedValue(animation === 'fade' ? 0.95 : 1)

  const { show, hide } = buildAnimations(
    animation, translateY, backdropOpacity, sheetScale, DISMISS_Y,
    () => setModalOpen(false)
  )

  React.useEffect(() => {
    if (isOpen) {
      setModalOpen(true)
      show()
    } else {
      hide()
    }
  }, [isOpen])

  const handleClose = () => {
    hide(() => runOnJS(onClose)())
  }

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: sheetScale.value },
    ],
  }))
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }))

  return (
    <Modal
      visible={modalOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.fill}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, backdropStyle]} />
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        <Animated.View style={sheetStyle}>
          <View style={styles.sheetWrap}>
            {/* Main action sheet */}
            <View style={styles.sheet}>
              <View style={styles.handle} />

              {(title != null || message != null) && (
                <>
                  <View style={styles.header}>
                    {title != null && (
                      <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.muted, textAlign: 'center' }}>
                        {title}
                      </Text>
                    )}
                    {message != null && (
                      <Text style={{ fontSize: 13, color: theme.colors.muted, textAlign: 'center', lineHeight: 18 }}>
                        {message}
                      </Text>
                    )}
                  </View>
                  {showDividers && <View style={styles.sep} />}
                </>
              )}

              {actions.map((action, i) => (
                <React.Fragment key={action.label}>
                  {i > 0 && showDividers && <View style={styles.sep} />}
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionRow,
                      { opacity: pressed || action.disabled ? 0.5 : 1 },
                    ]}
                    onPress={() => { handleClose(); setTimeout(action.onPress, 50) }}
                    disabled={action.disabled}
                    android_ripple={{ color: theme.colors.border + '40' }}
                    accessibilityRole="button"
                  >
                    {action.icon != null && (
                      <View style={{ opacity: action.disabled ? 0.4 : 0.85 }}>{action.icon}</View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: action.variant === 'destructive' ? '600' : '400',
                          color: action.variant === 'destructive'
                            ? theme.colors.destructive
                            : theme.colors.foreground,
                        }}
                      >
                        {action.label}
                      </Text>
                      {action.description != null && (
                        <Text style={{ fontSize: 12, color: theme.colors.muted, marginTop: 1 }}>
                          {action.description}
                        </Text>
                      )}
                    </View>
                    {action.variant === 'destructive' && (
                      <Ionicons name="trash-outline" size={18} color={theme.colors.destructive} style={{ opacity: 0.75 }} />
                    )}
                  </Pressable>
                </React.Fragment>
              ))}
            </View>

            {/* Cancel — separate rounded card */}
            <View style={styles.cancelSheet}>
              <Pressable
                style={({ pressed }) => [styles.cancelRow, { opacity: pressed ? 0.6 : 1 }]}
                onPress={handleClose}
                android_ripple={{ color: theme.colors.border + '40' }}
                accessibilityRole="button"
                accessibilityLabel={cancelLabel}
              >
                <Text style={{ fontSize: 17, fontWeight: '600', color: theme.colors.foreground }}>
                  {cancelLabel}
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}
