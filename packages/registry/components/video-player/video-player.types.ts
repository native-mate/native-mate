import type React from 'react'
import type { ViewProps, StyleProp, ViewStyle } from 'react-native'

export interface VideoPlayerProps extends Omit<ViewProps, 'style'> {
  /** Video source URI */
  source: { uri: string }
  /** Poster image URI shown before playing */
  poster?: string
  /** Auto-play on mount */
  autoPlay?: boolean
  /** Loop playback */
  loop?: boolean
  /** Start muted */
  muted?: boolean
  /** Show playback controls */
  controls?: boolean
  /** Called when playback starts */
  onPlay?: () => void
  /** Called when playback pauses */
  onPause?: () => void
  /** Called when playback ends */
  onEnd?: () => void
  /** Called with progress updates */
  onProgress?: (progress: { currentTime: number; duration: number }) => void
  /** Video aspect ratio, default 16/9 */
  aspectRatio?: number
  /** Border radius */
  borderRadius?: number
  style?: StyleProp<ViewStyle>
}
