// native-mate: review-card@0.1.0 | hash:PLACEHOLDER
import React, { useState, useCallback, useEffect } from 'react'
import { View, Image, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { ReviewCardProps } from './review-card.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorInfo: {
    flex: 1,
    gap: 2,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: theme.typography.size.md,
    ...fontStyle(theme.typography, 'semibold'),
    color: theme.colors.foreground,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: theme.colors.success + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  verifiedText: {
    fontSize: 10,
    color: theme.colors.success,
    ...fontStyle(theme.typography, 'semibold'),
  },
  date: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.muted,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.foreground,
    lineHeight: 20,
  },
  readMore: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.primary,
    ...fontStyle(theme.typography, 'medium'),
    marginTop: 2,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  reviewImage: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.muted,
    ...fontStyle(theme.typography, 'medium'),
  },
  actionTextActive: {
    color: theme.colors.primary,
  },
}))

function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 30) {
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  author,
  avatar,
  rating,
  date,
  text,
  images = [],
  helpful = 0,
  onHelpful,
  isHelpful = false,
  onReport,
  verified = false,
  onAuthorPress,
  maxLines = 3,
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [expanded, setExpanded] = useState(false)
  const [needsExpand, setNeedsExpand] = useState(false)
  const helpfulScale = useSharedValue(1)

  useEffect(() => {
    setNeedsExpand(false)
  }, [text, maxLines])

  const helpfulAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: helpfulScale.value }],
  }))

  const handleHelpful = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    helpfulScale.value = withSpring(1.2, { damping: 8, stiffness: 400 })
    setTimeout(() => {
      helpfulScale.value = withSpring(1, { damping: 10, stiffness: 300 })
    }, 100)
    onHelpful?.()
  }, [haptic, onHelpful])

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : i - 0.5 <= rating ? 'star-half' : 'star-outline'}
          size={16}
          color={i <= rating || i - 0.5 <= rating ? '#F59E0B' : theme.colors.muted + '60'}
        />,
      )
    }
    return stars
  }

  const avatarInitial = author.charAt(0).toUpperCase()

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="summary"
      accessibilityLabel={`Review by ${author}, ${rating} stars`}
      {...rest}
    >
      <View style={styles.header}>
        <Pressable
          onPress={onAuthorPress}
          disabled={onAuthorPress == null}
          accessibilityRole={onAuthorPress != null ? 'button' : undefined}
          accessibilityLabel={`View ${author}'s profile`}
        >
          {avatar != null ? (
            <Image source={avatar} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text
                variant="label"
                style={{ color: theme.colors.primary, fontSize: 16, ...fontStyle(theme.typography, 'bold') }}
              >
                {avatarInitial}
              </Text>
            </View>
          )}
        </Pressable>
        <View style={styles.authorInfo}>
          <View style={styles.authorRow}>
            <Pressable onPress={onAuthorPress} disabled={onAuthorPress == null}>
              <Text variant="label" style={styles.authorName}>
                {author}
              </Text>
            </Pressable>
            {verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={12} color={theme.colors.success} />
                <Text variant="caption" style={styles.verifiedText}>
                  Verified
                </Text>
              </View>
            )}
          </View>
          <Text variant="caption" style={styles.date}>
            {formatDate(date)}
          </Text>
        </View>
        <View style={styles.starsRow}>{renderStars()}</View>
      </View>

      <View>
        <Text
          variant="body"
          style={styles.reviewText}
          numberOfLines={expanded ? undefined : maxLines}
          onTextLayout={(e: any) => {
            if (!expanded && e.nativeEvent.lines.length > maxLines) {
              setNeedsExpand(true)
            }
          }}
        >
          {text}
        </Text>
        {needsExpand && (
          <Pressable onPress={() => setExpanded(!expanded)}>
            <Text variant="caption" style={styles.readMore}>
              {expanded ? 'Show less' : 'Read more'}
            </Text>
          </Pressable>
        )}
      </View>

      {images.length > 0 && (
        <View style={styles.imagesRow}>
          {images.slice(0, 4).map((uri, i) => (
            <Image
              key={i}
              source={{ uri }}
              style={styles.reviewImage}
              resizeMode="cover"
            />
          ))}
          {images.length > 4 && (
            <View
              style={[
                styles.reviewImage,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.colors.background,
                },
              ]}
            >
              <Text variant="label" style={{ color: theme.colors.muted, fontSize: 13 }}>
                +{images.length - 4}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.actionsRow}>
        {onHelpful != null && (
          <Pressable
            onPress={handleHelpful}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel={`Helpful, ${helpful} votes`}
            accessibilityState={{ selected: isHelpful }}
          >
            <Animated.View style={helpfulAnimStyle}>
              <Ionicons
                name={isHelpful ? 'thumbs-up' : 'thumbs-up-outline'}
                size={16}
                color={isHelpful ? theme.colors.primary : theme.colors.muted}
              />
            </Animated.View>
            <Text
              variant="caption"
              style={[
                styles.actionText,
                isHelpful && styles.actionTextActive,
              ]}
            >
              Helpful{helpful > 0 ? ` (${helpful})` : ''}
            </Text>
          </Pressable>
        )}
        {onReport != null && (
          <Pressable
            onPress={onReport}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel="Report review"
          >
            <Ionicons name="flag-outline" size={14} color={theme.colors.muted} />
            <Text variant="caption" style={styles.actionText}>
              Report
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}
