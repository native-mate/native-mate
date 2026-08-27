import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type TimelineItemStatus = 'completed' | 'active' | 'upcoming' | 'error'

export interface TimelineItem {
  /** Unique key */
  key: string
  /** Item title */
  title: string
  /** Item description */
  description?: string
  /** Timestamp */
  timestamp?: Date | string
  /** Icon override for the node */
  icon?: React.ReactNode
  /** Status determines node styling. Default: 'upcoming' */
  status?: TimelineItemStatus
  /** Additional content rendered below the description */
  content?: React.ReactNode
}

export interface TimelineProps {
  items: TimelineItem[]
  /** Stagger entrance animation. Default: true */
  animated?: boolean
  /** Delay between each item's entrance (ms). Default: 100 */
  staggerDelay?: number
  /** Size of the node circle. Default: 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Color for completed items. Uses theme primary if not set */
  completedColor?: string
  /** Color for active items. Uses theme primary if not set */
  activeColor?: string
  /** Color for error items. Uses theme destructive if not set */
  errorColor?: string
  /**
   * Formats a `Date` timestamp for display. Defaults to `toLocaleString()`.
   * Provide this to control locale, timezone and format (string timestamps are
   * rendered as-is and never passed through this).
   */
  formatTimestamp?: (d: Date) => string
  /** Enable haptic feedback on node press. Default: true */
  haptic?: boolean
  /** Called when a node is pressed */
  onItemPress?: (key: string) => void
  style?: StyleProp<ViewStyle>
  testID?: string
}
