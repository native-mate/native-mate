export type RadioSize = 'sm' | 'md' | 'lg'

export interface RadioOption {
  label: string
  value: string
  description?: string
  icon?: React.ReactNode
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
  haptic?: boolean
  accessibilityLabel?: string
}

export interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  onChange: (value: string) => void
  label?: string
  error?: string
  disabled?: boolean
  size?: RadioSize
  horizontal?: boolean
  card?: boolean
  haptic?: boolean
}
