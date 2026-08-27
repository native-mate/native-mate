import type { StyleProp, ViewStyle } from 'react-native'
import type { HapticProp, IconProp } from '@native-mate/core'

export type DialogVariant = 'default' | 'destructive'

// Canonical home is '@native-mate/core'; re-exported for source compatibility.
export type { HapticStyle, HapticProp, IconProp } from '@native-mate/core'

export interface DialogProps {
  visible: boolean
  onClose: () => void
  title: string
  description?: string
  /** Confirm button label. Defaults to the themed `confirm` string. */
  confirmLabel?: string
  /** Cancel button label. Defaults to the themed `cancel` string. */
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
  variant?: DialogVariant
  /**
   * Icon node displayed above the title; `null` hides the icon entirely.
   * A string is still accepted for one minor and rendered through Ionicons.
   */
  icon?: IconProp
  /** Dismiss by tapping the backdrop */
  dismissible?: boolean
  /** `false` (or 'none') disables haptics for this dialog; `true` means 'light'. */
  haptic?: HapticProp
  style?: StyleProp<ViewStyle>
}
