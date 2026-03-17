// native-mate: skeleton@0.2.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { useTheme, makeStyles } from '@native-mate/core'
import type { SkeletonProps, SkeletonTextProps, SkeletonAvatarProps, SkeletonCardProps } from './skeleton.types'

// Base skeleton bone — handles both pulse and shimmer
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius,
  variant = 'shimmer',
  style,
}) => {
  const theme = useTheme()
  const opacity = useSharedValue(1)
  const shimmerX = useSharedValue(-1)

  useEffect(() => {
    if (variant === 'pulse') {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.85, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      )
    } else {
      shimmerX.value = withRepeat(
        withSequence(
          withTiming(-1, { duration: 0 }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      )
    }
  }, [variant])

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value * 300 }],
  }))

  const br = borderRadius ?? theme.radius.md

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: br,
          backgroundColor: theme.colors.surface ?? '#27272a',
          overflow: 'hidden',
        },
        variant === 'pulse' ? pulseStyle : undefined,
        style,
      ]}
      accessibilityRole="none"
      accessible={false}
    >
      {variant === 'shimmer' && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: (theme.colors.surfaceRaised ?? theme.colors.border ?? '#3f3f46') + '80',
              // Extra wide so the shine covers fully at edges
              left: '-50%' as any,
              right: '-50%' as any,
            },
            shimmerStyle,
          ]}
        />
      )}
    </Animated.View>
  )
}

// Multiple text lines
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  lastLineWidth = '65%',
  variant = 'shimmer',
  style,
}) => {
  const widths = Array.from({ length: lines }, (_, i) =>
    i === lines - 1 ? lastLineWidth : `${100 - i * 8}%`
  )
  return (
    <View style={[{ gap: 8 }, style]}>
      {widths.map((w, i) => (
        <Skeleton key={i} width={w as any} height={12} variant={variant} />
      ))}
    </View>
  )
}

// Avatar circle + text lines beside it
export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 44,
  showText = true,
  textLines = 2,
  variant = 'shimmer',
  style,
}) => {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12 }, style]}>
      <Skeleton width={size} height={size} borderRadius={size / 2} variant={variant} />
      {showText && (
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton width="55%" height={12} variant={variant} />
          {textLines > 1 && <Skeleton width="80%" height={10} variant={variant} />}
        </View>
      )}
    </View>
  )
}

// Card with image + text
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  imageHeight = 160,
  lines = 2,
  variant = 'shimmer',
  style,
}) => {
  const theme = useTheme()
  return (
    <View style={[{
      borderRadius: theme.radius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border ?? '#3f3f46',
    }, style]}>
      <Skeleton width="100%" height={imageHeight} borderRadius={0} variant={variant} />
      <View style={{ padding: 12, gap: 8 }}>
        <Skeleton width="75%" height={14} variant={variant} />
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <Skeleton key={i} width={i === lines - 2 ? '50%' : '90%'} height={11} variant={variant} />
        ))}
      </View>
    </View>
  )
}
