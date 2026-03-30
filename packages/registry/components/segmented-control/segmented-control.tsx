// native-mate: segmented-control@0.1.0 | hash:PLACEHOLDER
import React, { useState, useEffect } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { SegmentedControlProps } from './segmented-control.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const sizeMap = {
  sm: { py: 4, px: 10, fontSize: 12, containerPadding: 2, height: 30 },
  md: { py: 6, px: 14, fontSize: 14, containerPadding: 3, height: 38 },
  lg: { py: 8, px: 18, fontSize: 16, containerPadding: 4, height: 46 },
}

const SPRING = { damping: 18, stiffness: 200, mass: 0.7 }

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'row',
    borderRadius: theme.radius.lg,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    borderRadius: theme.radius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 1,
  },
}))

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  selectedKey,
  onChange,
  size = 'md',
  fullWidth = true,
  disabled = false,
  haptic = true,
  backgroundColor,
  indicatorColor,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const sz = sizeMap[size]

  const [segLayouts, setSegLayouts] = useState<Record<string, { x: number; width: number }>>({})
  const indicatorX = useSharedValue(0)
  const indicatorW = useSharedValue(0)

  const bgColor = backgroundColor ?? theme.colors.surface
  const indColor = indicatorColor ?? (theme.colors.surfaceRaised ?? theme.colors.background)

  const handleLayout = (key: string, x: number, width: number) => {
    setSegLayouts((prev) => ({ ...prev, [key]: { x, width } }))
    if (key === selectedKey) {
      indicatorX.value = withSpring(x, SPRING)
      indicatorW.value = withSpring(width, SPRING)
    }
  }

  useEffect(() => {
    const layout = segLayouts[selectedKey]
    if (layout) {
      indicatorX.value = withSpring(layout.x, SPRING)
      indicatorW.value = withSpring(layout.width, SPRING)
    }
  }, [selectedKey, segLayouts])

  const indicatorStyle = useAnimatedStyle(() => ({
    left: indicatorX.value,
    width: indicatorW.value,
  }))

  const handlePress = (key: string) => {
    if (disabled) return
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onChange(key)
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          padding: sz.containerPadding,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      accessibilityRole="tablist"
    >
      {/* Sliding indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: indColor,
            top: sz.containerPadding,
            bottom: sz.containerPadding,
          },
          indicatorStyle,
        ]}
      />

      {segments.map((segment) => {
        const isSelected = segment.key === selectedKey
        return (
          <Pressable
            key={segment.key}
            style={[
              styles.segment,
              {
                flex: fullWidth ? 1 : undefined,
                paddingVertical: sz.py,
                paddingHorizontal: sz.px,
                minHeight: sz.height,
              },
            ]}
            onPress={() => handlePress(segment.key)}
            onLayout={(e) =>
              handleLayout(
                segment.key,
                e.nativeEvent.layout.x,
                e.nativeEvent.layout.width
              )
            }
            disabled={disabled}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected, disabled }}
            accessibilityLabel={segment.label}
          >
            {segment.icon && (
              <View style={{ opacity: isSelected ? 1 : 0.55 }}>
                {segment.icon}
              </View>
            )}
            <Text
              style={{
                fontSize: sz.fontSize,
                fontWeight: isSelected ? '600' : '500',
                color: isSelected ? theme.colors.foreground : theme.colors.muted,
              }}
            >
              {segment.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
