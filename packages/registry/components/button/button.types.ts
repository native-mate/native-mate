import type { PressableProps } from 'react-native'

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary' | 'link' | 'gradient'
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
  gradientColors?: [string, string]
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
