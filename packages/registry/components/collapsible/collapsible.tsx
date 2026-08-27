// native-mate: collapsible@0.1.0 | hash:PLACEHOLDER
import React, { useState, useCallback, useRef } from 'react'
import { View, Pressable, LayoutChangeEvent } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { CollapsibleProps } from './collapsible.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  container: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    minHeight: 44,
  },
  headerTitle: {
    flex: 1,
  },
  content: {
    overflow: 'hidden',
  },
  hiddenMeasurer: {
    position: 'absolute',
    top: -9999,
    start: 0,
    end: 0,
    opacity: 0,
  },
}))

export const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  icon,
  headerStyle,
  titleStyle,
  animationDuration = 250,
  haptic = true,
  disabled = false,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const isControlled = controlledOpen !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isControlled ? controlledOpen : internalOpen

  const [contentHeight, setContentHeight] = useState(0)
  const heightAnim = useSharedValue(isOpen ? 0 : 0)
  const opacityAnim = useSharedValue(isOpen ? 1 : 0)
  const rotation = useSharedValue(isOpen ? 180 : 0)

  const timing = { duration: animationDuration, easing: Easing.out(Easing.cubic) }

  const hasMeasuredRef = useRef(false)

  const handleMeasure = useCallback(
    (e: LayoutChangeEvent) => {
      const h = Math.ceil(e.nativeEvent.layout.height)
      if (h > 0 && h !== contentHeight) {
        if (!hasMeasuredRef.current && isOpen) {
          heightAnim.value = h
        }
        hasMeasuredRef.current = true
        setContentHeight(h)
      }
    },
    [contentHeight, isOpen]
  )

  React.useEffect(() => {
    rotation.value = withTiming(isOpen ? 180 : 0, timing)
    opacityAnim.value = withTiming(isOpen ? 1 : 0, {
      duration: isOpen ? animationDuration : animationDuration * 0.6,
    })
    if (isOpen && contentHeight > 0) {
      heightAnim.value = withTiming(contentHeight, timing)
    } else if (!isOpen) {
      heightAnim.value = withTiming(0, timing)
    }
  }, [isOpen, contentHeight])

  const toggle = useCallback(() => {
    if (disabled) return
    if (haptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    const newVal = !isOpen
    if (!isControlled) {
      setInternalOpen(newVal)
    }
    onToggle?.(newVal)
  }, [disabled, haptic, isOpen, isControlled, onToggle])

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  const collapseStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
    opacity: opacityAnim.value,
    overflow: 'hidden' as const,
  }))

  const contentBody = (
    <View style={{ paddingTop: 4, paddingBottom: 12, paddingHorizontal: 4 }}>
      {children}
    </View>
  )

  return (
    <View
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}
    >
      {/* Header */}
      <Pressable
        style={[styles.header, headerStyle]}
        onPress={toggle}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen, disabled }}
        accessibilityLabel={
          typeof title === 'string'
            ? `${title}, ${isOpen ? 'expanded' : 'collapsed'}`
            : isOpen
              ? 'Expanded section'
              : 'Collapsed section'
        }
      >
        <View style={styles.headerTitle}>
          {typeof title === 'string' ? (
            <Text
              variant="label"
              style={[
                {
                  fontSize: 15,
                  ...fontStyle(theme.typography, 'semibold'),
                  color: theme.colors.foreground,
                },
                titleStyle,
              ]}
            >
              {title}
            </Text>
          ) : (
            title
          )}
        </View>

        {icon ?? (
          <Animated.View style={chevronStyle}>
            <Ionicons
              name="chevron-down"
              size={18}
              color={theme.colors.muted}
            />
          </Animated.View>
        )}
      </Pressable>

      {/* Hidden measurer */}
      <View
        style={styles.hiddenMeasurer}
        pointerEvents="none"
        onLayout={handleMeasure}
      >
        {contentBody}
      </View>

      {/* Animated content */}
      <Animated.View style={collapseStyle}>
        {contentBody}
      </Animated.View>
    </View>
  )
}
