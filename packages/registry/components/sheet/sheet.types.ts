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
  /**
   * Heights the sheet can rest at, in px. The first entry is the height the
   * sheet opens at; the sheet is laid out at the tallest entry so it can be
   * dragged up to it. Dragging down past the shortest entry dismisses.
   *
   * Dragging between snap points requires the optional peer
   * `react-native-gesture-handler`. Without it the sheet opens at
   * `snapPoints[0]` and stays there (tap-to-dismiss only) and a one-time dev
   * warning names the missing capability. Omit to use `height` as the single
   * snap point.
   */
  snapPoints?: number[]
}
