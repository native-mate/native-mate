export interface SheetProps {
  visible: boolean
  onClose: () => void
  /** Height of the sheet. Default: 400 */
  height?: number
  children: React.ReactNode
  title?: string
  /** Show drag handle. Default: true */
  showHandle?: boolean
  /** Close when backdrop is pressed. Default: true */
  closeOnBackdrop?: boolean
  /** Animation preset. Default: 'slide' */
  animation?: 'slide' | 'spring' | 'fade'
  /** Horizontal padding for the content area. Default: 16 */
  padding?: number
  /** Render the content inside a ScrollView. Default: false */
  scrollable?: boolean
  /** Fired after the exit animation finishes (onClose fires on the dismiss intent). */
  onDismiss?: () => void
  /**
   * Bottom padding reserved for the home indicator. Defaults to 34 on iOS and
   * 0 elsewhere — pass a safe-area inset here if your app has one.
   */
  bottomInset?: number
  /** @deprecated use height instead */
  snapPoints?: number[]
}
