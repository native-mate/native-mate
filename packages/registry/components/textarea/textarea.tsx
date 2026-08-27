// native-mate: textarea@0.2.0 | hash:PLACEHOLDER
import React, { useState, useRef, useEffect, useCallback, useImperativeHandle } from 'react'
import { View, TextInput, Pressable, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
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
} from '@native-mate/core'
import type { TextareaProps, TextareaHandle } from './textarea.types'

const LINE_HEIGHT = 22

const useStyles = makeStyles((theme) => ({
  wrapper: { gap: theme.spacing.xs },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  container: {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  inputRow: { flexDirection: 'row', alignItems: 'flex-start' },
  input: {
    flex: 1,
    color: theme.colors.foreground,
    fontSize: 15,
    lineHeight: LINE_HEIGHT,
    textAlignVertical: 'top',
    paddingTop: 2,
    paddingBottom: 2,
  },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hint: { color: theme.colors.muted },
  error: { color: theme.colors.destructive },
  voiceBtn: {
    marginStart: 8,
    marginTop: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export const Textarea = React.forwardRef<TextareaHandle, TextareaProps>(({
  label,
  error,
  hint,
  disabled = false,
  readOnly = false,
  required = false,
  minRows = 3,
  maxRows = 10,
  showCount = false,
  countWarnAt = 0.8,
  submitOnEnter = false,
  onSubmit,
  onMention,
  voiceInput = false,
  onVoicePress,
  floatingLabel = false,
  haptic = true,
  value,
  onChangeText,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  placeholder,
  maxLength,
  testID,
  ...rest
}, ref) => {
  const theme = useTheme()
  const styles = useStyles()
  const haptics = useHaptics()
  const inputRef = useRef<TextInput>(null)

  // `hasError` (a plain boolean) is what the border worklet captures — `error`
  // itself may be a string and must never cross into one.
  const { hasError, message: errorText } = resolveError(error)

  const [focused, setFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(value || '')
  const [inputHeight, setInputHeight] = useState(minRows * LINE_HEIGHT + 4)

  const currentValue = value !== undefined ? value : internalValue
  const charCount = currentValue.length
  const isNearLimit = maxLength ? charCount / maxLength >= countWarnAt : false
  const isAtLimit = maxLength ? charCount >= maxLength : false

  // Animations
  const focusAnim = useSharedValue(0)
  const shakeAnim = useSharedValue(0)
  const floatAnim = useSharedValue(currentValue ? 1 : 0)

  useEffect(() => {
    focusAnim.value = withTiming(focused ? 1 : 0, { duration: 200 })
  }, [focused])

  useEffect(() => {
    if (floatingLabel) {
      floatAnim.value = withTiming(focused || currentValue ? 1 : 0, { duration: 250 })
    }
  }, [focused, currentValue, floatingLabel])

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

  const containerAnimStyle = useAnimatedStyle(() => ({
    borderColor: hasError
      ? theme.colors.destructive
      : interpolateColor(focusAnim.value, [0, 1], [theme.colors.border, theme.colors.primary]),
    transform: [{ translateX: shakeAnim.value }],
  }))

  const floatingLabelStyle = useAnimatedStyle(() => {
    if (!floatingLabel) return {}
    return {
      position: 'absolute' as const,
      left: -2,
      top: floatAnim.value === 1 ? -22 : 4,
      fontSize: floatAnim.value === 1 ? 11 : 15,
      color: interpolateColor(
        floatAnim.value,
        [0, 1],
        [theme.colors.muted, focused ? theme.colors.primary : theme.colors.muted],
      ),
      backgroundColor: (disabled || readOnly) ? theme.colors.surface : theme.colors.background,
      paddingHorizontal: 4,
      zIndex: 10,
    }
  })

  const handleFocus = (e: any) => {
    setFocused(true)
    onFocusProp?.(e)
  }

  const handleBlur = (e: any) => {
    setFocused(false)
    onBlurProp?.(e)
  }

  const handleChangeText = useCallback((text: string) => {
    if (value === undefined) setInternalValue(text)
    onChangeText?.(text)

    // Mention detection — find last @ and extract query after it
    if (onMention) {
      const atIdx = text.lastIndexOf('@')
      if (atIdx !== -1) {
        const query = text.slice(atIdx + 1)
        if (!query.includes(' ')) {
          onMention(query)
        }
      }
    }
  }, [value, onChangeText, onMention])

  const handleKeyPress = useCallback((e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (submitOnEnter && e.nativeEvent.key === 'Enter') {
      // On iOS nativeEvent doesn't expose shiftKey, so submitOnEnter sends always on Enter
      onSubmit?.(currentValue)
    }
  }, [submitOnEnter, onSubmit, currentValue])

  const handleContentSizeChange = useCallback((e: any) => {
    const newHeight = e.nativeEvent.contentSize.height
    const minH = minRows * LINE_HEIGHT + 4
    const maxH = maxRows * LINE_HEIGHT + 4
    setInputHeight(Math.min(Math.max(newHeight, minH), maxH))
  }, [minRows, maxRows])

  const handleClear = useCallback(() => {
    if (value === undefined) setInternalValue('')
    onChangeText?.('')
  }, [value, onChangeText])

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: handleClear,
    isFocused: () => inputRef.current?.isFocused() ?? false,
  }))

  const countColor = isAtLimit
    ? theme.colors.destructive
    : isNearLimit
    ? theme.colors.warning
    : theme.colors.muted

  return (
    <View style={styles.wrapper} testID={testID}>
      {/* Label row (non-floating) */}
      {label && !floatingLabel && (
        <View style={styles.labelRow}>
          <Text variant="label" testID={testID ? `${testID}-label` : undefined}>
            {label}
            {required && <Text variant="label" color={theme.colors.destructive}> *</Text>}
          </Text>
        </View>
      )}

      {/* Container */}
      <Animated.View style={[
        styles.container,
        { backgroundColor: (disabled || readOnly) ? theme.colors.surface : theme.colors.background },
        containerAnimStyle,
      ]}>
        {/* Floating label. fontStyle() resolves the themed brand family (or
            the weight fallback when no custom family is registered) — the
            previous `fontFamily: undefined` reset white-label themes back to
            the system font. */}
        {floatingLabel && label && (
          <Animated.Text style={[fontStyle(theme.typography, 'regular'), floatingLabelStyle]}>
            {label}{required ? ' *' : ''}
          </Animated.Text>
        )}

        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            testID={testID ? `${testID}-input` : undefined}
            multiline
            style={[
              styles.input,
              {
                height: inputHeight,
                opacity: (disabled || readOnly) ? 0.5 : 1,
                paddingTop: floatingLabel && currentValue ? 12 : 2,
              },
            ]}
            value={currentValue}
            onChangeText={handleChangeText}
            onContentSizeChange={handleContentSizeChange}
            placeholderTextColor={theme.colors.muted}
            placeholder={floatingLabel && !focused && !currentValue ? undefined : placeholder}
            editable={!disabled && !readOnly}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyPress={submitOnEnter ? handleKeyPress : undefined}
            maxLength={maxLength}
            scrollEnabled={inputHeight >= maxRows * LINE_HEIGHT + 4}
            accessibilityLabel={label}
            accessibilityState={{ disabled }}
            {...rest}
          />

          {/* Voice input button */}
          {voiceInput && (
            <Pressable
              onPress={() => {
                haptics.trigger(haptic)
                onVoicePress?.()
              }}
              style={[
                styles.voiceBtn,
                { backgroundColor: focused ? theme.colors.primary + '22' : theme.colors.surface },
              ]}
            >
              <Ionicons name="mic" size={16} color={focused ? theme.colors.primary : theme.colors.muted} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      {/* Bottom row: error/hint + count */}
      <View style={styles.bottomRow}>
        <View style={{ flex: 1 }}>
          {errorText && <Text variant="caption" style={styles.error} testID={testID ? `${testID}-error` : undefined}>{errorText}</Text>}
          {!hasError && hint && <Text variant="caption" style={styles.hint}>{hint}</Text>}
        </View>
        {showCount && (
          <Text variant="caption" style={{ color: countColor }}>
            {charCount}{maxLength ? `/${maxLength}` : ''}
          </Text>
        )}
      </View>
    </View>
  )
})

Textarea.displayName = 'Textarea'
