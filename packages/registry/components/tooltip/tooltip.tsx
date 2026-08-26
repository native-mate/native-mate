// native-mate: tooltip@0.1.0 | hash:PLACEHOLDER
import React, { useRef, useState, useCallback, useEffect } from 'react'
import { View, Pressable, Modal, StyleSheet, Platform, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { TooltipProps, TooltipPosition } from './tooltip.types'

const OFFSET = 8
const ARROW_SIZE = 6
const SCREEN_PADDING = 12

interface AnchorRect { x: number; y: number; width: number; height: number }

const useStyles = makeStyles((theme) => ({
  bubble: {
    position: 'absolute',
    backgroundColor: theme.colors.foreground,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 11,
  },
  arrow: {
    position: 'absolute',
    width: ARROW_SIZE * 2,
    height: ARROW_SIZE * 2,
    backgroundColor: theme.colors.foreground,
    transform: [{ rotate: '45deg' }],
  },
}))

function getBubblePosition(
  position: TooltipPosition,
  anchor: AnchorRect,
  maxWidth: number,
): { top: number; left: number; arrowStyle: Record<string, any>; adjustedPosition: TooltipPosition } {
  const { width: screenW, height: screenH } = Dimensions.get('window')
  const cx = anchor.x + anchor.width / 2
  const cy = anchor.y + anchor.height / 2
  let adjustedPosition = position

  // Auto-flip if not enough space
  if (position === 'top' && anchor.y < 60) adjustedPosition = 'bottom'
  if (position === 'bottom' && anchor.y + anchor.height > screenH - 60) adjustedPosition = 'top'
  if (position === 'left' && anchor.x < maxWidth + OFFSET + SCREEN_PADDING) adjustedPosition = 'right'
  if (position === 'right' && anchor.x + anchor.width + maxWidth + OFFSET > screenW - SCREEN_PADDING) adjustedPosition = 'left'

  let left = Math.max(SCREEN_PADDING, Math.min(cx - maxWidth / 2, screenW - maxWidth - SCREEN_PADDING))

  switch (adjustedPosition) {
    case 'top':
      return {
        top: anchor.y - OFFSET - 36,
        left,
        arrowStyle: {
          top: '100%',
          left: cx - left - ARROW_SIZE,
          marginTop: -ARROW_SIZE,
        },
        adjustedPosition,
      }
    case 'bottom':
      return {
        top: anchor.y + anchor.height + OFFSET,
        left,
        arrowStyle: {
          bottom: '100%',
          left: cx - left - ARROW_SIZE,
          marginBottom: -ARROW_SIZE,
        },
        adjustedPosition,
      }
    case 'left':
      return {
        top: cy - 18,
        left: anchor.x - OFFSET - maxWidth,
        arrowStyle: {
          top: 12,
          right: -ARROW_SIZE,
        },
        adjustedPosition,
      }
    case 'right':
      return {
        top: cy - 18,
        left: anchor.x + anchor.width + OFFSET,
        arrowStyle: {
          top: 12,
          left: -ARROW_SIZE,
        },
        adjustedPosition,
      }
  }
}

// ─── Web version ─────────────────────────────────────────────────────────────

function TooltipWeb({
  content,
  position = 'top',
  children,
  delay = 300,
  visible: controlledVisible,
  onOpenChange,
  maxWidth = 220,
  style,
}: TooltipProps) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isOpen = controlledVisible ?? open

  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.9)

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setOpen(true)
      onOpenChange?.(true)
      opacity.value = withTiming(1, { duration: 130 })
      scale.value = withSpring(1, { damping: 14, stiffness: 280 })
    }, delay)
  }, [delay, onOpenChange])

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    opacity.value = withTiming(0, { duration: 90 }, () => {
      runOnJS(setOpen)(false)
    })
    scale.value = withTiming(0.9, { duration: 90 })
    onOpenChange?.(false)
  }, [onOpenChange])

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  // Drive the entrance/exit animation when visibility is controlled externally
  // (i.e. not toggled via this component's own hover/press handlers).
  useEffect(() => {
    if (controlledVisible === undefined) return
    if (controlledVisible) {
      opacity.value = withTiming(1, { duration: 130 })
      scale.value = withSpring(1, { damping: 14, stiffness: 280 })
    } else {
      opacity.value = withTiming(0, { duration: 90 })
      scale.value = withTiming(0.9, { duration: 90 })
    }
  }, [controlledVisible])

  const bg = theme.colors.foreground
  const textColor = theme.colors.background

  const bubblePosition: any = {
    top:    { bottom: '100%', left: '50%', marginBottom: OFFSET, transform: [{ translateX: '-50%' as any }] },
    bottom: { top: '100%', left: '50%', marginTop: OFFSET, transform: [{ translateX: '-50%' as any }] },
    left:   { right: '100%', top: '50%', marginRight: OFFSET, transform: [{ translateY: '-50%' as any }] },
    right:  { left: '100%', top: '50%', marginLeft: OFFSET, transform: [{ translateY: '-50%' as any }] },
  }[position]

  const arrowPosition: any = {
    top:    { top: '100%', left: '50%', marginLeft: -ARROW_SIZE, marginTop: -ARROW_SIZE },
    bottom: { bottom: '100%', left: '50%', marginLeft: -ARROW_SIZE, marginBottom: -ARROW_SIZE },
    left:   { left: '100%', top: '50%', marginTop: -ARROW_SIZE, marginLeft: -ARROW_SIZE },
    right:  { right: '100%', top: '50%', marginTop: -ARROW_SIZE, marginRight: -ARROW_SIZE },
  }[position]

  return (
    <View style={[{ position: 'relative' as any }, style]}>
      <Pressable
        // @ts-ignore web events
        onMouseEnter={show}
        onMouseLeave={hide}
        onPress={() => (isOpen ? hide() : show())}
      >
        {children}
      </Pressable>

      {isOpen && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              backgroundColor: bg,
              borderRadius: 8,
              paddingVertical: 7,
              paddingHorizontal: 11,
              maxWidth,
              zIndex: 999,
              ...bubblePosition,
            },
            animStyle,
          ]}
          // @ts-ignore web
          pointerEvents="none"
        >
          {/* Arrow */}
          <View
            style={{
              position: 'absolute',
              width: ARROW_SIZE * 2,
              height: ARROW_SIZE * 2,
              backgroundColor: bg,
              transform: [{ rotate: '45deg' }],
              ...arrowPosition,
            }}
          />
          {typeof content === 'string' ? (
            <Text style={{ fontSize: 12, color: textColor, ...fontStyle(theme.typography, 'medium') }}>
              {content}
            </Text>
          ) : (
            content
          )}
        </Animated.View>
      )}
    </View>
  )
}

