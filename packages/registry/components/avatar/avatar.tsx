// native-mate: avatar@0.2.0 | hash:PLACEHOLDER
import React, { useState } from 'react'
import { View, Image } from 'react-native'
import { useTheme, Text } from '@native-mate/core'
import type { AvatarProps, AvatarGroupProps, AvatarSize, AvatarStatus } from './avatar.types'

const sizes: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 }
const fontSizes: Record<AvatarSize, number> = { xs: 9, sm: 11, md: 14, lg: 17, xl: 22 }
const statusSizes: Record<AvatarSize, number> = { xs: 6, sm: 8, md: 10, lg: 12, xl: 14 }

const statusColors: Record<AvatarStatus, string> = {
  online:  '#22c55e',
  offline: '#71717a',
  busy:    '#ef4444',
  away:    '#f59e0b',
}

// Generate a consistent color from a name string
function nameToColor(name: string): string {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#3b82f6']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

// Generate initials from a name string
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  fallback,
  size = 'md',
  status,
  shape = 'circle',
  color,
  accessibilityLabel,
}) => {
  const theme = useTheme()
  const [imgError, setImgError] = useState(false)
  const px = sizes[size]
  const fs = fontSizes[size]
  const radius = shape === 'circle' ? theme.radius.full : theme.radius.md

  const initials = fallback ?? (name ? getInitials(name) : '?')
  const bgColor = color ?? (name ? nameToColor(name) : theme.colors.surface)

  return (
    <View style={{ position: 'relative', width: px, height: px }}>
      <View
        style={{
          width: px, height: px,
          borderRadius: radius,
          backgroundColor: bgColor,
          borderWidth: 1.5, borderColor: theme.colors.border,
          alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}
        accessibilityLabel={accessibilityLabel ?? name}
      >
        {src && !imgError ? (
          <Image
            source={{ uri: src }}
            style={{ width: px, height: px }}
            onError={() => setImgError(true)}
          />
        ) : (
          <Text style={{ fontSize: fs, fontWeight: '600', color: '#fff', letterSpacing: 0.5 }}>
            {initials}
          </Text>
        )}
      </View>

      {status && (
        <View style={{
          position: 'absolute',
          bottom: 0, right: 0,
          width: statusSizes[size],
          height: statusSizes[size],
          borderRadius: theme.radius.full,
          backgroundColor: statusColors[status],
          borderWidth: 1.5,
          borderColor: theme.colors.background,
        }} />
      )}
    </View>
  )
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 'md',
  max = 4,
  spacing,
}) => {
  const theme = useTheme()
  const px = sizes[size]
  const overlap = spacing ?? Math.round(px * 0.35)
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max
  const fs = fontSizes[size]

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {visible.map((av, i) => (
        <View key={i} style={{ marginLeft: i === 0 ? 0 : -overlap, zIndex: visible.length - i }}>
          <Avatar {...av} size={size} />
        </View>
      ))}
      {overflow > 0 && (
        <View style={{
          marginLeft: -overlap,
          width: px, height: px,
          borderRadius: theme.radius.full,
          backgroundColor: theme.colors.surface,
          borderWidth: 1.5, borderColor: theme.colors.border,
          alignItems: 'center', justifyContent: 'center',
          zIndex: 0,
        }}>
          <Text style={{ fontSize: fs, fontWeight: '600', color: theme.colors.muted }}>
            +{overflow}
          </Text>
        </View>
      )}
    </View>
  )
}
