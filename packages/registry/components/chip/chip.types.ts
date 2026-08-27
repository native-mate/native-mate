import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { HapticProp, IconProp } from '@native-mate/core'

export type ChipVariant = 'filled' | 'outlined'
export type ChipSize = 'sm' | 'md'

// Canonical home is '@native-mate/core'; re-exported for source compatibility.
export type { HapticStyle, HapticProp, IconProp } from '@native-mate/core'

export interface ChipProps {
  label: string
  selected?: boolean
  onPress?: () => void
  variant?: ChipVariant
  size?: ChipSize
  /**
   * Node rendered before the label. A string is still accepted for one minor
   * and rendered through Ionicons — deprecated, pass an element instead.
   */
  icon?: IconProp
  /** Avatar node displayed before the label */
  avatar?: React.ReactNode
  /** Show a close/remove button */
  closable?: boolean
  onClose?: () => void
  disabled?: boolean
  /** Custom selected color */
  color?: string
  /** `false` (or 'none') disables haptics for this chip; `true` means 'light'. */
  haptic?: HapticProp
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
