import type { ViewStyle } from 'react-native'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onPress: () => void
  }
  style?: ViewStyle
}
