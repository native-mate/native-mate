import type { HapticProp } from '@native-mate/core'

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
  /** `false`/`'none'` disables; `true` means `'light'`. Default: true */
  haptic?: HapticProp
  labelPosition?: 'left' | 'right'
  accessibilityLabel?: string
}
