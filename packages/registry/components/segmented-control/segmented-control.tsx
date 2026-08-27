// native-mate: segmented-control@0.1.0 | hash:PLACEHOLDER
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import {
  useTheme,
  useMotion,
  useDirection,
  Text,
  makeStyles,
  fontStyle,
  useHaptics,
} from '@native-mate/core'
import type { SegmentedControlProps } from './segmented-control.types'

const sizeMap = {
  sm: { py: 4, px: 10, fontSize: 12, containerPadding: 2, height: 30 },
  md: { py: 6, px: 14, fontSize: 14, containerPadding: 3, height: 38 },
  lg: { py: 8, px: 18, fontSize: 16, containerPadding: 4, height: 46 },
}

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'row',
    borderRadius: theme.radius.lg,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    // Anchored at the start edge and moved with a translateX worklet; RN
    // mirrors `start` under RTL and the translation carries the direction sign.
    start: 0,
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
  const motion = useMotion()
  const direction = useDirection()
  const styles = useStyles()
  const haptics = useHaptics()
  const sz = sizeMap[size]

  // Per-segment layouts live in a ref: `onLayout` fires once per segment, and a
  // setState per callback used to cost one re-render per segment on mount. The
  // only value React needs is the indicator's *rendered* width, committed once
  // (below) after every segment has reported.
  const segLayouts = useRef<Record<string, { x: number; width: number }>>({})
  const [baseWidth, setBaseWidth] = useState(0)

  // The indicator is laid out once at `baseWidth` and then driven purely on the
  // compositor: translateX moves it, scaleX sizes it. Animating `left`/`width`
  // instead re-ran layout on the whole control every single frame.
  const indicatorTX = useSharedValue(0)
  const indicatorSX = useSharedValue(0)

  const bgColor = backgroundColor ?? theme.colors.surface
  const indColor = indicatorColor ?? (theme.colors.surfaceRaised ?? theme.colors.background)

  const dirSign = direction.sign

  // scaleX scales about the element's centre, so the translation targets the
  // selected segment's centre rather than its start edge.
  const moveIndicator = useCallback(
    (base: number) => {
      const layout = segLayouts.current[selectedKey]
      if (!base || !layout) return
      const spring = motion.spring()
      indicatorTX.value = withSpring(
        dirSign * (layout.x + layout.width / 2 - base / 2),
        spring
      )
      indicatorSX.value = withSpring(layout.width / base, spring)
    },
    [selectedKey, dirSign, motion]
  )

  const handleLayout = (key: string, x: number, width: number) => {
    segLayouts.current[key] = { x, width }
    // Only commit once every *current* segment has reported, so a changed
    // `segments` list cannot be satisfied by leftover entries from the old one.
    const measured = segments
      .map((s) => segLayouts.current[s.key])
      .filter(Boolean) as Array<{ x: number; width: number }>
    if (measured.length === segments.length) {
      const widest = Math.max(...measured.map((l) => l.width))
      // Single batched commit; React bails out when the value is unchanged.
      setBaseWidth((prev) => (prev === widest ? prev : widest))
    }
    if (key === selectedKey) moveIndicator(baseWidth)
  }

  useEffect(() => {
    moveIndicator(baseWidth)
  }, [selectedKey, baseWidth, moveIndicator])

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: indicatorTX.value },
      { scaleX: indicatorSX.value },
    ],
  }))

  // sm/md segments are 30–38pt tall; extend the touch target vertically to
  // 44pt without changing the rendered height. Horizontal slop is left at its
  // 0 default because segments are flush neighbours and would otherwise steal
  // each other's taps.
  const segmentHitSlop = {
    top: Math.max(0, Math.ceil((44 - sz.height) / 2)),
    bottom: Math.max(0, Math.ceil((44 - sz.height) / 2)),
  }

  const handlePress = (key: string) => {
    if (disabled) return
    haptics.trigger(haptic)
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
            width: baseWidth,
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
            hitSlop={segmentHitSlop}
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
                ...fontStyle(theme.typography, isSelected ? 'semibold' : 'medium'),
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
