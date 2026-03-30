import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle } from 'react-native'

export interface PricingFeature {
  /** Feature description */
  text: string
  /** Whether this feature is included in the plan */
  included: boolean
}

export interface PricingCardProps extends Omit<ViewProps, 'style'> {
  /** Plan title, e.g. "Pro" */
  title: string
  /** Price amount */
  price: number
  /** Billing period */
  period?: 'month' | 'year'
  /** Currency symbol, default '$' */
  currency?: string
  /** List of features */
  features?: PricingFeature[]
  /** Highlight as most popular plan */
  popular?: boolean
  /** CTA button label, default "Get Started" */
  ctaLabel?: string
  /** Called when CTA button is pressed */
  onPress?: () => void
  /** Disable interactions */
  disabled?: boolean
  /** Badge text override (replaces "Most Popular" when popular) */
  badge?: string
  /** Badge color override */
  badgeColor?: string
  /** Description under the title */
  description?: string
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
