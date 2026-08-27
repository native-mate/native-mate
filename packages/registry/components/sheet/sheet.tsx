// native-mate: sheet@0.2.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import { Modal, View, ScrollView, Pressable, StyleSheet, Keyboard, Platform } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS, Easing,
} from 'react-native-reanimated'
import { useTheme, useMotion, withAlpha, Text, Separator, makeStyles } from '@native-mate/core'
import type { SheetProps } from './sheet.types'

// Home-indicator inset. `react-native-safe-area-context` is not a registry-wide
// dependency, so we ship a sane constant that consumers can override.
const DEFAULT_BOTTOM_INSET = Platform.select({ ios: 34, android: 0, default: 0 }) as number

const useStyles = makeStyles((theme) => ({
  fill: { ...StyleSheet.absoluteFillObject },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha(theme.colors.border, 0.31),
    overflow: 'hidden',
  },
  handle: {
    width: 36, height: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginTop: 10, marginBottom: 6,
  },
  titleRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 4,
  },
}))

export const Sheet: React.FC<SheetProps> = ({
  visible,
  onClose,
  height = 400,
  children,
  title,
  showHandle = true,
  closeOnBackdrop = true,
  animation = 'slide',
  padding = 16,
  scrollable = false,
  onDismiss,
  bottomInset,
  snapPoints,
}) => {
  const theme = useTheme()
  const motion = useMotion()
  const styles = useStyles()

  // Support legacy snapPoints prop
  const sheetHeight = snapPoints?.[0] ?? height
  const resolvedBottomInset = bottomInset ?? DEFAULT_BOTTOM_INSET

  const [modalOpen, setModalOpen] = React.useState(visible)
  const translateY = useSharedValue(sheetHeight)
  const backdropOpacity = useSharedValue(0)
  const sheetScale = useSharedValue(animation === 'fade' ? 0.97 : 1)
  const bottomOffset = useSharedValue(0)

  // Latest-ref: the mount/visibility effect is keyed on `visible` only, so it
  // must never read props straight from the render closure or they go stale.
  const latest = React.useRef({ animation, sheetHeight, onClose, onDismiss, motion })
  latest.current = { animation, sheetHeight, onClose, onDismiss, motion }

  // Plain JS callback for runOnJS — reads the latest onDismiss, never a stale one.
  const notifyDismissed = () => {
    latest.current.onDismiss?.()
  }

  const runShow = () => {
    const { animation: anim, motion: m } = latest.current
    backdropOpacity.value = withTiming(1, m.timing('normal'))
    if (anim === 'spring') {
      sheetScale.value = 1
      translateY.value = withSpring(0, m.spring())
    } else if (anim === 'fade') {
      sheetScale.value = withTiming(1, { ...m.timing('normal'), easing: Easing.out(Easing.cubic) })
      translateY.value = withTiming(0, { ...m.timing('normal'), easing: Easing.out(Easing.cubic) })
    } else {
      // slide (default)
      sheetScale.value = 1
      translateY.value = withTiming(0, { ...m.timing('slow'), easing: Easing.out(Easing.cubic) })
    }
  }

  const runHide = () => {
    const { animation: anim, sheetHeight: h, motion: m } = latest.current
    backdropOpacity.value = withTiming(0, m.timing('normal'))
    if (anim === 'fade') {
      sheetScale.value = withTiming(0.97, m.timing('normal'))
    }
    translateY.value = withTiming(h, { ...m.timing('normal'), easing: Easing.in(Easing.cubic) }, () => {
      runOnJS(setModalOpen)(false)
      runOnJS(notifyDismissed)()
    })
  }

  useEffect(() => {
    if (visible) {
      setModalOpen(true)
      // Wait a frame so the Modal has mounted before animating in.
      let inner = 0
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => runShow())
      })
      return () => {
        cancelAnimationFrame(outer)
        if (inner) cancelAnimationFrame(inner)
      }
    }
    runHide()
    return undefined
  }, [visible])

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const onShow = Keyboard.addListener(showEvent, (e) => {
      bottomOffset.value = withTiming(e.endCoordinates.height, { duration: (e as any).duration ?? 250 })
    })
    const onHide = Keyboard.addListener(hideEvent, (e) => {
      bottomOffset.value = withTiming(0, { duration: (e as any).duration ?? 250 })
    })
    return () => { onShow.remove(); onHide.remove() }
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: sheetScale.value },
    ],
    bottom: bottomOffset.value,
  }))

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }))

  // Backdrop press is the dismiss *intent* — onClose fires immediately; the
  // exit animation still plays and onDismiss fires when it finishes.
  const handleBackdropPress = () => {
    latest.current.onClose()
    runHide()
  }

  const contentPadding = {
    paddingHorizontal: padding,
    paddingTop: title ? 16 : 8,
    paddingBottom: resolvedBottomInset,
  }

  return (
    <Modal visible={modalOpen} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.fill}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
        {closeOnBackdrop && (
          <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
        )}
        <Animated.View
          accessibilityViewIsModal
          style={[styles.sheet, { height: sheetHeight }, animatedStyle]}
        >
          {showHandle && <View style={styles.handle} />}
          {title != null && (
            <>
              <View style={styles.titleRow}>
                <Text variant="heading">{title}</Text>
              </View>
              <Separator />
            </>
          )}
          {scrollable ? (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={contentPadding}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          ) : (
            <View style={[{ flex: 1 }, contentPadding]}>
              {children}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  )
}
