import React, { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { useTheme } from '../../theme/useTheme'
import type { SpinnerProps } from './Spinner.types'

const sizes = { sm: 16, md: 24, lg: 32 }

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color }) => {
  const theme = useTheme()
  const rotation = useSharedValue(0)
  const px = sizes[size]
  const spinnerColor = color ?? theme.colors.primary

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
      false,
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  return (
    <View style={{ width: px, height: px }}>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: px,
            height: px,
            borderRadius: px / 2,
            borderWidth: 2,
            borderColor: spinnerColor,
            borderTopColor: 'transparent',
          },
        ]}
      />
    </View>
  )
}
