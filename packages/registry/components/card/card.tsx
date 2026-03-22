// native-mate: card@0.3.0 | hash:PLACEHOLDER
import React from 'react'
import { View, Pressable, Image } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useTheme, Text, Separator, makeStyles, shadow } from '@native-mate/core'
import { Skeleton } from '../skeleton/skeleton'
import type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps, CardMediaProps } from './card.types'

const sizeTokens = {
  sm: { pad: 12, gap: 8,  radius: 10, headerPad: 12 },
  md: { pad: 16, gap: 10, radius: 14, headerPad: 16 },
  lg: { pad: 20, gap: 12, radius: 18, headerPad: 20 },
}

const useStyles = makeStyles((theme) => ({
  elevated: {
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    ...shadow(2),
  },
  outline: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  flat: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    overflow: 'hidden',
  },
  skeletonWrap: {
    padding: 16,
    gap: 10,
  },
}))

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

// ─── CardMedia ────────────────────────────────────────────────────────────────

export const CardMedia: React.FC<CardMediaProps> = ({
  source,
  height = 180,
  roundedTop = true,
  style,
}) => {
  return (
    <Image
      source={source}
      style={[
        { width: '100%', height },
        roundedTop && { borderTopLeftRadius: 14, borderTopRightRadius: 14 },
        style,
      ]}
      resizeMode="cover"
    />
  )
}

// ─── CardHeader ───────────────────────────────────────────────────────────────

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  description,
  leading,
  trailing,
  style,
}) => {
  return (
    <View style={[{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: description ? 8 : 12 }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {leading != null && <View style={{ flexShrink: 0 }}>{leading}</View>}
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="label" style={{ fontSize: 15 }}>{title}</Text>
          {subtitle != null && (
            <Text variant="caption" muted style={{ fontSize: 12 }}>{subtitle}</Text>
          )}
        </View>
        {trailing != null && <View style={{ flexShrink: 0 }}>{trailing}</View>}
      </View>
      {description != null && (
        <Text variant="body" muted style={{ fontSize: 13, marginTop: 8, lineHeight: 20 }}>
          {description}
        </Text>
      )}
    </View>
  )
}

// ─── CardContent ──────────────────────────────────────────────────────────────

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => (
  <View style={[{ paddingHorizontal: 16, paddingBottom: 16 }, style]}>
    {children}
  </View>
)

// ─── CardFooter ───────────────────────────────────────────────────────────────

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  separated = false,
  align = 'left',
  style,
}) => {
  const justifyContent =
    align === 'right' ? 'flex-end' :
    align === 'apart' ? 'space-between' :
    'flex-start'

  return (
    <>
      {separated && <Separator />}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent,
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 8,
          },
          style,
        ]}
      >
        {children}
      </View>
    </>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  size = 'md',
  loading = false,
  onPress,
  disabled = false,
  activeScale = 0.97,
  accent,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const scale = useSharedValue(1)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const accentStyle = accent != null ? { borderLeftWidth: 3, borderLeftColor: accent } : {}
  const containerStyle = [styles[variant], accentStyle, style]

  const inner = loading ? (
    <View style={styles.skeletonWrap}>
      <Skeleton width="45%" height={13} />
      <Skeleton width="85%" height={11} style={{ marginTop: 2 }} />
      <Skeleton width="70%" height={11} />
      <Skeleton width="35%" height={11} />
    </View>
  ) : (
    children
  )

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => { scale.value = withSpring(activeScale, { damping: 15, stiffness: 300 }) }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }) }}
        android_ripple={{ color: theme.colors.border + '50', borderless: false }}
        accessibilityRole="button"
        style={[containerStyle, animStyle, disabled && { opacity: 0.5 }]}
        {...(rest as any)}
      >
        {inner}
      </AnimatedPressable>
    )
  }

  return (
    <View style={containerStyle} {...rest}>
      {inner}
    </View>
  )
}
