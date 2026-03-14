import type { ViewStyle } from 'react-native'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: string
  placement?: TooltipPlacement
  children: React.ReactElement
  style?: ViewStyle
}
