import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native'

export interface CartItemProps extends Omit<ViewProps, 'style'> {
  /** Product image */
  image: ImageSourcePropType
  /** Product title */
  title: string
  /** Variant info, e.g. "Size: M, Color: Blue" */
  variant?: string
  /** Item price */
  price: number
  /** Currency symbol, default '$' */
  currency?: string
  /** Current quantity */
  quantity: number
  /** Called when quantity changes */
  onQuantityChange?: (quantity: number) => void
  /** Called when item should be removed */
  onRemove?: () => void
  /** Maximum quantity allowed */
  maxQuantity?: number
  /** Minimum quantity, default 1 */
  minQuantity?: number
  /** Disable interactions */
  disabled?: boolean
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}
