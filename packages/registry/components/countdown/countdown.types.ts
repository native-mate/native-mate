import type { StyleProp, ViewStyle } from 'react-native'

export type CountdownFormat = 'dhms' | 'hms' | 'ms'
export type CountdownVariant = 'card' | 'inline' | 'minimal'

export interface CountdownProps {
  /** Target date to count down to */
  targetDate: Date
  /** Called when countdown reaches zero */
  onComplete?: () => void
  /** Display format. Default: 'dhms' */
  format?: CountdownFormat
  /** Separator between units. Default: ':' */
  separator?: string
  /** Size variant. Default: 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Visual variant. Default: 'card' */
  variant?: CountdownVariant
  /** Label shown above the countdown */
  label?: string
  /** Custom color for the digits */
  digitColor?: string
  /** Custom background color for card variant */
  cardColor?: string
  /** Enable digit roll animation. Default: true */
  animated?: boolean
  /** Whether the countdown is disabled/paused. Default: false */
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}
