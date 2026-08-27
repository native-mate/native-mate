// native-mate: pull-to-refresh@0.1.0 | hash:PLACEHOLDER
import React, { useRef, useState, useCallback, useEffect } from 'react'
import { View, ScrollView, PanResponder, ActivityIndicator, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated'
import { useTheme, makeStyles } from '@native-mate/core'
import type { PullToRefreshProps } from './pull-to-refresh.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const SPRING = { damping: 20, stiffness: 200, mass: 0.7 }
const MAX_PULL = 150

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  indicatorContainer: {
    position: 'absolute',
    start: 0,
    end: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  defaultIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  arcContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

// ── Progress arc using View borders ──────────────────────────────────────────

interface ProgressArcProps {
  progress: number
  size: number
  color: string
  strokeWidth: number
}

const ProgressArc: React.FC<ProgressArcProps> = ({
  progress,
  size,
  color,
  strokeWidth,
}) => {
  const rotation = progress * 360

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: color + '25',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: 'transparent',
          borderTopColor: color,
          borderRightColor: progress > 0.25 ? color : 'transparent',
          borderBottomColor: progress > 0.5 ? color : 'transparent',
          borderLeftColor: progress > 0.75 ? color : 'transparent',
          transform: [{ rotate: '-90deg' }],
        }}
      />
    </View>
  )
}

// ── Default indicator ────────────────────────────────────────────────────────

interface DefaultIndicatorProps {
  progress: number
  refreshing: boolean
  color: string
  size: number
}

const DefaultIndicator: React.FC<DefaultIndicatorProps> = ({
  progress,
  refreshing,
  color,
  size,
}) => {
  const styles = useStyles()
  const spinRotation = useSharedValue(0)

  useEffect(() => {
    if (refreshing) {
      spinRotation.value = withRepeat(
        withTiming(360, { duration: 800, easing: Easing.linear }),
        -1,
        false
      )
    } else {
      spinRotation.value = withTiming(0, { duration: 200 })
    }
  }, [refreshing])

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinRotation.value}deg` }],
  }))

  if (refreshing) {
    return (
      <View style={styles.defaultIndicator}>
        <Animated.View style={spinStyle}>
          <ActivityIndicator size="small" color={color} />
        </Animated.View>
      </View>
    )
  }

  return (
    <View style={styles.defaultIndicator}>
      <ProgressArc
        progress={Math.min(progress, 1)}
        size={size}
        color={color}
        strokeWidth={2.5}
      />
    </View>
  )
}

// ── PullToRefresh ────────────────────────────────────────────────────────────

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  refreshing,
  children,
  indicatorColor: indicatorColorProp,
  indicatorSize = 28,
  pullDistance = 80,
  renderIndicator,
  haptic = true,
  disabled = false,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const indicatorColor = indicatorColorProp ?? theme.colors.primary
  const translateY = useSharedValue(0)
  const pullProgress = useSharedValue(0)
  const [progress, setProgress] = useState(0)
  const isAtTop = useRef(true)
  const hasTriggered = useRef(false)
  const grantY = useRef(0)
  const disabledRef = useRef(disabled)
  disabledRef.current = disabled

  const scrollRef = useRef<ScrollView>(null)

  // When refreshing completes, spring back
  useEffect(() => {
    if (!refreshing && translateY.value > 0) {
      translateY.value = withSpring(0, SPRING)
      pullProgress.value = withTiming(0, { duration: 200 })
      hasTriggered.current = false
      setProgress(0)
    }
  }, [refreshing])

  // When refreshing starts, hold at pull distance
  useEffect(() => {
    if (refreshing) {
      translateY.value = withSpring(pullDistance * 0.7, SPRING)
    }
  }, [refreshing])

  const handleRefreshTrigger = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    onRefresh()
  }, [haptic, onRefresh])

  const handleRefreshRef = useRef(handleRefreshTrigger)
  handleRefreshRef.current = handleRefreshTrigger

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) => {
        if (disabledRef.current) return false
        return isAtTop.current && gs.dy > 10 && gs.dy > Math.abs(gs.dx)
      },
      onPanResponderGrant: () => {
        grantY.current = translateY.value
        hasTriggered.current = false
      },
      onPanResponderMove: (_, gs) => {
        if (disabledRef.current) return
        const dy = Math.max(0, grantY.current + gs.dy)
        // Rubber band effect past pull distance
        const capped = dy > pullDistance
          ? pullDistance + (dy - pullDistance) * 0.3
          : dy
        const limited = Math.min(capped, MAX_PULL)
        translateY.value = limited
        const nextProgress = Math.min(limited / pullDistance, 1)
        pullProgress.value = nextProgress
        const rounded = Math.round(nextProgress * 100) / 100
        setProgress((prev) => (prev === rounded ? prev : rounded))

        // Trigger at threshold
        if (limited >= pullDistance && !hasTriggered.current) {
          hasTriggered.current = true
          runOnJS(handleRefreshRef.current)()
        }
      },
      onPanResponderRelease: () => {
        if (!hasTriggered.current) {
          translateY.value = withSpring(0, SPRING)
          pullProgress.value = withTiming(0, { duration: 200 })
          setProgress(0)
        }
      },
    })
  ).current

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          translateY.value,
          [0, pullDistance],
          [-40, 10],
          Extrapolation.CLAMP
        ),
      },
      {
        scale: interpolate(
          translateY.value,
          [0, pullDistance * 0.5, pullDistance],
          [0.4, 0.8, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
    opacity: interpolate(
      translateY.value,
      [0, pullDistance * 0.3],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }))

  const handleScroll = useCallback((e: any) => {
    isAtTop.current = e.nativeEvent.contentOffset.y <= 0
  }, [])

  return (
    <View style={[styles.container, style]}>
      {/* Indicator */}
      <Animated.View style={[styles.indicatorContainer, { top: 0 }, indicatorStyle]}>
        {renderIndicator ? (
          renderIndicator({
            progress,
            refreshing,
          })
        ) : (
          <DefaultIndicator
            progress={progress}
            refreshing={refreshing}
            color={indicatorColor}
            size={indicatorSize}
          />
        )}
      </Animated.View>

      {/* Content */}
      <Animated.View style={[{ flex: 1 }, contentStyle]} {...panResponder.panHandlers}>
        <ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          bounces={false}
          overScrollMode="never"
          accessibilityRole="scrollbar"
        >
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  )
}
