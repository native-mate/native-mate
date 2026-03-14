import type { TextProps as RNTextProps } from 'react-native'

export type TextVariant = 'body' | 'label' | 'caption' | 'heading' | 'title' | 'display'
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'

export interface TextProps extends Omit<RNTextProps, 'style'> {
  variant?: TextVariant
  size?: TextSize
  weight?: TextWeight
  color?: string
  muted?: boolean
  children: React.ReactNode
  style?: RNTextProps['style']
}
