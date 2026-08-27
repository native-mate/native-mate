import type { ErrorProp, HapticProp, IconProp } from '@native-mate/core'

export type RadioSize = 'sm' | 'md' | 'lg'

export interface RadioOption {
  label: string
  value: string
  description?: string
  icon?: IconProp
  disabled?: boolean
}

export interface RadioProps {
  selected: boolean
  onSelect: () => void
  label?: string
  description?: string
  disabled?: boolean
  size?: RadioSize
  color?: string
  card?: boolean
  /** `false`/`'none'` disables; `true` means `'light'`. Default: true */
  haptic?: HapticProp
  accessibilityLabel?: string
}

export interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  onChange: (value: string) => void
  label?: string
  /** A string renders as the message; `true` sets error styling with no text. */
  error?: ErrorProp
  disabled?: boolean
  size?: RadioSize
  horizontal?: boolean
  card?: boolean
  /** `false`/`'none'` disables; `true` means `'light'`. Default: true */
  haptic?: HapticProp
}
