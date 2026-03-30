import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type BannerVariant = 'info' | 'warning' | 'success' | 'error'
export type BannerPosition = 'top' | 'bottom'
export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

export interface BannerAction {
  label: string
  onPress: () => void
}

export interface BannerProps {
  message: string
  description?: string
  variant?: BannerVariant
  position?: BannerPosition
  /** Custom Ionicons icon name (auto-selected by variant if not provided) */
  icon?: string
  /** Optional action button */
  action?: BannerAction
  /** Show dismiss/close button */
  dismissible?: boolean
  onDismiss?: () => void
  /** Controlled visibility */
  visible?: boolean
  /** Auto-dismiss after duration in ms (0 = no auto-dismiss) */
  autoDismiss?: number
  haptic?: HapticStyle
  style?: StyleProp<ViewStyle>
}