// ─── Native version ──────────────────────────────────────────────────────────

function TooltipNative({
  content,
  position = 'top',
  children,
  delay = 500,
  visible: controlledVisible,
  onOpenChange,
  maxWidth = 220,
  style,
}: TooltipProps) {
  const theme = useTheme()
  const styles = useStyles()
  const anchorRef = useRef<View>(null)
  const [anchor, setAnchor] = useState<AnchorRect>({ x: 0, y: 0, width: 0, height: 0 })
  const [internalOpen, setInternalOpen] = useState(false)

  const isOpen = controlledVisible ?? internalOpen
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.88)

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const show = useCallback(() => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height })
      setInternalOpen(true)
      onOpenChange?.(true)
      opacity.value = withTiming(1, { duration: 140 })
      scale.value = withSpring(1, { damping: 14, stiffness: 260 })
    })
  }, [onOpenChange])

  // Drive the entrance animation + anchor measurement when visibility is
  // controlled externally (i.e. not toggled via long-press on this component).
  useEffect(() => {
    if (controlledVisible === undefined) return
    if (controlledVisible) {
      anchorRef.current?.measureInWindow((x, y, width, height) => {
        setAnchor({ x, y, width, height })
        opacity.value = withTiming(1, { duration: 140 })
        scale.value = withSpring(1, { damping: 14, stiffness: 260 })
      })
    } else {
      opacity.value = withTiming(0, { duration: 100 })
      scale.value = withTiming(0.88, { duration: 100 })
    }
  }, [controlledVisible])

  const hide = useCallback(() => {
    opacity.value = withTiming(0, { duration: 100 })
    scale.value = withTiming(0.88, { duration: 100 }, () => {
      runOnJS(setInternalOpen)(false)
    })
    onOpenChange?.(false)
  }, [onOpenChange])

  const bg = theme.colors.foreground
  const textColor = theme.colors.background

  const layout = getBubblePosition(position, anchor, maxWidth)

  return (
    <>
      <Pressable
        ref={anchorRef as React.RefObject<View>}
        onLongPress={show}
        delayLongPress={delay}
        style={style}
        accessibilityRole="button"
        accessibilityHint="Long press to show tooltip"
      >
        {children}
      </Pressable>

      {isOpen && (
        <Modal visible transparent animationType="none" onRequestClose={hide} statusBarTranslucent>
          <Pressable
            pointerEvents="box-none"
            style={StyleSheet.absoluteFill}
            onPress={hide}
          >
            <Animated.View
              style={[
                styles.bubble,
                {
                  top: layout.top,
                  left: layout.left,
                  maxWidth,
                  minWidth: 40,
                },
                animStyle,
              ]}
            >
              {/* Arrow */}
              <View style={[styles.arrow, layout.arrowStyle]} />
              {typeof content === 'string' ? (
                <Text style={{ fontSize: 12, color: textColor, ...fontStyle(theme.typography, 'medium') }}>
                  {content}
                </Text>
              ) : (
                content
              )}
            </Animated.View>
          </Pressable>
        </Modal>
      )}
    </>
  )
}

// ─── Unified export ──────────────────────────────────────────────────────────

export const Tooltip: React.FC<TooltipProps> = (props) => {
  if (Platform.OS === 'web') return <TooltipWeb {...props} />
  return <TooltipNative {...props} />
}
