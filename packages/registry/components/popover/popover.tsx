// native-mate: popover@0.1.0 | hash:PLACEHOLDER
import React, { useRef, useState, useCallback } from 'react'
import { View, Pressable, Modal, StyleSheet, ScrollView, Dimensions } from 'react-native'
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
    ...shadow(6),
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

export const Popover: React.FC<PopoverProps> = ({
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
}) => {
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
