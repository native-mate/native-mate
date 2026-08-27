// native-mate: otp-input@0.2.0 | hash:PLACEHOLDER
import React, { useRef, useState, useEffect, useCallback, useImperativeHandle } from 'react'
import { View, TextInput, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  interpolateColor,
} from 'react-native-reanimated'
import { useTheme, useMotion, withAlpha, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { OTPInputProps, OTPInputHandle } from './otp-input.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  wrapper: { gap: theme.spacing.sm },
  row: { flexDirection: 'row', gap: theme.spacing.sm },
  hint: { color: theme.colors.muted, textAlign: 'center' },
  error: { color: theme.colors.destructive, textAlign: 'center' },
  resendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
}))

// ── Cell ──────────────────────────────────────────────────────────

function Cell({
  char,
  isActive,
  isFilled,
  error,
  success,
  variant,
  secure,
}: {
  char: string
  isActive: boolean
  isFilled: boolean
  error: boolean
  success: boolean
  variant: 'box' | 'underline' | 'rounded'
  secure: boolean
}) {
  const theme = useTheme()
  const motion = useMotion()

  // Cursor blink
  const cursorOpacity = useSharedValue(isActive ? 1 : 0)
  useEffect(() => {
    if (isActive) {
      if (motion.reduced) {
        // Decorative-only loop: leave the cursor visible and steady instead of blinking.
        cursorOpacity.value = 1
      } else {
        cursorOpacity.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 0 }),
            withTiming(1, { duration: 500 }),
            withTiming(0, { duration: 200 }),
            withTiming(0, { duration: 300 }),
          ),
          motion.loops(-1),
          false,
        )
      }
    } else {
      cursorOpacity.value = withTiming(0, motion.timing('fast'))
    }
  }, [isActive, motion])

  // Border/bg color animation
  const borderAnim = useSharedValue(0)
  useEffect(() => {
    borderAnim.value = withTiming(
      error ? 2 : success ? 3 : isActive ? 1 : isFilled ? 0.5 : 0,
      motion.timing('normal')
    )
  }, [isActive, isFilled, error, success, motion])

  const borderAnimStyle = useAnimatedStyle(() => {
    if (variant === 'underline') return {}
    return {
      borderColor: interpolateColor(
        borderAnim.value,
        [0, 0.5, 1, 2, 3],
        [
          theme.colors.border,
          theme.colors.onSurface ?? theme.colors.border,
          theme.colors.primary,
          theme.colors.destructive,
          theme.colors.success,
        ],
      ),
    }
  })

  const underlineBorderStyle = useAnimatedStyle(() => {
    if (variant !== 'underline') return {}
    return {
      borderBottomColor: error
        ? theme.colors.destructive
        : success
        ? theme.colors.success
        : isActive
        ? theme.colors.primary
        : theme.colors.border,
    }
  })

  const cursorStyle = useAnimatedStyle(() => ({ opacity: cursorOpacity.value }))

  const isBox = variant === 'box'
  const isRounded = variant === 'rounded'
  const isUnderline = variant === 'underline'

  const containerStyle = isUnderline
    ? {
        width: 40,
        height: 48,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.border,
      }
    : {
        width: 48,
        height: 56,
        borderRadius: isRounded ? 28 : 10,
        borderWidth: 2,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        borderColor: theme.colors.border,
        backgroundColor: isActive ? withAlpha(theme.colors.primary, 0.05) : theme.colors.background,
      }

  const displayChar = isFilled && secure ? '●' : char

  return (
    <Animated.View style={[containerStyle, isUnderline ? underlineBorderStyle : borderAnimStyle]}>
      {isFilled ? (
        <Text variant="title" style={{ fontSize: isRounded ? 20 : 22, letterSpacing: 0 }}>
          {displayChar}
        </Text>
      ) : isActive ? (
        <Animated.View style={[{
          width: 2,
          height: 24,
          borderRadius: 1,
          backgroundColor: theme.colors.primary,
        }, cursorStyle]} />
      ) : null}
    </Animated.View>
  )
}

// ── OTPInput ──────────────────────────────────────────────────────

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  error = false,
  errorMessage,
  success = false,
  disabled = false,
  loading = false,
  secure = false,
  type = 'numeric',
  variant = 'box',
  autoFocus = false,
  hint,
  resend = false,
  resendCooldown = 30,
  onResend,
  haptic = true,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const inputRef = useRef<TextInput>(null)
  const [focused, setFocused] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // Shake on error
  const shakeAnim = useSharedValue(0)
  useEffect(() => {
    if (error) {
      shakeAnim.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      )
      if (haptic && Haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    }
  }, [error])

  // Success haptic
  useEffect(() => {
    if (success && haptic && Haptics) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    }
  }, [success])

  // Resend cooldown timer — driven off a deadline timestamp so backgrounding
  // the app can't drift the count (a chained setTimeout would lose time
  // while suspended).
  const cooldownDeadline = useRef<number | null>(null)
  useEffect(() => {
    if (cooldown <= 0) {
      cooldownDeadline.current = null
      return
    }
    cooldownDeadline.current = Date.now() + cooldown * 1000
    const tick = () => {
      const deadline = cooldownDeadline.current
      if (deadline == null) return
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setCooldown(remaining)
    }
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cooldown > 0])

  const handleChange = useCallback((text: string) => {
    const clean = type === 'numeric'
      ? text.replace(/\D/g, '').slice(0, length)
      : text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, length)
    onChange(clean)
    if (clean.length === length) {
      if (haptic && Haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      onComplete?.(clean)
    }
  }, [length, type, onChange, onComplete, haptic])

  const handleResend = useCallback(() => {
    onChange('')
    setCooldown(resendCooldown)
    onResend?.()
  }, [onChange, resendCooldown, onResend])

  const rowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnim.value }],
  }))

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => !disabled && inputRef.current?.focus()}
        style={{ alignItems: 'center' }}
      >
        <Animated.View style={[styles.row, rowAnimStyle]}>
          {Array.from({ length }).map((_, i) => (
            <Cell
              key={i}
              char={value[i] ?? ''}
              isActive={focused && i === value.length && !disabled}
              isFilled={i < value.length}
              error={error}
              success={success && value.length === length}
              variant={variant}
              secure={secure}
            />
          ))}
        </Animated.View>
      </Pressable>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType={type === 'numeric' ? 'number-pad' : 'default'}
        maxLength={length}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
        editable={!disabled && !loading}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={`${length}-digit verification code`}
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
      />

      {errorMessage && error && (
        <Text variant="caption" style={styles.error}>{errorMessage}</Text>
      )}
      {!error && hint && (
        <Text variant="caption" style={styles.hint}>{hint}</Text>
      )}

      {resend && (
        <View style={styles.resendRow}>
          <Text variant="caption" muted>Didn't receive the code?</Text>
          <Pressable onPress={handleResend} disabled={cooldown > 0}>
            <Text variant="caption" style={{
              color: cooldown > 0 ? theme.colors.muted : theme.colors.primary,
              ...fontStyle(theme.typography, 'semibold'),
            }}>
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}
