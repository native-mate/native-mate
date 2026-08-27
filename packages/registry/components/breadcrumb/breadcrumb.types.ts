import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle } from 'react-native'

export type BreadcrumbSeparator = 'chevron' | 'slash' | 'dot' | string
export type BreadcrumbSize = 'sm' | 'md'

export interface BreadcrumbItem {
  /** Display label */
  label: string
  /** Called when this item is pressed (not called for the last/active item) */
  onPress?: () => void
  /** Optional icon name from Ionicons */
  icon?: string
}

export interface BreadcrumbProps extends Omit<ViewProps, 'style'> {
  /** Breadcrumb items */
  items: BreadcrumbItem[]
  /** Separator type or custom string */
  separator?: BreadcrumbSeparator
  /** Truncate middle items when exceeding this count, showing "..." */
  maxItems?: number
  /** Size variant */
  size?: BreadcrumbSize
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
  testID?: string
}
