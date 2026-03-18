// native-mate: slider@0.2.0 | hash:PLACEHOLDER
import React, { useRef, useState } from 'react'
import { View, PanResponder, LayoutChangeEvent, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { SliderProps, RangeSliderProps } from './slider.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const TRACK_HEIGHT = 4
const DEFAULT_THUMB = 22

const useStyles = makeStyles((theme) => ({
  wrapper: { gap: 8 },
  trackContainer: { justifyContent: 'center' },
  track: { borderRadius: theme.radius.full },
  valueRow: { flexDirection: 'row', justifyContent: 'space-between' },
  marksRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2, marginTop: 4 },
  mark: { width: 2, height: 6, borderRadius: 1 },
}))

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}
function snapVal(v: number, min: number, step: number) {
  return Math.round((v - min) / step) * step + min
}

// ── Single Slider ─────────────────────────────────────────────────

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onChangeEnd,
  disabled = false,
  showValue = false,
  trackColor,
  fillColor,
  thumbSize = DEFAULT_THUMB,
  marks = false,
  haptic = true,
  accessibilityLabel,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [width, setWidth] = useState(0)

  // All mutable values accessed inside PanResponder must be refs
  const widthRef = useRef(0)
  const disabledRef = useRef(disabled)
  const grantOffsetRef = useRef(0)   // thumb pixel position captured at grant
  const lastHapticVal = useRef(value)
  disabledRef.current = disabled

  const thumbScale = useSharedValue(1)
  const trackH = TRACK_HEIGHT

  // Pixel-based positioning (no %) to avoid edge-clipping issues
  // trackableWidth = width - thumbSize (accounts for thumb margin on both sides)
  const trackableWidth = width > 0 ? width - thumbSize : 0
  const thumbPx = trackableWidth > 0 ? ((value - min) / (max - min)) * trackableWidth : 0

  const thumbAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: thumbScale.value }],
  }))

  // Convert pixel position (0..trackableWidth) to snapped value
  const resolvePixel = (px: number): number => {
    const tw = widthRef.current - thumbSize
    if (tw <= 0) return value
    const ratio = clamp(px / tw, 0, 1)
    return clamp(snapVal(min + ratio * (max - min), min, step), min, max)
  }

  // IMPORTANT: PanResponder is on a separate child view from onLayout.
  // Putting both on the same view breaks Android after first drag (RN bug #28228).
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current,
      onMoveShouldSetPanResponder: () => !disabledRef.current,
      onPanResponderGrant: (e) => {
        // locationX is reliable at grant time.
        // Subtract thumbSize/2 to convert from container coords to track coords.
        const tw = widthRef.current - thumbSize
        const px = clamp(e.nativeEvent.locationX - thumbSize / 2, 0, tw)
        grantOffsetRef.current = px
        thumbScale.value = withSpring(1.3, { mass: 0.3, damping: 10 })
        const newVal = resolvePixel(px)
        if (haptic && Haptics && newVal !== lastHapticVal.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          lastHapticVal.current = newVal
        }
        onChange?.(newVal)
      },
      onPanResponderMove: (_, gestureState) => {
        // gestureState.dx is reliable on both iOS and Android.
        // locationX is NOT used here (broken on Android: frozen; broken on iOS: jumps to child views).
        if (disabledRef.current) return
        const tw = widthRef.current - thumbSize
        if (tw <= 0) return
        const px = clamp(grantOffsetRef.current + gestureState.dx, 0, tw)
        const newVal = resolvePixel(px)
        if (haptic && Haptics && newVal !== lastHapticVal.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          lastHapticVal.current = newVal
        }
        onChange?.(newVal)
      },
      onPanResponderRelease: (_, gestureState) => {
        thumbScale.value = withSpring(1, { mass: 0.3, damping: 10 })
        const tw = widthRef.current - thumbSize
        if (disabledRef.current || tw <= 0) return
        const px = clamp(grantOffsetRef.current + gestureState.dx, 0, tw)
        const newVal = resolvePixel(px)
        onChange?.(newVal)
        onChangeEnd?.(newVal)
      },
    })
  ).current

  const stepCount = Math.floor((max - min) / step) + 1

  return (
    <View style={styles.wrapper}>
      {showValue && (
        <View style={styles.valueRow}>
          <Text variant="caption" muted>{min}</Text>
          <Text variant="caption" style={{ color: fillColor ?? theme.colors.primary, fontWeight: '700' }}>
            {value}
          </Text>
          <Text variant="caption" muted>{max}</Text>
        </View>
      )}
      {/* onLayout is on THIS view — NOT on the panResponder view (Android bug #28228) */}
      <View
        style={[styles.trackContainer, { height: thumbSize, opacity: disabled ? 0.4 : 1 }]}
        onLayout={(e: LayoutChangeEvent) => {
          const w = e.nativeEvent.layout.width
          setWidth(w)
          widthRef.current = w
        }}
      >
        {/* Track background */}
        <View style={[styles.track, {
          height: trackH,
          backgroundColor: trackColor ?? theme.colors.border,
          marginHorizontal: thumbSize / 2,
        }]} />
        {/* Active fill — pixel width so it aligns perfectly with thumb */}
        <View style={{
          position: 'absolute',
          backgroundColor: fillColor ?? theme.colors.primary,
          height: trackH,
          top: (thumbSize - trackH) / 2,
          left: thumbSize / 2,
          width: thumbPx,
          borderRadius: theme.radius.full,
        }} />
        {/* Thumb — left: thumbPx (0..trackableWidth), no % needed */}
        <Animated.View style={[{
          position: 'absolute',
          width: thumbSize,
          height: thumbSize,
          borderRadius: thumbSize / 2,
          backgroundColor: fillColor ?? theme.colors.primary,
          left: thumbPx,
          top: 0,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        }, thumbAnimStyle]} />
        {/* Touch overlay — separate view from onLayout to avoid Android PanResponder bug.
            backgroundColor: 'transparent' required for Android touch to register. */}
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}
          {...panResponder.panHandlers}
          accessibilityRole="adjustable"
          accessibilityLabel={accessibilityLabel}
          accessibilityValue={{ min, max, now: value }}
        />
      </View>
      {marks && width > 0 && (
        <View style={styles.marksRow}>
          {Array.from({ length: stepCount }).map((_, i) => (
            <View
              key={i}
              style={[styles.mark, {
                backgroundColor: i <= Math.round(((value - min) / (max - min)) * (stepCount - 1))
                  ? (fillColor ?? theme.colors.primary)
                  : theme.colors.border,
              }]}
            />
          ))}
        </View>
      )}
    </View>
  )
}

