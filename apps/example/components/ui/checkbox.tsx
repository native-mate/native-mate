// native-mate: checkbox@0.1.0 | hash:d082c339dd712404
import React, { useCallback } from 'react'
import { Pressable, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { CheckboxProps, CheckboxGroupProps } from './checkbox.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const sizeMap = {
  sm: { box: 16, radius: 4, icon: 8, iconStroke: 1.5 },
  md: { box: 20, radius: 5, icon: 10, iconStroke: 2 },
  lg: { box: 24, radius: 6, icon: 12, iconStroke: 2.5 },
}

const useStyles = makeStyles((theme) => ({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm },
  rowReverse: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: theme.spacing.sm },
  labelCol: { flex: 1, gap: 2 },
  description: { color: theme.colors.muted },
  error: { color: theme.colors.destructive },
  groupWrapper: { gap: theme.spacing.sm },
  groupRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  groupLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
}))

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  indeterminate = false,
  label,
  description,
  disabled = false,
  error,
  size = 'md',
  color,
  labelPosition = 'right',
  haptic = true,
  accessibilityLabel,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const cfg = sizeMap[size]
  const activeColor = color ?? theme.colors.primary

  const scale = useSharedValue(1)
  const fill = useSharedValue(checked || indeterminate ? 1 : 0)
  const checkScale = useSharedValue(checked ? 1 : 0)

  React.useEffect(() => {
    const active = checked || indeterminate
    fill.value = withTiming(active ? 1 : 0, { duration: 150 })
    checkScale.value = withSpring(checked ? 1 : 0, { mass: 0.5, damping: 12, stiffness: 200 })
  }, [checked, indeterminate])

  const boxAnimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(fill.value, [0, 1], ['transparent', error ? theme.colors.destructive : activeColor]),
    borderColor: interpolateColor(fill.value, [0, 1], [error ? theme.colors.destructive : theme.colors.border, error ? theme.colors.destructive : activeColor]),
    transform: [{ scale: scale.value }],
  }))

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }))

  const handlePress = useCallback(() => {
    if (disabled) return
    scale.value = withTiming(0.85, { duration: 70 }, () => {
      scale.value = withSpring(1, { mass: 0.4, damping: 10, stiffness: 300 })
    })
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onChange(!checked)
  }, [disabled, checked, onChange, haptic])

  const box = (
    <Animated.View style={[{
      width: cfg.box,
      height: cfg.box,
      borderRadius: cfg.radius,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.45 : 1,
    }, boxAnimStyle]}>
      <Animated.View style={checkAnimStyle}>
        {indeterminate && !checked ? (
          <View style={{ width: cfg.icon, height: cfg.iconStroke, backgroundColor: theme.colors.onPrimary ?? '#fff', borderRadius: 2 }} />
        ) : checked ? (
          <Ionicons name="checkmark" size={cfg.icon} color={theme.colors.onPrimary ?? '#fff'} />
        ) : null}
      </Animated.View>
    </Animated.View>
  )

  const labelContent = (label || description) ? (
    <View style={styles.labelCol}>
      {label && (
        <Text variant="body" style={{ opacity: disabled ? 0.45 : 1 }}>
          {label}
        </Text>
      )}
      {description && (
        <Text variant="caption" style={[styles.description, { opacity: disabled ? 0.45 : 1 }]}>
          {description}
        </Text>
      )}
    </View>
  ) : null

  return (
    <View>
      <Pressable
        onPress={handlePress}
        style={labelPosition === 'left' ? styles.rowReverse : styles.row}
        accessibilityRole="checkbox"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ checked: indeterminate ? 'mixed' : checked, disabled }}
      >
        {box}
        {labelContent}
      </Pressable>
      {error && <Text variant="caption" style={[styles.error, { marginTop: 4 }]}>{error}</Text>}
    </View>
  )
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value,
  onChange,
  label,
  error,
  disabled = false,
  size = 'md',
  horizontal = false,
}) => {
  const styles = useStyles()
  const theme = useTheme()

  const toggle = useCallback((optVal: string) => {
    if (value.includes(optVal)) {
      onChange(value.filter((v) => v !== optVal))
    } else {
      onChange([...value, optVal])
    }
  }, [value, onChange])

  return (
    <View style={styles.groupWrapper}>
      {label && (
        <View style={styles.groupLabelRow}>
          <Text variant="label">{label}</Text>
        </View>
      )}
      <View style={horizontal ? styles.groupRow : styles.groupWrapper}>
        {options.map((opt) => (
          <Checkbox
            key={opt.value}
            checked={value.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            label={opt.label}
            description={opt.description}
            disabled={disabled || opt.disabled}
            size={size}
          />
        ))}
      </View>
      {error && <Text variant="caption" style={{ color: theme.colors.destructive, marginTop: 2 }}>{error}</Text>}
    </View>
  )
}
