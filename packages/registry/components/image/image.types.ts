import type { ImageSourcePropType, ImageResizeMode, StyleProp, ViewStyle, ImageStyle } from 'react-native'

export type ImagePlaceholder = 'blur' | 'shimmer' | 'color'

export interface ImageProps {
  source: ImageSourcePropType
  /** Fallback image source if primary fails */
  fallbackSource?: ImageSourcePropType
  /** Placeholder style while loading */
  placeholder?: ImagePlaceholder
  /** Background color for 'color' placeholder */
  placeholderColor?: string
  /** Aspect ratio (e.g., 16/9, 1, 4/3) */
  aspectRatio?: number
  borderRadius?: number
  resizeMode?: ImageResizeMode
  onLoad?: () => void
  onError?: () => void
  /** Show an ActivityIndicator while loading */
  showLoadingIndicator?: boolean
  /** Alt text for accessibility */
  alt?: string
  /** Fixed width */
  width?: number | string
  /** Fixed height */
  height?: number | string
  style?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
}
