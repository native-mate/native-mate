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
  /** Extra distance from the screen edge, added to the platform inset
   * (Android status bar / iOS notch). Defaults to 0. */
  offset?: number
  /** Root testID; `-action`, `-close` and `-progress` children derive from it. */
  testID?: string
  /** Internal: unique id for this shown toast instance, used to restart the
   * auto-dismiss timer when a new toast replaces a visible one. */
  id?: string | number
}

export interface ToastConfig extends Omit<ToastProps, 'visible' | 'onHide'> {
  id?: string
}

export interface ToastContextValue {
  /** Enqueue a toast. Returns the toast id (generated when not supplied). */
  show: (config: ToastConfig) => string
  /** Dismiss the oldest visible toast (imperative, backwards compatible). */
  hide: () => void
  /** Dismiss a specific toast by the id returned from `show()`. */
  dismiss: (id: string) => void
  /** Patch a queued or visible toast in place (loading -> success pattern). */
  update: (id: string, config: Partial<ToastConfig>) => void
}

export interface ToastProviderProps {
  children: React.ReactNode
  /** How many toasts may be visible at once. Defaults to 1. */
  max?: number
}
