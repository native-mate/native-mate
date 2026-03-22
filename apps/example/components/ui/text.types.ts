// native-mate: text@0.1.0 | hash:ff6f21cbc58d1bf0
import type { TextStyle } from 'react-native'

export type TextVariant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body' | 'bodyLarge' | 'bodySmall'
  | 'caption' | 'label' | 'overline' | 'code'

export type TextWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold'

export type TextAlign = 'left' | 'center' | 'right' | 'justify'

export type TextColor =
  | 'foreground' | 'muted' | 'primary'
  | 'destructive' | 'success' | 'warning'
  | (string & {})  // allow arbitrary hex/rgb

export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize'

export interface TextProps {
  /** Typography variant — maps to a preset size, weight, and line-height. */
  variant?: TextVariant
  /** Override the font weight independently of the variant. */
  weight?: TextWeight
  /** Horizontal text alignment. */
  align?: TextAlign
  /** Semantic color token or raw CSS/hex value. */
  color?: TextColor
  /** Explicit font-size in dp that overrides the variant size. */
  size?: number
  /** Number of lines before truncation. */
  numberOfLines?: number
  /** Truncation strategy when numberOfLines is set. */
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip'
  /** CSS-like text transform. */
  transform?: TextTransform
  /** Shorthand for color="muted". */
  muted?: boolean
  /** Makes the text selectable and copy-able on long-press. */
  selectable?: boolean
  children?: React.ReactNode
  style?: TextStyle
  accessibilityLabel?: string
}
