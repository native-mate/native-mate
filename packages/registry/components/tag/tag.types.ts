import type React from 'react'
import type { ViewStyle } from 'react-native'
import type { HapticProp, IconProp } from '@native-mate/core'

// Canonical home is '@native-mate/core'; re-exported for source compatibility.
export type { HapticStyle, HapticProp, IconProp } from '@native-mate/core'

export type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'info'

export interface TagProps {
  label: string
  selected?: boolean
  onPress?: () => void
  onRemove?: () => void
  variant?: TagVariant
  icon?: IconProp
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** `false` (or 'none') disables haptics for this tag; `true` means 'light'. */
  haptic?: HapticProp
  style?: ViewStyle
  testID?: string
}

export interface TagGroupProps {
  tags: TagProps[]
  multiSelect?: boolean
  selected?: string[]
  onChange?: (selected: string[]) => void
  style?: ViewStyle
  testID?: string
}
