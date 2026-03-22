// native-mate: checkbox@0.1.0 | hash:3776e3a1dfc61bc8
export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  indeterminate?: boolean
  label?: string
  description?: string
  disabled?: boolean
  error?: string
  size?: CheckboxSize
  color?: string
  labelPosition?: 'right' | 'left'
  haptic?: boolean
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
  error?: string
  disabled?: boolean
  size?: CheckboxSize
  horizontal?: boolean
}
