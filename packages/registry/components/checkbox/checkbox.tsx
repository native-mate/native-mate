// native-mate: checkbox@0.1.0 | hash:PLACEHOLDER
import React from 'react'
import { Pressable, View } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { CheckboxProps } from './checkbox.types'

const useStyles = makeStyles((theme) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  box: { width: 20, height: 20, borderRadius: theme.radius.sm, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkmark: { width: 10, height: 6, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: '#fff', transform: [{ rotate: '-45deg' }, { translateY: -1 }] },
}))

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, disabled = false, accessibilityLabel }) => {
  const theme = useTheme()
  const styles = useStyles()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePress = () => {
    if (disabled) return
    scale.value = withTiming(0.9, { duration: 80 }, () => { scale.value = withTiming(1, { duration: 80 }) })
    onChange(!checked)
  }

  return (
    <Pressable onPress={handlePress} style={styles.row} accessibilityRole="checkbox" accessibilityLabel={accessibilityLabel ?? label} accessibilityState={{ checked, disabled }}>
      <Animated.View style={[styles.box, { borderColor: checked ? theme.colors.primary : theme.colors.border, backgroundColor: checked ? theme.colors.primary : 'transparent', opacity: disabled ? 0.5 : 1 }, animatedStyle]}>
        {checked && <View style={styles.checkmark} />}
      </Animated.View>
      {label && <Text variant="body">{label}</Text>}
    </Pressable>
  )
}
