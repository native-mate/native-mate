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
}
