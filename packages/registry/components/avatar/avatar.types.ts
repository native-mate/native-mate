export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string
  fallback?: string
  size?: AvatarSize
  accessibilityLabel?: string
}
