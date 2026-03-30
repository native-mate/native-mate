import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type ToggleGroupSize = 'sm' | 'md' | 'lg'
export type ToggleGroupType = 'single' | 'multiple'
export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

export interface ToggleGroupItem {
  key: string
  label: string
  /** Ionicons icon name */
  icon?: string
  disabled?: boolean
}

export interface ToggleGroupSingleProps {
  items: ToggleGroupItem[]
  type?: 'single'
  value: string
  onChange: (value: string) => void
  values?: never
  onChangeMultiple?: never
  size?: ToggleGroupSize
  fullWidth?: boolean
  haptic?: HapticStyle
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

export interface ToggleGroupMultipleProps {
  items: ToggleGroupItem[]
  type: 'multiple'
  values: string[]
  onChangeMultiple: (values: string[]) => void
  value?: never
  onChange?: never
  size?: ToggleGroupSize
  fullWidth?: boolean
  haptic?: HapticStyle
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps
