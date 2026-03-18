export interface SelectOption {
  label: string
  value: string
  description?: string
  icon?: React.ReactNode
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
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  clearable?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export interface MultiSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
  value: string[]
  onChange: (value: string[]) => void
  maxSelections?: number
}
