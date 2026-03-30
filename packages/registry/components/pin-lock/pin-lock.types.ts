import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle } from 'react-native'

export interface PinLockProps extends Omit<ViewProps, 'style'> {
  /** PIN length, 4 or 6 */
  length?: 4 | 6
  /** Called when all digits are entered */
  onComplete?: (pin: string) => void
  /** Called when biometric authentication is requested */
  onBiometric?: () => void
  /** Show biometric button (fingerprint/face) */
  showBiometric?: boolean
  /** Title text above the dots */
  title?: string
  /** Subtitle text below the title */
  subtitle?: string
  /** Error state triggers shake animation */
  error?: boolean
  /** Error message text */
  errorMessage?: string
  /** Whether the screen is locked out */
  locked?: boolean
  /** Lock duration in seconds */
  lockDuration?: number
  /** Maximum number of attempts allowed */
  maxAttempts?: number
  /** Number of remaining attempts */
  attemptsRemaining?: number
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
