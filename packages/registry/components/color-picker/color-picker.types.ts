import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle } from 'react-native'

export type ColorFormat = 'hex' | 'rgb' | 'hsl'

export interface ColorPickerProps extends Omit<ViewProps, 'style'> {
  /** Current color value (hex string) */
  value: string
  /** Called when color changes */
  onChange: (color: string) => void
  /** Preset color swatches */
  presets?: string[]
  /** Show custom color sliders */
  showCustom?: boolean
  /** Output color format */
  format?: ColorFormat
  /** Show alpha/opacity slider */
  showAlpha?: boolean
  /** Swatch size */
  size?: number
  /** Disable interactions */
  disabled?: boolean
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
