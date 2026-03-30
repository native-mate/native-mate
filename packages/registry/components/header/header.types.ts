import type { StyleProp, ViewStyle } from 'react-native'

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

export interface HeaderAction {
  icon: string
  onPress: () => void
  accessibilityLabel?: string
}

export interface HeaderProps {
  /** Primary title */
  title: string
  /** Secondary line below the title */
  subtitle?: string
  /** Ionicons name for the left icon (defaults to 'chevron-back') */
  leftIcon?: string
  /** Callback when the left icon is pressed */
  onLeftPress?: () => void
  /** Hide the left icon entirely */
  hideLeft?: boolean
  /** Array of right-side action icons */
  rightActions?: HeaderAction[]
  /** Transparent background (useful over images/maps) */
  transparent?: boolean
  /** Enable large title mode that can shrink via scrollY */
  largeTitle?: boolean
  /** Reanimated shared value from a scroll view for large-title collapse */
  scrollY?: { value: number }
  /** Haptic feedback style */
  haptic?: HapticStyle
  /** Custom background color override */
  backgroundColor?: string
  /** Custom title color override */
  titleColor?: string
  /** Safe area top inset override (auto-detected by default) */
  topInset?: number
  style?: StyleProp<ViewStyle>
}
