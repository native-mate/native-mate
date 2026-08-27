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
  testID?: string
}

/** Imperative handle exposed via ref. */
export interface OTPInputHandle {
  focus(): void
  blur(): void
  clear(): void
}
