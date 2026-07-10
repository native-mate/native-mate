// native-mate: product-card@0.1.0 | hash:PLACEHOLDER
import React, { useCallback } from 'react'
import { View, Image, Pressable, Platform, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, shadow } from '@native-mate/core'
import type { ProductCardProps } from './product-card.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...shadow(2),
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow(1),
  },
  content: {
    padding: theme.spacing.md,
    gap: 6,
  },
  title: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold as any,
    color: theme.colors.foreground,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold as any,
    color: theme.colors.foreground,
  },
  originalPrice: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.muted,
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.semibold as any,
    color: theme.colors.success,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.foreground,
    fontWeight: theme.typography.weight.medium as any,
  },
  reviewCount: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.muted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    gap: 6,
  },
  addToCartDisabled: {
    backgroundColor: theme.colors.muted,
  },
  addToCartLabel: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold as any,
  },
  outOfStock: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.destructive,
    fontWeight: theme.typography.weight.medium as any,
  },
}))

export const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  originalPrice,
  currency = '$',
  rating,
  reviewCount,
  onPress,
  onAddToCart,
  inStock = true,
  badge,
  badgeColor,
  favorite = false,
  onFavoriteToggle,
  imageAspectRatio = 1,
  disabled = false,
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const cardScale = useSharedValue(1)
  const heartScale = useSharedValue(1)

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }))

  const heartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }))

  const handlePressIn = useCallback(() => {
    cardScale.value = withSpring(0.97, { damping: 15, stiffness: 300 })
  }, [])

  const handlePressOut = useCallback(() => {
    cardScale.value = withSpring(1, { damping: 15, stiffness: 300 })
  }, [])

  const handleFavoriteToggle = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    heartScale.value = withSequence(
      withSpring(1.3, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 300 }),
    )
    onFavoriteToggle?.()
  }, [haptic, onFavoriteToggle])

  const handleAddToCart = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onAddToCart?.()
  }, [haptic, onAddToCart])

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const formatPrice = (val: number) => {
    return `${currency}${val.toFixed(2)}`
  }

  const renderStars = (count: number) => {
    const stars = []
    const fullStars = Math.floor(count)
    const hasHalf = count - fullStars >= 0.5
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={14} color="#F59E0B" />,
        )
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <Ionicons key={i} name="star-half" size={14} color="#F59E0B" />,
        )
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={14} color="#D1D5DB" />,
        )
      }
    }
    return stars
  }

  const cardContent = (
    <>
      <View style={styles.imageContainer}>
        <Image
          source={image}
          style={[styles.image, { aspectRatio: imageAspectRatio }]}
          resizeMode="cover"
        />
        {badge != null && (
          <View
            style={[
              styles.badge,
              { backgroundColor: badgeColor ?? theme.colors.primary },
            ]}
          >
            <Text
              variant="caption"
              style={{
                color: badgeColor ? '#FFFFFF' : theme.colors.onPrimary,
                fontWeight: theme.typography.weight.bold as any,
                fontSize: 11,
              }}
            >
              {badge}
            </Text>
          </View>
        )}
        {onFavoriteToggle != null && (
          <Pressable
            onPress={handleFavoriteToggle}
            style={styles.favoriteButton}
            accessibilityRole="button"
            accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'}
            accessibilityState={{ selected: favorite }}
            hitSlop={8}
          >
            <Animated.View style={heartAnimStyle}>
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={20}
                color={favorite ? '#EF4444' : theme.colors.muted}
              />
            </Animated.View>
          </Pressable>
        )}
        {!inStock && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text variant="label" style={{ color: '#FFFFFF', fontSize: 14 }}>
              Out of Stock
            </Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text variant="body" numberOfLines={2} style={styles.title}>
          {title}
        </Text>
        {rating != null && (
          <View style={styles.ratingRow}>
            {renderStars(rating)}
            <Text variant="caption" style={styles.ratingText}>
              {rating.toFixed(1)}
            </Text>
            {reviewCount != null && (
              <Text variant="caption" style={styles.reviewCount}>
                ({reviewCount})
              </Text>
            )}
          </View>
        )}
        <View style={styles.footer}>
          <View style={styles.priceRow}>
            <Text variant="label" style={styles.price}>
              {formatPrice(price)}
            </Text>
            {originalPrice != null && originalPrice > price && (
              <>
                <Text variant="caption" style={styles.originalPrice}>
                  {formatPrice(originalPrice)}
                </Text>
                <Text variant="caption" style={styles.discount}>
                  -{discountPercent}%
                </Text>
              </>
            )}
          </View>
          {onAddToCart != null && (
            <Pressable
              onPress={handleAddToCart}
              disabled={disabled || !inStock}
              style={[
                styles.addToCartButton,
                (!inStock || disabled) && styles.addToCartDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Add to cart"
              accessibilityState={{ disabled: disabled || !inStock }}
            >
              <Ionicons name="cart-outline" size={16} color={theme.colors.onPrimary} />
              <Text variant="caption" style={styles.addToCartLabel}>
                Add
              </Text>
            </Pressable>
          )}
          {!inStock && onAddToCart == null && (
            <Text variant="caption" style={styles.outOfStock}>
              Out of stock
            </Text>
          )}
        </View>
      </View>
    </>
  )

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${formatPrice(price)}`}
        accessibilityState={{ disabled }}
        style={[styles.container, cardAnimStyle, disabled && { opacity: 0.5 }, style]}
        {...(rest as any)}
      >
        {cardContent}
      </AnimatedPressable>
    )
  }

  return (
    <Animated.View
      style={[styles.container, disabled && { opacity: 0.5 }, style]}
      accessibilityRole="summary"
      {...rest}
    >
      {cardContent}
    </Animated.View>
  )
}
