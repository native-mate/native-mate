// native-mate: slider@0.1.0 | hash:f69cfb52ee7642c0
import React, { useRef, useState, useCallback } from 'react'
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
  if (step <= 0) return v
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

  // ── Refs for everything PanResponder needs (avoids stale closures) ──
  const widthRef = useRef(0)
  const disabledRef = useRef(disabled)
  const grantOffsetRef = useRef(0)
  const lastHapticVal = useRef(value)
  const onChangeRef = useRef(onChange)
  const onChangeEndRef = useRef(onChangeEnd)
  const hapticRef = useRef(haptic)

  // Sync refs every render
  disabledRef.current = disabled
  onChangeRef.current = onChange
  onChangeEndRef.current = onChangeEnd
  hapticRef.current = haptic

  const thumbScale = useSharedValue(1)
  const trackH = TRACK_HEIGHT

  const trackableWidth = width > 0 ? width - thumbSize : 0
  const thumbPx = trackableWidth > 0 ? ((value - min) / (max - min)) * trackableWidth : 0

  const thumbAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: thumbScale.value }],
  }))

  const resolvePixel = useCallback((px: number): number => {
    const tw = widthRef.current - thumbSize
    if (tw <= 0) return min
    const ratio = clamp(px / tw, 0, 1)
    return clamp(snapVal(min + ratio * (max - min), min, step), min, max)
  }, [min, max, step, thumbSize])

  // Store resolvePixel in a ref so PanResponder always has the latest
  const resolveRef = useRef(resolvePixel)
  resolveRef.current = resolvePixel

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current,
      onMoveShouldSetPanResponder: () => !disabledRef.current,
      onPanResponderGrant: (e) => {
        const tw = widthRef.current - thumbSize
        if (tw <= 0) return
        const px = clamp(e.nativeEvent.locationX - thumbSize / 2, 0, tw)
        grantOffsetRef.current = px
        thumbScale.value = withSpring(1.3, { mass: 0.3, damping: 10 })
        const newVal = resolveRef.current(px)
        if (hapticRef.current && Haptics && newVal !== lastHapticVal.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          lastHapticVal.current = newVal
        }
        onChangeRef.current?.(newVal)
      },
      onPanResponderMove: (_, gestureState) => {
        if (disabledRef.current) return
        const tw = widthRef.current - thumbSize
        if (tw <= 0) return
        const px = clamp(grantOffsetRef.current + gestureState.dx, 0, tw)
        const newVal = resolveRef.current(px)
        if (hapticRef.current && Haptics && newVal !== lastHapticVal.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          lastHapticVal.current = newVal
        }
        onChangeRef.current?.(newVal)
      },
      onPanResponderRelease: (_, gestureState) => {
        thumbScale.value = withSpring(1, { mass: 0.3, damping: 10 })
        const tw = widthRef.current - thumbSize
        if (disabledRef.current || tw <= 0) return
        const px = clamp(grantOffsetRef.current + gestureState.dx, 0, tw)
        const newVal = resolveRef.current(px)
        onChangeRef.current?.(newVal)
        onChangeEndRef.current?.(newVal)
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
        {/* Active fill */}
        <View style={{
          position: 'absolute',
          backgroundColor: fillColor ?? theme.colors.primary,
          height: trackH,
          top: (thumbSize - trackH) / 2,
          left: thumbSize / 2,
          width: thumbPx,
          borderRadius: theme.radius.full,
        }} />
        {/* Thumb */}
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
        {/* Touch overlay — separate from onLayout (Android PanResponder bug #28228) */}
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

  // ── Refs for everything PanResponder needs (avoids stale closures) ──
  const widthRef = useRef(0)
  const disabledRef = useRef(disabled)
  const activeThumb = useRef<'low' | 'high' | null>(null)
  const grantOffsetRef = useRef(0)
  const lowRef = useRef(low)
  const highRef = useRef(high)
  const onChangeRef = useRef(onChange)
  const onChangeEndRef = useRef(onChangeEnd)
  const hapticRef = useRef(haptic)

  // Sync refs every render
  disabledRef.current = disabled
  lowRef.current = low
  highRef.current = high
  onChangeRef.current = onChange
  onChangeEndRef.current = onChangeEnd
  hapticRef.current = haptic

  const lowScale = useSharedValue(1)
  const highScale = useSharedValue(1)

  const trackableWidth = width > 0 ? width - thumbSize : 0
  const pxLow = trackableWidth > 0 ? ((low - min) / (max - min)) * trackableWidth : 0
  const pxHigh = trackableWidth > 0 ? ((high - min) / (max - min)) * trackableWidth : trackableWidth

  const resolvePixel = useCallback((px: number): number => {
    const tw = widthRef.current - thumbSize
    if (tw <= 0) return min
    const ratio = clamp(px / tw, 0, 1)
    return clamp(snapVal(min + ratio * (max - min), min, step), min, max)
  }, [min, max, step, thumbSize])

  const resolveRef = useRef(resolvePixel)
  resolveRef.current = resolvePixel

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabledRef.current,
      onMoveShouldSetPanResponder: () => !disabledRef.current,
      onPanResponderGrant: (e) => {
        const tw = widthRef.current - thumbSize
        if (tw <= 0) return
        const touchPx = clamp(e.nativeEvent.locationX - thumbSize / 2, 0, tw)
        // Compute current pixel positions from refs (always fresh)
        const curPxLow = ((lowRef.current - min) / (max - min)) * tw
        const curPxHigh = ((highRef.current - min) / (max - min)) * tw
        // Determine which thumb is closer
        const dLow = Math.abs(touchPx - curPxLow)
        const dHigh = Math.abs(touchPx - curPxHigh)
        activeThumb.current = dLow <= dHigh ? 'low' : 'high'
        grantOffsetRef.current = activeThumb.current === 'low' ? curPxLow : curPxHigh
        if (activeThumb.current === 'low') lowScale.value = withSpring(1.3, { mass: 0.3, damping: 10 })
        else highScale.value = withSpring(1.3, { mass: 0.3, damping: 10 })
      },
      onPanResponderMove: (_, gestureState) => {
        if (disabledRef.current) return
        const tw = widthRef.current - thumbSize
        if (tw <= 0) return
        const px = clamp(grantOffsetRef.current + gestureState.dx, 0, tw)
        const newVal = resolveRef.current(px)
        if (activeThumb.current === 'low') {
          onChangeRef.current?.(Math.min(newVal, highRef.current - step), highRef.current)
        } else {
          onChangeRef.current?.(lowRef.current, Math.max(newVal, lowRef.current + step))
        }
        if (hapticRef.current && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      },
      onPanResponderRelease: (_, gestureState) => {
        lowScale.value = withSpring(1, { mass: 0.3, damping: 10 })
        highScale.value = withSpring(1, { mass: 0.3, damping: 10 })
        if (!disabledRef.current) {
          const tw = widthRef.current - thumbSize
          if (tw > 0) {
            const px = clamp(grantOffsetRef.current + gestureState.dx, 0, tw)
            const newVal = resolveRef.current(px)
            if (activeThumb.current === 'low') {
              const l = Math.min(newVal, highRef.current - step)
              onChangeRef.current?.(l, highRef.current)
              onChangeEndRef.current?.(l, highRef.current)
            } else {
              const h = Math.max(newVal, lowRef.current + step)
              onChangeRef.current?.(lowRef.current, h)
              onChangeEndRef.current?.(lowRef.current, h)
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
        {/* Touch overlay — separate from onLayout (Android PanResponder bug #28228) */}
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
            const idx = stepCount > 1 ? i / (stepCount - 1) : 0
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
