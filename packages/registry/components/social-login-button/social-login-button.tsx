// native-mate: social-login-button@0.1.0 | hash:PLACEHOLDER
import React, { useCallback } from 'react'
import { View, Pressable, ActivityIndicator, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { SocialLoginButtonProps, SocialProvider, SocialLoginSize } from './social-login-button.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const providerConfig: Record<
  SocialProvider,
  { label: string; icon: string; color: string; textColor: string }
> = {
  google: {
    label: 'Google',
    icon: 'logo-google',
    color: '#FFFFFF',
    textColor: '#1F1F1F',
  },
  apple: {
    label: 'Apple',
    icon: 'logo-apple',
    color: '#000000',
    textColor: '#FFFFFF',
  },
  github: {
    label: 'GitHub',
    icon: 'logo-github',
    color: '#24292F',
    textColor: '#FFFFFF',
  },
  facebook: {
    label: 'Facebook',
    icon: 'logo-facebook',
    color: '#1877F2',
    textColor: '#FFFFFF',
  },
  twitter: {
    label: 'X',
    icon: 'logo-twitter',
    color: '#000000',
    textColor: '#FFFFFF',
  },
  discord: {
    label: 'Discord',
    icon: 'logo-discord',
    color: '#5865F2',
    textColor: '#FFFFFF',
  },
}

const sizeTokens: Record<SocialLoginSize, { height: number; fontSize: number; iconSize: number; padding: number }> = {
  md: { height: 48, fontSize: 15, iconSize: 20, padding: 16 },
  lg: { height: 56, fontSize: 17, iconSize: 22, padding: 20 },
}

const useStyles = makeStyles((theme) => ({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    gap: 10,
    overflow: 'hidden',
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  disabled: {
    opacity: 0.5,
  },
}))

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onPress,
  loading = false,
  disabled = false,
  variant = 'filled',
  size = 'md',
  label,
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const config = providerConfig[provider]
  const tokens = sizeTokens[size]
  const scale = useSharedValue(1)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 })
  }, [])

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 })
  }, [])

  const handlePress = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onPress?.()
  }, [haptic, onPress])

  const isDisabled = disabled || loading
  const displayLabel = label ?? `Continue with ${config.label}`

  const isOutlined = variant === 'outlined'
  const bgColor = isOutlined
    ? 'transparent'
    : provider === 'google'
      ? (theme.colorScheme === 'dark' ? '#131314' : '#FFFFFF')
      : config.color
  const textColor = isOutlined
    ? theme.colors.foreground
    : provider === 'google'
      ? (theme.colorScheme === 'dark' ? '#E3E3E3' : '#1F1F1F')
      : config.textColor
  const borderColor = isOutlined
    ? theme.colors.border
    : provider === 'google'
      ? (theme.colorScheme === 'dark' ? '#8E918F' : '#747775')
      : 'transparent'

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={displayLabel}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...(rest as any)}
    >
      <Animated.View
        style={[
          styles.button,
          {
            height: tokens.height,
            paddingHorizontal: tokens.padding,
            backgroundColor: bgColor,
            borderWidth: 1,
            borderColor: borderColor,
          },
          isDisabled && styles.disabled,
          animStyle,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <>
            <Ionicons
              name={config.icon as any}
              size={tokens.iconSize}
              color={textColor}
            />
            <Text
              variant="label"
              style={{
                fontSize: tokens.fontSize,
                ...fontStyle(theme.typography, 'semibold'),
                color: textColor,
              }}
            >
              {displayLabel}
            </Text>
          </>
        )}
      </Animated.View>
    </Pressable>
  )
}
