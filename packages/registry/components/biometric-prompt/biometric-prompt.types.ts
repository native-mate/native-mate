import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle } from 'react-native'

export type BiometricType = 'fingerprint' | 'faceId' | 'auto'

export interface BiometricPromptProps extends Omit<ViewProps, 'style'> {
  /** Whether the prompt is visible */
  visible: boolean
  /** Called when authentication should be attempted */
  onAuthenticate?: () => void
  /** Called when prompt is cancelled */
  onCancel?: () => void
  /** Title text */
  title?: string
  /** Subtitle text */
  subtitle?: string
  /** Biometric type */
  type?: BiometricType
  /** Label for the fallback button */
  fallbackLabel?: string
  /** Called when fallback is pressed */
  onFallback?: () => void
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
