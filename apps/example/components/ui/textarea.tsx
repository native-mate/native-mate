// native-mate: textarea@0.1.0 | hash:c6fa3aa6d107aea2
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { View, TextInput, Pressable, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { TextareaProps } from './textarea.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

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
    marginLeft: 8,
    marginTop: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export const Textarea: React.FC<TextareaProps> = ({
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
  value,
  onChangeText,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  placeholder,
  maxLength,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const inputRef = useRef<TextInput>(null)

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
      left: -2,
      top: floatAnim.value === 1 ? -22 : 4,
      fontSize: floatAnim.value === 1 ? 11 : 15,
      color: interpolateColor(
        floatAnim.value,
        [0, 1],
        [theme.colors.muted, focused ? theme.colors.primary : theme.colors.muted],
      ),
      backgroundColor: theme.colors.background,
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

  const countColor = isAtLimit
    ? theme.colors.destructive
    : isNearLimit
    ? '#f59e0b'
    : theme.colors.muted

  return (
    <View style={styles.wrapper}>
      {/* Label row (non-floating) */}
      {label && !floatingLabel && (
        <View style={styles.labelRow}>
          <Text variant="label">
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
        {/* Floating label */}
        {floatingLabel && label && (
          <Animated.Text style={[{ fontFamily: undefined }, floatingLabelStyle]}>
            {label}{required ? ' *' : ''}
          </Animated.Text>
        )}

        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
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
                Haptics?.impactAsync(Haptics?.ImpactFeedbackStyle?.Light)
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
          {error && <Text variant="caption" style={styles.error}>{error}</Text>}
          {!error && hint && <Text variant="caption" style={styles.hint}>{hint}</Text>}
        </View>
        {showCount && (
          <Text variant="caption" style={{ color: countColor }}>
            {charCount}{maxLength ? `/${maxLength}` : ''}
          </Text>
        )}
      </View>
    </View>
  )
}
