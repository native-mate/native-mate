import type { StyleProp, ViewStyle } from 'react-native'

export type DatePickerMode = 'date' | 'time' | 'datetime'

/** 0 = Sunday … 6 = Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

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
  /** Whether the picker's bottom sheet is open. Default: false */
  visible?: boolean
  /** Called when the picker is dismissed */
  onClose?: () => void
  /** Title shown at the top of the sheet */
  title?: string
  /** Show a confirm button instead of auto-closing. Default: false */
  showConfirmButton?: boolean
  /** Confirm button label. Default: the `done` string from `useStrings()` */
  confirmLabel?: string
  /** Cancel button label. Default: the `cancel` string from `useStrings()` */
  cancelLabel?: string
  /**
   * First column of the calendar grid. 0 = Sunday (default), 1 = Monday, …
   * Not derived from the locale: `Intl.Locale.prototype.weekInfo` does not
   * exist in Hermes, so there is nothing reliable to read it from.
   */
  firstDayOfWeek?: Weekday
  /**
   * BCP-47 tag used to resolve month and weekday names, and to pick the
   * default for `hour12`, via `Intl`. Falls back to `useStrings()` whenever
   * `Intl` is missing or throws — see the note in date-picker.tsx about
   * Hermes' locale data.
   */
  locale?: string
  /**
   * 12-hour time spinner with an AM/PM selector. Defaults to whatever `Intl`
   * reports for `locale`, and to 24-hour when `Intl` cannot answer.
   */
  hour12?: boolean
  /** Enable haptic feedback. Default: true */
  haptic?: boolean
  /** Whether picker is disabled. Default: false */
  disabled?: boolean
  /** Height of the bottom sheet. Default: 420 */
  sheetHeight?: number
  style?: StyleProp<ViewStyle>
}
