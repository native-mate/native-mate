import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native'

export interface AudioPlayerProps extends Omit<ViewProps, 'style'> {
  /** Track title */
  title: string
  /** Artist name */
  artist?: string
  /** Album artwork */
  artwork?: ImageSourcePropType
  /** Audio source URI */
  source?: { uri: string }
  /** Called when play is pressed */
  onPlay?: () => void
  /** Called when pause is pressed */
  onPause?: () => void
  /** Called when next track is pressed */
  onNext?: () => void
  /** Called when previous track is pressed */
  onPrevious?: () => void
  /** Whether currently playing */
  isPlaying?: boolean
  /** Current playback position in seconds */
  currentTime?: number
  /** Total duration in seconds */
  duration?: number
  /** Show progress bar */
  showProgress?: boolean
  /** Show playback controls */
  showControls?: boolean
  /** Compact mode (single row) */
  compact?: boolean
  /** Called when user seeks to a position */
  onSeek?: (position: number) => void
  /** Enable haptic feedback */
  haptic?: boolean
  style?: StyleProp<ViewStyle>
}
