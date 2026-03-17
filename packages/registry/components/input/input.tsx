// native-mate: input@0.3.0 | hash:PLACEHOLDER
import React, { useState, useRef, useEffect } from 'react'
import { View, TextInput, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { InputProps } from './input.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const AnimatedView = Animated.View

const sizeConfig = {
  sm: { minHeight: 36, fontSize: 13, paddingH: 10, iconSize: 14 },
  md: { minHeight: 44, fontSize: 15, paddingH: 12, iconSize: 16 },
  lg: { minHeight: 52, fontSize: 17, paddingH: 16, iconSize: 18 },
}

const useStyles = makeStyles((theme) => ({
  wrapper: { gap: theme.spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: theme.radius.md,
  },
  input: {
    flex: 1,
    color: theme.colors.foreground,
  },
  addonText: {
    color: theme.colors.muted,
    paddingHorizontal: theme.spacing.sm,
    borderColor: theme.colors.border,
  },
  hint: { color: theme.colors.muted },
  error: { color: theme.colors.destructive },
  clearBtn: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: theme.colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
}))

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  disabled = false,
  size = 'md',
  required = false,
  maxLength,
  showCount = false,
  clearable = false,
  onClear,
  secureTextEntry: secureTextEntryProp = false,
  showPasswordToggle = false,
  prefix,
  suffix,
  prefixText,
  suffixText,
  floatingLabel = false,
  hapticOnFocus = false,
  value,
  onChangeText,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  placeholder,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const config = sizeConfig[size]
  const inputRef = useRef<TextInput>(null)

  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [internalValue, setInternalValue] = useState(value || '')

  const currentValue = value !== undefined ? value : internalValue

  // Animations
  const focusAnim = useSharedValue(0)
  const shakeAnim = useSharedValue(0)
  const floatAnim = useSharedValue(currentValue ? 1 : 0)

  // Floating label animation
  useEffect(() => {
    if (floatingLabel) {
      floatAnim.value = withTiming(focused || currentValue ? 1 : 0, { duration: 250 })
    }
  }, [focused, currentValue, floatingLabel])

  // Shake on error
  useEffect(() => {
    if (error) {
      shakeAnim.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      )
    }
  }, [error])

  // Focus border animation
  useEffect(() => {
    focusAnim.value = withTiming(focused ? 1 : 0, { duration: 200 })
  }, [focused])

  const containerAnimStyle = useAnimatedStyle(() => ({
    borderColor: error
      ? theme.colors.destructive
      : interpolateColor(focusAnim.value, [0, 1], [theme.colors.border, theme.colors.primary]),
    transform: [{ translateX: shakeAnim.value }],
  }))

  const floatingLabelStyle = useAnimatedStyle(() => {
    if (!floatingLabel) return {}
    return {
      position: 'absolute' as const,
      left: config.paddingH - 6 + (prefixText || prefix ? 40 : 0),
      top: interpolate(floatAnim.value, [0, 1], [config.minHeight / 2 - 8, -9]),
      fontSize: interpolate(floatAnim.value, [0, 1], [config.fontSize, 11]),
      color: interpolateColor(
        floatAnim.value,
        [0, 1],
        [theme.colors.muted, focused ? theme.colors.primary : theme.colors.muted],
      ),
      backgroundColor: theme.colors.background,
      paddingHorizontal: 6,
      zIndex: 10,
    }
  })

  const handleFocus = (e: any) => {
    setFocused(true)
    if (hapticOnFocus && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onFocusProp?.(e)
  }

  const handleBlur = (e: any) => {
    setFocused(false)
    onBlurProp?.(e)
  }

  const handleChangeText = (text: string) => {
    if (value === undefined) setInternalValue(text)
    onChangeText?.(text)
  }

  const handleClear = () => {
    if (value === undefined) setInternalValue('')
    onChangeText?.('')
    onClear?.()
    inputRef.current?.focus()
  }

  const charCount = (currentValue || '').length

  return (
    <View style={styles.wrapper}>
      {/* Label row */}
      {label && !floatingLabel && (
        <View style={styles.row}>
          <Text variant="label">
            {label}
            {required && <Text variant="label" color={theme.colors.destructive}> *</Text>}
          </Text>
        </View>
      )}

      {/* Input container */}
      <AnimatedView style={[
        styles.inputRow,
        { minHeight: config.minHeight, backgroundColor: disabled ? theme.colors.surface : theme.colors.background },
        containerAnimStyle,
      ]}>
        {/* Floating label */}
        {floatingLabel && label && (
          <Animated.Text style={[{ fontFamily: undefined }, floatingLabelStyle]}>
            {label}{required ? ' *' : ''}
          </Animated.Text>
        )}

        {/* Prefix text */}
        {prefixText && (
          <View style={{ borderRightWidth: 1, borderColor: theme.colors.border, justifyContent: 'center', paddingHorizontal: config.paddingH }}>
            <Text variant="body" color={theme.colors.muted} style={{ fontSize: config.fontSize }}>{prefixText}</Text>
          </View>
        )}

        {/* Prefix icon */}
        {prefix && (
          <View style={{ paddingLeft: config.paddingH, justifyContent: 'center' }}>
            {prefix}
          </View>
        )}

        {/* TextInput */}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              fontSize: config.fontSize,
              paddingHorizontal: config.paddingH,
              minHeight: config.minHeight,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
          value={currentValue}
          onChangeText={handleChangeText}
          placeholderTextColor={theme.colors.muted}
          placeholder={floatingLabel && !focused && !currentValue ? undefined : placeholder}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntryProp && !showPassword}
          maxLength={maxLength}
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          {...rest}
        />

        {/* Clear button */}
        {clearable && currentValue ? (
          <Pressable onPress={handleClear} style={{ paddingRight: config.paddingH }}>
            <View style={styles.clearBtn}>
              <Text style={{ color: theme.colors.background, fontSize: 12, fontWeight: '700', lineHeight: 14 }}>×</Text>
            </View>
          </Pressable>
        ) : null}

        {/* Password toggle */}
        {showPasswordToggle && secureTextEntryProp && (
          <Pressable
            onPress={() => {
              setShowPassword(v => !v)
              setTimeout(() => inputRef.current?.focus(), 10)
            }}
            style={{ paddingRight: config.paddingH }}
          >
            <Text variant="caption" color={theme.colors.muted}>{showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        )}

        {/* Suffix icon */}
        {suffix && (
          <View style={{ paddingRight: config.paddingH, justifyContent: 'center' }}>
            {suffix}
          </View>
        )}

        {/* Suffix text */}
        {suffixText && (
          <View style={{ borderLeftWidth: 1, borderColor: theme.colors.border, justifyContent: 'center', paddingHorizontal: config.paddingH }}>
            <Text variant="body" color={theme.colors.muted} style={{ fontSize: config.fontSize }}>{suffixText}</Text>
          </View>
        )}
      </AnimatedView>

      {/* Bottom row: error/hint + count */}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          {error && <Text variant="caption" style={styles.error}>{error}</Text>}
          {!error && hint && <Text variant="caption" style={styles.hint}>{hint}</Text>}
        </View>
        {showCount && (
          <Text variant="caption" style={styles.hint}>
            {charCount}{maxLength ? `/${maxLength}` : ''}
          </Text>
        )}
      </View>
    </View>
  )
}
