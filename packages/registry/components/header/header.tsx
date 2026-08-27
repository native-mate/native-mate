// native-mate: header@0.1.0 | hash:PLACEHOLDER
import React, { useCallback } from 'react'
import { View, Pressable, Platform, StatusBar } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  useDerivedValue,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle, directionalIcon } from '@native-mate/core'
import type { HeaderProps, HeaderAction, HapticStyle } from './header.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const triggerHaptic = (style: HapticStyle) => {
  if (!Haptics || style === 'none') return
  const map = { light: 'Light', medium: 'Medium', heavy: 'Heavy' } as const
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[map[style]])
}

const DEFAULT_TOP_INSET = Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight ?? 24)
const LARGE_TITLE_HEIGHT = 52
const COLLAPSE_DISTANCE = 80

const useStyles = makeStyles((theme) => ({
  container: {
    zIndex: 100,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    height: 44,
    gap: theme.spacing.xs,
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  largeTitleWrap: {
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing.sm,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
}))

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const IconButton: React.FC<{
  icon: string
  onPress: () => void
  color: string
  haptic: HapticStyle
  accessibilityLabel?: string
}> = ({ icon, onPress, color, haptic, accessibilityLabel }) => {
  const styles = useStyles()
  const scale = useSharedValue(1)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.85, { damping: 15, stiffness: 300 })
    triggerHaptic(haptic)
  }, [haptic])

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 })
  }, [])

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={6}
      style={[styles.iconBtn, animStyle]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? icon}
    >
      <Ionicons name={icon as any} size={22} color={color} />
    </AnimatedPressable>
  )
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  // "Back" points toward the start edge, which is the right edge under RTL.
  leftIcon = directionalIcon('chevron-back', 'chevron-forward'),
  onLeftPress,
  hideLeft = false,
  rightActions = [],
  transparent = false,
  largeTitle = false,
  scrollY,
  haptic = 'light',
  backgroundColor,
  titleColor,
  topInset,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const safeTop = topInset ?? DEFAULT_TOP_INSET
  const bgColor = backgroundColor ?? (transparent ? 'transparent' : theme.colors.background)
  const fgColor = titleColor ?? theme.colors.foreground

  const scrollProgress = useDerivedValue(() => {
    if (!scrollY) return 0
    return Math.min(Math.max(scrollY.value / COLLAPSE_DISTANCE, 0), 1)
  }, [scrollY])

  const largeTitleStyle = useAnimatedStyle(() => {
    if (!largeTitle) return {}
    const height = interpolate(
      scrollProgress.value,
      [0, 1],
      [LARGE_TITLE_HEIGHT, 0],
      Extrapolation.CLAMP,
    )
    const opacity = interpolate(
      scrollProgress.value,
      [0, 0.6],
      [1, 0],
      Extrapolation.CLAMP,
    )
    const translateY = interpolate(
      scrollProgress.value,
      [0, 1],
      [0, -10],
      Extrapolation.CLAMP,
    )
    return { height, opacity, transform: [{ translateY }] }
  })

  const inlineTitleOpacity = useAnimatedStyle(() => {
    if (!largeTitle) return { opacity: 1 }
    const opacity = interpolate(
      scrollProgress.value,
      [0.5, 1],
      [0, 1],
      Extrapolation.CLAMP,
    )
    return { opacity }
  })

  const borderOpacity = useAnimatedStyle(() => {
    if (transparent) return { opacity: 0 }
    if (!largeTitle || !scrollY) return { opacity: 1 }
    return {
      opacity: interpolate(
        scrollProgress.value,
        [0.8, 1],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    }
  })

  return (
    <View style={[styles.container, { backgroundColor: bgColor, paddingTop: safeTop }, style]}>
      {/* Main bar */}
      <View style={styles.bar}>
        {/* Left */}
        {!hideLeft ? (
          <IconButton
            icon={leftIcon}
            onPress={onLeftPress ?? (() => {})}
            color={fgColor}
            haptic={haptic}
            accessibilityLabel="Go back"
          />
        ) : (
          <View style={{ width: 36 }} />
        )}

        {/* Center title */}
        <Animated.View style={[styles.titleWrap, inlineTitleOpacity]}>
          <Text
            variant="label"
            numberOfLines={1}
            style={{ color: fgColor, fontSize: 16, ...fontStyle(theme.typography, 'semibold') }}
          >
            {title}
          </Text>
          {subtitle && !largeTitle && (
            <Text
              variant="caption"
              numberOfLines={1}
              style={{ color: fgColor, opacity: 0.6, fontSize: 11, marginTop: -1 }}
            >
              {subtitle}
            </Text>
          )}
        </Animated.View>

        {/* Right actions */}
        <View style={styles.rightActions}>
          {rightActions.map((action: HeaderAction, i: number) => (
            <IconButton
              key={`${action.icon}-${i}`}
              icon={action.icon}
              onPress={action.onPress}
              color={fgColor}
              haptic={haptic}
              accessibilityLabel={action.accessibilityLabel}
            />
          ))}
          {rightActions.length === 0 && <View style={{ width: 36 }} />}
        </View>
      </View>

      {/* Large title area */}
      {largeTitle && (
        <Animated.View style={[styles.largeTitleWrap, largeTitleStyle]}>
          <Text
            variant="heading"
            numberOfLines={1}
            style={{ color: fgColor, fontSize: 32, ...fontStyle(theme.typography, 'bold'), letterSpacing: -0.5 }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              variant="body"
              numberOfLines={1}
              style={{ color: fgColor, opacity: 0.6, fontSize: 14, marginTop: 2 }}
            >
              {subtitle}
            </Text>
          )}
        </Animated.View>
      )}

      {/* Bottom border */}
      <Animated.View
        style={[
          {
            height: 1,
            backgroundColor: theme.colors.border,
          },
          borderOpacity,
        ]}
      />
    </View>
  )
}
