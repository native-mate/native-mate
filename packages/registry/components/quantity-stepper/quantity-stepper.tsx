// native-mate: quantity-stepper@0.1.0 | hash:PLACEHOLDER
import React, { useCallback, useRef, useEffect } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { QuantityStepperProps, QuantityStepperSize } from './quantity-stepper.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const sizeTokens: Record<QuantityStepperSize, { button: number; fontSize: number; iconSize: number; minWidth: number }> = {
  sm: { button: 28, fontSize: 13, iconSize: 16, minWidth: 32 },
  md: { button: 36, fontSize: 15, iconSize: 20, minWidth: 40 },
  lg: { button: 44, fontSize: 17, iconSize: 24, minWidth: 48 },
}

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...fontStyle(theme.typography, 'semibold'),
    color: theme.colors.foreground,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
}))

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  size = 'md',
  disabled = false,
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const tokens = sizeTokens[size]
  const valueScale = useSharedValue(1)
  const longPressTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const longPressActive = useRef(false)

  const valueAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: valueScale.value }],
  }))

  const isMinDisabled = value <= min
  const isMaxDisabled = max != null && value >= max

  const animateValue = useCallback(() => {
    valueScale.value = withSequence(
      withSpring(1.15, { damping: 12, stiffness: 400 }),
      withSpring(1, { damping: 14, stiffness: 300 }),
    )
  }, [])

  const triggerHaptic = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }, [haptic])

  const increment = useCallback(() => {
    if (disabled || isMaxDisabled) return
    const next = max != null ? Math.min(value + step, max) : value + step
    onChange(next)
    triggerHaptic()
    animateValue()
  }, [value, step, max, disabled, isMaxDisabled, onChange, triggerHaptic, animateValue])

  const decrement = useCallback(() => {
    if (disabled || isMinDisabled) return
    const next = Math.max(value - step, min)
    onChange(next)
    triggerHaptic()
    animateValue()
  }, [value, step, min, disabled, isMinDisabled, onChange, triggerHaptic, animateValue])

  const startLongPress = useCallback((action: 'increment' | 'decrement') => {
    longPressActive.current = true
    let delay = 200
    const run = () => {
      if (!longPressActive.current) return
      if (action === 'increment') increment()
      else decrement()
      delay = Math.max(50, delay * 0.85)
      longPressTimer.current = setTimeout(run, delay)
    }
    longPressTimer.current = setTimeout(run, 400)
  }, [increment, decrement])

  const stopLongPress = useCallback(() => {
    longPressActive.current = false
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopLongPress()
  }, [stopLongPress])

  return (
    <View
      style={[styles.container, disabled && styles.disabled, style]}
      accessibilityRole="adjustable"
      accessibilityLabel={`Quantity: ${value}`}
      accessibilityValue={{ min, max, now: value }}
      {...rest}
    >
      <Pressable
        onPress={decrement}
        onLongPress={() => startLongPress('decrement')}
        onPressOut={stopLongPress}
        disabled={disabled || isMinDisabled}
        style={[
          styles.button,
          {
            width: tokens.button,
            height: tokens.button,
          },
          (disabled || isMinDisabled) && { opacity: 0.35 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        accessibilityState={{ disabled: disabled || isMinDisabled }}
        hitSlop={4}
      >
        <Ionicons
          name="remove"
          size={tokens.iconSize}
          color={theme.colors.foreground}
        />
      </Pressable>
      <Animated.View
        style={[
          styles.valueContainer,
          { minWidth: tokens.minWidth },
          valueAnimStyle,
        ]}
      >
        <Text variant="label" style={[styles.value, { fontSize: tokens.fontSize }]}>
          {value}
        </Text>
      </Animated.View>
      <Pressable
        onPress={increment}
        onLongPress={() => startLongPress('increment')}
        onPressOut={stopLongPress}
        disabled={disabled || isMaxDisabled}
        style={[
          styles.button,
          {
            width: tokens.button,
            height: tokens.button,
          },
          (disabled || isMaxDisabled) && { opacity: 0.35 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        accessibilityState={{ disabled: disabled || isMaxDisabled }}
        hitSlop={4}
      >
        <Ionicons
          name="add"
          size={tokens.iconSize}
          color={theme.colors.foreground}
        />
      </Pressable>
    </View>
  )
}
