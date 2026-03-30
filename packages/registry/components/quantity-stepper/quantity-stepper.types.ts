import type { ViewProps, StyleProp, ViewStyle } from 'react-native'

export type QuantityStepperSize = 'sm' | 'md' | 'lg'

export interface QuantityStepperProps extends Omit<ViewProps, 'style'> {
  /** Current value */
  value: number
  /** Called when value changes */
  onChange: (value: number) => void
  /** Minimum value, default 0 */
  min?: number
  /** Maximum value */
  max?: number
  /** Increment step, default 1 */
  step?: number
  /** Size variant */
  size?: QuantityStepperSize
  /** Disable interactions */
  disabled?: boolean
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
