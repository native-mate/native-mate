// native-mate: notification-card@0.1.0 | hash:PLACEHOLDER
import React, { useRef, useMemo } from 'react'
import { View, Pressable, Image, PanResponder } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, useMotion, withAlpha, Text, makeStyles, fontStyle, useDirection } from '@native-mate/core'
import type { NotificationCardProps, NotificationCategory } from './notification-card.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const DISMISS_THRESHOLD = 120

function getCategoryConfig(
  theme: any
): Record<NotificationCategory, { icon: keyof typeof Ionicons.glyphMap; color: string }> {
  return {
    info: { icon: 'information-circle', color: theme.colors.info },
    success: { icon: 'checkmark-circle', color: theme.colors.success },
    warning: { icon: 'warning', color: theme.colors.warning },
    error: { icon: 'close-circle', color: theme.colors.destructive },
    social: { icon: 'people', color: '#8b5cf6' }, // no semantic token for social; intentional
    system: { icon: 'settings', color: theme.colors.muted },
  }
}

const useStyles = makeStyles((theme) => ({
  container: {
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  unreadCard: {
    borderStartWidth: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  dismissBg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    end: 0,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
}))

// ── Relative time ────────────────────────────────────────────────────────────

function relativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)
  const diffWeek = Math.floor(diffDay / 7)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  if (diffWeek < 4) return `${diffWeek}w ago`
  return date.toLocaleDateString()
}

// ── NotificationCard ─────────────────────────────────────────────────────────

export const NotificationCard = React.memo<NotificationCardProps>(({
  title,
  message,
  timestamp,
  icon,
  avatar,
  read = false,
  onPress,
  onDismiss,
  category = 'info',
  haptic = true,
  swipeToDismiss = true,
  style,
  testID,
}) => {
  const theme = useTheme()
  const motion = useMotion()
  const styles = useStyles()
  // Dismiss travels toward the *start* edge, so it mirrors under RTL.
  const { sign } = useDirection()

  const translateX = useSharedValue(0)
  const rowOpacity = useSharedValue(1)
  const rowHeight = useSharedValue<number | undefined>(undefined)
  const grantX = useRef(0)

  const catConfig = getCategoryConfig(theme)[category]
  const timeStr = useMemo(
    () => relativeTime(typeof timestamp === 'string' ? new Date(timestamp) : timestamp),
    [timestamp]
  )

  const handleDismiss = () => {
    onDismiss?.()
  }

  const handleDismissRef = useRef(handleDismiss)
  handleDismissRef.current = handleDismiss

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        swipeToDismiss && Math.abs(gs.dx) > 10 && Math.abs(gs.dx) > Math.abs(gs.dy) * 1.5,
      onPanResponderGrant: () => {
        grantX.current = translateX.value
      },
      onPanResponderMove: (_, gs) => {
        const dx = grantX.current + gs.dx
        // Only allow a swipe toward the start edge (left in LTR, right in RTL)
        translateX.value = sign * Math.min(0, sign * dx)
      },
      onPanResponderRelease: (_, gs) => {
        if (Math.abs(translateX.value) > DISMISS_THRESHOLD) {
          translateX.value = withTiming(-500 * sign, motion.timing('normal'))
          rowOpacity.value = withTiming(0, motion.timing('normal'), () => {
            runOnJS(handleDismissRef.current)()
          })
        } else {
          translateX.value = withSpring(0, motion.spring())
        }
      },
    })
  ).current

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: rowOpacity.value,
  }))

  const dismissBgStyle = useAnimatedStyle(() => {
    // Travel is one-directional; drive from the magnitude so the ranges below
    // stay ascending (and correct) whichever way the card actually moves.
    const travel = -Math.abs(translateX.value)
    return {
      opacity: interpolate(
        travel,
        [-DISMISS_THRESHOLD, -30, 0],
        [1, 0.4, 0],
        Extrapolation.CLAMP
      ),
      width: interpolate(
        travel,
        [-200, 0],
        [200, 0],
        Extrapolation.CLAMP
      ),
    }
  })

  const handlePress = () => {
    if (haptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress?.()
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Dismiss background */}
      {swipeToDismiss && onDismiss && (
        <Animated.View
          style={[
            styles.dismissBg,
            { backgroundColor: theme.colors.destructive },
            dismissBgStyle,
          ]}
        >
          <Ionicons name="trash-outline" size={22} color={theme.colors.onDestructive} />
        </Animated.View>
      )}

      <Animated.View style={cardStyle} {...panResponder.panHandlers}>
        <Pressable
          style={[
            styles.card,
            !read && styles.unreadCard,
            !read && { borderStartColor: catConfig.color },
          ]}
          onPress={onPress ? handlePress : undefined}
          accessibilityRole="button"
          accessibilityLabel={`${read ? '' : 'Unread '}notification: ${title}. ${message}. ${timeStr}`}
          accessibilityState={{ selected: !read }}
        >
          {/* Icon / Avatar */}
          {avatar ? (
            <Image source={avatar} style={styles.avatarImage} />
          ) : (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: withAlpha(catConfig.color, 0.09) },
              ]}
            >
              {icon ?? (
                <Ionicons
                  name={catConfig.icon}
                  size={22}
                  color={catConfig.color}
                />
              )}
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.titleRow}>
              {!read && (
                <View
                  style={[
                    styles.unreadDot,
                    { backgroundColor: catConfig.color },
                  ]}
                />
              )}
              <Text
                style={{
                  fontSize: 14,
                  ...(read ? fontStyle(theme.typography, 'medium') : fontStyle(theme.typography, 'bold')),
                  color: theme.colors.foreground,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {title}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 13,
                color: theme.colors.muted,
                lineHeight: 18,
              }}
              numberOfLines={2}
            >
              {message}
            </Text>

            <View style={styles.metaRow}>
              <Text
                style={{
                  fontSize: 11,
                  color: theme.colors.muted,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {timeStr}
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  )
})

NotificationCard.displayName = 'NotificationCard'
