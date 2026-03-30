import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface DraggableListProps<T = any> {
  /** Data array */
  data: T[]
  /** Render function for each item */
  renderItem: (info: { item: T; index: number; isDragging: boolean }) => React.ReactNode
  /** Called with the reordered data array when a drag finishes */
  onReorder: (data: T[]) => void
  /** Extract a unique key for each item */
  keyExtractor: (item: T, index: number) => string
  /** Position of the drag handle. Default: 'right' */
  dragHandlePosition?: 'left' | 'right'
  /** Trigger haptic feedback while dragging. Default: true */
  hapticOnDrag?: boolean
  /** Item height (required for smooth animations). Default: 60 */
  itemHeight?: number
  /** Separator between items. Default: true */
  showSeparator?: boolean
  /** Whether the list is disabled. Default: false */
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}
