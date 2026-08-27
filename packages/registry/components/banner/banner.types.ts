import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { HapticProp, IconProp } from '@native-mate/core'

// Canonical home is '@native-mate/core'; re-exported for source compatibility.
export type { HapticStyle, HapticProp, IconProp } from '@native-mate/core'

export type BannerVariant = 'info' | 'warning' | 'success' | 'error'
export type BannerPosition = 'top' | 'bottom'

export interface BannerAction {
  label: string
  onPress: () => void
}

export interface BannerProps {
  message: string
  description?: string
  variant?: BannerVariant
  position?: BannerPosition
  /**
   * Custom icon node (auto-selected by variant if not provided). A string is
   * still accepted for one minor and rendered through Ionicons — deprecated.
   */
  icon?: IconProp
  /** Optional action button */
  action?: BannerAction
  /** Show dismiss/close button */
  dismissible?: boolean
  onDismiss?: () => void
  /** Controlled visibility */
  visible?: boolean
  /** Auto-dismiss after duration in ms (0 = no auto-dismiss) */
  autoDismiss?: number
  /** `false` (or 'none') disables haptics for this banner; `true` means 'light'. */
  haptic?: HapticProp
  style?: StyleProp<ViewStyle>
}
