// native-mate: sheet@0.2.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import { Modal, View, ScrollView, Pressable, StyleSheet, Keyboard, Platform } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring, runOnJS, Easing,
} from 'react-native-reanimated'
import { useTheme, useMotion, withAlpha, Text, Separator, makeStyles, devWarn } from '@native-mate/core'
import type { SheetProps } from './sheet.types'

// Drag-to-dismiss and multi-snap need a real gesture system. RNGH is an
// OPTIONAL peer — exactly like expo-haptics elsewhere in the registry — so the
// sheet degrades to tap-to-dismiss instead of crashing when it is absent.
let RNGH: any = null
try { RNGH = require('react-native-gesture-handler') } catch {}
const HAS_RNGH = !!(RNGH && RNGH.Gesture && RNGH.GestureDetector)

// Home-indicator inset. `react-native-safe-area-context` is not a registry-wide
// dependency, so we ship a sane constant that consumers can override.
const DEFAULT_BOTTOM_INSET = Platform.select({ ios: 34, android: 0, default: 0 }) as number

// How far past the smallest snap point a release (position + projected
// velocity) has to land before it counts as a dismiss rather than a snap.
const DISMISS_SLOP = 56
// Seconds of velocity folded into the release position. Standard iOS-ish
// projection: enough that a flick reads as intent, small enough that a slow
// drag lands where you left it.
const VELOCITY_PROJECTION = 0.12
// Rubber-band factor for dragging above the largest snap point.
const OVERDRAG_RESISTANCE = 0.2

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

  // ── Snap geometry ──────────────────────────────────────────────────────────
  // The sheet view is always laid out at the LARGEST snap point and pushed down
  // by translateY, so "current height h" == "translateY maxHeight - h". With a
  // single point that resting offset is 0 and the maths collapses to the
  // pre-snap-point behaviour exactly.
  const points = React.useMemo(() => {
    const raw = snapPoints && snapPoints.length > 0 ? snapPoints : [height]
    const clean = [...new Set(raw.filter((h) => typeof h === 'number' && h > 0))]
    return clean.length > 0 ? clean.sort((a, b) => a - b) : [height]
  }, [snapPoints, height])

  const maxHeight = points[points.length - 1]
  // The first entry of the caller's array is the sheet's opening height.
  const openHeight = snapPoints?.[0] ?? height
  const openTranslate = Math.max(0, maxHeight - openHeight)

  // Resting translateY values, ascending (0 == fully expanded).
  const rests = React.useMemo(
    () => points.map((h) => maxHeight - h).sort((a, b) => a - b),
    [points, maxHeight]
  )

  const [modalOpen, setModalOpen] = React.useState(visible)
  const translateY = useSharedValue(maxHeight)
  const backdropOpacity = useSharedValue(0)
  const sheetScale = useSharedValue(animation === 'fade' ? 0.97 : 1)
  const bottomOffset = useSharedValue(0)
  const dragStart = useSharedValue(0)

  // Latest-ref: the mount/visibility effect is keyed on `visible` only, so it
  // must never read props straight from the render closure or they go stale.
  const latest = React.useRef({ animation, maxHeight, openTranslate, onClose, onDismiss, motion })
  latest.current = { animation, maxHeight, openTranslate, onClose, onDismiss, motion }

  // Plain JS callback for runOnJS — reads the latest onDismiss, never a stale one.
  const notifyDismissed = () => {
    latest.current.onDismiss?.()
  }

  const runShow = () => {
    const { animation: anim, motion: m, openTranslate: rest } = latest.current
    backdropOpacity.value = withTiming(1, m.timing('normal'))
    if (anim === 'spring') {
      sheetScale.value = 1
      translateY.value = withSpring(rest, m.spring())
    } else if (anim === 'fade') {
      sheetScale.value = withTiming(1, { ...m.timing('normal'), easing: Easing.out(Easing.cubic) })
      translateY.value = withTiming(rest, { ...m.timing('normal'), easing: Easing.out(Easing.cubic) })
    } else {
      // slide (default)
      sheetScale.value = 1
      translateY.value = withTiming(rest, { ...m.timing('slow'), easing: Easing.out(Easing.cubic) })
    }
  }

  const runHide = () => {
    const { animation: anim, maxHeight: h, motion: m } = latest.current
    backdropOpacity.value = withTiming(0, m.timing('normal'))
    if (anim === 'fade') {
      sheetScale.value = withTiming(0.97, m.timing('normal'))
    }
    translateY.value = withTiming(h, { ...m.timing('normal'), easing: Easing.in(Easing.cubic) }, () => {
      runOnJS(setModalOpen)(false)
      runOnJS(notifyDismissed)()
    })
  }

  // Dismiss *intent*: onClose fires immediately, the exit animation still plays
  // and onDismiss fires when it finishes. Only ever reads refs and shared
  // values, so the copy captured by the gesture memo below never goes stale.
  const requestClose = () => {
    latest.current.onClose()
    runHide()
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
    if (!HAS_RNGH) {
      devWarn(
        'sheet:no-gesture-handler',
        'Sheet: drag-to-dismiss and snap points need `react-native-gesture-handler`, ' +
          'which is not installed. The sheet still opens, closes and honours its ' +
          'first snap point — only dragging is unavailable. ' +
          'Run: npx expo install react-native-gesture-handler'
      )
    }
  }, [])

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

  const springConfig = React.useMemo(() => motion.spring(), [motion])

  // Pan gesture. Every value the worklets close over is a number, a number[] or
  // a shared value — never an element-typed prop, which Reanimated 4 cannot
  // copy to the UI thread.
  const panGesture = React.useMemo(() => {
    if (!HAS_RNGH) return null
    const minRest = rests[0]
    const maxRest = rests[rests.length - 1]
    const closedTranslate = maxHeight
    const snaps = rests
    const cfg = springConfig
    return RNGH.Gesture.Pan()
      .onStart(() => {
        'worklet'
        dragStart.value = translateY.value
      })
      .onUpdate((e: { translationY: number }) => {
        'worklet'
        const next = dragStart.value + e.translationY
        if (next < minRest) {
          // Rubber-band above the tallest snap point.
          translateY.value = minRest + (next - minRest) * OVERDRAG_RESISTANCE
        } else {
          translateY.value = next > closedTranslate ? closedTranslate : next
        }
      })
      .onEnd((e: { velocityY: number }) => {
        'worklet'
        const projected = translateY.value + e.velocityY * VELOCITY_PROJECTION
        // Past the smallest snap point (largest resting offset) => dismiss.
        if (projected > maxRest + DISMISS_SLOP) {
          runOnJS(requestClose)()
          return
        }
        let best = snaps[0]
        let bestDistance = Math.abs(projected - best)
        for (let i = 1; i < snaps.length; i++) {
          const d = Math.abs(projected - snaps[i])
          if (d < bestDistance) {
            bestDistance = d
            best = snaps[i]
          }
        }
        translateY.value = withSpring(best, cfg)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rests, maxHeight, springConfig])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: sheetScale.value },
    ],
    bottom: bottomOffset.value,
  }))

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }))

  const handleBackdropPress = () => {
    requestClose()
  }

  const contentPadding = {
    paddingHorizontal: padding,
    paddingTop: title ? 16 : 8,
    paddingBottom: bottomInset ?? DEFAULT_BOTTOM_INSET,
  }

  // The handle + title strip is the drag surface, mirroring native sheets.
  const dragArea = (
    <>
      {showHandle && <View style={styles.handle} />}
      {title != null && (
        <>
          <View style={styles.titleRow}>
            <Text variant="heading">{title}</Text>
          </View>
          <Separator />
        </>
      )}
    </>
  )

  // RNGH gestures need a root view of their own inside an RN Modal.
  const Root: any = HAS_RNGH ? RNGH.GestureHandlerRootView : View

  return (
    <Modal visible={modalOpen} transparent animationType="none" onRequestClose={onClose}>
      <Root style={styles.fill}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
        {closeOnBackdrop && (
          <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
        )}
        <Animated.View
          accessibilityViewIsModal
          style={[styles.sheet, { height: maxHeight }, animatedStyle]}
        >
          {panGesture ? (
            <RNGH.GestureDetector gesture={panGesture}>
              <View>{dragArea}</View>
            </RNGH.GestureDetector>
          ) : (
            dragArea
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
      </Root>
    </Modal>
  )
}
