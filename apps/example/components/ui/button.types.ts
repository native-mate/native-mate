// native-mate: button@0.3.0 | hash:6604c869c98bf6a5
import type { PressableProps } from 'react-native'

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  rounded?: boolean
  iconOnly?: boolean
  haptic?: HapticStyle
  color?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  children?: React.ReactNode
  accessibilityLabel?: string
}

export interface ButtonGroupProps {
  children: React.ReactNode
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
}
