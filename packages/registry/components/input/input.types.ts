import type { TextInputProps } from 'react-native'
import type { ErrorProp, HapticProp } from '@native-mate/core'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string
  /** A string renders as the message; `true` sets error styling with no text. */
  error?: ErrorProp
  hint?: string
  disabled?: boolean
  size?: InputSize
  required?: boolean
  maxLength?: number
  showCount?: boolean
  clearable?: boolean
  onClear?: () => void
  secureTextEntry?: boolean
  showPasswordToggle?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  prefixText?: string
  suffixText?: string
  floatingLabel?: boolean
  /** Haptic feedback on focus. `false`/`'none'` disables; `true` means `'light'`. */
  haptic?: HapticProp
  /**
   * @deprecated Use `haptic`. Removed in v0.6.
   * Run `npx @native-mate/cli migrate v0.5`.
   */
  hapticOnFocus?: HapticProp
  testID?: string
}

/** Imperative handle exposed via ref. */
export interface InputHandle {
  focus(): void
  blur(): void
  clear(): void
  isFocused(): boolean
}
