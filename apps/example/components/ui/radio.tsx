// native-mate: radio@0.1.0 | hash:f443c371a1c6dfff
import React, { useCallback } from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { RadioProps, RadioGroupProps } from './radio.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const sizeMap = {
  sm: { outer: 16, inner: 7 },
  md: { outer: 20, inner: 9 },
  lg: { outer: 24, inner: 11 },
}

const useStyles = makeStyles((theme) => ({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm },
  labelCol: { flex: 1, gap: 2 },
  description: { color: theme.colors.muted },
  groupWrapper: { gap: theme.spacing.sm },
  groupRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  card: {
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  groupLabelRow: { marginBottom: 4 },
}))

export const Radio: React.FC<RadioProps> = ({
  selected,
  onSelect,
  label,
  description,
  disabled = false,
  size = 'md',
  color,
  card = false,
  haptic = true,
  accessibilityLabel,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const cfg = sizeMap[size]
  const activeColor = color ?? theme.colors.primary

  const innerScale = useSharedValue(selected ? 1 : 0)
  const borderAnim = useSharedValue(selected ? 1 : 0)

  React.useEffect(() => {
    innerScale.value = withSpring(selected ? 1 : 0, { mass: 0.4, damping: 14, stiffness: 180 })
    borderAnim.value = withTiming(selected ? 1 : 0, { duration: 220, easing: Easing.out(Easing.quad) })
  }, [selected])

  const outerStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      borderAnim.value,
      [0, 1],
      [theme.colors.border, activeColor],
    ),
  }))

  const innerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: innerScale.value }],
  }))

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      borderAnim.value,
      [0, 1],
      [theme.colors.border, activeColor],
    ),
    backgroundColor: interpolateColor(
      borderAnim.value,
      [0, 1],
      [theme.colors.background, activeColor + '12'],
    ),
  }))

  const handlePress = useCallback(() => {
    if (disabled || selected) return
    if (haptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onSelect()
  }, [disabled, selected, onSelect, haptic])

  const radioIndicator = (
    <Animated.View style={[{
      width: cfg.outer,
      height: cfg.outer,
      borderRadius: cfg.outer / 2,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.45 : 1,
      marginTop: 2,
    }, outerStyle]}>
      <Animated.View style={[{
        width: cfg.inner,
        height: cfg.inner,
        borderRadius: cfg.inner / 2,
        backgroundColor: activeColor,
      }, innerAnimStyle]} />
    </Animated.View>
  )

  const labelContent = (
    <View style={[styles.labelCol, { opacity: disabled ? 0.45 : 1 }]}>
      {label && <Text variant="body">{label}</Text>}
      {description && <Text variant="caption" style={styles.description}>{description}</Text>}
    </View>
  )

  if (card) {
    return (
      <Pressable
        onPress={handlePress}
        android_ripple={null}
        style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
        accessibilityRole="radio"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ checked: selected, disabled }}
      >
        <Animated.View style={[styles.card, cardStyle, { opacity: disabled ? 0.45 : 1 }]}>
          {radioIndicator}
          {labelContent}
        </Animated.View>
      </Pressable>
    )
  }

  return (
    <Pressable
      onPress={handlePress}
      style={styles.row}
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: selected, disabled }}
    >
      {radioIndicator}
      {labelContent}
    </Pressable>
  )
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  label,
  error,
  disabled = false,
  size = 'md',
  horizontal = false,
  card = false,
  haptic = true,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  return (
    <View style={styles.groupWrapper}>
      {label && (
        <View style={styles.groupLabelRow}>
          <Text variant="label">{label}</Text>
        </View>
      )}
      <View style={horizontal ? styles.groupRow : styles.groupWrapper}>
        {options.map((opt) => (
          <Radio
            key={opt.value}
            selected={value === opt.value}
            onSelect={() => onChange(opt.value)}
            label={opt.label}
            description={opt.description}
            disabled={disabled || opt.disabled}
            size={size}
            card={card}
            haptic={haptic}
          />
        ))}
      </View>
      {error && (
        <Text variant="caption" style={{ color: theme.colors.destructive, marginTop: 2 }}>
          {error}
        </Text>
      )}
    </View>
  )
}
