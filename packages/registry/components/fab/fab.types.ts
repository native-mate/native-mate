import type { StyleProp, ViewStyle } from 'react-native'
import type { HapticProp, IconProp } from '@native-mate/core'

// Canonical home is '@native-mate/core'; re-exported for source compatibility.
export type { HapticStyle, HapticProp, IconProp } from '@native-mate/core'

export type FabSize = 'sm' | 'md' | 'lg'
export type FabVariant = 'default' | 'secondary' | 'destructive'
export type FabPosition = 'bottom-right' | 'bottom-left' | 'bottom-center'

export interface FabAction {
  /** Icon node. A string still renders through Ionicons for one minor. */
  icon: IconProp
  label?: string
  onPress: () => void
  color?: string
}

export interface FabProps {
  /** Icon node. A string still renders through Ionicons for one minor. */
  icon: IconProp
  onPress?: () => void
  /** Absolute position on screen */
  position?: FabPosition
  size?: FabSize
  variant?: FabVariant
  /** Extended FAB with a text label */
  label?: string
  /** Speed dial actions (fan out on press) */
  actions?: FabAction[]
  disabled?: boolean
  /** `false` (or 'none') disables haptics for this FAB; `true` means 'light'. */
  haptic?: HapticProp
  /** Custom background color */
  color?: string
  /** Distance from bottom edge */
  bottomOffset?: number
  /** Distance from side edge */
  sideOffset?: number
  style?: StyleProp<ViewStyle>
}
