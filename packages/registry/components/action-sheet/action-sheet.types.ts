export interface ActionSheetAction {
  label: string
  onPress: () => void
  variant?: 'default' | 'destructive'
  icon?: React.ReactNode
  disabled?: boolean
}

export interface ActionSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  actions: ActionSheetAction[]
  cancelLabel?: string
}
