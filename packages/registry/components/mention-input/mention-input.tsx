// native-mate: mention-input@0.1.0 | hash:PLACEHOLDER
import React, { useState, useCallback, useMemo, useRef } from 'react'
import { View, TextInput, Pressable, Image, FlatList, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, shadow, fontStyle } from '@native-mate/core'
import type { MentionInputProps, MentionUser } from './mention-input.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    minHeight: 44,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.size.md,
    color: theme.colors.foreground,
    padding: 0,
    margin: 0,
  },
  dropdown: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '100%',
    marginBottom: 4,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    maxHeight: 200,
    ...shadow(3),
  },
  dropdownBelow: {
    top: '100%',
    bottom: 'auto' as any,
    marginTop: 4,
    marginBottom: 0,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  userItemSeparator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 14,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
  },
  userAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: theme.typography.size.sm,
    ...fontStyle(theme.typography, 'medium'),
    color: theme.colors.foreground,
  },
  userId: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.muted,
  },
  emptyText: {
    padding: 16,
    textAlign: 'center',
    fontSize: theme.typography.size.sm,
    color: theme.colors.muted,
  },
  disabled: {
    opacity: 0.5,
  },
}))

export const MentionInput: React.FC<MentionInputProps> = ({
  value,
  onChangeText,
  mentions = [],
  onMentionSelect,
  onQueryChange,
  placeholder = 'Type a message...',
  multiline = false,
  maxLines = 4,
  disabled = false,
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [focused, setFocused] = useState(false)
  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<TextInput>(null)

  const filteredMentions = useMemo(() => {
    if (mentionQuery == null) return []
    const query = mentionQuery.toLowerCase()
    return mentions.filter(
      (user) => user.name.toLowerCase().includes(query) || user.id.toLowerCase().includes(query),
    ).slice(0, 8)
  }, [mentionQuery, mentions])

  const showDropdown = mentionQuery != null && filteredMentions.length > 0

  const handleChangeText = useCallback(
    (text: string) => {
      onChangeText(text)

      // Detect @mention query
      const beforeCursor = text.slice(0, cursorPosition + (text.length - value.length))
      const mentionMatch = beforeCursor.match(/@(\w*)$/)
      if (mentionMatch) {
        const query = mentionMatch[1]
        setMentionQuery(query)
        onQueryChange?.(query)
      } else {
        setMentionQuery(null)
      }
    },
    [value, cursorPosition, onChangeText, onQueryChange],
  )

  const handleSelectionChange = useCallback(
    (e: any) => {
      setCursorPosition(e.nativeEvent.selection.end)
    },
    [],
  )

  const handleMentionSelect = useCallback(
    (user: MentionUser) => {
      if (haptic && Haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }

      // Replace the @query with @username
      const beforeCursor = value.slice(0, cursorPosition)
      const afterCursor = value.slice(cursorPosition)
      const mentionMatch = beforeCursor.match(/@(\w*)$/)

      if (mentionMatch) {
        const beforeMention = beforeCursor.slice(0, beforeCursor.length - mentionMatch[0].length)
        const newText = `${beforeMention}@${user.name} ${afterCursor}`
        onChangeText(newText)
      }

      setMentionQuery(null)
      onMentionSelect?.(user)
      inputRef.current?.focus()
    },
    [value, cursorPosition, haptic, onChangeText, onMentionSelect],
  )

  const renderUserItem = useCallback(
    ({ item }: { item: MentionUser }) => (
      <Pressable
        onPress={() => handleMentionSelect(item)}
        style={styles.userItem}
        accessibilityRole="button"
        accessibilityLabel={`Mention ${item.name}`}
      >
        {item.avatar != null ? (
          <Image source={item.avatar} style={styles.userAvatar} />
        ) : (
          <View style={styles.userAvatarPlaceholder}>
            <Text
              variant="label"
              style={{ color: theme.colors.primary, fontSize: 13, ...fontStyle(theme.typography, 'bold') }}
            >
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text variant="body" style={styles.userName}>
            {item.name}
          </Text>
          <Text variant="caption" style={styles.userId}>
            @{item.id}
          </Text>
        </View>
      </Pressable>
    ),
    [handleMentionSelect, theme],
  )

  return (
    <View style={[styles.container, style]} {...rest}>
      {showDropdown && (
        <View style={[styles.dropdown, styles.dropdownBelow]}>
          <FlatList
            data={filteredMentions}
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View style={styles.userItemSeparator} />}
          />
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          focused && styles.inputFocused,
          disabled && styles.disabled,
        ]}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleChangeText}
          onSelectionChange={handleSelectionChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          multiline={multiline}
          numberOfLines={multiline ? maxLines : 1}
          maxLength={2000}
          editable={!disabled}
          style={[
            styles.input,
            multiline && { textAlignVertical: 'top', maxHeight: 120 },
          ]}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            setTimeout(() => setMentionQuery(null), 200)
          }}
          accessibilityLabel={placeholder}
        />
      </View>
    </View>
  )
}
