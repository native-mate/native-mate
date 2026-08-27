// native-mate: video-player@0.1.0 | hash:PLACEHOLDER
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { View, Pressable, Image, ActivityIndicator } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { VideoPlayerProps } from './video-player.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
  },
  poster: {
    ...absoluteFill(),
    backgroundColor: '#000000',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...absoluteFill(),
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsOverlay: {
    ...absoluteFill(),
    justifyContent: 'flex-end',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
  },
  centerPlay: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#FFFFFF',
    ...fontStyle(theme.typography, 'medium'),
    fontVariant: ['tabular-nums'],
  },
  controlButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    ...absoluteFill(),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    ...fontStyle(theme.typography, 'medium'),
  },
}))

function absoluteFill() {
  return {
    position: 'absolute' as const,
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  source,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  onPlay,
  onPause,
  onEnd,
  onProgress,
  aspectRatio = 16 / 9,
  borderRadius = 0,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(muted)

  const controlsOpacity = useSharedValue(1)
  const playScale = useSharedValue(1)
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const controlsAnimStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }))

  const playAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playScale.value }],
  }))

  const resetControlsTimer = useCallback(() => {
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    controlsOpacity.value = withTiming(1, { duration: 200 })
    setShowControls(true)
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => {
        controlsOpacity.value = withTiming(0, { duration: 300 })
        setShowControls(false)
      }, 3000)
    }
  }, [isPlaying])

  useEffect(() => {
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    }
  }, [])

  const handlePlayPause = useCallback(() => {
    if (Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    playScale.value = withSpring(0.85, { damping: 15, stiffness: 400 })
    setTimeout(() => {
      playScale.value = withSpring(1, { damping: 12, stiffness: 300 })
    }, 100)

    if (isPlaying) {
      setIsPlaying(false)
      onPause?.()
    } else {
      setIsPlaying(true)
      onPlay?.()
    }
    resetControlsTimer()
  }, [isPlaying, onPlay, onPause, resetControlsTimer])

  const handleOverlayPress = useCallback(() => {
    if (showControls && isPlaying) {
      controlsOpacity.value = withTiming(0, { duration: 300 })
      setShowControls(false)
    } else {
      resetControlsTimer()
    }
  }, [showControls, isPlaying, resetControlsTimer])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  const progress = duration > 0 ? currentTime / duration : 0

  return (
    <View
      style={[
        styles.container,
        { aspectRatio, borderRadius },
        style,
      ]}
      accessibilityRole="none"
      accessibilityLabel={`Video player${isPlaying ? ', playing' : ', paused'}`}
      {...rest}
    >
      {/* Poster / placeholder */}
      {!isPlaying && poster != null && (
        <View style={styles.poster}>
          <Image
            source={{ uri: poster }}
            style={styles.posterImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Video placeholder area */}
      {!poster && !isPlaying && (
        <View style={[styles.overlay, { backgroundColor: '#1a1a1a' }]}>
          <View style={styles.placeholder}>
            <Ionicons name="videocam-outline" size={32} color="rgba(255,255,255,0.5)" />
            <Text variant="caption" style={styles.placeholderText}>
              Tap to play
            </Text>
          </View>
        </View>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}

      {/* Controls overlay */}
      {controls && (
        <Pressable onPress={handleOverlayPress} style={styles.controlsOverlay}>
          <Animated.View style={[styles.controlsOverlay, controlsAnimStyle]}>
            {/* Center play button */}
            <View style={styles.overlay}>
              <Pressable
                onPress={handlePlayPause}
                accessibilityRole="button"
                accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
              >
                <Animated.View style={[styles.centerPlay, playAnimStyle]}>
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={28}
                    color="#FFFFFF"
                    style={!isPlaying ? { marginLeft: 3 } : undefined}
                  />
                </Animated.View>
              </Pressable>
            </View>

            {/* Bottom controls */}
            <View style={styles.bottomBar}>
              <Pressable
                onPress={handlePlayPause}
                style={styles.controlButton}
                accessibilityRole="button"
                accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>
              <Text variant="caption" style={styles.timeText}>
                {formatTime(currentTime)}
              </Text>
              <View style={styles.progressContainer}>
                <View
                  style={[styles.progressFill, { width: `${progress * 100}%` }]}
                />
              </View>
              <Text variant="caption" style={styles.timeText}>
                {formatTime(duration)}
              </Text>
              <Pressable
                onPress={toggleMute}
                style={styles.controlButton}
                accessibilityRole="button"
                accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
              >
                <Ionicons
                  name={isMuted ? 'volume-mute' : 'volume-high'}
                  size={18}
                  color="#FFFFFF"
                />
              </Pressable>
              <Pressable
                style={styles.controlButton}
                accessibilityRole="button"
                accessibilityLabel="Fullscreen"
              >
                <Ionicons name="expand" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </Animated.View>
        </Pressable>
      )}
    </View>
  )
}
