import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle } from 'react-native'
import type { HapticProp, IconProp } from '@native-mate/core'

// Canonical home is '@native-mate/core'; re-exported for source compatibility.
export type { HapticStyle, HapticProp, IconProp } from '@native-mate/core'

export type SpeedDialDirection = 'up' | 'left'
export type SpeedDialPosition = 'bottom-right' | 'bottom-left' | 'bottom-center'

export interface SpeedDialAction {
  /** Icon node. A string still renders through Ionicons for one minor. */
  icon: IconProp
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
  /** Main button icon node. A string still renders through Ionicons. */
  icon?: IconProp
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
  /** `false` (or 'none') disables haptics; `true` keeps the default feedback. */
  haptic?: HapticProp
  style?: StyleProp<ViewStyle>
}
