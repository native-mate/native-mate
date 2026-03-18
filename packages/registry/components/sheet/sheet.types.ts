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
  /** @deprecated use height instead */
  snapPoints?: number[]
}
