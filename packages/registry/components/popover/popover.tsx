// native-mate: popover@0.1.0 | hash:PLACEHOLDER
import React, { useRef, useState, useCallback, useEffect } from 'react'
import { View, Pressable, Modal, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { useTheme, makeStyles, shadow } from '@native-mate/core'
import type { PopoverProps, PopoverPosition } from './popover.types'

const OFFSET = 8
const ARROW_SIZE = 8
const SCREEN_PADDING = 12

interface AnchorRect { x: number; y: number; width: number; height: number }

const useStyles = makeStyles((theme) => ({
  bubble: {
    position: 'absolute',
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border + '80',
    overflow: 'hidden',
    ...shadow(4),
  },
  arrow: {
    position: 'absolute',
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: theme.colors.border + '80',
    transform: [{ rotate: '45deg' }],
  },
}))

function getBubbleLayout(
  position: PopoverPosition,
  anchor: AnchorRect,
  maxWidth: number,
): { top: number; left: number; arrowStyle: Record<string, any>; adjustedPosition: PopoverPosition } {
  const { width: screenW, height: screenH } = Dimensions.get('window')
  const cx = anchor.x + anchor.width / 2
  const cy = anchor.y + anchor.height / 2
  let adjustedPosition = position

  // Auto-flip if not enough space
  if (position === 'top' && anchor.y < 120) adjustedPosition = 'bottom'
  if (position === 'bottom' && anchor.y + anchor.height > screenH - 120) adjustedPosition = 'top'
  if (position === 'left' && anchor.x < maxWidth + OFFSET + SCREEN_PADDING) adjustedPosition = 'right'
  if (position === 'right' && anchor.x + anchor.width + maxWidth + OFFSET > screenW - SCREEN_PADDING) adjustedPosition = 'left'

  let left: number

  switch (adjustedPosition) {
    case 'top':
      left = Math.max(SCREEN_PADDING, Math.min(cx - maxWidth / 2, screenW - maxWidth - SCREEN_PADDING))
      return {
        top: anchor.y - OFFSET,
        left,
        arrowStyle: {
          top: '100%',
          left: cx - left - ARROW_SIZE / 2,
          marginTop: -(ARROW_SIZE / 2 - 1),
          transform: [{ rotate: '225deg' }],
        },
        adjustedPosition,
      }
    case 'bottom':
      left = Math.max(SCREEN_PADDING, Math.min(cx - maxWidth / 2, screenW - maxWidth - SCREEN_PADDING))
      return {
        top: anchor.y + anchor.height + OFFSET,
        left,
        arrowStyle: {
          bottom: '100%',
          left: cx - left - ARROW_SIZE / 2,
          marginBottom: -(ARROW_SIZE / 2 - 1),
          transform: [{ rotate: '45deg' }],
        },
        adjustedPosition,
      }
    case 'left':
      return {
        top: cy - 40,
        left: anchor.x - OFFSET - maxWidth,
        arrowStyle: {
          top: 36,
          right: -(ARROW_SIZE / 2 - 1),
          transform: [{ rotate: '135deg' }],
        },
        adjustedPosition,
      }
    case 'right':
      return {
        top: cy - 40,
        left: anchor.x + anchor.width + OFFSET,
        arrowStyle: {
          top: 36,
          left: -(ARROW_SIZE / 2 - 1),
          transform: [{ rotate: '-45deg' }],
        },
        adjustedPosition,
      }
  }
}

// ─── Web version ─────────────────────────────────────────────────────────────
// RN's Modal + measureInWindow don't behave reliably under react-native-web,
// so on web we position the bubble with plain relative/absolute CSS instead
// (same approach used by the Tooltip component's web implementation).

function PopoverWeb({
  trigger,
  content,
  position = 'bottom',
  visible: controlledVisible,
  onOpenChange,
  showArrow = true,
  closeOnOutsidePress = true,
  maxWidth = 280,
  maxHeight = 360,
  style,
}: PopoverProps) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const isOpen = controlledVisible ?? open

  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.9)

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const animateIn = useCallback(() => {
    opacity.value = withTiming(1, { duration: 160 })
    scale.value = withSpring(1, { damping: 16, stiffness: 260 })
  }, [])

  const animateOut = useCallback((cb?: () => void) => {
    opacity.value = withTiming(0, { duration: 120 }, () => {
      if (cb) runOnJS(cb)()
    })
    scale.value = withTiming(0.9, { duration: 120 })
  }, [])

  const openPopover = useCallback(() => {
    setOpen(true)
    onOpenChange?.(true)
    animateIn()
  }, [onOpenChange, animateIn])

  const closePopover = useCallback(() => {
    animateOut(() => setOpen(false))
    onOpenChange?.(false)
  }, [onOpenChange, animateOut])

  const toggle = useCallback(() => {
    if (isOpen) closePopover()
    else openPopover()
  }, [isOpen, openPopover, closePopover])

  // Keep animation in sync when visibility is controlled externally.
  useEffect(() => {
    if (controlledVisible === undefined) return
    if (controlledVisible) animateIn()
    else animateOut()
  }, [controlledVisible, animateIn, animateOut])

  const bg = theme.colors.surfaceRaised ?? theme.colors.surface
  const borderColor = theme.colors.border + '80'

  const bubblePosition: any = {
    top:    { bottom: '100%', left: '50%', marginBottom: OFFSET, transform: [{ translateX: '-50%' as any }] },
    bottom: { top: '100%', left: '50%', marginTop: OFFSET, transform: [{ translateX: '-50%' as any }] },
    left:   { right: '100%', top: '50%', marginRight: OFFSET, transform: [{ translateY: '-50%' as any }] },
    right:  { left: '100%', top: '50%', marginLeft: OFFSET, transform: [{ translateY: '-50%' as any }] },
  }[position]

  const arrowPosition: any = {
    top:    { top: '100%', left: '50%', marginLeft: -ARROW_SIZE / 2, marginTop: -ARROW_SIZE / 2, transform: [{ rotate: '225deg' }] },
    bottom: { bottom: '100%', left: '50%', marginLeft: -ARROW_SIZE / 2, marginBottom: -ARROW_SIZE / 2, transform: [{ rotate: '45deg' }] },
    left:   { left: '100%', top: '50%', marginTop: -ARROW_SIZE / 2, marginLeft: -ARROW_SIZE / 2, transform: [{ rotate: '135deg' }] },
    right:  { right: '100%', top: '50%', marginTop: -ARROW_SIZE / 2, marginRight: -ARROW_SIZE / 2, transform: [{ rotate: '-45deg' }] },
  }[position]

  return (
    <View style={[{ position: 'relative' as any }, style]}>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
      >
        {trigger}
      </Pressable>

      {isOpen && (
        <>
          {closeOnOutsidePress && (
            <Pressable
              // @ts-ignore web-only fixed positioning to catch outside clicks
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }}
              onPress={closePopover}
            />
          )}

          <Animated.View
            style={[
              {
                position: 'absolute',
                zIndex: 999,
                backgroundColor: bg,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor,
                overflow: 'hidden',
                maxWidth,
                ...bubblePosition,
              },
              animStyle,
            ]}
          >
            {showArrow && (
              <View
                style={{
                  position: 'absolute',
                  width: ARROW_SIZE,
                  height: ARROW_SIZE,
                  backgroundColor: bg,
                  borderTopWidth: 1,
                  borderLeftWidth: 1,
                  borderColor,
                  ...arrowPosition,
                }}
              />
            )}

            <ScrollView
              style={{ maxHeight }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {content}
            </ScrollView>
          </Animated.View>
        </>
      )}
    </View>
  )
}

