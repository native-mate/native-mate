import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface BottomSheetListItem {
  label: string
  value: string
  icon?: React.ReactNode
  description?: string
  disabled?: boolean
}

export interface BottomSheetListProps {
  /** Whether the sheet is visible */
  visible: boolean
  /** Called when the sheet should close */
  onClose: () => void
  /** List of items to display */
  items: BottomSheetListItem[]
  /** Called when an item is selected */
  onSelect: (value: string) => void
  /** Enable search functionality. Default: false */
  searchable?: boolean
  /** Placeholder for the search input. Default: 'Search...' */
  searchPlaceholder?: string
  /** Title shown at the top of the sheet */
  title?: string
  /** Enable multi-select mode. Default: false */
  multiSelect?: boolean
  /** Currently selected values (for multi-select or single). Default: [] */
  selectedValues?: string[]
  /** Message shown when search returns no results. Default: 'No results found' */
  emptyMessage?: string
  /** Height of the sheet. Default: 460 */
  height?: number
  /** Show a confirm button in multi-select mode. Default: true */
  showConfirmButton?: boolean
  /** Confirm button label. Default: 'Done' */
  confirmLabel?: string
  /** Enable haptic feedback on selection. Default: true */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
