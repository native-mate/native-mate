import type { ViewProps } from 'react-native'

export interface ScreenProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode
  backgroundColor?: string
}
