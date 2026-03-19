import type { StyleProp, ViewStyle, TextStyle } from 'react-native'

export type SeparatorOrientation = 'horizontal' | 'vertical'

export interface SeparatorProps {
  /** Direction of the divider line. Default: 'horizontal' */
  orientation?: SeparatorOrientation
  /** Line thickness in dp. Default: StyleSheet.hairlineWidth */
  thickness?: number
  /** Color of the line — uses theme.colors.border when omitted. */
  color?: string
  /** Space added on both sides of the line (marginVertical / marginHorizontal). Default: 8 */
  spacing?: number
  /**
   * Optional label displayed at the center of a horizontal separator.
   * Splits the line into two halves with text in between, e.g. "OR".
   */
  label?: string
  /** Color of the label text. Defaults to theme.colors.muted. */
  labelColor?: string
  /** Font size of the label. Default: 11 */
  labelSize?: number
  /** Font weight of the label. Default: '500' */
  labelWeight?: TextStyle['fontWeight']
  /**
   * When true the line is rendered as a dashed line instead of solid.
   * Note: on Android this may fall back to solid.
   */
  dashed?: boolean
  /**
   * When true the separator is purely decorative and hidden from
   * assistive technology. Default: true.
   */
  decorative?: boolean
  style?: StyleProp<ViewStyle>
}
