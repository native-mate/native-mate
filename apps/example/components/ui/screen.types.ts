// native-mate: screen@0.1.0 | hash:95e0f6b89266f0e9
import type { ViewProps } from 'react-native'

export interface ScreenProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode
  backgroundColor?: string
}
