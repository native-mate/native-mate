import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface StepItem {
  label: string
  description?: string
  icon?: React.ReactNode
}

export interface StepperProps {
  steps: StepItem[]
  /** Zero-based index of the current active step */
  currentStep: number
  /** Layout orientation. Default: 'horizontal' */
  orientation?: 'horizontal' | 'vertical'
  /** Visual variant. Default: 'numbered' */
  variant?: 'numbered' | 'icon' | 'dot'
  /** Callback when a completed step is pressed */
  onStepPress?: (index: number) => void
  /** Color for completed steps. Uses theme primary if not set */
  completedColor?: string
  /** Color for active step. Uses theme primary if not set */
  activeColor?: string
  /** Color for upcoming steps. Uses theme muted if not set */
  upcomingColor?: string
  /** Size variant. Default: 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Enable haptic feedback on step press. Default: true */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
