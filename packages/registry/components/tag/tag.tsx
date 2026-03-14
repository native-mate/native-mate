// native-mate: tag@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { Pressable, View } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useTheme, makeStyles, Text } from '@native-mate/core'
import type { TagProps } from './tag.types'

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.xs,
    paddingLeft: theme.spacing.sm,
    paddingRight: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  removeBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export const Tag: React.FC<TagProps> = ({ label, onRemove, disabled = false, style }) => {
  const theme = useTheme()
  const styles = useStyles()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handleRemovePress = () => {
    scale.value = withSpring(0.85, theme.animation.easing.spring, () => {
      scale.value = withSpring(1, theme.animation.easing.spring)
    })
    onRemove?.()
  }

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      <Text size="sm" style={{ opacity: disabled ? 0.5 : 1 }}>{label}</Text>
      {onRemove && !disabled && (
        <Pressable
          style={styles.removeBtn}
          onPress={handleRemovePress}
          accessibilityLabel={`Remove ${label}`}
          hitSlop={8}
        >
          <Text style={{ color: theme.colors.mutedForeground, fontSize: 11, lineHeight: 14 }}>✕</Text>
        </Pressable>
      )}
    </Animated.View>
  )
}
