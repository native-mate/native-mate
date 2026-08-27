import type { StyleProp, ViewStyle } from 'react-native'

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

export interface SearchBarSuggestion {
  id: string
  label: string
  icon?: string
}

export interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
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
  /** Auto-focus the input on mount */
  autoFocus?: boolean
  disabled?: boolean
  haptic?: HapticStyle
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
