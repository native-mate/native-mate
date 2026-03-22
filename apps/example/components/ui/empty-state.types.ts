// native-mate: empty-state@0.1.0 | hash:0cc3b1866b6702dd
import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface EmptyStateAction {
  label: string
  onPress: () => void
  variant?: 'primary' | 'outline'
}

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: EmptyStateAction
  secondaryAction?: { label: string; onPress: () => void }
  variant?: 'default' | 'compact' | 'illustration'
  style?: StyleProp<ViewStyle>
}
