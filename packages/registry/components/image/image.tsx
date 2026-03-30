// native-mate: image@0.1.0 | hash:PLACEHOLDER
import React, { useState, useCallback, useEffect } from 'react'
import { View, Image as RNImage, ActivityIndicator } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, makeStyles } from '@native-mate/core'
import type { ImageProps } from './image.types'

const AnimatedImage = Animated.createAnimatedComponent(RNImage)

const useStyles = makeStyles((theme) => ({
  container: {
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  placeholder: {
    ...({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    } as const),
  },
  errorWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
}))

const ShimmerPlaceholder: React.FC<{ color: string }> = ({ color }) => {
  const shimmerOpacity = useSharedValue(0.3)

  useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 }),
      ),
      -1,
      true,
    )
  }, [])

  const animStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color,
    opacity: shimmerOpacity.value,
  }))

  return <Animated.View style={animStyle} />
}

export const Image: React.FC<ImageProps> = ({
  source,
  fallbackSource,
  placeholder = 'shimmer',
  placeholderColor,
  aspectRatio,
  borderRadius = 0,
  resizeMode = 'cover',
  onLoad,
  onError,
  showLoadingIndicator = false,
  alt,
  width,
  height,
  style,
  imageStyle,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const [loading, setLoading] = useState(true)
  const [errored, setErrored] = useState(false)
  const [useFallback, setUseFallback] = useState(false)

  const imageOpacity = useSharedValue(0)

  const imageAnimStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }))

  const handleLoad = useCallback(() => {
    setLoading(false)
    imageOpacity.value = withTiming(1, { duration: 300 })
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    if (fallbackSource && !useFallback) {
      setUseFallback(true)
      return
    }
    setLoading(false)
    setErrored(true)
    onError?.()
  }, [fallbackSource, useFallback, onError])

  const currentSource = useFallback && fallbackSource ? fallbackSource : source
  const bgColor = placeholderColor ?? theme.colors.surface

  const containerStyle = [
    styles.container,
    {
      borderRadius,
      width: width as any,
      height: height as any,
      aspectRatio,
    },
    style,
  ]

  return (
    <View style={containerStyle}>
      {/* Placeholder */}
      {loading && !errored && (
        <View style={[styles.placeholder, { backgroundColor: bgColor }]}>
          {placeholder === 'shimmer' && (
            <ShimmerPlaceholder color={theme.colors.muted + '30'} />
          )}
          {placeholder === 'blur' && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: theme.colors.muted + '20',
              }}
            />
          )}
          {showLoadingIndicator && (
            <ActivityIndicator size="small" color={theme.colors.muted} />
          )}
        </View>
      )}

      {/* Error state */}
      {errored && (
        <View style={[styles.placeholder, { backgroundColor: bgColor }]}>
          <View style={styles.errorWrap}>
            <Ionicons name="image-outline" size={28} color={theme.colors.muted} style={{ opacity: 0.5 }} />
          </View>
        </View>
      )}

      {/* Image */}
      {!errored && (
        <AnimatedImage
          source={currentSource}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
          style={[
            {
              width: '100%',
              height: '100%',
              borderRadius,
            },
            imageAnimStyle,
            imageStyle,
          ]}
          accessibilityRole="image"
          accessibilityLabel={alt}
        />
      )}
    </View>
  )
}
