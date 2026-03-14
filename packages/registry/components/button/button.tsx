// native-mate: button@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { Pressable, ActivityIndicator } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { ButtonProps, ButtonVariant } from './button.types'

const useStyles = makeStyles((theme) => ({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.md },
  default:     { backgroundColor: theme.colors.primary },
  destructive: { backgroundColor: theme.colors.destructive },
  outline:     { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.border },
  ghost:       { backgroundColor: 'transparent' },
  secondary:   { backgroundColor: theme.colors.surface },
  sm: { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.sm, minHeight: 32 },
  md: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg, minHeight: 44 },
  lg: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl, minHeight: 52 },
  disabled: { opacity: 0.5 },
}))

const labelColorMap: Record<ButtonVariant, keyof ReturnType<typeof useTheme>['colors']> = {
  default: 'onPrimary', destructive: 'onDestructive', outline: 'foreground', ghost: 'foreground', secondary: 'onSurface',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default', size = 'md', loading = false, disabled = false,
  children, accessibilityLabel, onPress, ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const pressed = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(pressed.value ? 0.97 : 1, theme.animation.easing.spring) }],
  }))

  const isDisabled = disabled || loading
  const textColor = theme.colors[labelColorMap[variant]]

  return (
    <Pressable
      onPressIn={() => { pressed.value = 1 }}
      onPressOut={() => { pressed.value = 0 }}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...rest}
    >
      <Animated.View style={[styles.base, styles[variant], styles[size], isDisabled && styles.disabled, animatedStyle]}>
        {loading
          ? <ActivityIndicator size="small" color={textColor} />
          : <Text variant="label" color={textColor}>{children}</Text>
        }
      </Animated.View>
    </Pressable>
  )
}
