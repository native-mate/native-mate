// native-mate: onboarding-screen@0.1.0 | hash:PLACEHOLDER
import React, { useCallback } from 'react'
import { View, Image, Pressable, Dimensions, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated'
import { useTheme, useMotion, withAlpha, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { OnboardingScreenProps } from './onboarding-screen.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
  },
  imageArea: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  image: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
  },
  textArea: {
    flex: 2,
    paddingHorizontal: 32,
    paddingTop: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    ...fontStyle(theme.typography, 'bold'),
    textAlign: 'center',
    lineHeight: 34,
  },
  description: {
    fontSize: theme.typography.size.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'ios' ? 50 : 32,
    gap: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipLabel: {
    fontSize: theme.typography.size.md,
    ...fontStyle(theme.typography, 'medium'),
  },
  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  nextLabel: {
    fontSize: theme.typography.size.md,
    ...fontStyle(theme.typography, 'semibold'),
  },
}))

function Dot({
  active,
  color,
}: {
  active: boolean
  color: string
}) {
  const motion = useMotion()
  const width = useSharedValue(active ? 24 : 8)
  const opacity = useSharedValue(active ? 1 : 0.3)

  React.useEffect(() => {
    width.value = withSpring(active ? 24 : 8, motion.spring())
    opacity.value = withTiming(active ? 1 : 0.3, motion.timing('normal'))
  }, [active])

  const animStyle = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        {
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
        },
        animStyle,
      ]}
    />
  )
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  image,
  title,
  description,
  backgroundColor,
  textColor,
  index,
  total,
  onNext,
  onSkip,
  onFinish,
  showSkip = true,
  showDots = true,
  nextLabel = 'Next',
  finishLabel = 'Get Started',
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const motion = useMotion()
  const styles = useStyles()
  const buttonScale = useSharedValue(1)

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const isLast = index === total - 1

  const handleNext = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    buttonScale.value = withSpring(0.95, motion.spring())
    setTimeout(() => {
      buttonScale.value = withSpring(1, motion.spring())
    }, 100)
    if (isLast) {
      onFinish?.()
    } else {
      onNext?.()
    }
  }, [haptic, isLast, onFinish, onNext, motion])

  const handleSkip = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onSkip?.()
  }, [haptic, onSkip])

  const bg = backgroundColor ?? theme.colors.background
  const fg = textColor ?? theme.colors.foreground
  const mutedColor = textColor ? withAlpha(textColor, 0.6) : theme.colors.muted

  const renderImage = () => {
    if (image == null) return null
    if (React.isValidElement(image)) return image
    return (
      <Image
        source={image as any}
        style={styles.image}
        resizeMode="contain"
      />
    )
  }

  return (
    <View
      style={[styles.container, { backgroundColor: bg }, style]}
      accessibilityRole="summary"
      accessibilityLabel={`Onboarding step ${index + 1} of ${total}: ${title}`}
      {...rest}
    >
      <View style={styles.imageArea}>{renderImage()}</View>

      <View style={styles.textArea}>
        <Text variant="title" style={[styles.title, { color: fg }]}>
          {title}
        </Text>
        {description != null && (
          <Text variant="body" style={[styles.description, { color: mutedColor }]}>
            {description}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        {showDots && (
          <View style={styles.dotsRow}>
            {Array.from({ length: total }).map((_, i) => (
              <Dot key={i} active={i === index} color={theme.colors.primary} />
            ))}
          </View>
        )}

        <View style={styles.buttonsRow}>
          {showSkip && !isLast ? (
            <Pressable
              onPress={handleSkip}
              style={styles.skipButton}
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding"
            >
              <Text variant="body" style={[styles.skipLabel, { color: mutedColor }]}>
                Skip
              </Text>
            </Pressable>
          ) : (
            <View />
          )}
          <Pressable
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel={isLast ? finishLabel : nextLabel}
          >
            <Animated.View
              style={[
                styles.nextButton,
                { backgroundColor: theme.colors.primary },
                buttonAnimStyle,
              ]}
            >
              <Text
                variant="label"
                style={[styles.nextLabel, { color: theme.colors.onPrimary }]}
              >
                {isLast ? finishLabel : nextLabel}
              </Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
