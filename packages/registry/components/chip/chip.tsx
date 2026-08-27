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
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
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

const AnimatedView = Animated.View

export const Chip = React.memo<ChipProps>(({
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
  testID,
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

  // Chips are 28–34pt tall, well under the 44pt minimum touch target. hitSlop
  // extends the *touchable* area without altering the rendered size. Horizontal
  // slop is kept small so adjacent chips in a ChipGroup can't steal each
  // other's taps.
  const chipHitSlop = {
    top: Math.max(0, Math.ceil((44 - dims.height) / 2)),
    bottom: Math.max(0, Math.ceil((44 - dims.height) / 2)),
    left: 4,
    right: 4,
  }

  // Close icon is 14–16pt; slop reaches ~44pt while biasing away from the label
  // so the main press target isn't swallowed.
  const closeHitSlop = {
    top: Math.max(0, Math.ceil((44 - dims.closeSize) / 2)),
    bottom: Math.max(0, Math.ceil((44 - dims.closeSize) / 2)),
    left: 10,
    right: Math.max(0, 44 - dims.closeSize - 10),
  }

  const handleClose = useCallback(() => {
    triggerHaptic(haptic)
    onClose?.()
  }, [haptic, onClose])

  return (
    <AnimatedView
      testID={testID}
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
      {/* Main pressable content — the close button below is a sibling, not a
          descendant, so the parent's press-in scale/haptic can't be stolen by it. */}
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        hitSlop={chipHitSlop}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected, disabled }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
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
          style={{ fontSize: dims.fontSize, ...fontStyle(theme.typography, 'medium'), color: textColor }}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Pressable>

      {/* Close button — sibling of the main Pressable, outside its subtree */}
      {closable && (
        <Pressable
          onPress={handleClose}
          hitSlop={closeHitSlop}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          testID={testID ? `${testID}-close` : undefined}
        >
          <Ionicons name="close-circle" size={dims.closeSize} color={iconColor} style={{ opacity: 0.7 }} />
        </Pressable>
      )}
    </AnimatedView>
  )
})

Chip.displayName = 'Chip'

export const ChipGroup: React.FC<ChipGroupProps> = ({
  children,
  wrap = true,
  gap = 8,
  style,
  testID,
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
    testID={testID}
  >
    {children}
  </View>
)
