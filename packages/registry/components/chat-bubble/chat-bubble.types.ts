import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type MessageSender = 'self' | 'other'
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read'
export type MessageType = 'text' | 'image' | 'system'

export interface ChatBubbleProps {
  /** Message text content */
  message: string
  /** Message timestamp */
  timestamp: Date | string
  /** Who sent the message. Default: 'other' */
  sender?: MessageSender
  /** Delivery status (only shown for 'self' messages). Default: 'sent' */
  status?: MessageStatus
  /** Avatar image source */
  avatar?: { uri: string } | number
  /** Show avatar. Default: true for 'other', false for 'self' */
  showAvatar?: boolean
  /** Show timestamp below the bubble. Default: false */
  showTimestamp?: boolean
  /** Message type. Default: 'text' */
  type?: MessageType
  /** Image source (when type is 'image') */
  imageSource?: { uri: string } | number
  /** Image dimensions */
  imageWidth?: number
  imageHeight?: number
  /** Sender display name (shown above other's messages) */
  senderName?: string
  /** Custom bubble color for self messages */
  selfColor?: string
  /** Custom bubble color for other messages */
  otherColor?: string
  /** Enable haptic on long press. Default: true */
  haptic?: boolean
  /** Called on long press */
  onLongPress?: () => void
  style?: StyleProp<ViewStyle>
}
