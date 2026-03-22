// native-mate: icon@0.1.0 | hash:8691278ec7776ed4
import type { StyleProp, ViewStyle } from 'react-native'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number

export type IconColor =
  | 'foreground' | 'muted' | 'primary'
  | 'destructive' | 'success' | 'warning' | 'border'
  | (string & {})

export type IconLibrary = 'ionicons'

export interface IconProps {
  /** Ionicons icon name. See https://ionic.io/ionicons */
  name: string
  /** Preset size or explicit dp value. Default: 'md' (20dp) */
  size?: IconSize
  /** Semantic color token or raw hex/rgb value. Default: 'foreground' */
  color?: IconColor
  /** Opacity (0–1). Default: 1 */
  opacity?: number
  /** Extra style applied to the icon element. */
  style?: StyleProp<ViewStyle>
  accessibilityLabel?: string
  /** If true the icon is hidden from assistive technology (decorative). */
  decorative?: boolean
}
