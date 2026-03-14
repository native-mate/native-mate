// native-mate: tooltip@0.1.0 | hash:PLACEHOLDER
import React, { useRef, useState } from 'react'
import { View, Pressable, Modal } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated'
import { makeStyles, Text, useTheme } from '@native-mate/core'
import type { TooltipProps, TooltipPlacement } from './tooltip.types'

const useStyles = makeStyles((theme) => ({
  bubble: {
    position: 'absolute',
    backgroundColor: theme.colors.foreground,
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    maxWidth: 220,
    zIndex: 9999,
  },
  arrow: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: theme.colors.foreground,
    transform: [{ rotate: '45deg' }],
  },
}))

const OFFSET = 8

export const Tooltip: React.FC<TooltipProps> = ({ content, placement = 'top', children, style }) => {
  const theme = useTheme()
  const styles = useStyles()
  const [visible, setVisible] = useState(false)
  const [anchorLayout, setAnchorLayout] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.9)
  const anchorRef = useRef<View>(null)

  const show = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchorLayout({ x, y, width, height })
      setVisible(true)
      opacity.value = withTiming(1, { duration: theme.animation.speed.fast })
      scale.value = withSpring(1, theme.animation.easing.spring)
    })
  }

  const hide = () => {
    opacity.value = withTiming(0, { duration: 100 })
    scale.value = withSpring(0.9, theme.animation.easing.spring)
    setTimeout(() => setVisible(false), 120)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const getBubblePosition = (): ViewStyle => {
    const { x, y, width, height } = anchorLayout
    switch (placement) {
      case 'bottom': return { top: y + height + OFFSET, left: x + width / 2 }
      case 'left':   return { top: y + height / 2, left: x - OFFSET, transform: [{ translateX: -100 }, { translateY: -50 }] }
      case 'right':  return { top: y + height / 2, left: x + width + OFFSET, transform: [{ translateY: -50 }] }
      default:       return { top: y - OFFSET, left: x + width / 2, transform: [{ translateX: -50 }, { translateY: -100 }] }
    }
  }

  type ViewStyle = { top?: number; left?: number; transform?: object[] }

  return (
    <>
      <Pressable ref={anchorRef as React.RefObject<View>} onPress={show} onLongPress={show} onPressOut={hide} style={style}>
        {children}
      </Pressable>
      {visible && (
        <Modal visible transparent onRequestClose={hide}>
          <Pressable style={{ flex: 1 }} onPress={hide}>
            <Animated.View
              style={[
                styles.bubble,
                getBubblePosition() as object,
                animatedStyle,
              ]}
            >
              <Text size="xs" style={{ color: theme.colors.background }}>{content}</Text>
            </Animated.View>
          </Pressable>
        </Modal>
      )}
    </>
  )
}
