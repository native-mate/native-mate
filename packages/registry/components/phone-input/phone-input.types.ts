import type { StyleProp, ViewStyle } from 'react-native'

export interface Country {
  code: string
  name: string
  dialCode: string
  flag: string
  /** Phone number format mask, e.g. '### ### ####' */
  format?: string
}

export interface PhoneInputProps {
  /** Current phone number (digits only, without dial code) */
  value: string
  /** Called when the phone number changes */
  onChangeText: (value: string) => void
  /**
   * Called alongside `onChangeText` with the E.164 number (`+<dialCode><digits>`)
   * and whether the digit count matches the selected country's mask.
   */
  onChangeFormatted?: (e164: string, isValid: boolean) => void
  /**
   * Controlled country code (ISO 3166-1 alpha-2). When provided it wins over
   * internal state and later changes are respected.
   */
  country?: string
  /** Uncontrolled initial country code (ISO 3166-1 alpha-2). Default: 'US' */
  defaultCountry?: string
  /** Called when the country changes */
  onCountryChange?: (country: Country) => void
  /** Custom list of countries. Uses built-in list if not provided */
  countries?: Country[]
  /** Show country flag. Default: true */
  showFlag?: boolean
  /** Show dial code in the input. Default: true */
  showDialCode?: boolean
  /** Disable input. Default: false */
  disabled?: boolean
  /** Error message to display */
  error?: string
  /** Label above the input */
  label?: string
  /** Placeholder text. Default: 'Phone number' */
  placeholder?: string
  /** Enable haptic feedback. Default: true */
  haptic?: boolean
  /** Test identifier for the root; children derive `-input` / `-country`. */
  testID?: string
  style?: StyleProp<ViewStyle>
}

/** Imperative handle exposed via ref. */
export interface PhoneInputHandle {
  focus(): void
  blur(): void
  clear(): void
}
