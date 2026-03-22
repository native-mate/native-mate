// native-mate: skeleton@0.1.0 | hash:030e916832f3c19a
import type { ViewStyle } from 'react-native'

export type SkeletonVariant = 'pulse' | 'shimmer'

export interface SkeletonProps {
  width?: number | string
  height?: number
  borderRadius?: number
  variant?: SkeletonVariant
  style?: ViewStyle
}

export interface SkeletonTextProps {
  lines?: number
  lastLineWidth?: string | number
  variant?: SkeletonVariant
  style?: ViewStyle
}

export interface SkeletonAvatarProps {
  size?: number
  showText?: boolean
  textLines?: number
  variant?: SkeletonVariant
  style?: ViewStyle
}

export interface SkeletonCardProps {
  imageHeight?: number
  lines?: number
  variant?: SkeletonVariant
  style?: ViewStyle
}
