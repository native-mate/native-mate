import type { ViewProps } from 'react-native'

export interface CardProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}
