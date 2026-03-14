// native-mate: empty-state@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { View, Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated'
import { makeStyles, Text, useTheme } from '@native-mate/core'
import type { EmptyStateProps } from './empty-state.types'

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing['2xl'],
    gap: theme.spacing.sm,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionBtn: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
  },
}))

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, style }) => {
  const theme = useTheme()
  const styles = useStyles()
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(12)

  React.useEffect(() => {
    opacity.value = withDelay(100, withSpring(1, theme.animation.easing.spring))
    translateY.value = withDelay(100, withSpring(0, theme.animation.easing.spring))
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <Text size="lg" weight="semibold" style={{ textAlign: 'center' }}>{title}</Text>
      {description && (
        <Text size="sm" color={theme.colors.mutedForeground} style={{ textAlign: 'center', maxWidth: 260 }}>
          {description}
        </Text>
      )}
      {action && (
        <Pressable
          style={styles.actionBtn}
          onPress={action.onPress}
          accessibilityRole="button"
        >
          <Text size="sm" weight="semibold" style={{ color: theme.colors.primaryForeground }}>
            {action.label}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  )
}
