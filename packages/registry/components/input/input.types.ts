import type { TextInputProps } from 'react-native'

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string
  error?: string
  hint?: string
  disabled?: boolean
}
