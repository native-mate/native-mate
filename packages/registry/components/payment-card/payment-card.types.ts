import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle } from 'react-native'

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'generic'
export type PaymentCardVariant = 'display' | 'input'

export interface PaymentCardErrors {
  cardNumber?: string
  expiryDate?: string
  cvc?: string
  cardholderName?: string
}

export interface PaymentCardProps extends Omit<ViewProps, 'style'> {
  /** Card number (can be partial/masked) */
  cardNumber?: string
  /** Cardholder name */
  cardholderName?: string
  /** Expiry date string, e.g. "12/25" */
  expiryDate?: string
  /** CVC code (for input variant) */
  cvc?: string
  /** Card brand, auto-detected from number or set manually */
  brand?: CardBrand
  /** Display mode or input mode */
  variant?: PaymentCardVariant
  /** Called when card number changes (input mode) */
  onCardNumberChange?: (value: string) => void
  /** Called when expiry changes (input mode) */
  onExpiryChange?: (value: string) => void
  /** Called when CVC changes (input mode) */
  onCvcChange?: (value: string) => void
  /** Called when cardholder name changes (input mode) */
  onCardholderNameChange?: (value: string) => void
  /** Validation errors */
  errors?: PaymentCardErrors
  /** Disable interactions */
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}
