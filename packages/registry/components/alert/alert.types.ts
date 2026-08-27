import type React from 'react'
import type { IconProp } from '@native-mate/core'

// Canonical home is '@native-mate/core'; re-exported for source compatibility.
export type { IconProp } from '@native-mate/core'

export type AlertVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info'

export interface AlertAction {
  label: string
  onPress: () => void
}

export interface AlertProps {
  variant?: AlertVariant
  title: string
  description?: string
  icon?: IconProp
  /** Show dismiss (×) button */
  onDismiss?: () => void
  /** Optional action button in footer */
  action?: AlertAction
  children?: React.ReactNode
}
