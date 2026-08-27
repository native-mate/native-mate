import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type ChipVariant = 'filled' | 'outlined'
export type ChipSize = 'sm' | 'md'
export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

export interface ChipProps {
  label: string
  selected?: boolean
  onPress?: () => void
  variant?: ChipVariant
  size?: ChipSize
  /** Ionicons icon name displayed before the label */
  icon?: string
  /** Avatar node displayed before the label */
  avatar?: React.ReactNode
  /** Show a close/remove button */
  closable?: boolean
  onClose?: () => void
  disabled?: boolean
  /** Custom selected color */
  color?: string
  haptic?: HapticStyle
  style?: StyleProp<ViewStyle>
  testID?: string
}

export interface ChipGroupProps {
  children: React.ReactNode
  /** Wrap chips to next line */
  wrap?: boolean
  /** Gap between chips */
  gap?: number
  style?: StyleProp<ViewStyle>
  testID?: string
}
