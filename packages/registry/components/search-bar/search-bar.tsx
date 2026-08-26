// native-mate: search-bar@0.1.0 | hash:PLACEHOLDER
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { View, TextInput, Pressable, ActivityIndicator, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { SearchBarProps, SearchBarSuggestion, HapticStyle } from './search-bar.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const triggerHaptic = (style: HapticStyle) => {
  if (!Haptics || style === 'none') return
  const map = { light: 'Light', medium: 'Medium', heavy: 'Heavy' } as const
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[map[style]])
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

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onFocus,
  onBlur,
  onCancel,
  showCancel,
  suggestions = [],
  onSuggestionPress,
  loading = false,
  autoFocus = false,
  disabled = false,
  haptic = 'light',
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const inputRef = useRef<TextInput>(null)
  const [focused, setFocused] = useState(false)

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

  const handleFocus = useCallback(() => {
    setFocused(true)
    onFocus?.()
  }, [onFocus])

  const handleBlur = useCallback(() => {
    setFocused(false)
    onBlur?.()
  }, [onBlur])

  const handleCancel = useCallback(() => {
    triggerHaptic(haptic)
    onChangeText('')
    inputRef.current?.blur()
    setFocused(false)
    onCancel?.()
  }, [haptic, onChangeText, onCancel])

  const handleClear = useCallback(() => {
    triggerHaptic(haptic)
    onChangeText('')
    inputRef.current?.focus()
  }, [haptic, onChangeText])

  const handleSuggestionPress = useCallback((suggestion: SearchBarSuggestion) => {
    triggerHaptic(haptic)
    onSuggestionPress?.(suggestion)
  }, [haptic, onSuggestionPress])

  const showSuggestions = focused && suggestions.length > 0

  return (
    <View style={[styles.container, disabled && { opacity: 0.5 }, style]}>
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
            style={[
              styles.input,
              Platform.OS === 'web' && { outlineStyle: 'none' } as any,
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.muted}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoFocus={autoFocus}
            editable={!disabled}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityRole="search"
            accessibilityLabel={placeholder}
          />
          {value.length > 0 && (
            <Pressable onPress={handleClear} hitSlop={6} accessibilityLabel="Clear search">
              <View style={styles.clearBtn}>
                <Ionicons name="close" size={12} color={theme.colors.muted} />
              </View>
            </Pressable>
          )}
        </View>

        {/* Cancel button */}
        <Animated.View style={[{ overflow: 'hidden' }, cancelAnimStyle]}>
          <Pressable onPress={handleCancel} accessibilityRole="button" accessibilityLabel="Cancel search">
            <Text style={{ color: theme.colors.primary, fontSize: 15, ...fontStyle(theme.typography, 'medium') }}>
              Cancel
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
                <Ionicons
                  name={(suggestion.icon ?? 'search-outline') as any}
                  size={16}
                  color={theme.colors.muted}
                />
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
}
