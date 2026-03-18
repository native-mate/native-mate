import type React from 'react'

export interface ModalAction {
  label: string
  onPress: () => void
  variant?: 'default' | 'primary' | 'destructive'
}

export interface ModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'fullscreen'
  /** Footer action buttons */
  actions?: ModalAction[]
  /** Prevent closing by tapping backdrop */
  dismissible?: boolean
  /** Show close (×) button in header */
  showCloseButton?: boolean
}
