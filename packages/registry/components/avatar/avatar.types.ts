export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

export interface AvatarProps {
  src?: string
  name?: string
  fallback?: string
  size?: AvatarSize
  status?: AvatarStatus
  shape?: 'circle' | 'square'
  color?: string
  accessibilityLabel?: string
}

export interface AvatarGroupProps {
  avatars: Omit<AvatarProps, 'size'>[]
  size?: AvatarSize
  max?: number
  spacing?: number
}
