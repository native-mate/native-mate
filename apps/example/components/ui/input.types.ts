// native-mate: input@0.2.0 | hash:19e416df1fb1c896
import type { TextInputProps } from 'react-native'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string
  error?: string
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
  hapticOnFocus?: boolean
}
