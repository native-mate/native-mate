import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle } from 'react-native'

export type SpeedDialDirection = 'up' | 'left'
export type SpeedDialPosition = 'bottom-right' | 'bottom-left' | 'bottom-center'

export interface SpeedDialAction {
  /** Icon name from Ionicons */
  icon: string
  /** Label text shown alongside the FAB */
  label: string
  /** Called when this action is pressed */
  onPress: () => void
  /** Custom background color for the action FAB */
  color?: string
  /** Custom icon color */
  iconColor?: string
}

export interface SpeedDialProps extends Omit<ViewProps, 'style'> {
  /** Main button icon name from Ionicons */
  icon?: string
  /** Array of action items */
  actions: SpeedDialAction[]
  /** Controlled open state */
  open?: boolean
  /** Called when toggled */
  onToggle?: (open: boolean) => void
  /** Position of the main FAB */
  position?: SpeedDialPosition
  /** Direction actions expand */
  direction?: SpeedDialDirection
  /** Main FAB background color */
  color?: string
  /** Main FAB icon color */
  iconColor?: string
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
