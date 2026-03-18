import type { StyleProp, ViewStyle } from 'react-native'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: string
  placement?: TooltipPlacement
  children: React.ReactElement
  /** Delay in ms before showing (default 300) */
  delay?: number
  style?: StyleProp<ViewStyle>
}
