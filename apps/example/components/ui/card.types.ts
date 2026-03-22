// native-mate: card@0.1.0 | hash:3e1df5d7c92d133e
import type React from 'react'
import type { ViewProps, ImageSourcePropType, StyleProp, ViewStyle, ImageStyle } from 'react-native'

export type CardVariant = 'elevated' | 'outline' | 'flat' | 'ghost'
export type CardSize = 'sm' | 'md' | 'lg'

export interface CardProps extends Omit<ViewProps, 'style'> {
  children?: React.ReactNode
  variant?: CardVariant
  size?: CardSize
  /** Shows animated skeleton placeholder instead of children */
  loading?: boolean
  /** Makes card pressable with spring animation */
  onPress?: () => void
  disabled?: boolean
  /** Scale on press, default 0.97 */
  activeScale?: number
  /** Accent color painted as a left border stripe */
  accent?: string
  style?: StyleProp<ViewStyle>
}

export interface CardHeaderProps {
  title: string
  subtitle?: string
  description?: string
  /** Avatar or icon rendered on the left */
  leading?: React.ReactNode
  /** Action or badge rendered on the right */
  trailing?: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export interface CardContentProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export interface CardFooterProps {
  children: React.ReactNode
  /** Adds top separator line */
  separated?: boolean
  /** Reverse row direction (right-align actions) */
  align?: 'left' | 'right' | 'apart'
  style?: StyleProp<ViewStyle>
}

export interface CardMediaProps {
  source: ImageSourcePropType
  height?: number
  /** Rounded top corners only (default true) */
  roundedTop?: boolean
  style?: StyleProp<ImageStyle>
}
