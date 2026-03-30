import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type ChangeType = 'increase' | 'decrease' | 'neutral'
export type StatFormat = 'number' | 'currency' | 'percent'

export interface StatCardProps {
  /** Stat label/title */
  title: string
  /** Current value (numeric) */
  value: number
  /** Previous value (used to calculate change if `change` is not provided) */
  previousValue?: number
  /** Absolute change amount (overrides auto-calculation from previousValue) */
  change?: number
  /** Direction of change. Default: auto-detected from value vs previousValue */
  changeType?: ChangeType
  /** Icon displayed in the card */
  icon?: React.ReactNode
  /** Display format. Default: 'number' */
  format?: StatFormat
  /** Prefix string (e.g. '$') */
  prefix?: string
  /** Suffix string (e.g. '%') */
  suffix?: string
  /** Show skeleton loading state. Default: false */
  loading?: boolean
  /** Animate the number counting up on mount. Default: true */
  animated?: boolean
  /** Number of decimal places. Default: 0 for number, 2 for currency/percent */
  decimals?: number
  /** Currency code for currency format. Default: 'USD' */
  currency?: string
  /** Enable haptic feedback on press. Default: true */
  haptic?: boolean
  /** Called when the card is pressed */
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}
