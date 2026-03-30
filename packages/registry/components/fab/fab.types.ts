import type { StyleProp, ViewStyle } from 'react-native'

export type FabSize = 'sm' | 'md' | 'lg'
export type FabVariant = 'default' | 'secondary' | 'destructive'
export type FabPosition = 'bottom-right' | 'bottom-left' | 'bottom-center'
export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

export interface FabAction {
  icon: string
  label?: string
  onPress: () => void
  color?: string
}

export interface FabProps {
  /** Ionicons icon name */
  icon: string
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
  /** Haptic feedback on press */
  haptic?: HapticStyle
  /** Custom background color */
  color?: string
  /** Distance from bottom edge */
  bottomOffset?: number
  /** Distance from side edge */
  sideOffset?: number
  style?: StyleProp<ViewStyle>
}
