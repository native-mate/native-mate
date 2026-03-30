// native-mate: cart-item@0.1.0 | hash:PLACEHOLDER
import React, { useCallback } from 'react'
import { View, Image, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, shadow } from '@native-mate/core'
import { QuantityStepper } from '../quantity-stepper/quantity-stepper'
import type { CartItemProps } from './cart-item.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const REMOVE_THRESHOLD = -80

const useStyles = makeStyles((theme) => ({
  outerContainer: {
    overflow: 'hidden',
    borderRadius: theme.radius.md,
  },
  deleteBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 100,
    backgroundColor: theme.colors.destructive,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
  },
  image: {
    width: 72,
    height: 72,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold as any,
    color: theme.colors.foreground,
  },
  variant: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.bold as any,
    color: theme.colors.foreground,
  },
  removeButton: {
    padding: 6,
    marginLeft: 4,
  },
}))

export const CartItem: React.FC<CartItemProps> = ({
  image,
  title,
  variant,
  price,
  currency = '$',
  quantity,
  onQuantityChange,
  onRemove,
  maxQuantity,
  minQuantity = 1,
  disabled = false,
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const translateX = useSharedValue(0)
  const itemHeight = useSharedValue<number | undefined>(undefined)
  const priceScale = useSharedValue(1)

  const priceAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: priceScale.value }],
  }))

  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      priceScale.value = withSpring(1.1, { damping: 10, stiffness: 400 })
      setTimeout(() => {
        priceScale.value = withSpring(1, { damping: 12, stiffness: 300 })
      }, 100)
      onQuantityChange?.(newQuantity)
    },
    [onQuantityChange],
  )

  const handleRemove = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    onRemove?.()
  }, [haptic, onRemove])

  const formatPrice = (val: number) => `${currency}${val.toFixed(2)}`
  const totalPrice = price * quantity

  return (
    <View style={[styles.outerContainer, style]} {...rest}>
      {onRemove != null && (
        <View style={styles.deleteBackground}>
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
        </View>
      )}
      <View
        style={[styles.container, disabled && { opacity: 0.5 }]}
        accessibilityRole="summary"
        accessibilityLabel={`${title}, quantity ${quantity}, ${formatPrice(totalPrice)}`}
      >
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} resizeMode="cover" />
        </View>
        <View style={styles.info}>
          <Text variant="body" numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          {variant != null && (
            <Text variant="caption" numberOfLines={1} style={styles.variant}>
              {variant}
            </Text>
          )}
          <View style={styles.priceRow}>
            <Animated.View style={priceAnimStyle}>
              <Text variant="label" style={styles.price}>
                {formatPrice(totalPrice)}
              </Text>
            </Animated.View>
            <QuantityStepper
              value={quantity}
              onChange={handleQuantityChange}
              min={minQuantity}
              max={maxQuantity}
              size="sm"
              disabled={disabled}
              haptic={haptic}
            />
          </View>
        </View>
        {onRemove != null && (
          <Pressable
            onPress={handleRemove}
            style={styles.removeButton}
            accessibilityRole="button"
            accessibilityLabel="Remove item"
            hitSlop={8}
          >
            <Ionicons
              name="close-circle-outline"
              size={22}
              color={theme.colors.muted}
            />
          </Pressable>
        )}
      </View>
    </View>
  )
}
