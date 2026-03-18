// native-mate: tooltip@0.3.0 | hash:PLACEHOLDER
import React, { useRef, useState } from 'react'
import { View, Pressable, Modal, StyleSheet, Platform } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS,
} from 'react-native-reanimated'
import { useTheme, Text } from '@native-mate/core'
import type { TooltipProps } from './tooltip.types'

const OFFSET = 8
const ARROW = 6

// ─── Web version: inline absolute positioning, no measureInWindow ─────────────

function TooltipWeb({ content, placement = 'top', children, style }: TooltipProps) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.9)

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const show = () => {
    setOpen(true)
    opacity.value = withTiming(1, { duration: 130 })
    scale.value = withSpring(1, { damping: 14, stiffness: 280 })
  }

  const hide = () => {
    opacity.value = withTiming(0, { duration: 90 }, () => runOnJS(setOpen)(false))
    scale.value = withTiming(0.9, { duration: 90 })
  }

  const bg = theme.colors.foreground
  const textColor = theme.colors.background

  const bubblePosition: any = {
    top:    { bottom: '100%', left: '50%', marginBottom: OFFSET, transform: [{ translateX: '-50%' as any }] },
    bottom: { top: '100%', left: '50%', marginTop: OFFSET, transform: [{ translateX: '-50%' as any }] },
    left:   { right: '100%', top: '50%', marginRight: OFFSET, transform: [{ translateY: '-50%' as any }] },
    right:  { left: '100%', top: '50%', marginLeft: OFFSET, transform: [{ translateY: '-50%' as any }] },
  }[placement]

  return (
    <View style={[{ position: 'relative' as any }, style]}>
      <Pressable
        // @ts-ignore web events
        onMouseEnter={show}
        onMouseLeave={hide}
        onPress={() => open ? hide() : show()}
      >
        {children}
      </Pressable>

      {open && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              backgroundColor: bg,
              borderRadius: 7,
              paddingVertical: 6,
              paddingHorizontal: 10,
              maxWidth: 220,
              zIndex: 999,
              ...bubblePosition,
            },
            animStyle,
          ]}
          // @ts-ignore web
          pointerEvents="none"
        >
          <Text style={{ fontSize: 12, color: textColor, fontWeight: '500', whiteSpace: 'nowrap' as any }}>
            {content}
          </Text>
        </Animated.View>
      )}
    </View>
  )
}

// ─── Native version: Modal + measureInWindow ──────────────────────────────────

interface AnchorRect { x: number; y: number; width: number; height: number }

function TooltipNative({ content, placement = 'top', children, delay = 500, style }: TooltipProps) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<AnchorRect>({ x: 0, y: 0, width: 0, height: 0 })
  const anchorRef = useRef<View>(null)
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.88)

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const show = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height })
      setOpen(true)
      opacity.value = withTiming(1, { duration: 140 })
      scale.value = withSpring(1, { damping: 14, stiffness: 260 })
    })
  }

  const hide = () => {
    opacity.value = withTiming(0, { duration: 100 })
    scale.value = withTiming(0.88, { duration: 100 }, () => {
      runOnJS(setOpen)(false)
    })
  }

  const bg = theme.colors.foreground
  const textColor = theme.colors.background

  const cx = anchor.x + anchor.width / 2
  const cy = anchor.y + anchor.height / 2

  const bubbleStyle = {
    top:    { top: anchor.y - OFFSET - 32, left: cx - 60 },
    bottom: { top: anchor.y + anchor.height + OFFSET, left: cx - 60 },
    left:   { top: cy - 16, left: anchor.x - OFFSET - 120 },
    right:  { top: cy - 16, left: anchor.x + anchor.width + OFFSET },
  }[placement]

  return (
    <>
      <Pressable
        ref={anchorRef as React.RefObject<View>}
        onLongPress={show}
        delayLongPress={delay}
        style={style}
      >
        {children}
      </Pressable>

      {open && (
        <Modal visible transparent animationType="none" onRequestClose={hide} statusBarTranslucent>
          {/* Full-screen tap-to-dismiss — pointerEvents as prop, not style */}
          <Pressable pointerEvents="box-none" style={StyleSheet.absoluteFill} onPress={hide}>
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  backgroundColor: bg,
                  borderRadius: 7,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  maxWidth: 220,
                  minWidth: 60,
                  ...bubbleStyle,
                },
                animStyle,
              ]}
            >
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

// ─── Unified export ────────────────────────────────────────────────────────────

export const Tooltip: React.FC<TooltipProps> = (props) => {
  if (Platform.OS === 'web') return <TooltipWeb {...props} />
  return <TooltipNative {...props} />
}
