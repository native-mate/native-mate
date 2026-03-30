import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native'

export interface MentionUser {
  /** Unique user identifier */
  id: string
  /** Display name */
  name: string
  /** Optional avatar */
  avatar?: ImageSourcePropType
}

export interface MentionInputProps extends Omit<ViewProps, 'style'> {
  /** Current text value */
  value: string
  /** Called when text changes */
  onChangeText: (text: string) => void
  /** Available users for mentions */
  mentions?: MentionUser[]
  /** Called when a mention is selected */
  onMentionSelect?: (user: MentionUser) => void
  /** Called when the @query changes for filtering */
  onQueryChange?: (query: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Allow multiline input */
  multiline?: boolean
  /** Maximum number of lines for multiline */
  maxLines?: number
  /** Disable interactions */
  disabled?: boolean
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
