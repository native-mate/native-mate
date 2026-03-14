import type { TextInputProps } from 'react-native'

export interface TextareaProps extends Omit<TextInputProps, 'style' | 'multiline'> {
  label?: string
  error?: string
  hint?: string
  disabled?: boolean
  rows?: number
}
