// native-mate: chip@0.1.0 | hash:PLACEHOLDER
import React, { useCallback, useEffect } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { ChipProps, ChipGroupProps, HapticStyle } from './chip.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const triggerHaptic = (style: HapticStyle) => {
  if (!Haptics || style === 'none') return
  const map = { light: 'Light', medium: 'Medium', heavy: 'Heavy' } as const
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[map[style]])
}

const sizeMap = {
  sm: { height: 28, px: 10, fontSize: 12, iconSize: 14, closeSize: 14 },
  md: { height: 34, px: 14, fontSize: 14, iconSize: 16, closeSize: 16 },
}

const useStyles = makeStyles((theme) => ({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
}))

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  variant = 'outlined',
  size = 'md',
  icon,
  avatar,
  closable = false,
  onClose,
  disabled = false,
  color,
  haptic = 'light',
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const dims = sizeMap[size]

  const selectionProgress = useSharedValue(selected ? 1 : 0)
  const scale = useSharedValue(1)

  const accentColor = color ?? theme.colors.primary

  useEffect(() => {
    selectionProgress.value = withSpring(selected ? 1 : 0, {
      damping: 16,
      stiffness: 240,
    })
  }, [selected])

  const filledAnimStyle = useAnimatedStyle(() => {
    if (variant === 'filled') {
      const backgroundColor = interpolateColor(
        selectionProgress.value,
        [0, 1],
        [theme.colors.surface, accentColor],
      )
      return {
        backgroundColor,
        transform: [{ scale: scale.value }],
      }
    }
    // outlined
    const backgroundColor = interpolateColor(
      selectionProgress.value,
      [0, 1],
      ['transparent', accentColor + '18'],
    )
    const borderColor = interpolateColor(
      selectionProgress.value,
      [0, 1],
      [theme.colors.border, accentColor],
    )
    return {
      backgroundColor,
      borderColor,
      borderWidth: 1,
      transform: [{ scale: scale.value }],
    }
  })

  const textColor = variant === 'filled' && selected
    ? theme.colors.onPrimary
    : selected
      ? accentColor
      : theme.colors.foreground

  const iconColor = variant === 'filled' && selected
    ? theme.colors.onPrimary
    : selected
      ? accentColor
      : theme.colors.muted

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.93, { damping: 15, stiffness: 300 })
    triggerHaptic(haptic)
  }, [haptic])

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 })
  }, [])

  const handleClose = useCallback(() => {
    triggerHaptic(haptic)
    onClose?.()
  }, [haptic, onClose])

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      style={[
        styles.chip,
        {
          height: dims.height,
          paddingLeft: avatar ? 4 : dims.px,
          paddingRight: closable ? 6 : dims.px,
          gap: 6,
        },
        variant === 'outlined' && !selected && {
          borderWidth: 1,
          borderColor: theme.colors.border,
        },
        disabled && styles.disabled,
        filledAnimStyle,
        style,
      ]}
    >
      {/* Avatar */}
      {avatar && (
        <View style={{ marginRight: -2 }}>{avatar}</View>
      )}

      {/* Icon */}
      {icon && !avatar && (
        <Ionicons name={icon as any} size={dims.iconSize} color={iconColor} />
      )}

      {/* Checkmark for selected state */}
      {selected && !icon && !avatar && (
        <Ionicons name="checkmark" size={dims.iconSize} color={iconColor} />
      )}

      {/* Label */}
      <Text
        style={{ fontSize: dims.fontSize, fontWeight: '500', color: textColor }}
        numberOfLines={1}
      >
        {label}
      </Text>

      {/* Close button */}
      {closable && (
        <Pressable onPress={handleClose} hitSlop={4} accessibilityLabel={`Remove ${label}`}>
          <Ionicons name="close-circle" size={dims.closeSize} color={iconColor} style={{ opacity: 0.7 }} />
        </Pressable>
      )}
    </AnimatedPressable>
  )
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  children,
  wrap = true,
  gap = 8,
  style,
}) => (
  <View
    style={[
      {
        flexDirection: 'row',
        flexWrap: wrap ? 'wrap' : 'nowrap',
        gap,
      },
      style,
    ]}
    accessibilityRole="radiogroup"
  >
    {children}
  </View>
)
