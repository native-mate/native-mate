import type { ErrorProp, HapticProp } from '@native-mate/core'

export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  indeterminate?: boolean
  label?: string
  description?: string
  disabled?: boolean
  /** A string renders as the message; `true` sets error styling with no text. */
  error?: ErrorProp
  size?: CheckboxSize
  color?: string
  labelPosition?: 'right' | 'left'
  /** `false`/`'none'` disables; `true` means `'light'`. Default: true */
  haptic?: HapticProp
  accessibilityLabel?: string
}

export interface CheckboxGroupOption {
  label: string
  value: string
  description?: string
  disabled?: boolean
}

export interface CheckboxGroupProps {
  options: CheckboxGroupOption[]
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  /** A string renders as the message; `true` sets error styling with no text. */
  error?: ErrorProp
  disabled?: boolean
  size?: CheckboxSize
  horizontal?: boolean
  /** `false`/`'none'` disables; `true` means `'light'`. Default: true */
  haptic?: HapticProp
}
