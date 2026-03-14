import type { PressableProps } from 'react-native'

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  accessibilityLabel?: string
}
