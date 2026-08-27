import type { StyleProp, ViewStyle } from 'react-native'
import type { HapticProp, IconProp } from '@native-mate/core'

/** Re-exported from core so existing imports keep resolving. */
export type { HapticStyle } from '@native-mate/core'

export interface SearchBarSuggestion {
  id: string
  label: string
  /**
   * A node. A string is still accepted for one minor and rendered through
   * Ionicons — deprecated, removed in v0.6.
   */
  icon?: IconProp | string
}

export interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  /** Defaults to `useStrings().search`. */
  placeholder?: string
  onFocus?: () => void
  onBlur?: () => void
  /** Called when user taps the cancel button */
  onCancel?: () => void
  /** Show cancel button (auto-shows on focus if true) */
  showCancel?: boolean
  /** Suggestion items displayed below the input */
  suggestions?: SearchBarSuggestion[]
  onSuggestionPress?: (suggestion: SearchBarSuggestion) => void
  /** Show loading spinner in the search bar */
  loading?: boolean
  /** Called when the keyboard's search/submit key is pressed */
  onSubmitEditing?: (text: string) => void
  /**
   * Debounce window (ms) for `onDebouncedChangeText`. Default: 300.
   * Only takes effect when `onDebouncedChangeText` is provided.
   */
  debounceMs?: number
  /** Called `debounceMs` after the user stops typing */
  onDebouncedChangeText?: (text: string) => void
  /** Auto-focus the input on mount */
  autoFocus?: boolean
  disabled?: boolean
  /** `false`/`'none'` disables; `true` means `'light'`. */
  haptic?: HapticProp
  style?: StyleProp<ViewStyle>
  testID?: string
}

/** Imperative handle exposed via ref. */
export interface SearchBarHandle {
  focus(): void
  blur(): void
  clear(): void
  isFocused(): boolean
}
