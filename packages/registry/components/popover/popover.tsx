// native-mate: popover@0.1.0 | hash:PLACEHOLDER
import React, { useRef, useState, useCallback } from 'react'
import { View, Pressable, Modal, StyleSheet, ScrollView } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS,
} from 'react-native-reanimated'
import { useTheme, makeStyles, shadow } from '@native-mate/core'
import type { PopoverProps, PopoverPlacement } from './popover.types'

const OFFSET = 8
const ARROW = 8

interface AnchorRect { x: number; y: number; width: number; height: number }

function getOriginStyle(placement: PopoverPlacement) {
  switch (placement) {
    case 'top':    return { transformOrigin: 'bottom center' }
    case 'bottom': return { transformOrigin: 'top center' }
    case 'left':   return { transformOrigin: 'right center' }
    case 'right':  return { transformOrigin: 'left center' }
  }
}

function getBubbleLayout(
  placement: PopoverPlacement,
  anchor: AnchorRect,
  maxWidth: number,
): { top: number; left: number; translateX?: number; translateY?: number; arrowStyle: object } {
  const cx = anchor.x + anchor.width / 2
  const cy = anchor.y + anchor.height / 2

  switch (placement) {
    case 'top':
      return {
        top: anchor.y - OFFSET,
        left: cx,
        translateX: -(maxWidth / 2),
        translateY: -10000, // will be recalculated after measure
        arrowStyle: {
          top: '100%', left: '50%',
          marginLeft: -(ARROW / 2), marginTop: -(ARROW / 2 - 1),
          transform: [{ rotate: '45deg' }],
        },
      }
    case 'bottom':
      return {
        top: anchor.y + anchor.height + OFFSET,
        left: cx,
        translateX: -(maxWidth / 2),
        arrowStyle: {
          bottom: '100%', left: '50%',
          marginLeft: -(ARROW / 2), marginBottom: -(ARROW / 2 - 1),
          transform: [{ rotate: '45deg' }],
        },
      }
    case 'left':
      return {
        top: cy,
        left: anchor.x - OFFSET,
        translateX: -(maxWidth + OFFSET),
        translateY: -20,
        arrowStyle: {
          top: 20, right: -(ARROW / 2 - 1),
          transform: [{ rotate: '45deg' }],
        },
      }
    case 'right':
      return {
        top: cy,
        left: anchor.x + anchor.width + OFFSET,
        translateY: -20,
        arrowStyle: {
          top: 20, left: -(ARROW / 2 - 1),
          transform: [{ rotate: '45deg' }],
        },
      }
  }
}

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
    width: ARROW,
    height: ARROW,
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: theme.colors.border + '80',
  },
}))

export const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  placement = 'bottom',
  maxWidth = 260,
  dismissible = true,
  open: controlledOpen,
  onOpenChange,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const anchorRef = useRef<View>(null)
  const [anchor, setAnchor] = useState<AnchorRect>({ x: 0, y: 0, width: 0, height: 0 })
  const [internalOpen, setInternalOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const isOpen = controlledOpen ?? internalOpen
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.9)

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const openPopover = useCallback(() => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height })
      setModalOpen(true)
      setInternalOpen(true)
      onOpenChange?.(true)
      opacity.value = withTiming(1, { duration: 150 })
      scale.value = withSpring(1, { damping: 16, stiffness: 280 })
    })
  }, [onOpenChange])

  const closePopover = useCallback(() => {
    opacity.value = withTiming(0, { duration: 120 })
    scale.value = withTiming(0.9, { duration: 120 }, () => {
      runOnJS(setModalOpen)(false)
      runOnJS(setInternalOpen)(false)
    })
    onOpenChange?.(false)
  }, [onOpenChange])

  const toggle = () => {
    if (isOpen) closePopover()
    else openPopover()
  }

  const layout = getBubbleLayout(placement, anchor, maxWidth)
  const bg = theme.colors.surfaceRaised ?? theme.colors.surface

  return (
    <>
      <Pressable ref={anchorRef as React.RefObject<View>} onPress={toggle} style={style}>
        {children}
      </Pressable>

      {modalOpen && (
        <Modal
          visible
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={closePopover}
        >
          {dismissible && (
            <Pressable style={StyleSheet.absoluteFill} onPress={closePopover} />
          )}

          <Animated.View
            style={[
              styles.bubble,
              {
                top: layout.top,
                left: layout.left,
                maxWidth,
                transform: [
                  { translateX: layout.translateX ?? 0 },
                  ...(layout.translateY ? [{ translateY: layout.translateY }] : []),
                ],
              },
              animStyle,
            ]}
          >
            {/* Arrow */}
            <View style={[styles.arrow, layout.arrowStyle as object]} />

            <ScrollView
              style={{ maxHeight: 320 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {content}
            </ScrollView>
          </Animated.View>
        </Modal>
      )}
    </>
  )
}