// ── Range Slider ──────────────────────────────────────────────────

export const RangeSlider: React.FC<RangeSliderProps> = ({
  low,
  high,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onChangeEnd,
  disabled = false,
  showValue = false,
  trackColor,
  fillColor,
  thumbSize = DEFAULT_THUMB,
  marks = false,
  haptic = true,
  accessibilityLabel,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [width, setWidth] = useState(0)

  const widthRef = useRef(0)
  const disabledRef = useRef(disabled)
  const activeThumb = useRef<'low' | 'high' | null>(null)
  const grantOffsetRef = useRef(0)   // pixel position of active thumb at grant
  const lowRef = useRef(low)
  const highRef = useRef(high)
  disabledRef.current = disabled
  lowRef.current = low
  highRef.current = high

  const lowScale = useSharedValue(1)
  const highScale = useSharedValue(1)

  const trackableWidth = width > 0 ? width - thumbSize : 0
  const pxLow = trackableWidth > 0 ? ((low - min) / (max - min)) * trackableWidth : 0
  const pxHigh = trackableWidth > 0 ? ((high - min) / (max - min)) * trackableWidth : trackableWidth

  const resolvePixel = (px: number): number => {
    const tw = widthRef.current - thumbSize
    if (tw <= 0) return min
    const ratio = clamp(px / tw, 0, 1)
    return clamp(snapVal(min + ratio * (max - min), min, step), min, max)
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current,
      onMoveShouldSetPanResponder: () => !disabledRef.current,
      onPanResponderGrant: (e) => {
        const tw = widthRef.current - thumbSize
        const touchPx = clamp(e.nativeEvent.locationX - thumbSize / 2, 0, tw)
        // Determine which thumb is closer to the touch
        const dLow = Math.abs(touchPx - pxLow)
        const dHigh = Math.abs(touchPx - pxHigh)
        activeThumb.current = dLow <= dHigh ? 'low' : 'high'
        const currentPx = activeThumb.current === 'low' ? pxLow : pxHigh
        grantOffsetRef.current = currentPx
        if (activeThumb.current === 'low') lowScale.value = withSpring(1.3, { mass: 0.3, damping: 10 })
        else highScale.value = withSpring(1.3, { mass: 0.3, damping: 10 })
      },
      onPanResponderMove: (_, gestureState) => {
        if (disabledRef.current) return
        const tw = widthRef.current - thumbSize
        if (tw <= 0) return
        const px = clamp(grantOffsetRef.current + gestureState.dx, 0, tw)
        const newVal = resolvePixel(px)
        if (activeThumb.current === 'low') {
          onChange?.(Math.min(newVal, highRef.current - step), highRef.current)
        } else {
          onChange?.(lowRef.current, Math.max(newVal, lowRef.current + step))
        }
        if (haptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      },
      onPanResponderRelease: (_, gestureState) => {
        lowScale.value = withSpring(1, { mass: 0.3, damping: 10 })
        highScale.value = withSpring(1, { mass: 0.3, damping: 10 })
        if (!disabledRef.current) {
          const tw = widthRef.current - thumbSize
          if (tw > 0) {
            const px = clamp(grantOffsetRef.current + gestureState.dx, 0, tw)
            const newVal = resolvePixel(px)
            if (activeThumb.current === 'low') {
              const l = Math.min(newVal, highRef.current - step)
              onChange?.(l, highRef.current)
              onChangeEnd?.(l, highRef.current)
            } else {
              const h = Math.max(newVal, lowRef.current + step)
              onChange?.(lowRef.current, h)
              onChangeEnd?.(lowRef.current, h)
            }
          }
        }
        activeThumb.current = null
      },
    })
  ).current

  const lowThumbStyle = useAnimatedStyle(() => ({ transform: [{ scale: lowScale.value }] }))
  const highThumbStyle = useAnimatedStyle(() => ({ transform: [{ scale: highScale.value }] }))
  const trackH = TRACK_HEIGHT
  const stepCount = Math.floor((max - min) / step) + 1

  return (
    <View style={styles.wrapper}>
      {showValue && (
        <View style={styles.valueRow}>
          <Text variant="caption" style={{ color: fillColor ?? theme.colors.primary, fontWeight: '700' }}>
            {low}
          </Text>
          <Text variant="caption" muted>–</Text>
          <Text variant="caption" style={{ color: fillColor ?? theme.colors.primary, fontWeight: '700' }}>
            {high}
          </Text>
        </View>
      )}
      <View
        style={[styles.trackContainer, { height: thumbSize, opacity: disabled ? 0.4 : 1 }]}
        onLayout={(e: LayoutChangeEvent) => {
          const w = e.nativeEvent.layout.width
          setWidth(w)
          widthRef.current = w
        }}
      >
        {/* Track background */}
        <View style={[styles.track, {
          height: trackH,
          backgroundColor: trackColor ?? theme.colors.border,
          marginHorizontal: thumbSize / 2,
        }]} />
        {/* Active fill between thumbs */}
        <View style={{
          position: 'absolute',
          backgroundColor: fillColor ?? theme.colors.primary,
          height: trackH,
          top: (thumbSize - trackH) / 2,
          left: thumbSize / 2 + pxLow,
          width: Math.max(0, pxHigh - pxLow),
          borderRadius: theme.radius.full,
        }} />
        {/* Low thumb */}
        <Animated.View style={[{
          position: 'absolute',
          width: thumbSize,
          height: thumbSize,
          borderRadius: thumbSize / 2,
          backgroundColor: fillColor ?? theme.colors.primary,
          left: pxLow,
          top: 0,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        }, lowThumbStyle]} />
        {/* High thumb */}
        <Animated.View style={[{
          position: 'absolute',
          width: thumbSize,
          height: thumbSize,
          borderRadius: thumbSize / 2,
          backgroundColor: fillColor ?? theme.colors.primary,
          left: pxHigh,
          top: 0,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        }, highThumbStyle]} />
        {/* Touch overlay — separate from onLayout view (Android PanResponder bug #28228) */}
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}
          {...panResponder.panHandlers}
          accessibilityRole="adjustable"
          accessibilityLabel={accessibilityLabel}
        />
      </View>
      {marks && width > 0 && (
        <View style={styles.marksRow}>
          {Array.from({ length: stepCount }).map((_, i) => {
            const idx = i / (stepCount - 1)
            const pctLow = (low - min) / (max - min)
            const pctHigh = (high - min) / (max - min)
            const inRange = idx >= pctLow && idx <= pctHigh
            return (
              <View key={i} style={[styles.mark, {
                backgroundColor: inRange ? (fillColor ?? theme.colors.primary) : theme.colors.border,
              }]} />
            )
          })}
        </View>
      )}
    </View>
  )
}
