import type { ViewStyle } from 'react-native'

export interface TagProps {
  label: string
  onRemove?: () => void
  disabled?: boolean
  style?: ViewStyle
}
