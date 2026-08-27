// native-mate: search-bar@0.1.0 | hash:PLACEHOLDER
import React, { useState, useRef, useCallback, useEffect, useImperativeHandle } from 'react'
import { View, TextInput, Pressable, ActivityIndicator, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import {
  useTheme,
  Text,
  makeStyles,
  fontStyle,
  useHaptics,
  useStrings,
  deprecatedProp,
} from '@native-mate/core'
import type { SearchBarProps, SearchBarSuggestion, SearchBarHandle } from './search-bar.types'

// `icon` is a node in v0.5. A string still works for one minor — it is routed
// through the bundled Ionicons set exactly as before — but the warning fires
// once so call sites can migrate. Not a hook, so calling it per suggestion
// inside the list render is fine.
function renderSuggestionIcon(icon: SearchBarSuggestion['icon'], color: string) {
  if (icon == null) {
    return <Ionicons name="search-outline" size={16} color={color} />
  }
  if (typeof icon === 'string') {
    const name = deprecatedProp('suggestion.icon (string)', 'suggestion.icon (ReactNode)', icon)
    return <Ionicons name={name as any} size={16} color={color} />
  }
  return <>{icon}</>
}

const useStyles = makeStyles((theme) => ({
  container: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
    height: 42,
    gap: theme.spacing.xs,
  },
  inputWrapFocused: {
    borderColor: theme.colors.primary,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.foreground,
    paddingVertical: 0,
    height: '100%',
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.muted + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionsWrap: {
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  suggestionDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
}))

export const SearchBar = React.forwardRef<SearchBarHandle, SearchBarProps>(({
  value,
  onChangeText,
  placeholder,
  onFocus,
  onBlur,
  onCancel,
  showCancel,
  suggestions = [],
  onSuggestionPress,
  onSubmitEditing,
  debounceMs = 300,
  onDebouncedChangeText,
  loading = false,
  autoFocus = false,
  disabled = false,
  haptic = 'light',
  style,
  testID,
}, ref) => {
  const theme = useTheme()
  const styles = useStyles()
  const strings = useStrings()
  const haptics = useHaptics()
  const inputRef = useRef<TextInput>(null)
  const [focused, setFocused] = useState(false)

  // The prop still wins; the strings slot only supplies the default.
  const resolvedPlaceholder = placeholder ?? strings.search

  const showCancelButton = showCancel !== undefined ? showCancel : focused

  // Initialized from the current value (not a fixed "hidden" baseline) so a
  // demo/consumer passing showCancel={true} on first mount doesn't depend
  // solely on the effect below to reveal it.
  const cancelWidth = useSharedValue(showCancelButton ? 60 : 0)
  const cancelOpacity = useSharedValue(showCancelButton ? 1 : 0)

  useEffect(() => {
    if (showCancelButton) {
      cancelWidth.value = withSpring(60, { damping: 18, stiffness: 220 })
      cancelOpacity.value = withTiming(1, { duration: 200 })
    } else {
      cancelWidth.value = withSpring(0, { damping: 18, stiffness: 220 })
      cancelOpacity.value = withTiming(0, { duration: 150 })
    }
  }, [showCancelButton])

  const cancelAnimStyle = useAnimatedStyle(() => ({
    width: cancelWidth.value,
    opacity: cancelOpacity.value,
  }))

  // ── Debounced change ───────────────────────────────────────────────────────
  // The latest callback is held in a ref so the timer never fires a stale one,
  // and the pending timer is always cleared on unmount.
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const debouncedCbRef = useRef(onDebouncedChangeText)
  useEffect(() => { debouncedCbRef.current = onDebouncedChangeText }, [onDebouncedChangeText])
  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
  }, [])

  const handleChangeText = useCallback((text: string) => {
    onChangeText(text)
    if (!debouncedCbRef.current) return
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      debounceTimer.current = null
      debouncedCbRef.current?.(text)
    }, debounceMs)
  }, [onChangeText, debounceMs])

  const handleSubmitEditing = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }
    onSubmitEditing?.(value)
  }, [onSubmitEditing, value])

  const handleFocus = useCallback(() => {
    setFocused(true)
    onFocus?.()
  }, [onFocus])

  const handleBlur = useCallback(() => {
    setFocused(false)
    onBlur?.()
  }, [onBlur])

  const handleCancel = useCallback(() => {
    haptics.trigger(haptic)
    handleChangeText('')
    inputRef.current?.blur()
    setFocused(false)
    onCancel?.()
  }, [haptic, handleChangeText, onCancel])

  const handleClear = useCallback(() => {
    haptics.trigger(haptic)
    handleChangeText('')
    inputRef.current?.focus()
  }, [haptic, handleChangeText])

  const handleSuggestionPress = useCallback((suggestion: SearchBarSuggestion) => {
    haptics.trigger(haptic)
    onSuggestionPress?.(suggestion)
  }, [haptic, onSuggestionPress])

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: handleClear,
    isFocused: () => inputRef.current?.isFocused() ?? false,
  }))

  const showSuggestions = focused && suggestions.length > 0

  return (
    <View style={[styles.container, disabled && { opacity: 0.5 }, style]} testID={testID}>
      <View style={styles.row}>
        {/* Search input */}
        <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.muted} />
          ) : (
            <Ionicons name="search" size={18} color={theme.colors.muted} />
          )}
          <TextInput
            ref={inputRef}
            testID={testID ? `${testID}-input` : undefined}
            style={[
              styles.input,
              // A visible keyboard focus ring on web. The previous
              // `outlineStyle: 'none'` removed it entirely, leaving keyboard
              // users with no indication of where focus was.
              Platform.OS === 'web' && focused && ({
                outlineStyle: 'solid',
                outlineWidth: 2,
                outlineColor: theme.colors.primary,
                outlineOffset: 2,
              } as any),
            ]}
            value={value}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmitEditing}
            placeholder={resolvedPlaceholder}
            placeholderTextColor={theme.colors.muted}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoFocus={autoFocus}
            editable={!disabled}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityRole="search"
            accessibilityLabel={resolvedPlaceholder}
          />
          {value.length > 0 && (
            <Pressable
              onPress={handleClear}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={strings.clear}
              testID={testID ? `${testID}-clear` : undefined}
            >
              <View style={styles.clearBtn}>
                <Ionicons name="close" size={12} color={theme.colors.muted} />
              </View>
            </Pressable>
          )}
        </View>

        {/* Cancel button */}
        <Animated.View
          style={[{ overflow: 'hidden' }, cancelAnimStyle]}
          accessibilityElementsHidden={!showCancelButton}
          importantForAccessibility={showCancelButton ? 'auto' : 'no-hide-descendants'}
          pointerEvents={showCancelButton ? 'auto' : 'none'}
        >
          <Pressable onPress={handleCancel} hitSlop={8} accessibilityRole="button" accessibilityLabel={strings.cancel}>
            <Text style={{ color: theme.colors.primary, fontSize: 15, ...fontStyle(theme.typography, 'medium') }}>
              {strings.cancel}
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Suggestions */}
      {showSuggestions && (
        <View style={styles.suggestionsWrap}>
          {suggestions.map((suggestion, i) => (
            <React.Fragment key={suggestion.id}>
              {i > 0 && <View style={styles.suggestionDivider} />}
              <Pressable
                style={({ pressed }) => [
                  styles.suggestionItem,
                  pressed && { backgroundColor: theme.colors.surface + '80' },
                ]}
                onPress={() => handleSuggestionPress(suggestion)}
                accessibilityRole="button"
                accessibilityLabel={suggestion.label}
              >
                {renderSuggestionIcon(suggestion.icon, theme.colors.muted)}
                <Text style={{ fontSize: 14, color: theme.colors.foreground, flex: 1 }} numberOfLines={1}>
                  {suggestion.label}
                </Text>
                <Ionicons name="arrow-forward" size={14} color={theme.colors.muted} style={{ opacity: 0.5 }} />
              </Pressable>
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  )
})

SearchBar.displayName = 'SearchBar'
