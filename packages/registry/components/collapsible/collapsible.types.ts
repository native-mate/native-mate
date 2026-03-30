import type React from 'react'
import type { StyleProp, ViewStyle, TextStyle } from 'react-native'

export interface CollapsibleProps {
  /** Header title (string or custom ReactNode) */
  title: string | React.ReactNode
  /** Collapsible content */
  children: React.ReactNode
  /** Whether the section starts open. Default: false */
  defaultOpen?: boolean
  /** Controlled open state (overrides internal state) */
  open?: boolean
  /** Called when the open state changes */
  onToggle?: (open: boolean) => void
  /** Custom icon (replaces the default chevron) */
  icon?: React.ReactNode
  /** Style for the header area */
  headerStyle?: StyleProp<ViewStyle>
  /** Style for the title text (only applies when title is a string) */
  titleStyle?: StyleProp<TextStyle>
  /** Animation duration in ms. Default: 250 */
  animationDuration?: number
  /** Enable haptic feedback on toggle. Default: true */
  haptic?: boolean
  /** Whether the collapsible is disabled. Default: false */
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}
