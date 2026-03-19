import type { StyleProp, ViewStyle } from 'react-native'

export type SpinnerVariant = 'circle' | 'dots' | 'pulse'

export type SpinnerSize = 'sm' | 'md' | 'lg' | number

export type SpinnerSpeed = 'slow' | 'normal' | 'fast' | number

export type SpinnerColor =
  | 'primary' | 'foreground' | 'muted'
  | 'destructive' | 'success' | 'warning'
  | (string & {})

export interface SpinnerProps {
  /** Animation style. Default: 'circle' */
  variant?: SpinnerVariant
  /** Size preset or explicit dp. Default: 'md' */
  size?: SpinnerSize
  /** Semantic color token or raw value. Default: 'primary' */
  color?: SpinnerColor
  /** Animation speed. Default: 'normal' */
  speed?: SpinnerSpeed
  /** Accessible label read by screen readers. */
  label?: string
  /**
   * When true, centers the spinner in a semi-transparent overlay
   * that covers its nearest positioned ancestor.
   */
  overlay?: boolean
  /** Opacity of the overlay background (0–1). Default: 0.6 */
  overlayOpacity?: number
  style?: StyleProp<ViewStyle>
}
