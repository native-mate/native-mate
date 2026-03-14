// native-mate: radio@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { Pressable, View } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { RadioProps, RadioGroupProps } from './radio.types'

const useStyles = makeStyles((theme) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  outer: { width: 20, height: 20, borderRadius: theme.radius.full, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  inner: { width: 10, height: 10, borderRadius: theme.radius.full },
}))

export const Radio: React.FC<RadioProps> = ({ selected, onSelect, label, disabled = false, accessibilityLabel }) => {
  const theme = useTheme()
  const styles = useStyles()
  const scale = useSharedValue(selected ? 1 : 0)

  React.useEffect(() => { scale.value = withSpring(selected ? 1 : 0, theme.animation.easing.spring) }, [selected])
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  return (
    <Pressable onPress={() => !disabled && onSelect()} style={styles.row} accessibilityRole="radio" accessibilityLabel={accessibilityLabel ?? label} accessibilityState={{ checked: selected, disabled }}>
      <View style={[styles.outer, { borderColor: selected ? theme.colors.primary : theme.colors.border, opacity: disabled ? 0.5 : 1 }]}>
        <Animated.View style={[styles.inner, { backgroundColor: theme.colors.primary }, animatedStyle]} />
      </View>
      {label && <Text variant="body">{label}</Text>}
    </Pressable>
  )
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ options, value, onChange, disabled }) => {
  const theme = useTheme()
  return (
    <View style={{ gap: theme.spacing.sm }}>
      {options.map((opt) => (
        <Radio key={opt.value} selected={value === opt.value} onSelect={() => onChange(opt.value)} label={opt.label} disabled={disabled} />
      ))}
    </View>
  )
}
