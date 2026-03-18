// native-mate: tooltip@0.2.0 | hash:PLACEHOLDER
import React, { useRef, useState } from 'react'
import { View, Pressable, Modal, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS,
} from 'react-native-reanimated'
import { useTheme, Text } from '@native-mate/core'
import type { TooltipProps, TooltipPlacement } from './tooltip.types'

const OFFSET = 10
const ARROW = 7

interface AnchorRect { x: number; y: number; width: number; height: number }

/** Returns absolute position and origin for the bubble + arrow */
function getPositionStyle(placement: TooltipPlacement, anchor: AnchorRect) {
  const cx = anchor.x + anchor.width / 2
  const cy = anchor.y + anchor.height / 2

  switch (placement) {
    case 'top':
      return {
        bubble: { bottom: undefined, top: undefined, left: cx, translateX: '-50%' as any, top2: anchor.y - OFFSET },
        arrow: { top: '100%' as any, left: '50%' as any, marginLeft: -(ARROW / 2), marginTop: -(ARROW / 2), rotate: '45deg' },
      }
    case 'bottom':
      return {
        bubble: { top2: anchor.y + anchor.height + OFFSET, left: cx, translateX: '-50%' as any },
        arrow: { bottom: '100%' as any, left: '50%' as any, marginLeft: -(ARROW / 2), marginTop: ARROW / 2, rotate: '45deg' },
      }
    case 'left':
      return {
        bubble: { top2: cy, left: anchor.x - OFFSET, translateY: '-50%' as any, translateX: '-100%' as any },
        arrow: { top: '50%' as any, left: '100%' as any, marginTop: -(ARROW / 2), rotate: '45deg' },
      }
    case 'right':
      return {
        bubble: { top2: cy, left: anchor.x + anchor.width + OFFSET, translateY: '-50%' as any },
        arrow: { top: '50%' as any, right: '100%' as any, marginTop: -(ARROW / 2), rotate: '45deg' },
      }
  }
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = 'top',
  children,
  delay = 300,
  style,
}) => {
  const theme = useTheme()
  const [modalOpen, setModalOpen] = useState(false)
  const [anchor, setAnchor] = useState<AnchorRect>({ x: 0, y: 0, width: 0, height: 0 })
  const anchorRef = useRef<View>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.88)

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const show = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height })
      setModalOpen(true)
      opacity.value = withTiming(1, { duration: 140 })
      scale.value = withSpring(1, { damping: 14, stiffness: 260 })
    })
  }

  const hide = () => {
    opacity.value = withTiming(0, { duration: 100 })
    scale.value = withTiming(0.88, { duration: 100 }, () => {
      runOnJS(setModalOpen)(false)
    })
  }

  const onPressIn = () => {
    timerRef.current = setTimeout(show, delay)
  }

  const onPressOut = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (modalOpen) hide()
  }

  const bg = theme.colors.foreground
  const textColor = theme.colors.background

  const pos = getPositionStyle(placement, anchor)

  return (
    <>
      <Pressable
        ref={anchorRef as React.RefObject<View>}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onLongPress={show}
        style={style}
      >
        {children}
      </Pressable>

      {modalOpen && (
        <Modal visible transparent animationType="none" onRequestClose={hide} statusBarTranslucent>
          <Pressable style={StyleSheet.absoluteFill} onPress={hide}>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  backgroundColor: bg,
                  borderRadius: 7,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  maxWidth: 220,
                  top: pos.bubble.top2,
                  left: pos.bubble.left,
                  transform: [
                    { translateX: pos.bubble.translateX ?? 0 },
                    ...(pos.bubble.translateY ? [{ translateY: pos.bubble.translateY }] : []),
                  ],
                },
                animStyle,
              ]}
            >
              {/* Arrow */}
              <View
                style={{
                  position: 'absolute',
                  width: ARROW,
                  height: ARROW,
                  backgroundColor: bg,
                  transform: [{ rotate: pos.arrow.rotate }],
                  ...(pos.arrow.top !== undefined ? { top: pos.arrow.top } : {}),
                  ...(pos.arrow.bottom !== undefined ? { bottom: pos.arrow.bottom } : {}),
                  ...(pos.arrow.left !== undefined ? { left: pos.arrow.left } : {}),
                  ...(pos.arrow.right !== undefined ? { right: pos.arrow.right } : {}),
                  ...(pos.arrow.marginLeft !== undefined ? { marginLeft: pos.arrow.marginLeft } : {}),
                  ...(pos.arrow.marginTop !== undefined ? { marginTop: pos.arrow.marginTop } : {}),
                }}
              />
              <Text style={{ fontSize: 12, color: textColor, fontWeight: '500' }}>
                {content}
              </Text>
            </Animated.View>
          </Pressable>
        </Modal>
      )}
    </>
  )
}
