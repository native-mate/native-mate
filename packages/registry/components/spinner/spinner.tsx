// native-mate: spinner@0.1.0 | hash:PLACEHOLDER
import React, { useEffect, useRef } from 'react'
import { View, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { useTheme } from '@native-mate/core'
import type { SpinnerProps, SpinnerSize, SpinnerColor, SpinnerSpeed } from './spinner.types'

// ─── Helpers ───────────────────────────────────────────────────────────────────

const SIZE_MAP: Record<Exclude<SpinnerSize, number>, number> = {
  sm: 16,
  md: 24,
  lg: 40,
}

const SPEED_MAP: Record<Exclude<SpinnerSpeed, number>, number> = {
  fast:   600,
  normal: 900,
  slow:   1400,
}

function resolveSize(size: SpinnerSize): number {
  return typeof size === 'number' ? size : SIZE_MAP[size]
}

function resolveSpeed(speed: SpinnerSpeed): number {
  return typeof speed === 'number' ? speed : SPEED_MAP[speed]
}

function resolveColor(color: SpinnerColor, colors: Record<string, string>): string {
  const TOKEN_MAP: Record<string, string> = {
    primary:     colors.primary     ?? '#6366f1',
    foreground:  colors.foreground  ?? '#fafafa',
    muted:       colors.muted       ?? '#52525b',
    destructive: colors.destructive ?? '#ef4444',
    success:     colors.success     ?? '#22c55e',
    warning:     colors.warning     ?? '#f59e0b',
  }
  return TOKEN_MAP[color] ?? color
}

// ─── CSS injection (web only) ──────────────────────────────────────────────────

let cssInjected = false
function injectCSS() {
  if (cssInjected || Platform.OS !== 'web') return
  cssInjected = true
  const style = document.createElement('style')
  style.textContent = `
    @keyframes nm-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes nm-dot {
      0%, 80%, 100% { transform: scale(0.35); opacity: 0.35; }
      40%           { transform: scale(1);    opacity: 1; }
    }
    @keyframes nm-pulse {
      0%, 100% { transform: scale(0.85); opacity: 1; }
      50%      { transform: scale(1.18); opacity: 0.3; }
    }
  `
  document.head.appendChild(style)
}

// ─── Web variants (CSS animations) ────────────────────────────────────────────

function WebCircle({ size, color, speed }: { size: number; color: string; speed: number }) {
  useEffect(() => { injectCSS() }, [])
  const stroke = Math.max(2, Math.round(size * 0.1))
  return React.createElement('div', {
    style: {
      width: size, height: size, borderRadius: '50%',
      borderWidth: stroke, borderStyle: 'solid',
      borderColor: `${color}28`,
      borderTopColor: color,
      borderRightColor: color,
      animation: `nm-spin ${speed}ms linear infinite`,
      display: 'inline-block',
      flexShrink: 0,
    } as React.CSSProperties,
  }) as unknown as React.ReactElement
}

function WebDots({ size, color, speed }: { size: number; color: string; speed: number }) {
  useEffect(() => { injectCSS() }, [])
  const dotSize = Math.max(4, Math.round(size * 0.28))
  const gap = Math.round(dotSize * 0.7)
  const delays = [0, speed / 3, (speed / 3) * 2]
  return React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap } as React.CSSProperties,
  },
    ...delays.map((delay, i) =>
      React.createElement('div', {
        key: i,
        style: {
          width: dotSize, height: dotSize, borderRadius: '50%',
          backgroundColor: color,
          animation: `nm-dot ${speed}ms ease-in-out ${delay}ms infinite`,
          display: 'inline-block',
          flexShrink: 0,
        } as React.CSSProperties,
      })
    )
  ) as unknown as React.ReactElement
}

function WebPulse({ size, color, speed }: { size: number; color: string; speed: number }) {
  useEffect(() => { injectCSS() }, [])
  return React.createElement('div', {
    style: {
      width: size, height: size, borderRadius: '50%',
      backgroundColor: color,
      animation: `nm-pulse ${speed}ms ease-in-out infinite`,
      display: 'inline-block',
      flexShrink: 0,
    } as React.CSSProperties,
  }) as unknown as React.ReactElement
}

