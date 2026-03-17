import type React from 'react'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info'
export type BadgeSize = 'sm' | 'md' | 'lg'
export type BadgeAppearance = 'solid' | 'soft' | 'outline'

export interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  appearance?: BadgeAppearance
  dot?: boolean
  pulse?: boolean          // animated pulsing dot (for live/online status)
  icon?: React.ReactNode   // node before text
  count?: number
  maxCount?: number
  onDismiss?: () => void
  children?: React.ReactNode
}
