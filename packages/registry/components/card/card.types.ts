import type React from 'react'
import type { ViewProps, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native'

export type CardVariant = 'elevated' | 'outline' | 'flat'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends Omit<ViewProps, 'style'> {
  children?: React.ReactNode
  variant?: CardVariant
  /** Padding applied to card when NOT using CardHeader/CardContent/CardFooter sub-components */
  padding?: CardPadding
  /** Shows animated skeleton placeholder instead of children */
  loading?: boolean
  onPress?: () => void
  /** Cover image rendered edge-to-edge at top */
  image?: ImageSourcePropType
  imageHeight?: number
  style?: StyleProp<ViewStyle>
}

export interface CardHeaderProps {
  title: string
  subtitle?: string
  trailing?: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export interface CardContentProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export interface CardFooterProps {
  children: React.ReactNode
  /** Adds top border separator */
  separated?: boolean
  style?: StyleProp<ViewStyle>
}
