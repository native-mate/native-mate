// native-mate: button@0.3.0 | hash:PLACEHOLDER
import React, { useCallback } from 'react'
import { Pressable, ActivityIndicator, Platform, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { ButtonProps, ButtonVariant, ButtonGroupProps, HapticStyle } from './button.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const triggerHaptic = (style: HapticStyle) => {
  if (!Haptics || style === 'none') return
  const map = { light: 'Light', medium: 'Medium', heavy: 'Heavy' } as const
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[map[style]])
}

const useStyles = makeStyles((theme) => ({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
    overflow: 'hidden',
  },
  default:     { backgroundColor: theme.colors.primary },
  destructive: { backgroundColor: theme.colors.destructive },
  outline:     { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.border },
  ghost:       { backgroundColor: 'transparent' },
  secondary:   { backgroundColor: theme.colors.surface },
  link:        { backgroundColor: 'transparent' },
  sm: { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.sm, minHeight: 32 },
  md: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg, minHeight: 44 },
  lg: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl, minHeight: 52 },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
}))

const iconOnlySizes = { sm: 32, md: 44, lg: 52 }

const labelColorMap: Record<ButtonVariant, keyof ReturnType<typeof useTheme>['colors']> = {
  default: 'onPrimary',
  destructive: 'onDestructive',
  outline: 'foreground',
  ghost: 'foreground',
  secondary: 'onSurface',
  link: 'primary',
}

export const Button: React.FC<ButtonProps & { _groupStyle?: any }> = ({
  variant = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  rounded = false,
  iconOnly = false,
  haptic = 'light',
  color,
  iconLeft,
  iconRight,
  children,
  accessibilityLabel,
  onPress,
  _groupStyle,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const pressed = useSharedValue(0)
  const rippleScale = useSharedValue(0)
  const rippleOpacity = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(pressed.value ? 0.95 : 1, theme.animation.easing.spring) }],
    opacity: pressed.value ? 0.85 : 1,
  }))

  const rippleStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: rounded ? 9999 : theme.radius.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }))

  const isDisabled = disabled || loading
  const textColor = color
    ? (variant === 'outline' || variant === 'ghost' ? color : '#fff')
    : theme.colors[labelColorMap[variant]]

  const handlePressIn = useCallback(() => {
    pressed.value = 1
    triggerHaptic(haptic)
    if (Platform.OS === 'android') {
      rippleScale.value = 0
      rippleOpacity.value = 1
      rippleScale.value = withTiming(2, { duration: 300 })
    }
  }, [haptic])

  const handlePressOut = useCallback(() => {
    pressed.value = 0
    if (Platform.OS === 'android') {
      rippleOpacity.value = withTiming(0, { duration: 200 })
    }
  }, [])

  // Icon-only: square/circle button
  const iconOnlySize = iconOnlySizes[size]
  const iconOnlyStyle = iconOnly ? {
    width: iconOnlySize,
    height: iconOnlySize,
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: iconOnlySize,
  } : undefined

  // Rounded pill
  const roundedStyle = rounded ? { borderRadius: 9999 } : undefined

  // Custom color overrides
  const colorOverride = color ? (() => {
    if (variant === 'default') return { backgroundColor: color }
    if (variant === 'outline') return { borderColor: color }
    return undefined
  })() : undefined

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...rest}
    >
      <Animated.View
        style={[
          styles.base,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          variant === 'link' && { paddingHorizontal: 0, minHeight: 0 },
          iconOnlyStyle,
          roundedStyle,
          colorOverride,
          _groupStyle,
          animatedStyle,
        ]}
      >
        {/* Android ripple */}
        {Platform.OS === 'android' && <Animated.View style={rippleStyle} />}

        {/* Content */}
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <>
            {iconLeft}
            {children != null && !iconOnly && (
              <Text
                variant="label"
                color={textColor}
                style={variant === 'link' ? { textDecorationLine: 'underline' } : undefined}
              >
                {children}
              </Text>
            )}
            {iconRight}
          </>
        )}
      </Animated.View>
    </Pressable>
  )
}

// ButtonGroup — joins multiple buttons together
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  size,
  variant,
  fullWidth = false,
}) => {
  const theme = useTheme()
  const items = React.Children.toArray(children)

  return (
    <View style={{
      flexDirection: 'row',
      width: fullWidth ? '100%' : undefined,
      overflow: 'hidden',
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    }}>
      {items.map((child, i) => {
        if (!React.isValidElement(child)) return child
        const isFirst = i === 0
        const isLast = i === items.length - 1

        return (
          <View key={i} style={{
            flex: fullWidth ? 1 : undefined,
            borderLeftWidth: !isFirst ? 1 : 0,
            borderLeftColor: theme.colors.border,
          }}>
            {React.cloneElement(child as React.ReactElement<any>, {
              size: size || child.props.size,
              variant: variant || child.props.variant || 'outline',
              fullWidth: true,
              rounded: false,
              _groupStyle: {
                borderRadius: 0,
                borderWidth: 0,
              },
            })}
          </View>
        )
      })}
    </View>
  )
}
