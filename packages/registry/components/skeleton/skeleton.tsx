// native-mate: skeleton@0.1.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated'
import { useTheme } from '@native-mate/core'
import type { SkeletonProps } from './skeleton.types'

export const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = 16, borderRadius, style }) => {
  const theme = useTheme()
  const opacity = useSharedValue(0.4)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: theme.animation.speed.slow }),
      -1, true,
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius: borderRadius ?? theme.radius.md, backgroundColor: theme.colors.surface },
        animatedStyle,
        style,
      ]}
      accessibilityRole="none"
      accessible={false}
    />
  )
}
