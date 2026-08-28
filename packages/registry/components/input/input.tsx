// native-mate: input@0.3.0 | hash:PLACEHOLDER
import React, { useState, useRef, useEffect, useImperativeHandle } from 'react'
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
import { Ionicons } from '@expo/vector-icons'
import {
  useTheme,
  Text,
  makeStyles,
  fontStyle,
  resolveError,
  useHaptics,
  useStrings,
  deprecatedProp,
} from '@native-mate/core'
import type { InputProps, InputHandle } from './input.types'

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

export const Input = React.forwardRef<InputHandle, InputProps>(({
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
  haptic = false,
  hapticOnFocus,
  value,
  onChangeText,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  placeholder,
  testID,
  ...rest
}, ref) => {
  const theme = useTheme()
  const styles = useStyles()
  const haptics = useHaptics()
  const strings = useStrings()
  const config = sizeConfig[size]
  const inputRef = useRef<TextInput>(null)

  // `hapticOnFocus` is the pre-v0.5 name for the same switch. Honoured for one
  // minor, and it wins when explicitly passed so old call sites don't change
  // behaviour.
  const hapticSetting = hapticOnFocus !== undefined
    ? deprecatedProp('hapticOnFocus', 'haptic', hapticOnFocus)
    : haptic

  // `hasError` (a plain boolean) is what crosses into the worklet below —
  // `error` itself may be a string and must never be captured there.
  const { hasError, message: errorText } = resolveError(error)

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
    if (hasError) {
      shakeAnim.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      )
    }
  }, [hasError])

  // Focus border animation
  useEffect(() => {
    focusAnim.value = withTiming(focused ? 1 : 0, { duration: 200 })
  }, [focused])

  // Hoisted OUT of the worklets below: a `theme.…` read inside a worklet copies
  // the whole theme object to the UI thread on every evaluation. Only these
  // plain strings/arrays cross the boundary. They depend on `focused`/`hasError`
  // and simply recompute on render, which is exactly what we want.
  const destructiveColor = theme.colors.destructive
  const backgroundColor = theme.colors.background
  const mutedColor = theme.colors.muted
  const borderRange = [theme.colors.border, theme.colors.primary]
  const labelColorRange = [mutedColor, focused ? theme.colors.primary : mutedColor]

  const containerAnimStyle = useAnimatedStyle(() => ({
    borderColor: hasError
      ? destructiveColor
      : interpolateColor(focusAnim.value, [0, 1], borderRange),
    transform: [{ translateX: shakeAnim.value }],
  }))

  // Computed OUTSIDE the worklet: `prefix` is a React element, and a worklet
  // closure must never capture one. Only this plain number crosses threads.
  const labelLeft = config.paddingH - 6 + (prefixText || prefix ? 40 : 0)

  // Resting values for the non-floating branch. The floating <Animated.Text> is
  // only mounted when `floatingLabel` is true, so nothing on screen changes —
  // but every branch has to return the SAME keys, because Reanimated never
  // resets a key it stops receiving.
  const restingLabelTop = config.minHeight / 2 - 8

  const floatingLabelStyle = useAnimatedStyle(() => {
    if (!floatingLabel) {
      return {
        position: 'absolute' as const,
        left: labelLeft,
        top: restingLabelTop,
        fontSize: config.fontSize,
        color: mutedColor,
        backgroundColor,
        paddingHorizontal: 6,
        zIndex: 10,
      }
    }
    return {
      position: 'absolute' as const,
      left: labelLeft,
      top: interpolate(floatAnim.value, [0, 1], [restingLabelTop, -9]),
      fontSize: interpolate(floatAnim.value, [0, 1], [config.fontSize, 11]),
      color: interpolateColor(floatAnim.value, [0, 1], labelColorRange),
      backgroundColor,
      paddingHorizontal: 6,
      zIndex: 10,
    }
  })

  const handleFocus = (e: any) => {
    setFocused(true)
    haptics.trigger(hapticSetting)
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

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: handleClear,
    isFocused: () => inputRef.current?.isFocused() ?? false,
  }))

  const charCount = (currentValue || '').length

  return (
    <View style={styles.wrapper} testID={testID}>
      {/* Label row */}
      {label && !floatingLabel && (
        <View style={styles.row}>
          <Text variant="label" testID={testID ? `${testID}-label` : undefined}>
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
        {/* Floating label. fontStyle() resolves the themed brand family (or
            the weight fallback when no custom family is registered) — the
            previous inline check emitted `fontFamily: undefined` for
            white-label themes and silently fell back to the system font. */}
        {floatingLabel && label && (
          <Animated.Text style={[fontStyle(theme.typography, 'regular'), floatingLabelStyle]}>
            {label}{required ? ' *' : ''}
          </Animated.Text>
        )}

        {/* Prefix text */}
        {prefixText && (
          <View style={{ borderEndWidth: 1, borderColor: theme.colors.border, justifyContent: 'center', paddingHorizontal: config.paddingH }}>
            <Text variant="body" color={theme.colors.muted} style={{ fontSize: config.fontSize }}>{prefixText}</Text>
          </View>
        )}

        {/* Prefix icon */}
        {prefix && (
          <View style={{ paddingStart: config.paddingH, justifyContent: 'center' }}>
            {prefix}
          </View>
        )}

        {/* TextInput */}
        {/* `{...rest}` is spread FIRST so the component's own contract —
            accessibility, the disabled/editable state, value wiring and style —
            always wins. Spreading it last let a consumer silently clobber
            `editable={!disabled}` or the accessibility label. */}
        <TextInput
          {...rest}
          ref={inputRef}
          testID={testID ? `${testID}-input` : undefined}
          style={[
            styles.input,
            {
              fontSize: config.fontSize,
              paddingHorizontal: config.paddingH,
              minHeight: config.minHeight,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
          placeholderTextColor={theme.colors.muted}
          placeholder={floatingLabel && !focused && !currentValue ? undefined : placeholder}
          value={currentValue}
          onChangeText={handleChangeText}
          editable={!disabled}
          accessibilityLabel={label ?? rest.accessibilityLabel}
          accessibilityHint={errorText || hint || rest.accessibilityHint}
          accessibilityState={{ disabled }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntryProp && !showPassword}
          maxLength={maxLength}
        />

        {/* Clear button */}
        {clearable && currentValue ? (
          <Pressable
            onPress={handleClear}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={label ? `${strings.clear} ${label}` : strings.clear}
            style={{ paddingEnd: config.paddingH }}
            testID={testID ? `${testID}-clear` : undefined}
          >
            <View style={styles.clearBtn}>
              <Ionicons name="close" size={11} color={theme.colors.onSurface} />
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
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? strings.hidePassword : strings.showPassword}
            style={{ paddingEnd: config.paddingH }}
            testID={testID ? `${testID}-toggle` : undefined}
          >
            <Text variant="caption" color={theme.colors.muted}>{showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        )}

        {/* Suffix icon */}
        {suffix && (
          <View style={{ paddingEnd: config.paddingH, justifyContent: 'center' }}>
            {suffix}
          </View>
        )}

        {/* Suffix text */}
        {suffixText && (
          <View style={{ borderStartWidth: 1, borderColor: theme.colors.border, justifyContent: 'center', paddingHorizontal: config.paddingH }}>
            <Text variant="body" color={theme.colors.muted} style={{ fontSize: config.fontSize }}>{suffixText}</Text>
          </View>
        )}
      </AnimatedView>

      {/* Bottom row: error/hint + count */}
      <View style={styles.row}>
        {/* Validation errors must announce the moment they change — an
            assertive live region interrupts so the message isn't missed. */}
        <View style={{ flex: 1 }} accessibilityLiveRegion={hasError ? 'assertive' : 'none'}>
          {errorText && (
            <Text
              variant="caption"
              style={styles.error}
              accessibilityLiveRegion="assertive"
              accessibilityRole="alert"
              testID={testID ? `${testID}-error` : undefined}
            >
              {errorText}
            </Text>
          )}
          {!hasError && hint && <Text variant="caption" style={styles.hint}>{hint}</Text>}
        </View>
        {showCount && (
          <Text variant="caption" style={styles.hint}>
            {charCount}{maxLength ? `/${maxLength}` : ''}
          </Text>
        )}
      </View>
    </View>
  )
})

Input.displayName = 'Input'
