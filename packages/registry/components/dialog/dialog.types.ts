import type { StyleProp, ViewStyle } from 'react-native'

export type DialogVariant = 'default' | 'destructive'
export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

export interface DialogProps {
  visible: boolean
  onClose: () => void
  title: string
  description?: string
  /** Confirm button label (defaults to 'Confirm') */
  confirmLabel?: string
  /** Cancel button label (defaults to 'Cancel') */
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
  variant?: DialogVariant
  /** Ionicons icon name displayed above the title */
  icon?: string | null
  /** Dismiss by tapping the backdrop */
  dismissible?: boolean
  haptic?: HapticStyle
  style?: StyleProp<ViewStyle>
}
