import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface PullToRefreshProps {
  /** Called when the user triggers a refresh */
  onRefresh: () => void | Promise<void>
  /** Whether a refresh is currently in progress */
  refreshing: boolean
  /** The scrollable content */
  children: React.ReactNode
  /** Indicator color. Uses theme primary if not set */
  indicatorColor?: string
  /** Indicator size. Default: 28 */
  indicatorSize?: number
  /** Distance the user must pull to trigger refresh (px). Default: 80 */
  pullDistance?: number
  /** Custom render function for the pull indicator */
  renderIndicator?: (info: {
    progress: number
    refreshing: boolean
  }) => React.ReactNode
  /** Enable haptic feedback on trigger. Default: true */
  haptic?: boolean
  /** Whether pull-to-refresh is disabled. Default: false */
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}
