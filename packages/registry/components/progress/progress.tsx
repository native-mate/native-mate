// native-mate: progress@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useTheme, makeStyles } from '@native-mate/core'
import type { ProgressProps } from './progress.types'

const useStyles = makeStyles((theme) => ({
  track: { height: 8, borderRadius: theme.radius.full, backgroundColor: theme.colors.surface, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: theme.radius.full },
}))

export const Progress: React.FC<ProgressProps> = ({ value, animated = true, color, accessibilityLabel }) => {
  const theme = useTheme()
  const styles = useStyles()
  const clampedValue = Math.min(100, Math.max(0, value))

  const animatedStyle = useAnimatedStyle(() => ({
    width: animated
      ? withTiming(`${clampedValue}%` as any, { duration: theme.animation.speed.normal })
      : (`${clampedValue}%` as any),
  }))

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: clampedValue }}
    >
      <Animated.View style={[styles.fill, { backgroundColor: color ?? theme.colors.primary }, animatedStyle]} />
    </View>
  )
}
