import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type NotificationCategory =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'social'
  | 'system'

export interface NotificationCardProps {
  /** Notification title */
  title: string
  /** Notification message body */
  message: string
  /** Timestamp (Date object or ISO string) */
  timestamp: Date | string
  /** Icon to display (overrides category icon) */
  icon?: React.ReactNode
  /** Avatar image source (overrides icon) */
  avatar?: { uri: string } | number
  /** Whether the notification has been read. Default: false */
  read?: boolean
  /** Called when the notification is pressed */
  onPress?: () => void
  /** Called when the notification is dismissed */
  onDismiss?: () => void
  /** Category determines accent color and default icon. Default: 'info' */
  category?: NotificationCategory
  /** Enable haptic feedback. Default: true */
  haptic?: boolean
  /** Enable swipe to dismiss. Default: true */
  swipeToDismiss?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}
