// native-mate: toggle-group@0.1.0 | hash:PLACEHOLDER
import React, { useState, useEffect, useCallback } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { ToggleGroupProps, ToggleGroupItem, HapticStyle } from './toggle-group.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const triggerHaptic = (style: HapticStyle) => {
  if (!Haptics || style === 'none') return
  const map = { light: 'Light', medium: 'Medium', heavy: 'Heavy' } as const
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[map[style]])
}

const sizeMap = {
  sm: { height: 32, px: 10, fontSize: 12, iconSize: 14, gap: 4 },
  md: { height: 40, px: 14, fontSize: 14, iconSize: 16, gap: 6 },
  lg: { height: 48, px: 18, fontSize: 16, iconSize: 18, gap: 8 },
}

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 3,
    position: 'relative',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md - 2,
    zIndex: 1,
  },
  indicator: {
    position: 'absolute',
    top: 3,
    borderRadius: theme.radius.md - 2,
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
}))

export const ToggleGroup: React.FC<ToggleGroupProps> = (props) => {
  const {
    items,
    type = 'single',
    size = 'md',
    fullWidth = false,
    haptic = 'light',
    disabled = false,
    style,
  } = props

  const theme = useTheme()
  const styles = useStyles()
  const dims = sizeMap[size]

  const [itemLayouts, setItemLayouts] = useState<Record<string, { x: number; width: number }>>({})
  const indicatorX = useSharedValue(0)
  const indicatorW = useSharedValue(0)
  const indicatorH = useSharedValue(dims.height)

  const isSingle = type === 'single'
  const activeValue = isSingle ? props.value : null
  const activeValues = !isSingle ? props.values : []

  const isItemActive = useCallback((key: string) => {
    if (isSingle) return key === activeValue
    return (activeValues ?? []).includes(key)
  }, [isSingle, activeValue, activeValues])

  const handleItemLayout = useCallback((key: string, x: number, width: number) => {
    setItemLayouts((prev) => ({ ...prev, [key]: { x, width } }))
  }, [])

  // Animate indicator for single mode
  useEffect(() => {
    if (!isSingle || !activeValue) return
    const layout = itemLayouts[activeValue]
    if (layout) {
      indicatorX.value = withSpring(layout.x, { damping: 18, stiffness: 220 })
      indicatorW.value = withSpring(layout.width, { damping: 18, stiffness: 220 })
    }
  }, [activeValue, itemLayouts, isSingle])

  const indicatorStyle = useAnimatedStyle(() => ({
    left: indicatorX.value,
    width: indicatorW.value,
    height: indicatorH.value,
  }))

  const handlePress = useCallback((key: string) => {
    if (disabled) return
    triggerHaptic(haptic)
    if (isSingle) {
      ;(props as any).onChange(key)
    } else {
      const current = (props as any).values as string[]
      const next = current.includes(key)
        ? current.filter((k: string) => k !== key)
        : [...current, key]
      ;(props as any).onChangeMultiple(next)
    }
  }, [disabled, haptic, isSingle, props])

  return (
    <View
      style={[
        styles.container,
        fullWidth && { width: '100%' },
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="radiogroup"
    >
      {/* Sliding indicator for single mode */}
      {isSingle && activeValue && (
        <Animated.View style={[styles.indicator, indicatorStyle]} />
      )}

      {items.map((item) => {
        const active = isItemActive(item.key)
        const itemDisabled = disabled || item.disabled

        return (
          <Pressable
            key={item.key}
            onPress={itemDisabled ? undefined : () => handlePress(item.key)}
            onLayout={(e) => handleItemLayout(item.key, e.nativeEvent.layout.x, e.nativeEvent.layout.width)}
            disabled={itemDisabled}
            accessibilityRole="radio"
            accessibilityState={{ checked: active, disabled: itemDisabled }}
            accessibilityLabel={item.label}
            style={[
              styles.item,
              {
                height: dims.height,
                paddingHorizontal: dims.px,
                gap: dims.gap,
                flex: fullWidth ? 1 : undefined,
              },
              // For multiple mode, show a background on active items
              !isSingle && active && {
                backgroundColor: theme.colors.primary + '18',
              },
              itemDisabled && { opacity: 0.4 },
            ]}
          >
            {item.icon && (
              <Ionicons
                name={item.icon as any}
                size={dims.iconSize}
                color={active ? theme.colors.foreground : theme.colors.muted}
              />
            )}
            <Text
              style={{
                fontSize: dims.fontSize,
                ...fontStyle(theme.typography, active ? 'semibold' : 'medium'),
                color: active ? theme.colors.foreground : theme.colors.muted,
              }}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
