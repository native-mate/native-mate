import type { ErrorProp, HapticProp, IconProp } from '@native-mate/core'

export interface SelectOption {
  label: string
  value: string
  description?: string
  icon?: IconProp
  disabled?: boolean
}

export interface SelectGroup {
  label: string
  options: SelectOption[]
}

export interface SelectProps {
  options: SelectOption[]
  groups?: SelectGroup[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  /** A string renders as the message; `true` sets error styling with no text. */
  error?: ErrorProp
  hint?: string
  disabled?: boolean
  required?: boolean
  clearable?: boolean
  searchable?: boolean
  /** Defaults to `useStrings().search`. */
  searchPlaceholder?: string
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** `false`/`'none'` disables; `true` means `'light'`. Default: true */
  haptic?: HapticProp
}

export interface MultiSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  value: string[]
  onChange: (value: string[]) => void
  maxSelections?: number
}
