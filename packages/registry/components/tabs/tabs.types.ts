import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface TabItem {
  key: string
  label: string
  icon?: React.ReactNode
  badge?: number | string
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
  variant?: 'underline' | 'pill' | 'card'
  size?: 'sm' | 'md' | 'lg'
  scrollable?: boolean
  style?: StyleProp<ViewStyle>
}
