// native-mate: chat-bubble@0.1.0 | hash:PLACEHOLDER
import React, { useMemo } from 'react'
import { View, Pressable, Image } from 'react-native'
import Animated, {
  FadeIn,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { ChatBubbleProps, MessageStatus } from './chat-bubble.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  selfContainer: {
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '80%',
  },
  selfRow: {
    flexDirection: 'row-reverse',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    maxWidth: '100%',
  },
  selfBubble: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 18,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  systemBubble: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 3,
  },
  imageBubble: {
    overflow: 'hidden',
    padding: 0,
  },
  senderName: {
    marginBottom: 2,
    marginLeft: 36,
  },
}))

// ── Status icon ──────────────────────────────────────────────────────────────

const StatusIcon: React.FC<{ status: MessageStatus; color: string }> = ({
  status,
  color,
}) => {
  const size = 13

  switch (status) {
    case 'sending':
      return <Ionicons name="time-outline" size={size} color={color} />
    case 'sent':
      return <Ionicons name="checkmark" size={size} color={color} />
    case 'delivered':
      return <Ionicons name="checkmark-done" size={size} color={color} />
    case 'read':
      return <Ionicons name="checkmark-done" size={size} color="#3b82f6" />
    default:
      return null
  }
}

// ── Format time ──────────────────────────────────────────────────────────────

function formatTime(date: Date): string {
  const h = date.getHours()
  const m = date.getMinutes()
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

// ── ChatBubble ───────────────────────────────────────────────────────────────

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  timestamp,
  sender = 'other',
  status = 'sent',
  avatar,
  showAvatar,
  showTimestamp = false,
  type = 'text',
  imageSource,
  imageWidth = 220,
  imageHeight = 160,
  senderName,
  selfColor,
  otherColor,
  haptic = true,
  onLongPress,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const isSelf = sender === 'self'
  const shouldShowAvatar = showAvatar ?? !isSelf
  const ts = useMemo(
    () => formatTime(typeof timestamp === 'string' ? new Date(timestamp) : timestamp),
    [timestamp]
  )

  const bubbleBg = isSelf
    ? selfColor ?? theme.colors.primary
    : otherColor ?? (theme.colors.surfaceRaised ?? theme.colors.surface)

  const textColor = isSelf ? theme.colors.onPrimary : theme.colors.foreground
  const mutedTextColor = isSelf ? theme.colors.onPrimary + 'A6' : theme.colors.muted

  const handleLongPress = () => {
    if (haptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onLongPress?.()
  }

  // ── System message ──
  if (type === 'system') {
    return (
      <View style={[styles.systemContainer, style]}>
        <View
          style={[
            styles.systemBubble,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.muted,
              textAlign: 'center',
            }}
          >
            {message}
          </Text>
        </View>
      </View>
    )
  }

  // ── Text / Image message ──
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={[
        styles.container,
        isSelf ? styles.selfContainer : styles.otherContainer,
        style,
      ]}
    >
      {/* Sender name for other's messages */}
      {!isSelf && senderName && (
        <Text
          style={[
            styles.senderName,
            { fontSize: 11, ...fontStyle(theme.typography, 'semibold'), color: theme.colors.muted },
          ]}
        >
          {senderName}
        </Text>
      )}

      <View style={[styles.row, isSelf && styles.selfRow]}>
        {/* Avatar */}
        {shouldShowAvatar && avatar ? (
          <Image source={avatar} style={styles.avatar} />
        ) : shouldShowAvatar ? (
          <View
            style={[
              styles.avatarPlaceholder,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Ionicons name="person" size={14} color={theme.colors.muted} />
          </View>
        ) : null}

        <Pressable
          onLongPress={onLongPress ? handleLongPress : undefined}
          delayLongPress={300}
          accessibilityRole="text"
          accessibilityLabel={`${isSelf ? 'You' : senderName ?? 'Other'}: ${message}. ${ts}`}
        >
          {type === 'image' && imageSource ? (
            <View
              style={[
                styles.bubble,
                isSelf ? styles.selfBubble : styles.otherBubble,
                styles.imageBubble,
                { backgroundColor: bubbleBg },
              ]}
            >
              <Image
                source={imageSource}
                style={{
                  width: imageWidth,
                  height: imageHeight,
                  borderRadius: 14,
                }}
                resizeMode="cover"
              />
              {message ? (
                <View style={{ paddingHorizontal: 14, paddingVertical: 8 }}>
                  <Text style={{ fontSize: 15, color: textColor, lineHeight: 20 }}>
                    {message}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View
              style={[
                styles.bubble,
                isSelf ? styles.selfBubble : styles.otherBubble,
                { backgroundColor: bubbleBg },
                !isSelf && {
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text style={{ fontSize: 15, color: textColor, lineHeight: 20 }}>
                {message}
              </Text>
            </View>
          )}

          {/* Timestamp & status */}
          {(showTimestamp || (isSelf && status)) && (
            <View style={styles.statusRow}>
              {showTimestamp && (
                <Text
                  style={{
                    fontSize: 10,
                    color: theme.colors.muted,
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {ts}
                </Text>
              )}
              {isSelf && status && (
                <StatusIcon status={status} color={mutedTextColor} />
              )}
            </View>
          )}
        </Pressable>
      </View>
    </Animated.View>
  )
}
