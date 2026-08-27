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
  /**
   * Where screen-reader focus goes when the popover closes. Defaults to the
   * popover's own trigger, which it already owns — pass a ref only when the
   * control the user actually pressed lives somewhere else. Native-only and
   * fully guarded: web, a missing ref, or an unavailable
   * `AccessibilityInfo.setAccessibilityFocus` is a silent no-op.
   */
  returnFocusRef?: React.RefObject<any> | null
}
