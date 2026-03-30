import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  /** Tooltip content — string or custom ReactNode */
  content: string | React.ReactNode
  /** The trigger element */
  children: React.ReactElement
  position?: TooltipPosition
  /** Delay in ms before showing on long press (native) or hover (web) */
  delay?: number
  /** Controlled visibility */
  visible?: boolean
  onOpenChange?: (open: boolean) => void
  /** Max width of the tooltip bubble */
  maxWidth?: number
  style?: StyleProp<ViewStyle>
}