// ─── Native version ──────────────────────────────────────────────────────────

function PopoverNative({
  trigger,
  content,
  position = 'bottom',
  visible: controlledVisible,
  onOpenChange,
  showArrow = true,
  closeOnOutsidePress = true,
  maxWidth = 280,
  maxHeight = 360,
  style,
}: PopoverProps) {
  const theme = useTheme()
  const styles = useStyles()
  const anchorRef = useRef<View>(null)
  const [anchor, setAnchor] = useState<AnchorRect>({ x: 0, y: 0, width: 0, height: 0 })
  const [internalOpen, setInternalOpen] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const isOpen = controlledVisible ?? internalOpen

  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.9)

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const openPopover = useCallback(() => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height })
      setModalVisible(true)
      setInternalOpen(true)
      onOpenChange?.(true)
      opacity.value = withTiming(1, { duration: 160 })
      scale.value = withSpring(1, { damping: 16, stiffness: 260 })
    })
  }, [onOpenChange])

  const closePopover = useCallback(() => {
    opacity.value = withTiming(0, { duration: 120 })
    scale.value = withTiming(0.9, { duration: 120 }, () => {
      runOnJS(setModalVisible)(false)
      runOnJS(setInternalOpen)(false)
    })
    onOpenChange?.(false)
  }, [onOpenChange])

  const toggle = useCallback(() => {
    if (isOpen) closePopover()
    else openPopover()
  }, [isOpen, openPopover, closePopover])

  // Keep animation + anchor measurement in sync when visibility is controlled externally.
  useEffect(() => {
    if (controlledVisible === undefined) return
    if (controlledVisible) {
      anchorRef.current?.measureInWindow((x, y, width, height) => {
        setAnchor({ x, y, width, height })
        setModalVisible(true)
        opacity.value = withTiming(1, { duration: 160 })
        scale.value = withSpring(1, { damping: 16, stiffness: 260 })
      })
    } else {
      opacity.value = withTiming(0, { duration: 120 }, () => {
        runOnJS(setModalVisible)(false)
      })
      scale.value = withTiming(0.9, { duration: 120 })
    }
  }, [controlledVisible])

  const layout = getBubbleLayout(position, anchor, maxWidth)

  return (
    <>
      <Pressable
        ref={anchorRef as React.RefObject<View>}
        onPress={toggle}
        style={style}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
      >
        {trigger}
      </Pressable>

      {modalVisible && (
        <Modal
          visible
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={closePopover}
        >
          {closeOnOutsidePress && (
            <Pressable style={StyleSheet.absoluteFill} onPress={closePopover} />
          )}

          <Animated.View
            style={[
              styles.bubble,
              {
                top: layout.top,
                left: layout.left,
                maxWidth,
              },
              animStyle,
            ]}
          >
            {/* Arrow */}
            {showArrow && (
              <View style={[styles.arrow, layout.arrowStyle as object]} />
            )}

            <ScrollView
              style={{ maxHeight }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {content}
            </ScrollView>
          </Animated.View>
        </Modal>
      )}
    </>
  )
}

// ─── Unified export ──────────────────────────────────────────────────────────

export const Popover: React.FC<PopoverProps> = (props) => {
  if (Platform.OS === 'web') return <PopoverWeb {...props} />
  return <PopoverNative {...props} />
}
