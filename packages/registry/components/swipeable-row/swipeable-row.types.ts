import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface SwipeAction {
  label: string
  icon?: React.ReactNode
  color: string
  onPress: () => void
  /** Text color for the action label. Default: '#fff' */
  textColor?: string
}

export interface SwipeableRowProps {
  children: React.ReactNode
  /** Actions revealed when swiping right (left side) */
  leftActions?: SwipeAction[]
  /** Actions revealed when swiping left (right side) */
  rightActions?: SwipeAction[]
  /** Distance in px before snap threshold. Default: 80 */
  swipeThreshold?: number
  /** Callback when swiped fully left */
  onSwipeLeft?: () => void
  /** Callback when swiped fully right */
  onSwipeRight?: () => void
  /** Swipe friction factor (0-1, lower = more resistance). Default: 0.8 */
  friction?: number
  /** Width of each action button. Default: 80 */
  actionWidth?: number
  /** Enable haptic feedback. Default: true */
  haptic?: boolean
  /** Whether the row is disabled. Default: false */
  disabled?: boolean
  /** Full-swipe auto-completes destructive action. Default: true */
  fullSwipeEnabled?: boolean
  style?: StyleProp<ViewStyle>
}
