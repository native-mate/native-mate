import type { StyleProp, ViewStyle } from 'react-native'

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

export interface BottomBarBadge {
  value?: number | string
  color?: string
  /** Pulse animation on the badge */
  pulse?: boolean
}

export interface BottomBarItem {
  key: string
  label: string
  /** Ionicons icon name */
  icon: string
  /** Ionicons name for the active state (defaults to icon) */
  activeIcon?: string
  badge?: BottomBarBadge
  disabled?: boolean
}

export interface BottomBarProps {
  items: BottomBarItem[]
  activeKey: string
  onChange: (key: string) => void
  /** Show labels under icons */
  showLabels?: boolean
  /** Haptic feedback style on tap */
  haptic?: HapticStyle
  /** Override bottom safe area inset */
  bottomInset?: number
  /** Show sliding pill indicator behind active item */
  showIndicator?: boolean
  style?: StyleProp<ViewStyle>
}
