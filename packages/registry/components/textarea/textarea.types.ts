import type { TextInputProps } from 'react-native'

export interface TextareaProps extends Omit<TextInputProps, 'style' | 'multiline'> {
  label?: string
  error?: string
  hint?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  /** Minimum visible rows (default 3) */
  minRows?: number
  /** Maximum rows before scroll kicks in */
  maxRows?: number
  /** Show character count below */
  showCount?: boolean
  /** Amber warning threshold 0–1, e.g. 0.8 = warn at 80% */
  countWarnAt?: number
  /** Submit on Enter key; Shift+Enter inserts newline */
  submitOnEnter?: boolean
  /** Called when Enter is pressed and submitOnEnter is true */
  onSubmit?: (value: string) => void
  /** Called when text contains @ — passes the mention query string */
  onMention?: (query: string) => void
  /** Show microphone button for voice input */
  voiceInput?: boolean
  /** Called when voice button is pressed — wire to expo-speech or your STT lib */
  onVoicePress?: () => void
  /** Floating label style (Material Design) */
  floatingLabel?: boolean
}
