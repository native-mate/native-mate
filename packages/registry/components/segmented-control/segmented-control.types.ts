import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface Segment {
  key: string
  label: string
  icon?: React.ReactNode
}

export interface SegmentedControlProps {
  segments: Segment[]
  /** Currently selected segment key */
  selectedKey: string
  /** Called when a segment is selected */
  onChange: (key: string) => void
  /** Size variant. Default: 'md' */
  size?: 'sm' | 'md' | 'lg'
  /** Whether the control fills the available width. Default: true */
  fullWidth?: boolean
  /** Disable all segments. Default: false */
  disabled?: boolean
  /** Enable haptic feedback on selection. Default: true */
  haptic?: boolean
  /** Background color of the container */
  backgroundColor?: string
  /** Color of the sliding indicator */
  indicatorColor?: string
  style?: StyleProp<ViewStyle>
}
