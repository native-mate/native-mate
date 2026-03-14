export type ToastVariant = 'default' | 'success' | 'destructive' | 'warning'

export interface ToastProps {
  message: string
  description?: string
  variant?: ToastVariant
  duration?: number
  visible: boolean
  onHide: () => void
  position?: 'top' | 'bottom'
}
