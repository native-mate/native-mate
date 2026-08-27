import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native'

export interface ReviewCardProps extends Omit<ViewProps, 'style'> {
  /** Review author name */
  author: string
  /** Author avatar image */
  avatar?: ImageSourcePropType
  /** Rating out of 5 */
  rating: number
  /** Review date string or Date */
  date: string | Date
  /** Review text content */
  text: string
  /** Array of review image URIs */
  images?: string[]
  /** Helpful vote count */
  helpful?: number
  /** Called when helpful is pressed */
  onHelpful?: () => void
  /** Whether the user already marked it helpful */
  isHelpful?: boolean
  /** Called when report is pressed */
  onReport?: () => void
  /** Whether the reviewer is a verified purchaser */
  verified?: boolean
  /** Called when author name/avatar is pressed */
  onAuthorPress?: () => void
  /** Max lines of text before "Read more" */
  maxLines?: number
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}
