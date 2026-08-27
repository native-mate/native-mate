import type React from 'react'
import type { ImageSourcePropType } from 'react-native'

export type ToastVariant = 'default' | 'success' | 'destructive' | 'warning'

export interface ToastAction {
  label: string
  onPress: () => void
  variant?: 'default' | 'primary'
}

export interface ToastProps {
  message: string
  description?: string
  variant?: ToastVariant
  duration?: number
  visible: boolean
  onHide: () => void
  position?: 'top' | 'bottom'
  action?: ToastAction       // single action (backwards compat)
  actions?: ToastAction[]    // multiple actions
  showProgress?: boolean
  persistent?: boolean
  icon?: React.ReactNode
  avatar?: ImageSourcePropType   // image source for social notification style
  /** Internal: unique id for this shown toast instance, used to restart the
   * auto-dismiss timer when a new toast replaces a visible one. */
  id?: string | number
}

export interface ToastConfig extends Omit<ToastProps, 'visible' | 'onHide'> {
  id?: string
}

export interface ToastContextValue {
  show: (config: ToastConfig) => void
  hide: () => void
}
