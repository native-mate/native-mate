// native-mate: swipeable-row@0.1.0 | hash:PLACEHOLDER
import React, { useRef, useCallback } from 'react'
import { View, Pressable, PanResponder, LayoutChangeEvent } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { SwipeableRowProps, SwipeAction } from './swipeable-row.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const SPRING_CONFIG = { damping: 22, stiffness: 220, mass: 0.8 }
const SNAP_BACK_SPRING = { damping: 20, stiffness: 260, mass: 0.6 }

const useStyles = makeStyles((theme) => ({
  container: {
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  row: {
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4,
  },
  actionLabel: {
    fontWeight: '600',
    fontSize: 12,
  },
}))

// ── Action button ────────────────────────────────────────────────────────────

interface ActionButtonProps {
  action: SwipeAction
  width: number
  progress: Animated.SharedValue<number>
  index: number
  total: number
  side: 'left' | 'right'
}

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  width,
  progress,
  index,
  total,
  side,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      Math.abs(progress.value),
      [0, width * 0.5, width * total],
      [0.6, 0.85, 1],
      Extrapolation.CLAMP
    )
    return { transform: [{ scale }] }
  })

  return (
    <Pressable
      onPress={action.onPress}
      accessibilityRole="button"
      accessibilityLabel={action.label}
      style={[
        {
          width,
          backgroundColor: action.color,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 8,
          gap: 4,
        },
      ]}
    >
      <Animated.View style={[{ alignItems: 'center', gap: 4 }, animatedStyle]}>
        {action.icon && action.icon}
        <Text
          style={{
            fontWeight: '600',
            fontSize: 12,
            color: action.textColor ?? '#fff',
          }}
        >
          {action.label}
        </Text>
      </Animated.View>
    </Pressable>
  )
}

// ── SwipeableRow ─────────────────────────────────────────────────────────────

export const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  leftActions = [],
  rightActions = [],
  swipeThreshold = 80,
  onSwipeLeft,
  onSwipeRight,
  friction = 0.8,
  actionWidth = 80,
  haptic = true,
  disabled = false,
  fullSwipeEnabled = true,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const translateX = useSharedValue(0)
  const rowWidth = useRef(0)
  const grantX = useRef(0)
  const hasTriggeredHaptic = useRef(false)
  const disabledRef = useRef(disabled)
  disabledRef.current = disabled

  const leftTotal = leftActions.length * actionWidth
  const rightTotal = rightActions.length * actionWidth
  const fullSwipeThreshold = 0.6 // 60% of row width

  const hapticTrigger = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
  }, [haptic])

  const handleFullSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (direction === 'left' && rightActions.length > 0) {
        const lastAction = rightActions[rightActions.length - 1]
        translateX.value = withTiming(-rowWidth.current, { duration: 200 }, () => {
          runOnJS(lastAction.onPress)()
          if (onSwipeLeft) runOnJS(onSwipeLeft)()
          translateX.value = withSpring(0, SNAP_BACK_SPRING)
        })
      } else if (direction === 'right' && leftActions.length > 0) {
        const lastAction = leftActions[leftActions.length - 1]
        translateX.value = withTiming(rowWidth.current, { duration: 200 }, () => {
          runOnJS(lastAction.onPress)()
          if (onSwipeRight) runOnJS(onSwipeRight)()
          translateX.value = withSpring(0, SNAP_BACK_SPRING)
        })
      }
    },
    [leftActions, rightActions, onSwipeLeft, onSwipeRight]
  )

  const handleFullSwipeRef = useRef(handleFullSwipe)
  handleFullSwipeRef.current = handleFullSwipe
  const hapticTriggerRef = useRef(hapticTrigger)
  hapticTriggerRef.current = hapticTrigger

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => {
        if (disabledRef.current) return false
        return Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5
      },
      onPanResponderGrant: () => {
        grantX.current = translateX.value
        hasTriggeredHaptic.current = false
      },
      onPanResponderMove: (_, gs) => {
        if (disabledRef.current) return
        let dx = grantX.current + gs.dx * friction

        // Clamp: only allow swipe if actions exist on that side
        if (dx > 0 && leftActions.length === 0) dx = 0
        if (dx < 0 && rightActions.length === 0) dx = 0

        // Rubber band past action area
        if (dx > leftTotal) {
          const over = dx - leftTotal
          dx = leftTotal + over * 0.3
        }
        if (dx < -rightTotal) {
          const over = Math.abs(dx) - rightTotal
          dx = -(rightTotal + over * 0.3)
        }

        translateX.value = dx

        // Haptic at threshold
        const absX = Math.abs(dx)
        if (absX > swipeThreshold && !hasTriggeredHaptic.current) {
          hasTriggeredHaptic.current = true
          hapticTriggerRef.current()
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (disabledRef.current) return
        const dx = translateX.value
        const absX = Math.abs(dx)
        const rw = rowWidth.current

        // Full swipe detection
        if (fullSwipeEnabled && rw > 0 && absX > rw * fullSwipeThreshold) {
          handleFullSwipeRef.current(dx < 0 ? 'left' : 'right')
          return
        }

        // Snap to open or closed
        if (dx > 0 && absX > swipeThreshold && leftActions.length > 0) {
          translateX.value = withSpring(leftTotal, SPRING_CONFIG)
        } else if (dx < 0 && absX > swipeThreshold && rightActions.length > 0) {
          translateX.value = withSpring(-rightTotal, SPRING_CONFIG)
        } else {
          translateX.value = withSpring(0, SNAP_BACK_SPRING)
        }
      },
    })
  ).current

  const rowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const leftActionsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, actionWidth * 0.5],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }))

  const rightActionsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-actionWidth * 0.5, 0],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }))

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    rowWidth.current = e.nativeEvent.layout.width
  }, [])

  return (
    <View
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}
      onLayout={handleLayout}
      accessibilityRole="none"
    >
      {/* Left actions (revealed on right swipe) */}
      {leftActions.length > 0 && (
        <Animated.View
          style={[
            styles.actionsContainer,
            { left: 0, width: leftTotal },
            leftActionsStyle,
          ]}
        >
          {leftActions.map((action, i) => (
            <ActionButton
              key={i}
              action={action}
              width={actionWidth}
              progress={translateX}
              index={i}
              total={leftActions.length}
              side="left"
            />
          ))}
        </Animated.View>
      )}

      {/* Right actions (revealed on left swipe) */}
      {rightActions.length > 0 && (
        <Animated.View
          style={[
            styles.actionsContainer,
            { right: 0, width: rightTotal },
            rightActionsStyle,
          ]}
        >
          {rightActions.map((action, i) => (
            <ActionButton
              key={i}
              action={action}
              width={actionWidth}
              progress={translateX}
              index={i}
              total={rightActions.length}
              side="right"
            />
          ))}
        </Animated.View>
      )}

      {/* Main row content */}
      <Animated.View
        style={[styles.row, rowAnimatedStyle]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  )
}
