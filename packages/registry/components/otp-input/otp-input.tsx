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
import {
  useTheme,
  useMotion,
  withAlpha,
  Text,
  makeStyles,
  fontStyle,
  resolveError,
  resolveHaptic,
  useHaptics,
  useStrings,
  deprecatedProp,
} from '@native-mate/core'
import type { OTPInputProps, OTPInputHandle } from './otp-input.types'

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
  testID,
}: {
  char: string
  isActive: boolean
  isFilled: boolean
  error: boolean
  success: boolean
  variant: 'box' | 'underline' | 'rounded'
  secure: boolean
  testID?: string
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
    <Animated.View
      style={[containerStyle, isUnderline ? underlineBorderStyle : borderAnimStyle]}
      testID={testID}
      // The real (offscreen) TextInput carries the accessible value; the cells
      // are a purely visual mirror and would otherwise be read out as noise.
      accessibilityElementsHidden={true}
      importantForAccessibility="no-hide-descendants"
    >
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

export const OTPInput = React.forwardRef<OTPInputHandle, OTPInputProps>(({
  length = 6,
  value,
  onChange,
  onComplete,
  error = false,
  errorMessage: errorMessageProp,
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
  initialCooldown = 0,
  onResend,
  haptic = true,
  accessibilityLabel,
  testID,
}, ref) => {
  const theme = useTheme()
  const styles = useStyles()
  const strings = useStrings()
  const haptics = useHaptics()
  const inputRef = useRef<TextInput>(null)

  // `error` used to be a boolean paired with `errorMessage`; it now carries the
  // message itself. `errorMessage` still wins for one minor so existing call
  // sites keep rendering their copy.
  const { hasError, message } = resolveError(error)
  const errorText = errorMessageProp !== undefined
    ? deprecatedProp('errorMessage', 'error', errorMessageProp)
    : message

  // Resolved once, outside every callback: `false`/`'none'` means silent.
  const hapticsWanted = resolveHaptic(haptic) !== null
  const [focused, setFocused] = useState(false)
  // Seeded once: a code is typically already in flight when this mounts.
  const [cooldown, setCooldown] = useState(() => Math.max(0, initialCooldown))

  // Shake on error
  const shakeAnim = useSharedValue(0)
  useEffect(() => {
    if (hasError) {
      shakeAnim.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      )
      if (hapticsWanted) haptics.notify('error')
    }
  }, [hasError])

  // Success haptic
  useEffect(() => {
    if (success && hapticsWanted) {
      haptics.notify('success')
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
      if (hapticsWanted) haptics.notify('success')
      onComplete?.(clean)
    }
  }, [length, type, onChange, onComplete, hapticsWanted, haptics])

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: () => onChange(''),
  }), [onChange])

  const handleResend = useCallback(() => {
    onChange('')
    setCooldown(resendCooldown)
    onResend?.()
  }, [onChange, resendCooldown, onResend])

  const rowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnim.value }],
  }))

  return (
    <View style={styles.wrapper} testID={testID}>
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
              error={hasError}
              success={success && value.length === length}
              variant={variant}
              secure={secure}
              testID={testID ? `${testID}-cell-${i}` : undefined}
            />
          ))}
        </Animated.View>
      </Pressable>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType={type === 'numeric' ? 'number-pad' : 'default'}
        autoCapitalize={type === 'alphanumeric' ? 'characters' : 'none'}
        maxLength={length}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
        editable={!disabled && !loading}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={accessibilityLabel ?? strings.verificationCode}
        accessibilityHint={`Enter the ${length}-character code`}
        accessibilityValue={{ text: value.split('').join(' ') }}
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        testID={testID ? `${testID}-input` : undefined}
      />

      {errorText && hasError && (
        <Text variant="caption" style={styles.error}>{errorText}</Text>
      )}
      {!hasError && hint && (
        <Text variant="caption" style={styles.hint}>{hint}</Text>
      )}

      {resend && (
        <View style={styles.resendRow}>
          <Text variant="caption" muted>{strings.resendPrompt}</Text>
          <Pressable onPress={handleResend} disabled={cooldown > 0}>
            <Text variant="caption" style={{
              color: cooldown > 0 ? theme.colors.muted : theme.colors.primary,
              ...fontStyle(theme.typography, 'semibold'),
            }}>
              {cooldown > 0 ? strings.resendIn(cooldown) : strings.resend}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  )
})

OTPInput.displayName = 'OTPInput'
