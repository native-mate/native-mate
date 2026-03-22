// native-mate: progress@0.1.0 | hash:5e63ee50ecf2530e
import React from 'react'
import { View, Platform } from 'react-native'
import Animated, {
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  useSharedValue,
  Easing,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { ProgressProps } from './progress.types'

const linearHeights = { sm: 4, md: 8, lg: 12 }
const circularSizes = { sm: 36, md: 52, lg: 68 }
const circularStroke = { sm: 4, md: 5, lg: 6 }

const useStyles = makeStyles((theme) => ({
  track: { borderRadius: theme.radius.full, backgroundColor: theme.colors.surface, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: theme.radius.full },
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  label: { marginBottom: 4 },
}))

// Circular progress — SVG arc on web, half-circle clip on native
function CircularRing({
  value,
  size,
  color,
  trackColor,
  showValue,
  innerBg,
}: {
  value: number
  size: 'sm' | 'md' | 'lg'
  color: string
  trackColor: string
  showValue: boolean
  innerBg: string
}) {
  const diameter = circularSizes[size]
  const stroke = circularStroke[size]
  const clamped = Math.min(100, Math.max(0, value))

  // ── Web: SVG with strokeDashoffset for smooth arc ──────────────────────────
  if (Platform.OS === 'web') {
    const radius = (diameter - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const dashOffset = circumference - (clamped / 100) * circumference
    const cx = diameter / 2
    const cy = diameter / 2

    const svg = React.createElement(
      'svg' as unknown as React.ElementType,
      { width: diameter, height: diameter, viewBox: `0 0 ${diameter} ${diameter}`, style: { display: 'block' } },
      // Track
      React.createElement('circle' as unknown as React.ElementType, {
        cx, cy, r: radius, fill: 'none', stroke: trackColor, strokeWidth: stroke,
      }),
      // Arc
      React.createElement('circle' as unknown as React.ElementType, {
        cx, cy, r: radius, fill: 'none', stroke: color, strokeWidth: stroke,
        strokeDasharray: circumference, strokeDashoffset: dashOffset,
        strokeLinecap: 'round',
        transform: `rotate(-90 ${cx} ${cy})`,
        style: { transition: 'stroke-dashoffset 0.5s ease' },
      }),
      // Value text
      showValue
        ? React.createElement(
            'text' as unknown as React.ElementType,
            {
              x: cx, y: cy,
              textAnchor: 'middle', dominantBaseline: 'central',
              fill: color, fontSize: Math.round(diameter * 0.18), fontWeight: '700',
            },
            `${Math.round(clamped)}%`,
          )
        : null,
    ) as unknown as React.ReactElement

    return svg
  }

  // ── Native: two rotating half-circle clips ─────────────────────────────────
  const deg = (clamped / 100) * 360
  const leftDeg = deg > 180 ? 180 : deg
  const rightDeg = deg > 180 ? deg - 180 : 0

  const containerStyle = {
    width: diameter, height: diameter,
    borderRadius: diameter / 2, backgroundColor: trackColor,
    alignItems: 'center' as const, justifyContent: 'center' as const, position: 'relative' as const,
  }
  const halfBase = {
    position: 'absolute' as const, width: diameter, height: diameter,
    borderRadius: diameter / 2, overflow: 'hidden' as const,
  }
  const rightClip = { ...halfBase, left: diameter / 2, width: diameter / 2 }
  const rightFill = {
    position: 'absolute' as const, right: 0, width: diameter, height: diameter,
    borderRadius: diameter / 2, backgroundColor: color,
    transform: [{ rotate: `${rightDeg}deg` }],
  }
  const leftClip = { ...halfBase, width: diameter / 2, overflow: 'hidden' as const }
  const leftFill = {
    position: 'absolute' as const, left: 0, width: diameter, height: diameter,
    borderRadius: diameter / 2, backgroundColor: color,
    transform: [{ rotate: `${leftDeg}deg` }],
    display: (deg > 180 ? 'flex' : 'none') as 'flex' | 'none',
  }
  const innerSize = diameter - stroke * 2

  return (
    <View style={containerStyle}>
      {rightDeg > 0 && <View style={rightClip}><View style={rightFill} /></View>}
      {deg > 180 && <View style={leftClip}><View style={leftFill} /></View>}
      <View style={{
        width: innerSize, height: innerSize, borderRadius: innerSize / 2,
        backgroundColor: innerBg, alignItems: 'center', justifyContent: 'center', zIndex: 2,
      }}>
        {showValue && (
          <Text style={{ fontSize: diameter * 0.18, fontWeight: '700', color }}>
            {Math.round(clamped)}%
          </Text>
        )}
      </View>
    </View>
  )
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  variant = 'linear',
  size = 'md',
  color,
  trackColor,
  showValue = false,
  label,
  indeterminate = false,
  animated = true,
  accessibilityLabel,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const clampedValue = Math.min(100, Math.max(0, value))
  const fillColor = color ?? theme.colors.primary
  const bgColor = trackColor ?? theme.colors.surface

  // Indeterminate shimmer position
  const shimmerX = useSharedValue(-1)
  React.useEffect(() => {
    if (indeterminate) {
      shimmerX.value = withRepeat(
        withSequence(
          withTiming(-1, { duration: 0 }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      )
    }
  }, [indeterminate])

  if (variant === 'circular') {
    return (
      <CircularRing
        value={clampedValue}
        size={size}
        color={fillColor}
        trackColor={bgColor}
        showValue={showValue}
        innerBg={theme.colors.background ?? '#09090b'}
      />
    )
  }

  const h = linearHeights[size]

  const fillStyle = useAnimatedStyle(() => ({
    // withTiming with percentage strings doesn't interpolate correctly in React Native Web
    width: (animated && !indeterminate && Platform.OS !== 'web')
      ? withTiming(`${clampedValue}%` as any, { duration: 500, easing: Easing.out(Easing.ease) })
      : (indeterminate ? '35%' : `${clampedValue}%` as any),
    transform: indeterminate
      ? [{ translateX: shimmerX.value * 300 as any }]
      : [],
  }))

  return (
    <View>
      {(label || showValue) && (
        <View style={[styles.row, styles.label]}>
          {label && <Text variant="caption" style={{ flex: 1, color: theme.colors.muted }}>{label}</Text>}
          {showValue && !indeterminate && (
            <Text variant="caption" style={{ color: fillColor, fontWeight: '600' }}>
              {Math.round(clampedValue)}%
            </Text>
          )}
        </View>
      )}
      <View
        style={[styles.track, { height: h, backgroundColor: bgColor }]}
        accessibilityRole="progressbar"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ min: 0, max: 100, now: indeterminate ? undefined : clampedValue }}
      >
        <Animated.View style={[styles.fill, { backgroundColor: fillColor, height: h }, fillStyle]} />
      </View>
    </View>
  )
}
