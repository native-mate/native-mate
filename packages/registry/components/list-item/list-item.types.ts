import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

export interface ListItemProps {
  /** Primary text */
  title: string
  /** Secondary text below the title */
  subtitle?: string
  /** Tertiary description text */
  description?: string
  /** Element on the left: icon, avatar, image, or custom node */
  leading?: React.ReactNode
  /** Element on the right: chevron, badge, switch, text, or custom node */
  trailing?: React.ReactNode
  onPress?: () => void
  onLongPress?: () => void
  disabled?: boolean
  /** Destructive/danger styling */
  destructive?: boolean
  /** Show bottom divider line */
  divider?: boolean
  /** Compact row with less padding */
  compact?: boolean
  /** Haptic feedback on press */
  haptic?: HapticStyle
  /** Show chevron as trailing element by default when onPress is defined */
  showChevron?: boolean
  style?: StyleProp<ViewStyle>
}
