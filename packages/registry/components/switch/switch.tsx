// native-mate: switch@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated'
import { useTheme } from '@native-mate/core'
import type { SwitchProps } from './switch.types'

const TRACK_W = 50, TRACK_H = 28, THUMB = 22, PADDING = 3

export const Switch: React.FC<SwitchProps> = ({ value, onValueChange, disabled = false, accessibilityLabel }) => {
  const theme = useTheme()
  const progress = useSharedValue(value ? 1 : 0)

  React.useEffect(() => { progress.value = withSpring(value ? 1 : 0, theme.animation.easing.spring) }, [value])

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(progress.value * (TRACK_W - THUMB - PADDING * 2), theme.animation.easing.spring) }],
  }))

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [theme.colors.border, theme.colors.primary]),
  }))

  return (
    <Pressable onPress={() => !disabled && onValueChange(!value)} accessibilityRole="switch" accessibilityLabel={accessibilityLabel} accessibilityState={{ checked: value, disabled }}>
      <Animated.View style={[{ width: TRACK_W, height: TRACK_H, borderRadius: TRACK_H / 2, padding: PADDING, justifyContent: 'center', opacity: disabled ? 0.5 : 1 }, trackStyle]}>
        <Animated.View style={[{ width: THUMB, height: THUMB, borderRadius: THUMB / 2, backgroundColor: '#fff' }, thumbStyle]} />
      </Animated.View>
    </Pressable>
  )
}
