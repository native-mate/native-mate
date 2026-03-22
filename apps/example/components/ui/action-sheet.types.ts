// native-mate: action-sheet@0.1.0 | hash:e71ceda46358702a
export interface ActionSheetAction {
  label: string
  onPress: () => void
  variant?: 'default' | 'destructive'
  icon?: React.ReactNode
  description?: string
  disabled?: boolean
}

export interface ActionSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  actions: ActionSheetAction[]
  cancelLabel?: string
  /** Animation preset. Default: 'slide' */
  animation?: 'slide' | 'spring' | 'fade'
  /** Show separators between actions. Default: true */
  showDividers?: boolean
}
