import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { IconProp } from '@native-mate/core'

// Canonical home is '@native-mate/core'; re-exported for source compatibility.
export type { IconProp } from '@native-mate/core'

export interface EmptyStateAction {
  label: string
  onPress: () => void
  variant?: 'primary' | 'outline'
}

export interface EmptyStateProps {
  icon?: IconProp
  /** Defaults to the themed `empty` string ("No items yet"). */
  title?: string
  description?: string
  action?: EmptyStateAction
  secondaryAction?: { label: string; onPress: () => void }
  variant?: 'default' | 'compact' | 'illustration'
  style?: StyleProp<ViewStyle>
}
