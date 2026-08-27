// native-mate: badge@0.3.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle, useStrings } from '@native-mate/core'
import type { BadgeProps, BadgeVariant, BadgeSize, BadgeAppearance } from './badge.types'

function getColors(variant: BadgeVariant, appearance: BadgeAppearance, theme: any) {
  let baseColor: string
  let onColor: string
  switch (variant) {
    case 'default':     baseColor = theme.colors.primary; onColor = theme.colors.onPrimary; break
    case 'secondary':   baseColor = theme.colors.muted;   onColor = theme.colors.background; break
    case 'destructive': baseColor = theme.colors.destructive; onColor = theme.colors.onDestructive; break
    case 'success':     baseColor = theme.colors.success; onColor = theme.colors.onSuccess; break
    case 'warning':     baseColor = theme.colors.warning; onColor = theme.colors.onWarning; break
    case 'info':        baseColor = theme.colors.info; onColor = theme.colors.onInfo; break
    default:            baseColor = theme.colors.primary; onColor = theme.colors.onPrimary
  }

  switch (appearance) {
    case 'solid':
      return { bg: baseColor, text: onColor, border: 'transparent' }
    case 'soft':
      // Mirror Alert's style: tinted bg + subtle border + full-color text
      return { bg: baseColor + '18', text: baseColor, border: baseColor + '40' }
    case 'outline':
      return { bg: 'transparent', text: baseColor, border: baseColor }
    default:
      return { bg: baseColor + '18', text: baseColor, border: baseColor + '40' }
  }
}

const sizeMap: Record<BadgeSize, { py: number; px: number; fontSize: number; dotSize: number; gap: number }> = {
  sm: { py: 2,  px: 7,  fontSize: 10, dotSize: 5, gap: 4 },
  md: { py: 3,  px: 9,  fontSize: 11, dotSize: 6, gap: 5 },
  lg: { py: 4,  px: 12, fontSize: 13, dotSize: 7, gap: 6 },
}

/** Spoken prefix conveying the variant's meaning to a screen reader. */
const variantMeaning: Record<BadgeVariant, string> = {
  default: '',
  secondary: '',
  destructive: 'Error',
  success: 'Success',
  warning: 'Warning',
  info: 'Info',
}

function PulseDot({ color, size }: { color: string; size: number }) {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.6, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1, false,
    )
    opacity.value = withRepeat(
      withSequence(withTiming(0.3, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1, false,
    )
  }, [])
  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))
  return (
    <View style={{ width: size + 4, height: size + 4, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[{
        position: 'absolute',
        width: size + 4, height: size + 4, borderRadius: (size + 4) / 2,
        backgroundColor: color, opacity: 0.35,
      }, outerStyle]} />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
    </View>
  )
}

export const Badge = React.memo<BadgeProps>(({
  variant = 'default',
  size = 'md',
  appearance = 'soft',
  dot = false,
  pulse = false,
  icon,
  count,
  maxCount = 99,
  onDismiss,
  children,
  accessibilityLabel,
  testID,
}) => {
  const theme = useTheme()
  const strings = useStrings()
  const colors = getColors(variant, appearance, theme)
  const sz = sizeMap[size]

  const label = count !== undefined
    ? count > maxCount ? `${maxCount}+` : String(count)
    : children

  // Screen-reader label: variant meaning + the badge's textual content.
  // `children` is only read when it is plain text — arbitrary nodes are skipped.
  const spokenContent = count !== undefined
    ? (count > maxCount ? `More than ${maxCount}` : String(count))
    : (typeof children === 'string' || typeof children === 'number' ? String(children) : '')
  const meaning = variantMeaning[variant] ?? ''
  const composedLabel = accessibilityLabel
    ?? (meaning && spokenContent
      ? `${meaning}: ${spokenContent}`
      : meaning || spokenContent || undefined)

  // When dismissible the close button must stay its own a11y node, so the
  // container is not collapsed; the label then rides on the Text instead.
  return (
    <View
      testID={testID}
      accessible={!onDismiss}
      accessibilityRole="text"
      accessibilityLabel={onDismiss ? undefined : composedLabel}
      style={{
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: 9999,
      paddingVertical: sz.py,
      paddingHorizontal: sz.px,
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.border !== 'transparent' ? colors.border : 'transparent',
      gap: sz.gap,
    }}>
      {icon && <View>{icon}</View>}
      {(dot || pulse) && (
        pulse
          ? <PulseDot color={colors.text} size={sz.dotSize} />
          : <View style={{ width: sz.dotSize, height: sz.dotSize, borderRadius: sz.dotSize / 2, backgroundColor: colors.text, opacity: 0.85 }} />
      )}
      <Text
        accessibilityRole="text"
        accessibilityLabel={onDismiss ? composedLabel : undefined}
        style={{ fontSize: sz.fontSize, ...fontStyle(theme.typography, 'semibold'), color: colors.text, letterSpacing: 0.2, lineHeight: sz.fontSize + 4 }}>
        {label}
      </Text>
      {onDismiss && (
        <Pressable
          onPress={onDismiss}
          hitSlop={16}
          accessibilityRole="button"
          accessibilityLabel={spokenContent ? `${strings.dismiss} ${spokenContent}` : strings.dismiss}
          style={{ marginLeft: -2 }}>
          <Ionicons name="close" size={sz.fontSize + 2} color={colors.text} style={{ opacity: 0.6 }} />
        </Pressable>
      )}
    </View>
  )
})

Badge.displayName = 'Badge'
