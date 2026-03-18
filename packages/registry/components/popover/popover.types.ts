import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface PopoverProps {
  /** The trigger element */
  children: React.ReactElement
  /** Content rendered inside the popover bubble */
  content: React.ReactNode
  placement?: PopoverPlacement
  /** Max width of the popover bubble (default 260) */
  maxWidth?: number
  /** Prevent closing by tapping outside */
  dismissible?: boolean
  /** Controlled open state */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  style?: StyleProp<ViewStyle>
}
