// native-mate: comment@0.1.0 | hash:PLACEHOLDER
import React, { useState, useCallback } from 'react'
import { View, Image, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { CommentProps, CommentData } from './comment.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const INDENT_WIDTH = 24

const useStyles = makeStyles((theme) => ({
  container: {
    gap: 0,
  },
  commentRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: theme.typography.size.sm,
    ...fontStyle(theme.typography, 'semibold'),
    color: theme.colors.foreground,
  },
  timestamp: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.muted,
  },
  content: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.foreground,
    lineHeight: 20,
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
    paddingVertical: 2,
  },
  actionText: {
    fontSize: 12,
    color: theme.colors.muted,
    ...fontStyle(theme.typography, 'medium'),
  },
  actionTextActive: {
    color: theme.colors.primary,
  },
  threadLine: {
    position: 'absolute',
    left: 15,
    top: 42,
    bottom: 0,
    width: 2,
    backgroundColor: theme.colors.border,
    borderRadius: 1,
  },
  repliesContainer: {
    marginLeft: INDENT_WIDTH,
  },
  showRepliesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    marginLeft: 42,
  },
  showRepliesText: {
    fontSize: 12,
    color: theme.colors.primary,
    ...fontStyle(theme.typography, 'semibold'),
  },
}))

function formatTimestamp(timestamp: string | Date): string {
  const d = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 30) {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }
  if (days > 0) return `${days}d`
  if (hours > 0) return `${hours}h`
  if (minutes > 0) return `${minutes}m`
  return 'now'
}

function CommentItem({
  author,
  avatar,
  content,
  timestamp,
  likes = 0,
  liked = false,
  onLike,
  onReply,
  replies = [],
  depth = 0,
  maxDepth = 3,
  onAuthorPress,
  haptic = true,
}: CommentProps) {
  const theme = useTheme()
  const styles = useStyles()
  const [showReplies, setShowReplies] = useState(depth < 1)
  const likeScale = useSharedValue(1)

  const likeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }))

  const handleLike = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    likeScale.value = withSpring(1.3, { damping: 8, stiffness: 400 })
    setTimeout(() => {
      likeScale.value = withSpring(1, { damping: 10, stiffness: 300 })
    }, 100)
    onLike?.()
  }, [haptic, onLike])

  const handleReply = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onReply?.()
  }, [haptic, onReply])

  const avatarInitial = author.charAt(0).toUpperCase()
  const hasReplies = replies.length > 0

  return (
    <View style={styles.container}>
      <View style={{ position: 'relative' }}>
        {hasReplies && showReplies && (
          <View style={styles.threadLine} />
        )}
        <View style={styles.commentRow}>
          <Pressable
            onPress={() => onAuthorPress?.(author)}
            disabled={onAuthorPress == null}
            accessibilityRole={onAuthorPress != null ? 'button' : undefined}
          >
            {avatar != null ? (
              <Image source={avatar} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text
                  variant="label"
                  style={{ color: theme.colors.primary, fontSize: 13, ...fontStyle(theme.typography, 'bold') }}
                >
                  {avatarInitial}
                </Text>
              </View>
            )}
          </Pressable>
          <View style={styles.body}>
            <View style={styles.authorRow}>
              <Pressable
                onPress={() => onAuthorPress?.(author)}
                disabled={onAuthorPress == null}
              >
                <Text variant="label" style={styles.authorName}>
                  {author}
                </Text>
              </Pressable>
              <Text variant="caption" style={styles.timestamp}>
                {formatTimestamp(timestamp)}
              </Text>
            </View>
            <Text variant="body" style={styles.content}>
              {content}
            </Text>
            <View style={styles.actionsRow}>
              {onLike != null && (
                <Pressable
                  onPress={handleLike}
                  style={styles.actionButton}
                  accessibilityRole="button"
                  accessibilityLabel={`Like, ${likes} likes`}
                  accessibilityState={{ selected: liked }}
                >
                  <Animated.View style={likeAnimStyle}>
                    <Ionicons
                      name={liked ? 'heart' : 'heart-outline'}
                      size={14}
                      color={liked ? '#EF4444' : theme.colors.muted}
                    />
                  </Animated.View>
                  {likes > 0 && (
                    <Text
                      variant="caption"
                      style={[styles.actionText, liked && styles.actionTextActive]}
                    >
                      {likes}
                    </Text>
                  )}
                </Pressable>
              )}
              {onReply != null && depth < maxDepth && (
                <Pressable
                  onPress={handleReply}
                  style={styles.actionButton}
                  accessibilityRole="button"
                  accessibilityLabel="Reply"
                >
                  <Ionicons name="chatbubble-outline" size={13} color={theme.colors.muted} />
                  <Text variant="caption" style={styles.actionText}>
                    Reply
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>

      {hasReplies && !showReplies && (
        <Pressable
          onPress={() => setShowReplies(true)}
          style={styles.showRepliesButton}
          accessibilityRole="button"
          accessibilityLabel={`Show ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
        >
          <Ionicons name="chevron-down" size={14} color={theme.colors.primary} />
          <Text variant="caption" style={styles.showRepliesText}>
            {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
          </Text>
        </Pressable>
      )}

      {hasReplies && showReplies && depth < maxDepth && (
        <View style={styles.repliesContainer}>
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              author={reply.author}
              avatar={reply.avatar}
              content={reply.content}
              timestamp={reply.timestamp}
              likes={reply.likes}
              liked={reply.liked}
              onLike={onLike}
              onReply={onReply}
              replies={reply.replies}
              depth={depth + 1}
              maxDepth={maxDepth}
              onAuthorPress={onAuthorPress}
              haptic={haptic}
            />
          ))}
        </View>
      )}
    </View>
  )
}

export const Comment: React.FC<CommentProps> = (props) => {
  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`Comment by ${props.author}`}
      style={props.style}
    >
      <CommentItem {...props} />
    </View>
  )
}
