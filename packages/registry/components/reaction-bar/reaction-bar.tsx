// native-mate: reaction-bar@0.1.0 | hash:PLACEHOLDER
import React, { useCallback } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { ReactionBarProps, Reaction, ReactionBarSize } from './reaction-bar.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const sizeTokens: Record<ReactionBarSize, { pill: number; emoji: number; count: number; padding: number; gap: number }> = {
  sm: { pill: 28, emoji: 14, count: 11, padding: 6, gap: 4 },
  md: { pill: 34, emoji: 18, count: 13, padding: 8, gap: 6 },
}

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  pillReacted: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  emoji: {
    textAlign: 'center',
  },
  count: {
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  countReacted: {
    color: theme.colors.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
}))

function ReactionPill({
  reaction,
  size,
  onReact,
  haptic,
}: {
  reaction: Reaction
  size: ReactionBarSize
  onReact?: (emoji: string) => void
  haptic: boolean
}) {
  const theme = useTheme()
  const styles = useStyles()
  const tokens = sizeTokens[size]
  const scale = useSharedValue(1)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    scale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 300 }),
    )
    onReact?.(reaction.emoji)
  }, [haptic, onReact, reaction.emoji])

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${reaction.emoji} ${reaction.count} reactions${reaction.reacted ? ', you reacted' : ''}`}
      accessibilityState={{ selected: reaction.reacted }}
    >
      <Animated.View
        style={[
          styles.pill,
          reaction.reacted && styles.pillReacted,
          {
            height: tokens.pill,
            paddingHorizontal: tokens.padding,
            gap: tokens.gap,
          },
          animStyle,
        ]}
      >
        <Text variant="body" style={[styles.emoji, { fontSize: tokens.emoji }]}>
          {reaction.emoji}
        </Text>
        <Text
          variant="caption"
          style={[
            styles.count,
            {
              fontSize: tokens.count,
              color: reaction.reacted ? theme.colors.primary : theme.colors.muted,
            },
          ]}
        >
          {reaction.count}
        </Text>
      </Animated.View>
    </Pressable>
  )
}

export const ReactionBar: React.FC<ReactionBarProps> = ({
  reactions,
  onReact,
  onLongPress,
  maxVisible = 8,
  size = 'md',
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const tokens = sizeTokens[size]

  const visibleReactions = reactions.slice(0, maxVisible)
  const overflowCount = reactions.length - maxVisible

  const handleAddPress = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onLongPress?.()
  }, [haptic, onLongPress])

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="toolbar"
      accessibilityLabel="Reactions"
      {...rest}
    >
      {visibleReactions.map((reaction) => (
        <ReactionPill
          key={reaction.emoji}
          reaction={reaction}
          size={size}
          onReact={onReact}
          haptic={haptic}
        />
      ))}
      {overflowCount > 0 && (
        <View
          style={[
            styles.pill,
            {
              height: tokens.pill,
              paddingHorizontal: tokens.padding,
            },
          ]}
        >
          <Text
            variant="caption"
            style={[styles.count, { fontSize: tokens.count, color: theme.colors.muted }]}
          >
            +{overflowCount}
          </Text>
        </View>
      )}
      {onLongPress != null && (
        <Pressable
          onPress={handleAddPress}
          accessibilityRole="button"
          accessibilityLabel="Add reaction"
        >
          <View
            style={[
              styles.addButton,
              {
                width: tokens.pill,
                height: tokens.pill,
              },
            ]}
          >
            <Ionicons
              name="add"
              size={tokens.emoji}
              color={theme.colors.muted}
            />
          </View>
        </Pressable>
      )}
    </View>
  )
}
