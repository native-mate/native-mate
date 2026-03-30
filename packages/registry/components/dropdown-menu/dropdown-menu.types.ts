import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

export interface DropdownMenuItem {
  key: string
  label: string
  /** Ionicons icon name */
  icon?: string
  onPress: () => void
  destructive?: boolean
  disabled?: boolean
  /** Show a divider after this item */
  divider?: boolean
}

export interface DropdownMenuProps {
  /** The element that triggers the menu */
  trigger: React.ReactElement
  items: DropdownMenuItem[]
  /** Controlled open state */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Anchor position relative to trigger */
  align?: 'left' | 'right'
  haptic?: HapticStyle
  style?: StyleProp<ViewStyle>
}
