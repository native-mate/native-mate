import type { PressableProps, StyleProp, ViewStyle } from 'react-native'
import type { HapticProp, IconProp } from '@native-mate/core'

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'

// Re-exported so callers that imported these from the component keep compiling.
// The canonical home is '@native-mate/core'.
export type { HapticStyle, HapticProp, IconProp } from '@native-mate/core'

interface ButtonBaseProps extends Omit<PressableProps, 'style' | 'accessibilityLabel'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  rounded?: boolean
  /** `false` (or 'none') disables haptics for this button; `true` means 'light'. */
  haptic?: HapticProp
  color?: string
  iconLeft?: IconProp
  iconRight?: IconProp
  children?: React.ReactNode
  /** Merged last onto the root Pressable — layout escape hatch. */
  style?: StyleProp<ViewStyle>
  testID?: string
}

/**
 * Icon-only buttons render no text, so `accessibilityLabel` is the *only*
 * accessible name a screen reader can announce — hence required here.
 */
export interface ButtonIconOnlyProps extends ButtonBaseProps {
  iconOnly: true
  accessibilityLabel: string
}

export interface ButtonLabelledProps extends ButtonBaseProps {
  iconOnly?: false
  accessibilityLabel?: string
}

export type ButtonProps = ButtonIconOnlyProps | ButtonLabelledProps

export interface ButtonGroupProps {
  children: React.ReactNode
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
}
