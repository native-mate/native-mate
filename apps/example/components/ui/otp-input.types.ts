// native-mate: otp-input@0.1.0 | hash:806c6c4a862d8e9e
export type OTPVariant = 'box' | 'underline' | 'rounded'
export type OTPType = 'numeric' | 'alphanumeric'

export interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  error?: boolean
  errorMessage?: string
  success?: boolean
  disabled?: boolean
  loading?: boolean
  secure?: boolean
  type?: OTPType
  variant?: OTPVariant
  autoFocus?: boolean
  hint?: string
  resend?: boolean
  resendCooldown?: number
  onResend?: () => void
  haptic?: boolean
}
