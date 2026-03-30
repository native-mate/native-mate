import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type PaginationPosition = 'bottom' | 'top'

export interface CarouselProps<T = any> {
  data: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  /** Width of each item (defaults to screen width - 48) */
  itemWidth?: number
  /** Gap between items */
  gap?: number
  /** Show pagination dots */
  showPagination?: boolean
  paginationPosition?: PaginationPosition
  /** Auto-play through items */
  autoPlay?: boolean
  /** Auto-play interval in ms */
  autoPlayInterval?: number
  /** Loop from last to first */
  loop?: boolean
  /** Callback when the visible index changes */
  onIndexChange?: (index: number) => void
  /** Initial index */
  initialIndex?: number
  /** Content inset padding on edges */
  contentInset?: number
  style?: StyleProp<ViewStyle>
}
