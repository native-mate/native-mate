import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle } from 'react-native'

export type SortDirection = 'asc' | 'desc'

export interface DataTableColumn<T = any> {
  /** Unique key that maps to the data object property */
  key: string
  /** Display title for the column header */
  title: string
  /** Fixed width for the column */
  width?: number
  /** Flex value for the column, default 1 */
  flex?: number
  /** Whether this column is sortable */
  sortable?: boolean
  /** Custom render function for cell content */
  render?: (value: any, row: T, index: number) => React.ReactNode
  /** Text alignment */
  align?: 'left' | 'center' | 'right'
}

export interface DataTableProps<T = any> extends Omit<ViewProps, 'style'> {
  /** Column definitions */
  columns: DataTableColumn<T>[]
  /** Data array */
  data: T[]
  /** Currently sorted column key */
  sortBy?: string
  /** Current sort direction */
  sortDirection?: SortDirection
  /** Called when a sortable column header is pressed */
  onSort?: (key: string, direction: SortDirection) => void
  /** Called when a row is pressed */
  onRowPress?: (row: T, index: number) => void
  /** Make header sticky on scroll */
  stickyHeader?: boolean
  /** Alternate row background colors */
  striped?: boolean
  /** Show cell borders */
  bordered?: boolean
  /** Show loading skeleton rows */
  loading?: boolean
  /** Number of skeleton rows when loading, default 5 */
  loadingRows?: number
  /** Empty state message */
  emptyMessage?: string
  /** Unique key extractor for rows */
  keyExtractor?: (row: T, index: number) => string
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
