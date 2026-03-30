import type { StyleProp, ViewStyle } from 'react-native'

export type DividerLabelPosition = 'center' | 'left' | 'right'
export type DividerLabelVariant = 'line' | 'dashed'

export interface DividerLabelProps {
  /** Text label in the divider */
  label: string
  /** Position of the label */
  position?: DividerLabelPosition
  /** Line style */
  variant?: DividerLabelVariant
  /** Line color override */
  color?: string
  /** Text color override */
  textColor?: string
  /** Line thickness */
  thickness?: number
  /** Vertical spacing around the divider */
  spacing?: number
  style?: StyleProp<ViewStyle>
}
