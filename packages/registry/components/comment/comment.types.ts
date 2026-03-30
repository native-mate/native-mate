import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native'

export interface CommentData {
  /** Unique comment identifier */
  id: string
  /** Comment author name */
  author: string
  /** Author avatar */
  avatar?: ImageSourcePropType
  /** Comment text content */
  content: string
  /** Timestamp string or Date */
  timestamp: string | Date
  /** Like count */
  likes?: number
  /** Whether the user has liked this comment */
  liked?: boolean
  /** Nested reply comments */
  replies?: CommentData[]
}

export interface CommentProps extends Omit<ViewProps, 'style'> {
  /** Comment author name */
  author: string
  /** Author avatar */
  avatar?: ImageSourcePropType
  /** Comment text content */
  content: string
  /** Comment timestamp */
  timestamp: string | Date
  /** Like count */
  likes?: number
  /** Whether the user has liked this comment */
  liked?: boolean
  /** Called when like is pressed */
  onLike?: () => void
  /** Called when reply is pressed */
  onReply?: () => void
  /** Nested reply comments */
  replies?: CommentData[]
  /** Current nesting depth, default 0 */
  depth?: number
  /** Maximum nesting depth, default 3 */
  maxDepth?: number
  /** Called when author name/avatar is pressed */
  onAuthorPress?: (author: string) => void
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
