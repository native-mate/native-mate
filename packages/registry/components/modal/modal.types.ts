import type React from 'react'

export interface ModalAction {
  label: string
  onPress: () => void
  variant?: 'default' | 'primary' | 'destructive'
}

export interface ModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'fullscreen'
  /** Footer action buttons */
  actions?: ModalAction[]
  /** Prevent closing by tapping backdrop */
  dismissible?: boolean
  /** Show close (×) button in header */
  showCloseButton?: boolean
  /**
   * Ref to the control that opened the modal (usually the trigger `Pressable`).
   * When the modal finishes closing, screen-reader focus is sent back to it via
   * `AccessibilityInfo.setAccessibilityFocus`, instead of being dropped at the
   * top of the screen. Native-only and fully guarded — a missing ref, web, or an
   * unavailable API is a silent no-op.
   */
  returnFocusRef?: React.RefObject<any> | null
}
