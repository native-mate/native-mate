// native-mate: switch@0.1.0 | hash:ed13e21f1569ab7c
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
