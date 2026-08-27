// native-mate: bottom-bar@0.1.0 | hash:PLACEHOLDER
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, Pressable, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { BottomBarProps, BottomBarItem, HapticStyle, BottomBarBadge } from './bottom-bar.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const triggerHaptic = (style: HapticStyle) => {
  if (!Haptics || style === 'none') return
  const map = { light: 'Light', medium: 'Medium', heavy: 'Heavy' } as const
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[map[style]])
}

const DEFAULT_BOTTOM_INSET = Platform.OS === 'ios' ? 34 : 8

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 56,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    position: 'relative',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 32,
    borderRadius: 16,
  },
  badgeDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  indicator: {
    position: 'absolute',
    height: 32,
    borderRadius: 16,
  },
}))

const Badge: React.FC<{ badge: BottomBarBadge; theme: any }> = ({ badge, theme }) => {
  const styles = useStyles()
  const pulseScale = useSharedValue(1)
  const bgColor = badge.color ?? theme.colors.destructive

  useEffect(() => {
    if (badge.pulse) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600 }),
          withTiming(1, { duration: 600 }),
        ),
        -1,
        true,
      )
    }
  }, [badge.pulse])

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }))

  const hasValue = badge.value !== undefined && badge.value !== 0

  return (
    <Animated.View
      style={[
        styles.badgeDot,
        {
          backgroundColor: bgColor,
          minWidth: hasValue ? 16 : 8,
          height: hasValue ? 16 : 8,
          right: hasValue ? -4 : 2,
          top: hasValue ? -2 : 2,
        },
        animStyle,
      ]}
    >
      {hasValue && (
        <Text style={{ color: badge.color ? '#fff' : (theme.colors.onDestructive ?? '#fff'), fontSize: 9, ...fontStyle(theme.typography, 'bold'), lineHeight: 12 }}>
          {typeof badge.value === 'number' && badge.value > 99 ? '99+' : String(badge.value)}
        </Text>
      )}
    </Animated.View>
  )
}

const TabItem: React.FC<{
  item: BottomBarItem
  active: boolean
  showLabels: boolean
  haptic: HapticStyle
  onPress: () => void
  onLayout: (x: number, width: number) => void
}> = ({ item, active, showLabels, haptic, onPress, onLayout }) => {
  const theme = useTheme()
  const styles = useStyles()
  const scale = useSharedValue(1)
  const iconTranslateY = useSharedValue(0)

  const activeColor = theme.colors.primary
  const inactiveColor = theme.colors.muted

  useEffect(() => {
    iconTranslateY.value = withSpring(active ? -1 : 0, { damping: 15, stiffness: 300 })
  }, [active])

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: iconTranslateY.value }],
  }))

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.88, { damping: 15, stiffness: 300 })
    triggerHaptic(haptic)
  }, [haptic])

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 })
  }, [])

  const iconName = active && item.activeIcon ? item.activeIcon : item.icon

  return (
    <Pressable
      style={[styles.tab, item.disabled && { opacity: 0.4 }]}
      onPress={item.disabled ? undefined : onPress}
      onPressIn={item.disabled ? undefined : handlePressIn}
      onPressOut={item.disabled ? undefined : handlePressOut}
      onLayout={(e) => onLayout(e.nativeEvent.layout.x, e.nativeEvent.layout.width)}
      accessibilityRole="tab"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: active, disabled: item.disabled }}
      disabled={item.disabled}
    >
      <Animated.View style={[styles.iconWrap, iconAnimStyle]}>
        <Ionicons
          name={iconName as any}
          size={22}
          color={active ? activeColor : inactiveColor}
        />
        {item.badge && <Badge badge={item.badge} theme={theme} />}
      </Animated.View>
      {showLabels && (
        <Text
          style={{
            fontSize: 10,
            ...fontStyle(theme.typography, active ? 'semibold' : 'medium'),
            color: active ? activeColor : inactiveColor,
            marginTop: 2,
          }}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      )}
    </Pressable>
  )
}

export const BottomBar: React.FC<BottomBarProps> = ({
  items,
  activeKey,
  onChange,
  showLabels = true,
  haptic = 'light',
  bottomInset,
  showIndicator = true,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const safeBottom = bottomInset ?? DEFAULT_BOTTOM_INSET

  const [tabLayouts, setTabLayouts] = useState<Record<string, { x: number; width: number }>>({})
  const indicatorX = useSharedValue(0)
  const indicatorW = useSharedValue(48)

  const handleTabLayout = useCallback((key: string, x: number, width: number) => {
    setTabLayouts((prev) => ({ ...prev, [key]: { x, width } }))
  }, [])

  useEffect(() => {
    const layout = tabLayouts[activeKey]
    if (layout) {
      const centerX = layout.x + (layout.width - 48) / 2
      indicatorX.value = withSpring(centerX, { damping: 18, stiffness: 220 })
      indicatorW.value = withSpring(48, { damping: 18, stiffness: 220 })
    }
  }, [activeKey, tabLayouts])

  const indicatorStyle = useAnimatedStyle(() => ({
    left: indicatorX.value,
    width: indicatorW.value,
  }))

  return (
    <View
      style={[styles.container, { paddingBottom: safeBottom }, style]}
      accessibilityRole="tablist"
    >
      <View style={styles.bar}>
        {/* Sliding indicator */}
        {showIndicator && (
          <Animated.View
            style={[
              styles.indicator,
              {
                backgroundColor: theme.colors.primary + '18',
                top: 12,
              },
              indicatorStyle,
            ]}
          />
        )}

        {items.map((item) => (
          <TabItem
            key={item.key}
            item={item}
            active={item.key === activeKey}
            showLabels={showLabels}
            haptic={haptic}
            onPress={() => onChange(item.key)}
            onLayout={(x, w) => handleTabLayout(item.key, x, w)}
          />
        ))}
      </View>
    </View>
  )
}
