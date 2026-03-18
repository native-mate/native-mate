import type React from 'react'

export type AlertVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info'

export interface AlertAction {
  label: string
  onPress: () => void
}

export interface AlertProps {
  variant?: AlertVariant
  title: string
  description?: string
  icon?: React.ReactNode
  /** Show dismiss (×) button */
  onDismiss?: () => void
  /** Optional action button in footer */
  action?: AlertAction
  children?: React.ReactNode
}
