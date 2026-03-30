import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right'

export interface PopoverProps {
  /** The trigger element */
  trigger: React.ReactElement
  /** Content rendered inside the popover */
  content: React.ReactNode
  position?: PopoverPosition
  /** Controlled visibility */
  visible?: boolean
  onOpenChange?: (open: boolean) => void
  /** Show the arrow pointing to trigger */
  showArrow?: boolean
  /** Close when tapping outside */
  closeOnOutsidePress?: boolean
  /** Max width of the popover */
  maxWidth?: number
  /** Max height of the popover content area */
  maxHeight?: number
  style?: StyleProp<ViewStyle>
}
