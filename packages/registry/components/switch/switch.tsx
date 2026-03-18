// native-mate: switch@0.2.0 | hash:PLACEHOLDER
import React, { useCallback } from 'react'
import { Pressable, View, ActivityIndicator } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { SwitchProps } from './switch.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const sizeMap = {
  sm: { trackW: 38, trackH: 22, thumb: 16, padding: 3 },
  md: { trackW: 50, trackH: 28, thumb: 22, padding: 3 },
  lg: { trackW: 62, trackH: 34, thumb: 28, padding: 3 },
}

const useStyles = makeStyles((theme) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  rowReverse: { flexDirection: 'row-reverse', alignItems: 'center', gap: theme.spacing.sm },
  labelCol: { flex: 1, gap: 2 },
  description: { color: theme.colors.muted },
}))

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  size = 'md',
  color,
  loading = false,
  haptic = true,
  labelPosition = 'right',
  accessibilityLabel,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const cfg = sizeMap[size]
  const activeColor = color ?? theme.colors.success ?? '#22c55e'

  const progress = useSharedValue(value ? 1 : 0)

  React.useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, { mass: 0.4, damping: 14, stiffness: 200 })
  }, [value])

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * (cfg.trackW - cfg.thumb - cfg.padding * 2) }],
  }))

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.border, activeColor],
    ),
  }))

  const handlePress = useCallback(() => {
    if (disabled || loading) return
    if (haptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onValueChange(!value)
  }, [disabled, loading, value, onValueChange, haptic])

  const switchEl = (
    <Animated.View
      style={[
        {
          width: cfg.trackW,
          height: cfg.trackH,
          borderRadius: cfg.trackH / 2,
          padding: cfg.padding,
          justifyContent: 'center',
          opacity: disabled ? 0.45 : 1,
        },
        trackStyle,
      ]}
    >
      {loading ? (
        <View style={{
          width: cfg.thumb,
          height: cfg.thumb,
          borderRadius: cfg.thumb / 2,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: value ? cfg.trackW - cfg.thumb - cfg.padding * 2 : 0,
        }}>
          <ActivityIndicator size={cfg.thumb * 0.55} color={activeColor} />
        </View>
      ) : (
        <Animated.View
          style={[
            {
              width: cfg.thumb,
              height: cfg.thumb,
              borderRadius: cfg.thumb / 2,
              backgroundColor: '#fff',
              borderWidth: 0.5,
              borderColor: 'rgba(0,0,0,0.08)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3,
              elevation: 3,
            },
            thumbStyle,
          ]}
        />
      )}
    </Animated.View>
  )

  const labelEl = (label || description) ? (
    <View style={[styles.labelCol, { opacity: disabled ? 0.45 : 1 }]}>
      {label && <Text variant="body">{label}</Text>}
      {description && <Text variant="caption" style={styles.description}>{description}</Text>}
    </View>
  ) : null

  return (
    <Pressable
      onPress={handlePress}
      style={labelPosition === 'left' ? styles.rowReverse : styles.row}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ checked: value, disabled: disabled || loading }}
    >
      {labelEl}
      {switchEl}
    </Pressable>
  )
}
