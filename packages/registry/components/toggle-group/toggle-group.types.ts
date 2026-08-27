import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { HapticProp, IconProp } from '@native-mate/core'

export type ToggleGroupSize = 'sm' | 'md' | 'lg'
export type ToggleGroupType = 'single' | 'multiple'

// Canonical home is '@native-mate/core'; re-exported for source compatibility.
export type { HapticStyle, HapticProp, IconProp } from '@native-mate/core'

export interface ToggleGroupItem {
  key: string
  label: string
  /** Icon node. A string still renders through Ionicons for one minor. */
  icon?: IconProp
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
  /** `false` (or 'none') disables haptics; `true` means 'light'. */
  haptic?: HapticProp
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
  /** `false` (or 'none') disables haptics; `true` means 'light'. */
  haptic?: HapticProp
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps
