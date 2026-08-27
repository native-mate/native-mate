import type React from 'react'
import type { IconProp } from '@native-mate/core'

// Canonical home is '@native-mate/core'; re-exported for source compatibility.
export type { IconProp } from '@native-mate/core'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info'
export type BadgeSize = 'sm' | 'md' | 'lg'
export type BadgeAppearance = 'solid' | 'soft' | 'outline'

export interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  appearance?: BadgeAppearance
  dot?: boolean
  pulse?: boolean          // animated pulsing dot (for live/online status)
  icon?: IconProp          // node before text
  count?: number
  maxCount?: number
  onDismiss?: () => void
  children?: React.ReactNode
  /** Overrides the auto-composed screen-reader label (variant meaning + content) */
  accessibilityLabel?: string
  testID?: string
}
