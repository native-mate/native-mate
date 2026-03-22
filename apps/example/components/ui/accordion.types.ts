// native-mate: accordion@0.1.0 | hash:726c47b3c8f6241b
import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface AccordionItem {
  key: string
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
  trailing?: React.ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  variant?: 'ghost' | 'card' | 'bordered'
  size?: 'sm' | 'md' | 'lg'
  defaultOpen?: string[]
  style?: StyleProp<ViewStyle>
}
