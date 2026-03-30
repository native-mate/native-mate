// native-mate: audio-player@0.1.0 | hash:PLACEHOLDER
import React, { useCallback } from 'react'
import { View, Image, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, shadow } from '@native-mate/core'
import type { AudioPlayerProps } from './audio-player.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  // Full layout
  fullContainer: {
    padding: theme.spacing.md,
    gap: 16,
    alignItems: 'center',
  },
  artwork: {
    width: 200,
    height: 200,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.background,
  },
  artworkPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackInfo: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold as any,
    color: theme.colors.foreground,
    textAlign: 'center',
  },
  artist: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.muted,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    gap: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeText: {
    fontSize: 11,
    color: theme.colors.muted,
    fontVariant: ['tabular-nums'],
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  controlButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow(2),
  },
  // Compact layout
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  compactArtwork: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background,
  },
  compactArtworkPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactInfo: {
    flex: 1,
    gap: 2,
  },
  compactTitle: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold as any,
    color: theme.colors.foreground,
  },
  compactArtist: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.muted,
  },
  compactControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactProgressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.border,
  },
  compactProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
}))

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  title,
  artist,
  artwork,
  source,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  showProgress = true,
  showControls = true,
  compact = false,
  onSeek,
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const playScale = useSharedValue(1)

  const playAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playScale.value }],
  }))

  const handlePlayPause = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    playScale.value = withSpring(0.9, { damping: 12, stiffness: 400 })
    setTimeout(() => {
      playScale.value = withSpring(1, { damping: 10, stiffness: 300 })
    }, 100)
    if (isPlaying) {
      onPause?.()
    } else {
      onPlay?.()
    }
  }, [isPlaying, haptic, onPlay, onPause])

  const handlePrevious = useCallback(() => {
    if (haptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPrevious?.()
  }, [haptic, onPrevious])

  const handleNext = useCallback(() => {
    if (haptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onNext?.()
  }, [haptic, onNext])

  const progress = duration > 0 ? currentTime / duration : 0

  if (compact) {
    return (
      <View
        style={[styles.container, style]}
        accessibilityRole="summary"
        accessibilityLabel={`Now playing: ${title}${artist ? ` by ${artist}` : ''}`}
        {...rest}
      >
        <View style={styles.compactContainer}>
          {artwork != null ? (
            <Image source={artwork} style={styles.compactArtwork} resizeMode="cover" />
          ) : (
            <View style={styles.compactArtworkPlaceholder}>
              <Ionicons name="musical-notes" size={20} color={theme.colors.primary} />
            </View>
          )}
          <View style={styles.compactInfo}>
            <Text variant="label" numberOfLines={1} style={styles.compactTitle}>
              {title}
            </Text>
            {artist != null && (
              <Text variant="caption" numberOfLines={1} style={styles.compactArtist}>
                {artist}
              </Text>
            )}
          </View>
          {showControls && (
            <View style={styles.compactControls}>
              {onPrevious != null && (
                <Pressable
                  onPress={handlePrevious}
                  style={styles.controlButton}
                  accessibilityRole="button"
                  accessibilityLabel="Previous track"
                >
                  <Ionicons name="play-skip-back" size={18} color={theme.colors.foreground} />
                </Pressable>
              )}
              <Pressable
                onPress={handlePlayPause}
                accessibilityRole="button"
                accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
              >
                <Animated.View style={[styles.compactPlayButton, playAnimStyle]}>
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={18}
                    color={theme.colors.onPrimary}
                    style={!isPlaying ? { marginLeft: 2 } : undefined}
                  />
                </Animated.View>
              </Pressable>
              {onNext != null && (
                <Pressable
                  onPress={handleNext}
                  style={styles.controlButton}
                  accessibilityRole="button"
                  accessibilityLabel="Next track"
                >
                  <Ionicons name="play-skip-forward" size={18} color={theme.colors.foreground} />
                </Pressable>
              )}
            </View>
          )}
        </View>
        {showProgress && (
          <View style={styles.compactProgressBar}>
            <View style={[styles.compactProgressFill, { width: `${progress * 100}%` }]} />
          </View>
        )}
      </View>
    )
  }

  // Full layout
  return (
    <View
      style={[styles.container, styles.fullContainer, style]}
      accessibilityRole="summary"
      accessibilityLabel={`Now playing: ${title}${artist ? ` by ${artist}` : ''}`}
      {...rest}
    >
      {artwork != null ? (
        <Image source={artwork} style={styles.artwork} resizeMode="cover" />
      ) : (
        <View style={styles.artworkPlaceholder}>
          <Ionicons name="musical-notes" size={48} color={theme.colors.primary} />
        </View>
      )}

      <View style={styles.trackInfo}>
        <Text variant="title" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {artist != null && (
          <Text variant="body" numberOfLines={1} style={styles.artist}>
            {artist}
          </Text>
        )}
      </View>

      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <View style={styles.timeRow}>
            <Text variant="caption" style={styles.timeText}>
              {formatTime(currentTime)}
            </Text>
            <Text variant="caption" style={styles.timeText}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>
      )}

      {showControls && (
        <View style={styles.controlsRow}>
          {onPrevious != null && (
            <Pressable
              onPress={handlePrevious}
              style={styles.controlButton}
              accessibilityRole="button"
              accessibilityLabel="Previous track"
            >
              <Ionicons name="play-skip-back" size={24} color={theme.colors.foreground} />
            </Pressable>
          )}
          <Pressable
            onPress={handlePlayPause}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          >
            <Animated.View style={[styles.playButton, playAnimStyle]}>
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={26}
                color={theme.colors.onPrimary}
                style={!isPlaying ? { marginLeft: 3 } : undefined}
              />
            </Animated.View>
          </Pressable>
          {onNext != null && (
            <Pressable
              onPress={handleNext}
              style={styles.controlButton}
              accessibilityRole="button"
              accessibilityLabel="Next track"
            >
              <Ionicons name="play-skip-forward" size={24} color={theme.colors.foreground} />
            </Pressable>
          )}
        </View>
      )}
    </View>
  )
}
