import type { StyleProp, ViewStyle } from 'react-native'

export type DatePickerMode = 'date' | 'time' | 'datetime'

export interface DatePickerProps {
  /** Currently selected date */
  value: Date
  /** Called when the date changes */
  onChange: (date: Date) => void
  /** Picker mode. Default: 'date' */
  mode?: DatePickerMode
  /** Minimum selectable date */
  minimumDate?: Date
  /** Maximum selectable date */
  maximumDate?: Date
  /** Whether the picker is visible (bottom sheet). Default: false */
  visible?: boolean
  /** Called when the picker is dismissed */
  onClose?: () => void
  /** Title shown at the top of the sheet */
  title?: string
  /** Show a confirm button instead of auto-closing. Default: false */
  showConfirmButton?: boolean
  /** Confirm button label. Default: 'Done' */
  confirmLabel?: string
  /** Enable haptic feedback. Default: true */
  haptic?: boolean
  /** Whether picker is disabled. Default: false */
  disabled?: boolean
  /** Height of the bottom sheet. Default: 420 */
  sheetHeight?: number
  style?: StyleProp<ViewStyle>
}
