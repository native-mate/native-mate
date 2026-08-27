import type React from 'react'
import type { IconProp } from '@native-mate/core'

// Canonical home is '@native-mate/core'; re-exported for source compatibility.
export type { IconProp } from '@native-mate/core'

export interface ActionSheetAction {
  label: string
  onPress: () => void
  variant?: 'default' | 'destructive'
  icon?: IconProp
  description?: string
  disabled?: boolean
}

export interface ActionSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  actions: ActionSheetAction[]
  /** Cancel button label. Defaults to the themed `cancel` string. */
  cancelLabel?: string
  /** Animation preset. Default: 'slide' */
  animation?: 'slide' | 'spring' | 'fade'
  /** Show separators between actions. Default: true */
  showDividers?: boolean
  /**
   * Ref to the control that opened the sheet (usually the trigger `Pressable`).
   * When the sheet finishes closing, screen-reader focus is sent back to it via
   * `AccessibilityInfo.setAccessibilityFocus`, instead of being dropped at the
   * top of the screen. Native-only and fully guarded — a missing ref, web, or an
   * unavailable API is a silent no-op.
   */
  returnFocusRef?: React.RefObject<any> | null
}
