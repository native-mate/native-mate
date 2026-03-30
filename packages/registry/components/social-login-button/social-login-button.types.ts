import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle } from 'react-native'

export type SocialProvider = 'google' | 'apple' | 'github' | 'facebook' | 'twitter' | 'discord'
export type SocialLoginVariant = 'filled' | 'outlined'
export type SocialLoginSize = 'md' | 'lg'

export interface SocialLoginButtonProps extends Omit<ViewProps, 'style'> {
  /** Social provider */
  provider: SocialProvider
  /** Called when button is pressed */
  onPress?: () => void
  /** Show loading spinner */
  loading?: boolean
  /** Disable interactions */
  disabled?: boolean
  /** Button variant */
  variant?: SocialLoginVariant
  /** Button size */
  size?: SocialLoginSize
  /** Custom label, auto-generated if omitted */
  label?: string
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
