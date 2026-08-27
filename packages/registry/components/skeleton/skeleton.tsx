// native-mate: skeleton@0.2.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import { View, Platform, StyleSheet, LayoutChangeEvent } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { useTheme, useMotion, withAlpha } from '@native-mate/core'
import type { SkeletonProps, SkeletonTextProps, SkeletonAvatarProps, SkeletonCardProps } from './skeleton.types'

// ─── CSS injection (web only) ──────────────────────────────────────────────────

let cssInjected = false
function injectSkeletonCSS(nonce?: string) {
  if (cssInjected || Platform.OS !== 'web') return
  // Platform.OS === 'web' still covers SSR / static prerender passes where
  // there is no DOM at all, so guard on `document` before touching it.
  if (typeof document === 'undefined' || !document.head) return
  cssInjected = true
  const el = document.createElement('style')
  // Under a strict Content-Security-Policy an injected <style> needs the
  // page's nonce or the browser drops it.
  if (nonce) el.setAttribute('nonce', nonce)
  el.textContent = `
    @keyframes nm-skeleton-shimmer {
      0%   { transform: translateX(-100%); }
      100% { transform: translateX(250%); }
    }
    @keyframes nm-skeleton-pulse {
      0%, 100% { opacity: 0.85; }
      50%       { opacity: 0.4;  }
    }
  `
  document.head.appendChild(el)
}

// ─── Web bone ─────────────────────────────────────────────────────────────────

function WebSkeleton({
  width, height, borderRadius, variant, baseColor, shimmerColor, style, nonce,
}: {
  width: string | number
  height: number
  borderRadius: number
  variant: 'shimmer' | 'pulse'
  baseColor: string
  shimmerColor: string
  style?: any
  nonce?: string
}) {
  useEffect(() => { injectSkeletonCSS(nonce) }, [nonce])

  const w = typeof width === 'number' ? `${width}px` : width

  return React.createElement(
    'div',
    {
      style: {
        width: w, height, borderRadius,
        backgroundColor: baseColor,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        animation: variant === 'pulse'
          ? 'nm-skeleton-pulse 1.2s ease-in-out infinite'
          : undefined,
        ...(style as React.CSSProperties),
      } as React.CSSProperties,
    },
    variant === 'shimmer'
      ? React.createElement('div', {
          style: {
            position: 'absolute', inset: 0,
            background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
            animation: 'nm-skeleton-shimmer 1.6s ease-in-out infinite',
          } as React.CSSProperties,
        })
      : null,
  ) as unknown as React.ReactElement
}

// ─── Native bone (Reanimated) ─────────────────────────────────────────────────

function NativeSkeleton({
  width, height, borderRadius, variant, baseColor, shimmerColor, style,
}: {
  width: string | number
  height: number
  borderRadius: number
  variant: 'shimmer' | 'pulse'
  baseColor: string
  shimmerColor: string
  style?: any
}) {
  const motion = useMotion()
  const opacity  = useSharedValue(1)
  const shimmerX = useSharedValue(-1)
  // Sweep distance for the shimmer highlight, measured from the bone's
  // actual rendered width so wide/narrow bones shimmer proportionally
  // instead of always sweeping a hardcoded 300px.
  const [boneWidth, setBoneWidth] = React.useState(300)
  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width
    if (w > 0 && w !== boneWidth) setBoneWidth(w)
  }

  useEffect(() => {
    // Purely decorative loading loops: under reduce-motion, leave the bone
    // in its resting state instead of animating even once.
    if (motion.reduced) {
      opacity.value = 0.85
      shimmerX.value = -1
      return
    }
    if (variant === 'pulse') {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.4,  { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.85, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        motion.loops(-1), false,
      )
    } else {
      shimmerX.value = withRepeat(
        withSequence(
          withTiming(-1, { duration: 0 }),
          withTiming(1,  { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        ),
        motion.loops(-1), false,
      )
    }
  }, [variant, motion.reduced])

  const pulseStyle   = useAnimatedStyle(() => ({ opacity: opacity.value }))
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value * boneWidth }],
  }), [boneWidth])

  return (
    <Animated.View
      onLayout={handleLayout}
      style={[
        {
          width: width as any, height, borderRadius,
          backgroundColor: baseColor,
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
            { backgroundColor: shimmerColor, left: '-50%' as any, right: '-50%' as any },
            shimmerStyle,
          ]}
        />
      )}
    </Animated.View>
  )
}

// ─── Public Skeleton ───────────────────────────────────────────────────────────

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius,
  variant = 'shimmer',
  style,
  nonce,
}) => {
  const theme = useTheme()
  const br          = borderRadius ?? theme.radius.md
  const baseColor   = theme.colors.surfaceRaised
  const shimmerColor = withAlpha(theme.colors.border, 0.56)

  if (Platform.OS === 'web') {
    return (
      <WebSkeleton
        width={width as string | number}
        height={height}
        borderRadius={br}
        variant={variant}
        baseColor={baseColor}
        shimmerColor={shimmerColor}
        style={style}
        nonce={nonce}
      />
    )
  }

  return (
    <NativeSkeleton
      width={width as string | number}
      height={height}
      borderRadius={br}
      variant={variant}
      baseColor={baseColor}
      shimmerColor={shimmerColor}
      style={style}
    />
  )
}

// ─── Composites ────────────────────────────────────────────────────────────────

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  lastLineWidth = '65%',
  variant = 'shimmer',
  style,
  nonce,
}) => {
  const lineCount = Math.max(0, Math.trunc(lines) || 0)
  // Each line steps 8% narrower; past 12 lines that formula goes to zero and
  // then negative, so floor the taper at a still-visible 30%.
  const widths = Array.from({ length: lineCount }, (_, i) =>
    i === lineCount - 1 ? lastLineWidth : `${Math.max(30, 100 - i * 8)}%`
  )
  return (
    <View style={[{ gap: 8 }, style]}>
      {widths.map((w, i) => (
        <Skeleton key={i} width={w as any} height={12} variant={variant} nonce={nonce} />
      ))}
    </View>
  )
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 44,
  showText = true,
  textLines = 2,
  variant = 'shimmer',
  style,
}) => (
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
      borderColor: theme.colors.border,
    }, style]}>
      <Skeleton width="100%" height={imageHeight} borderRadius={0} variant={variant} />
      <View style={{ padding: 12, gap: 8 }}>
        <Skeleton width="75%" height={14} variant={variant} />
        {Array.from({ length: Math.max(0, lines - 1) }).map((_, i) => (
          <Skeleton key={i} width={i === lines - 2 ? '50%' : '90%'} height={11} variant={variant} />
        ))}
      </View>
    </View>
  )
}
