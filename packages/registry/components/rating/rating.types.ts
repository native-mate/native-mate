import type { StyleProp, ViewStyle } from 'react-native'

export type RatingSize = 'sm' | 'md' | 'lg'
export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

export interface RatingProps {
  value: number
  onChange?: (value: number) => void
  maxStars?: number
  size?: RatingSize
  /** Read-only display mode */
  readonly?: boolean
  /** Allow half-star values */
  allowHalf?: boolean
  /** Ionicons icon name for filled star */
  icon?: string
  /** Ionicons icon name for empty star */
  emptyIcon?: string
  /** Color for filled stars */
  color?: string
  /** Color for empty stars */
  emptyColor?: string
  /** Show numeric value next to stars */
  showValue?: boolean
  haptic?: HapticStyle
  disabled?: boolean
  accessibilityLabel?: string
  style?: StyleProp<ViewStyle>
}
