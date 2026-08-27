// native-mate: action-sheet@0.3.0 | hash:PLACEHOLDER
import React, { useState } from 'react'
import {
  View, Pressable, Modal, StyleSheet, Platform, AccessibilityInfo, findNodeHandle,
} from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS, Easing,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { fontStyle, makeStyles, Text, useTheme, useMotion, useStrings, withAlpha, type Motion } from '@native-mate/core'
import type { ActionSheetProps } from './action-sheet.types'

// ── Focus restore ────────────────────────────────────────────────────────────
// Opening an RN Modal moves the screen reader into it; closing one drops the
// cursor wherever the platform decides — usually the top of the screen, not the
// control the user pressed. `returnFocusRef` points at that control so focus
// lands back where it started. `setAccessibilityFocus` is native-only and takes
// a react tag, so every step is guarded: on web, or if the API is ever missing,
// this is a no-op rather than a crash.
function restoreAccessibilityFocus(ref?: React.RefObject<any> | null) {
  const node = ref?.current
  if (!node || Platform.OS === 'web') return
  if (typeof AccessibilityInfo?.setAccessibilityFocus !== 'function') return
  try {
    const tag = typeof node === 'number' ? node : findNodeHandle(node)
    if (tag != null) AccessibilityInfo.setAccessibilityFocus(tag)
  } catch {}
}

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
    borderColor: withAlpha(theme.colors.border, 0.38),
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
    backgroundColor: withAlpha(theme.colors.border, 0.5),
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
    borderColor: withAlpha(theme.colors.border, 0.38),
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
  motion: Motion,
) {
  const show = () => {
    backdropOpacity.value = withTiming(1, motion.timing('normal'))
    if (animation === 'fade') {
      sheetScale.value = withTiming(1, { ...motion.timing('normal'), easing: Easing.out(Easing.cubic) })
      translateY.value = withTiming(0, { ...motion.timing('normal'), easing: Easing.out(Easing.cubic) })
    } else if (animation === 'spring') {
      translateY.value = withSpring(0, motion.spring())
    } else {
      // slide (default) — same smooth cubic as Sheet
      translateY.value = withTiming(0, { ...motion.timing('slow'), easing: Easing.out(Easing.cubic) })
    }
  }

  const hide = (cb?: () => void) => {
    backdropOpacity.value = withTiming(0, motion.timing('normal'))
    if (animation === 'fade') {
      sheetScale.value = withTiming(0.95, motion.timing('normal'))
      translateY.value = withTiming(dismissY, { ...motion.timing('normal'), easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(onDismiss)()
        if (cb) runOnJS(cb)()
      })
    } else {
      translateY.value = withTiming(dismissY, { ...motion.timing('normal'), easing: Easing.in(Easing.cubic) }, () => {
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
  cancelLabel,
  animation = 'slide',
  showDividers = true,
  returnFocusRef,
}) => {
  const theme = useTheme()
  const motion = useMotion()
  const styles = useStyles()
  const strings = useStrings()
  // The per-component label prop stays the higher-priority override.
  const cancelText = cancelLabel ?? strings.cancel
  const [modalOpen, setModalOpen] = useState(isOpen)
  const [sheetHeight, setSheetHeight] = useState(0)

  const DISMISS_Y = 600
  const dismissY = Math.max(DISMISS_Y, sheetHeight + 60)
  const translateY = useSharedValue(DISMISS_Y)
  const backdropOpacity = useSharedValue(0)
  const sheetScale = useSharedValue(animation === 'fade' ? 0.95 : 1)

  // `returnFocusRef` is read through a ref so the JS callback handed to the
  // exit animation can never see a stale one.
  const returnFocusRefLatest = React.useRef(returnFocusRef)
  returnFocusRefLatest.current = returnFocusRef

  const { show, hide } = buildAnimations(
    animation, translateY, backdropOpacity, sheetScale, dismissY,
    () => {
      setModalOpen(false)
      restoreAccessibilityFocus(returnFocusRefLatest.current)
    },
    motion,
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
    hide(onClose)
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
      {/* Everything the sheet owns lives under one view marked as modal, so
          iOS VoiceOver stops at its boundary instead of wandering into the
          screen behind it. */}
      <View style={styles.fill} accessibilityViewIsModal={true}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, backdropStyle]} />
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

        <Animated.View style={sheetStyle}>
          <View
            style={styles.sheetWrap}
            onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
          >
            {/* Main action sheet */}
            <View style={styles.sheet}>
              <View style={styles.handle} />

              {(title != null || message != null) && (
                <>
                  <View style={styles.header}>
                    {title != null && (
                      <Text style={{ fontSize: 13, ...fontStyle(theme.typography, 'semibold'), color: theme.colors.muted, textAlign: 'center' }}>
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
                    android_ripple={{ color: withAlpha(theme.colors.border, 0.25) }}
                    accessibilityRole="button"
                  >
                    {action.icon != null && (
                      <View style={{ opacity: action.disabled ? 0.4 : 0.85 }}>{action.icon}</View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          ...fontStyle(theme.typography, action.variant === 'destructive' ? 'semibold' : 'regular'),
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
                android_ripple={{ color: withAlpha(theme.colors.border, 0.25) }}
                accessibilityRole="button"
                accessibilityLabel={cancelText}
              >
                <Text style={{ fontSize: 17, ...fontStyle(theme.typography, 'semibold'), color: theme.colors.foreground }}>
                  {cancelText}
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}
