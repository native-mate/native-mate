export interface SheetProps {
  visible: boolean
  onClose: () => void
  snapPoints?: number[]
  children: React.ReactNode
  title?: string
}
