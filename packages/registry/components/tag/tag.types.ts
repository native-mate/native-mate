import type React from 'react'
import type { ViewStyle } from 'react-native'

export type TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'info'

export interface TagProps {
  label: string
  selected?: boolean
  onPress?: () => void
  onRemove?: () => void
  variant?: TagVariant
  icon?: React.ReactNode
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  style?: ViewStyle
}

export interface TagGroupProps {
  tags: TagProps[]
  multiSelect?: boolean
  selected?: string[]
  onChange?: (selected: string[]) => void
  style?: ViewStyle
}
