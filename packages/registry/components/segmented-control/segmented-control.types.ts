import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { HapticProp } from '@native-mate/core'

// Canonical home is '@native-mate/core'; re-exported for source compatibility.
export type { HapticStyle, HapticProp } from '@native-mate/core'

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
  /** Haptics on selection. `false` (or 'none') disables; `true` means 'light'. Default: true */
  haptic?: HapticProp
  /** Background color of the container */
  backgroundColor?: string
  /** Color of the sliding indicator */
  indicatorColor?: string
  style?: StyleProp<ViewStyle>
}
