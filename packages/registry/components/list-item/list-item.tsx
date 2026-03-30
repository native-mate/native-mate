// native-mate: list-item@0.1.0 | hash:PLACEHOLDER
import React, { useCallback } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { ListItemProps, HapticStyle } from './list-item.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const triggerHaptic = (style: HapticStyle) => {
  if (!Haptics || style === 'none') return
  const map = { light: 'Light', medium: 'Medium', heavy: 'Heavy' } as const
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[map[style]])
}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  innerCompact: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  leading: {
    flexShrink: 0,
  },
  trailing: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
}))

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  description,
  leading,
  trailing,
  onPress,
  onLongPress,
  disabled = false,
  destructive = false,
  divider = false,
  compact = false,
  haptic = 'light',
  showChevron,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const pressed = useSharedValue(0)

  const animStyle = useAnimatedStyle(() => ({
    backgroundColor: pressed.value
      ? theme.colors.surface
      : 'transparent',
    transform: [{ scale: pressed.value ? 0.985 : 1 }],
  }))

  const handlePressIn = useCallback(() => {
    pressed.value = withTiming(1, { duration: 80 })
    triggerHaptic(haptic)
  }, [haptic])

  const handlePressOut = useCallback(() => {
    pressed.value = withTiming(0, { duration: 200 })
  }, [])

  const titleColor = destructive ? theme.colors.destructive : theme.colors.foreground
  const subtitleColor = destructive ? theme.colors.destructive + '99' : theme.colors.muted

  const shouldShowChevron = showChevron !== undefined
    ? showChevron
    : onPress !== undefined && trailing === undefined

  const content = (
    <Animated.View
      style={[
        styles.inner,
        compact && styles.innerCompact,
        disabled && styles.disabled,
        onPress ? animStyle : undefined,
      ]}
    >
      {/* Leading */}
      {leading && <View style={styles.leading}>{leading}</View>}

      {/* Content */}
      <View style={styles.content}>
        <Text
          variant="label"
          numberOfLines={1}
          style={{ color: titleColor, fontSize: compact ? 14 : 15 }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            variant="caption"
            numberOfLines={1}
            style={{ color: subtitleColor, fontSize: compact ? 12 : 13 }}
          >
            {subtitle}
          </Text>
        )}
        {description && (
          <Text
            variant="body"
            numberOfLines={2}
            style={{ color: theme.colors.muted, fontSize: 12, marginTop: 2, lineHeight: 17 }}
          >
            {description}
          </Text>
        )}
      </View>

      {/* Trailing */}
      {trailing && <View style={styles.trailing}>{trailing}</View>}
      {shouldShowChevron && (
        <View style={styles.trailing}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.muted}
            style={{ opacity: 0.6 }}
          />
        </View>
      )}
    </Animated.View>
  )

  return (
    <View style={[styles.container, style]}>
      {onPress || onLongPress ? (
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={title}
          accessibilityState={{ disabled }}
        >
          {content}
        </Pressable>
      ) : (
        content
      )}
      {divider && <View style={styles.divider} />}
    </View>
  )
}
