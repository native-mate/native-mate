// native-mate: pricing-card@0.1.0 | hash:PLACEHOLDER
import React, { useCallback } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, shadow } from '@native-mate/core'
import type { PricingCardProps } from './pricing-card.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  popular: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    ...shadow(3),
  },
  popularBadge: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 6,
    alignItems: 'center',
  },
  content: {
    padding: 24,
    gap: 16,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.foreground,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  price: {
    fontSize: 48,
    fontWeight: '800',
    color: theme.colors.foreground,
    lineHeight: 52,
  },
  period: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.muted,
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  features: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    flex: 1,
    fontSize: theme.typography.size.sm,
    lineHeight: 20,
  },
  featureIncluded: {
    color: theme.colors.foreground,
  },
  featureExcluded: {
    color: theme.colors.muted,
    textDecorationLine: 'line-through',
  },
  ctaButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  ctaLabel: {
    fontSize: theme.typography.size.md,
    fontWeight: '600',
  },
}))

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period = 'month',
  currency = '$',
  features = [],
  popular = false,
  ctaLabel = 'Get Started',
  onPress,
  disabled = false,
  badge,
  badgeColor,
  description,
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const buttonScale = useSharedValue(1)

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const handlePress = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    buttonScale.value = withSpring(0.95, { damping: 15, stiffness: 400 })
    setTimeout(() => {
      buttonScale.value = withSpring(1, { damping: 12, stiffness: 300 })
    }, 100)
    onPress?.()
  }, [haptic, onPress])

  const badgeText = badge ?? (popular ? 'Most Popular' : null)

  return (
    <View
      style={[
        styles.container,
        popular && styles.popular,
        disabled && { opacity: 0.5 },
        style,
      ]}
      accessibilityRole="summary"
      accessibilityLabel={`${title} plan, ${currency}${price} per ${period}`}
      {...rest}
    >
      {badgeText != null && (
        <View
          style={[
            styles.popularBadge,
            badgeColor != null && { backgroundColor: badgeColor },
          ]}
        >
          <Text
            variant="caption"
            style={{
              color: badgeColor != null ? '#FFFFFF' : theme.colors.onPrimary,
              fontWeight: '700',
              fontSize: 12,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {badgeText}
          </Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="title" style={styles.title}>
            {title}
          </Text>
          {description != null && (
            <Text variant="body" style={styles.description}>
              {description}
            </Text>
          )}
        </View>
        <View style={styles.priceRow}>
          <Text variant="label" style={styles.currency}>
            {currency}
          </Text>
          <Text variant="title" style={styles.price}>
            {Number.isInteger(price) ? price : price.toFixed(2)}
          </Text>
          <Text variant="caption" style={styles.period}>
            /{period}
          </Text>
        </View>
        {features.length > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.features}>
              {features.map((feature, i) => (
                <View key={i} style={styles.featureRow}>
                  <Ionicons
                    name={feature.included ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={feature.included ? theme.colors.success : theme.colors.muted}
                  />
                  <Text
                    variant="body"
                    style={[
                      styles.featureText,
                      feature.included
                        ? styles.featureIncluded
                        : styles.featureExcluded,
                    ]}
                  >
                    {feature.text}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
        {onPress != null && (
          <Pressable
            onPress={handlePress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={ctaLabel}
            accessibilityState={{ disabled }}
          >
            <Animated.View
              style={[
                styles.ctaButton,
                !popular && styles.ctaButtonOutline,
                buttonAnimStyle,
              ]}
            >
              <Text
                variant="label"
                style={[
                  styles.ctaLabel,
                  {
                    color: popular
                      ? theme.colors.onPrimary
                      : theme.colors.foreground,
                  },
                ]}
              >
                {ctaLabel}
              </Text>
            </Animated.View>
          </Pressable>
        )}
      </View>
    </View>
  )
}
