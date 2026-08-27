// native-mate: rating@0.1.0 | hash:PLACEHOLDER
import React, { useCallback, useRef } from 'react'
import { View, Pressable, PanResponder } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { RatingProps, RatingSize, HapticStyle } from './rating.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const triggerHaptic = (style: HapticStyle) => {
  if (!Haptics || style === 'none') return
  const map = { light: 'Light', medium: 'Medium', heavy: 'Heavy' } as const
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[map[style]])
}

const sizeMap: Record<RatingSize, { icon: number; gap: number; fontSize: number }> = {
  sm: { icon: 18, gap: 2, fontSize: 12 },
  md: { icon: 26, gap: 4, fontSize: 14 },
  lg: { icon: 34, gap: 6, fontSize: 16 },
}

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
}))

const Star = React.memo<{
  index: number
  value: number
  iconSize: number
  filledIcon: string
  emptyIcon: string
  filledColor: string
  emptyColor: string
  allowHalf: boolean
  readonly: boolean
  disabled: boolean
  haptic: HapticStyle
  onRate: (v: number) => void
  testID?: string
}>(({
  index,
  value,
  iconSize,
  filledIcon,
  emptyIcon,
  filledColor,
  emptyColor,
  allowHalf,
  readonly,
  disabled,
  haptic,
  onRate,
  testID,
}) => {
  const scale = useSharedValue(1)
  const starIndex = index + 1

  const isFull = value >= starIndex
  const isHalf = allowHalf && !isFull && value >= starIndex - 0.5

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = useCallback(() => {
    if (readonly || disabled) return
    triggerHaptic(haptic)
    scale.value = withSpring(1.3, { damping: 8, stiffness: 300 })
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 200 })
    }, 100)

    if (allowHalf) {
      // Tap on a filled star to set half, tap on half to unfill
      if (isFull) {
        onRate(starIndex - 0.5)
      } else if (isHalf) {
        onRate(starIndex - 1)
      } else {
        onRate(starIndex)
      }
    } else {
      // Toggle: if already this value, go to one less
      onRate(value === starIndex ? starIndex - 1 : starIndex)
    }
  }, [readonly, disabled, haptic, value, starIndex, allowHalf, isFull, isHalf, onRate])

  let iconName: string
  let iconColor: string
  if (isFull) {
    iconName = filledIcon
    iconColor = filledColor
  } else if (isHalf) {
    iconName = 'star-half'
    iconColor = filledColor
  } else {
    iconName = emptyIcon
    iconColor = emptyColor
  }

  if (readonly || disabled) {
    return (
      <View style={{ padding: 1 }} testID={testID}>
        <Ionicons name={iconName as any} size={iconSize} color={iconColor} />
      </View>
    )
  }

  return (
    <Pressable onPress={handlePress} hitSlop={2} testID={testID}>
      <Animated.View style={[{ padding: 1 }, animStyle]}>
        <Ionicons name={iconName as any} size={iconSize} color={iconColor} />
      </Animated.View>
    </Pressable>
  )
})

Star.displayName = 'RatingStar'

export const Rating = React.memo<RatingProps>(({
  value,
  onChange,
  maxStars = 5,
  size = 'md',
  readonly = false,
  allowHalf = false,
  icon = 'star',
  emptyIcon = 'star-outline',
  color,
  emptyColor,
  showValue = false,
  haptic = 'light',
  disabled = false,
  accessibilityLabel,
  style,
  testID,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const dims = sizeMap[size]

  const filledColor = color ?? '#f59e0b'
  const emptyStarColor = emptyColor ?? (theme.colors.muted + '60')

  const handleRate = useCallback((v: number) => {
    onChange?.(v)
  }, [onChange])

  const stars = Array.from({ length: maxStars }, (_, i) => i)

  return (
    <View
      style={[
        styles.container,
        { gap: dims.gap },
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel ?? `Rating: ${value} of ${maxStars} stars`}
      accessibilityValue={{ min: 0, max: maxStars, now: value }}
      testID={testID}
    >
      <View style={[styles.starsRow, { gap: dims.gap }]}>
        {stars.map((i) => (
          <Star
            key={i}
            index={i}
            value={value}
            iconSize={dims.icon}
            filledIcon={icon}
            emptyIcon={emptyIcon}
            filledColor={filledColor}
            emptyColor={emptyStarColor}
            allowHalf={allowHalf}
            readonly={readonly}
            disabled={disabled}
            haptic={haptic}
            onRate={handleRate}
            testID={testID ? `${testID}-star-${i}` : undefined}
          />
        ))}
      </View>
      {showValue && (
        <Text style={{ fontSize: dims.fontSize, ...fontStyle(theme.typography, 'semibold'), color: theme.colors.foreground, marginStart: 4 }}>
          {allowHalf ? value.toFixed(1) : value}
        </Text>
      )}
    </View>
  )
})

Rating.displayName = 'Rating'
