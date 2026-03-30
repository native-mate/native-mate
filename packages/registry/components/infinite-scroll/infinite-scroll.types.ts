import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface InfiniteScrollProps<T = any> {
  /** Data array */
  data: T[]
  /** Render function for each item */
  renderItem: (info: { item: T; index: number }) => React.ReactNode
  /** Called when the scroll reaches the threshold to load more */
  onLoadMore: () => void | Promise<void>
  /** Whether there are more items to load */
  hasMore: boolean
  /** Whether a load-more request is in progress */
  loading: boolean
  /** Extract a unique key for each item */
  keyExtractor?: (item: T, index: number) => string
  /** Component rendered at the top of the list */
  ListHeaderComponent?: React.ReactNode
  /** Component rendered when the list is empty and not loading */
  ListEmptyComponent?: React.ReactNode
  /** Component rendered between items */
  ItemSeparatorComponent?: React.ReactNode
  /** Distance from the bottom (in px) to trigger load more. Default: 200 */
  threshold?: number
  /** Custom loading indicator at the bottom */
  loadingIndicator?: React.ReactNode
  /** End-of-list message. Default: none */
  endMessage?: string
  /** Enable haptic feedback on load trigger. Default: false */
  haptic?: boolean
  /** Number of columns for grid layout. Default: 1 */
  numColumns?: number
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
}