// ─── Native variants (Reanimated) ─────────────────────────────────────────────

function NativeCircle({ size, color, speed }: { size: number; color: string; speed: number }) {
  const rotation = useSharedValue(0)
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: speed, easing: Easing.linear }),
      -1, false,
    )
  }, [speed])
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))
  const stroke = Math.max(2, Math.round(size * 0.1))
  return (
    <Animated.View style={[{
      width: size, height: size, borderRadius: size / 2,
      borderWidth: stroke, borderColor: `${color}28`,
      borderTopColor: color, borderRightColor: color,
    }, animStyle]} />
  )
}

function NativeDot({ size, color, delay, speed }: { size: number; color: string; delay: number; speed: number }) {
  const scale = useSharedValue(0.35)
  useEffect(() => {
    scale.value = withDelay(delay,
      withRepeat(
        withSequence(
          withTiming(1,    { duration: speed * 0.4, easing: Easing.out(Easing.ease) }),
          withTiming(0.35, { duration: speed * 0.4, easing: Easing.in(Easing.ease) }),
          withTiming(0.35, { duration: speed * 0.2 }),
        ),
        -1, false,
      )
    )
  }, [delay, speed])
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }))
  return (
    <Animated.View style={[
      { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      animStyle,
    ]} />
  )
}

function NativeDots({ size, color, speed }: { size: number; color: string; speed: number }) {
  const dotSize = Math.max(4, Math.round(size * 0.28))
  const gap = Math.round(dotSize * 0.7)
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap }}>
      <NativeDot size={dotSize} color={color} delay={0}               speed={speed} />
      <NativeDot size={dotSize} color={color} delay={speed / 3}       speed={speed} />
      <NativeDot size={dotSize} color={color} delay={(speed / 3) * 2} speed={speed} />
    </View>
  )
}

function NativePulse({ size, color, speed }: { size: number; color: string; speed: number }) {
  const scale   = useSharedValue(0.85)
  const opacity = useSharedValue(1)
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: speed * 0.5, easing: Easing.out(Easing.ease) }),
        withTiming(0.85, { duration: speed * 0.5, easing: Easing.in(Easing.ease) }),
      ),
      -1, false,
    )
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: speed * 0.5 }),
        withTiming(1,   { duration: speed * 0.5 }),
      ),
      -1, false,
    )
  }, [speed])
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))
  return (
    <Animated.View style={[
      { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      animStyle,
    ]} />
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export const Spinner: React.FC<SpinnerProps> = ({
  variant = 'circle',
  size = 'md',
  color = 'primary',
  speed = 'normal',
  label = 'Loading',
  overlay = false,
  overlayOpacity = 0.6,
  style,
}) => {
  const theme = useTheme()
  const resolvedSize  = resolveSize(size)
  const resolvedSpeed = resolveSpeed(speed)
  const resolvedColor = resolveColor(color, theme.colors as Record<string, string>)

  const isWeb = Platform.OS === 'web'

  const spinnerEl = (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
      style={[{ alignItems: 'center', justifyContent: 'center' }, style]}
    >
      {variant === 'circle' && (isWeb
        ? <WebCircle  size={resolvedSize} color={resolvedColor} speed={resolvedSpeed} />
        : <NativeCircle size={resolvedSize} color={resolvedColor} speed={resolvedSpeed} />
      )}
      {variant === 'dots' && (isWeb
        ? <WebDots  size={resolvedSize} color={resolvedColor} speed={resolvedSpeed} />
        : <NativeDots size={resolvedSize} color={resolvedColor} speed={resolvedSpeed} />
      )}
      {variant === 'pulse' && (isWeb
        ? <WebPulse  size={resolvedSize} color={resolvedColor} speed={resolvedSpeed} />
        : <NativePulse size={resolvedSize} color={resolvedColor} speed={resolvedSpeed} />
      )}
    </View>
  )

  if (overlay) {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0, left: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
          zIndex: 999,
        }}
        pointerEvents="box-only"
      >
        {spinnerEl}
      </View>
    )
  }

  return spinnerEl
}
