// native-mate: avatar@0.1.0 | hash:PLACEHOLDER
import React, { useState } from 'react'
import { View, Image } from 'react-native'
import { useTheme, Text } from '@native-mate/core'
import type { AvatarProps } from './avatar.types'

const sizes = { sm: 32, md: 40, lg: 48, xl: 64 }

export const Avatar: React.FC<AvatarProps> = ({ src, fallback, size = 'md', accessibilityLabel }) => {
  const theme = useTheme()
  const [imgError, setImgError] = useState(false)
  const px = sizes[size]
  const fontSize = size === 'sm' ? theme.typography.size.xs : size === 'xl' ? theme.typography.size.lg : theme.typography.size.sm

  const containerStyle = {
    width: px, height: px,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1, borderColor: theme.colors.border,
    alignItems: 'center' as const, justifyContent: 'center' as const, overflow: 'hidden' as const,
  }

  return (
    <View style={containerStyle} accessibilityLabel={accessibilityLabel}>
      {src && !imgError ? (
        <Image source={{ uri: src }} style={{ width: px, height: px }} onError={() => setImgError(true)} />
      ) : (
        <Text style={{ fontSize, fontWeight: '600', color: theme.colors.muted }}>
          {fallback ? fallback.slice(0, 2).toUpperCase() : '?'}
        </Text>
      )}
    </View>
  )
}
