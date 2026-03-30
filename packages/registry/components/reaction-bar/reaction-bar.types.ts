import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle } from 'react-native'

export type ReactionBarSize = 'sm' | 'md'

export interface Reaction {
  /** Emoji character */
  emoji: string
  /** Number of reactions */
  count: number
  /** Whether the current user has reacted */
  reacted: boolean
}

export interface ReactionBarProps extends Omit<ViewProps, 'style'> {
  /** Array of reactions */
  reactions: Reaction[]
  /** Called when a reaction is toggled */
  onReact?: (emoji: string) => void
  /** Called on long press (open full emoji picker) */
  onLongPress?: () => void
  /** Maximum visible reactions before overflow */
  maxVisible?: number
  /** Size variant */
  size?: ReactionBarSize
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
