// native-mate: tag@0.1.0 | hash:71f4cd8c91d6ebc2
import React, { useCallback } from 'react'
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
import type { TagProps, TagGroupProps, TagVariant } from './tag.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

// Each variant: [activeColor, activeBg, activeText] - used when selected
const variantPalette: Record<TagVariant, [string, string, string]> = {
  default:     ['',        '',           ''],  // theme-driven
  primary:     ['#6366f1', '#6366f118', '#6366f1'],
  success:     ['#22c55e', '#22c55e18', '#22c55e'],
  warning:     ['#f59e0b', '#f59e0b18', '#f59e0b'],
  destructive: ['#ef4444', '#ef444418', '#ef4444'],
  info:        ['#3b82f6', '#3b82f618', '#3b82f6'],
}

const sizeMap = {
  sm: { py: 3,  px: 9,  fontSize: 11, iconSize: 12, removeSize: 14 },
  md: { py: 5,  px: 12, fontSize: 13, iconSize: 14, removeSize: 16 },
  lg: { py: 7,  px: 16, fontSize: 15, iconSize: 16, removeSize: 18 },
}

export const Tag: React.FC<TagProps> = ({
  label,
  selected = false,
  onPress,
  onRemove,
  variant = 'default',
  icon,
  disabled = false,
  size = 'md',
  style,
}) => {
  const theme = useTheme()
  const sz = sizeMap[size]

  // Resolve colors
  const [activeColor, activeBg, activeText] = variantPalette[variant]
  const resolvedActiveColor = variant === 'default' ? theme.colors.primary : activeColor
  const resolvedActiveBg    = variant === 'default' ? theme.colors.primary + '18' : activeBg
  const resolvedActiveText  = variant === 'default' ? theme.colors.primary : activeText
  const idleBg              = theme.colors.surface
  const idleText            = theme.colors.foreground
  const idleBorder          = theme.colors.border

  const anim = useSharedValue(selected ? 1 : 0)
  const scale = useSharedValue(1)

  React.useEffect(() => {
    anim.value = withTiming(selected ? 1 : 0, { duration: 180 })
  }, [selected])

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(anim.value, [0, 1], [idleBg, resolvedActiveBg]),
    borderColor: interpolateColor(anim.value, [0, 1], [idleBorder, resolvedActiveColor]),
    transform: [{ scale: scale.value }],
  }))

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(anim.value, [0, 1], [idleText, resolvedActiveText]),
  }))

  const handlePress = useCallback(() => {
    if (disabled) return
    Haptics?.impactAsync(Haptics?.ImpactFeedbackStyle?.Light)
    scale.value = withSpring(0.94, { mass: 0.3, damping: 10 }, () => {
      scale.value = withSpring(1, { mass: 0.3, damping: 12 })
    })
    onPress?.()
  }, [disabled, onPress])

  const handleRemove = useCallback(() => {
    if (disabled) return
    scale.value = withSpring(0.8, { mass: 0.3, damping: 10 }, () => {
      scale.value = withSpring(1, { mass: 0.3, damping: 12 })
    })
    onRemove?.()
  }, [disabled, onRemove])

  const inner = (
    <Animated.View style={[{
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: 9999,
      borderWidth: 1,
      paddingVertical: sz.py,
      paddingLeft: sz.px,
      paddingRight: onRemove ? sz.px - 4 : sz.px,
      gap: 5,
      opacity: disabled ? 0.45 : 1,
    }, containerStyle, style]}>
      {icon && <View style={{ opacity: selected ? 1 : 0.7 }}>{icon}</View>}
      <Animated.Text style={[{ fontSize: sz.fontSize, fontWeight: selected ? '600' : '500', letterSpacing: 0.1 }, textStyle]}>
        {label}
      </Animated.Text>
      {onRemove && !disabled && (
        <Pressable onPress={handleRemove} hitSlop={8}>
          <Ionicons name="close" size={sz.removeSize} color={selected ? resolvedActiveText : idleText} style={{ opacity: 0.7 }} />
        </Pressable>
      )}
    </Animated.View>
  )

  if (!onPress) return inner

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      {inner}
    </Pressable>
  )
}

export const TagGroup: React.FC<TagGroupProps> = ({
  tags,
  multiSelect = false,
  selected = [],
  onChange,
  style,
}) => {
  const handlePress = (label: string) => {
    if (multiSelect) {
      const next = selected.includes(label)
        ? selected.filter((l) => l !== label)
        : [...selected, label]
      onChange?.(next)
    } else {
      onChange?.(selected.includes(label) ? [] : [label])
    }
  }

  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, style]}>
      {tags.map((tag) => (
        <Tag
          key={tag.label}
          {...tag}
          selected={selected.includes(tag.label)}
          onPress={() => handlePress(tag.label)}
        />
      ))}
    </View>
  )
}
