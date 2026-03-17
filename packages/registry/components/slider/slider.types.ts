export interface SliderProps {
  value: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  onChangeEnd?: (value: number) => void
  disabled?: boolean
  showValue?: boolean
  trackColor?: string
  fillColor?: string
  thumbSize?: number
  marks?: boolean
  haptic?: boolean
  accessibilityLabel?: string
}

export interface RangeSliderProps {
  low: number
  high: number
  min?: number
  max?: number
  step?: number
  onChange?: (low: number, high: number) => void
  onChangeEnd?: (low: number, high: number) => void
  disabled?: boolean
  showValue?: boolean
  trackColor?: string
  fillColor?: string
  thumbSize?: number
  marks?: boolean
  haptic?: boolean
  accessibilityLabel?: string
}
