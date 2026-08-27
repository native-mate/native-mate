import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native'

export interface ProductCardProps extends Omit<ViewProps, 'style'> {
  /** Product image source */
  image: ImageSourcePropType
  /** Product title */
  title: string
  /** Current price */
  price: number
  /** Original price shown with strikethrough */
  originalPrice?: number
  /** Currency symbol, default '$' */
  currency?: string
  /** Average rating out of 5 */
  rating?: number
  /** Number of reviews */
  reviewCount?: number
  /** Called when card is pressed */
  onPress?: () => void
  /** Called when add-to-cart button is pressed */
  onAddToCart?: () => void
  /** Whether product is in stock */
  inStock?: boolean
  /** Badge text, e.g. "Sale", "New" */
  badge?: string
  /** Badge color override */
  badgeColor?: string
  /** Whether product is favorited */
  favorite?: boolean
  /** Called when favorite heart is toggled */
  onFavoriteToggle?: () => void
  /** Aspect ratio for the image, default 1 */
  imageAspectRatio?: number
  /** Disable interactions */
  disabled?: boolean
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}
