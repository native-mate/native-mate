export type ProgressVariant = 'linear' | 'circular'
export type ProgressSize = 'sm' | 'md' | 'lg'

export interface ProgressProps {
  value: number
  variant?: ProgressVariant
  size?: ProgressSize
  color?: string
  trackColor?: string
  showValue?: boolean
  label?: string
  indeterminate?: boolean
  animated?: boolean
  striped?: boolean
  accessibilityLabel?: string
}
