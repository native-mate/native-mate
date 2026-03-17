export type SwitchSize = 'sm' | 'md' | 'lg'

export interface SwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: SwitchSize
  color?: string
  loading?: boolean
  haptic?: boolean
  labelPosition?: 'left' | 'right'
  accessibilityLabel?: string
}
