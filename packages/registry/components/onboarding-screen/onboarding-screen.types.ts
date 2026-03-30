import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native'

export interface OnboardingScreenProps extends Omit<ViewProps, 'style'> {
  /** Image source or custom illustration ReactNode */
  image?: ImageSourcePropType | React.ReactNode
  /** Slide title */
  title: string
  /** Slide description */
  description?: string
  /** Background color override */
  backgroundColor?: string
  /** Text color override */
  textColor?: string
  /** Current slide index (0-based) */
  index: number
  /** Total number of slides */
  total: number
  /** Called when Next button is pressed */
  onNext?: () => void
  /** Called when Skip is pressed */
  onSkip?: () => void
  /** Called on the last slide when Finish/Get Started is pressed */
  onFinish?: () => void
  /** Show skip button, default true */
  showSkip?: boolean
  /** Show dot indicators, default true */
  showDots?: boolean
  /** Custom next button label */
  nextLabel?: string
  /** Custom finish button label */
  finishLabel?: string
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
