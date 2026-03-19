// native-mate: tabs@0.2.0 | hash:PLACEHOLDER
import React, { useState } from 'react'
import { View, Pressable, ScrollView } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { TabsProps, TabItem } from './tabs.types'

const sizeMap = {
  sm: { py: 6,  px: 12, fontSize: 12, badgeSize: 14, iconGap: 4 },
  md: { py: 10, px: 16, fontSize: 14, badgeSize: 16, iconGap: 6 },
  lg: { py: 14, px: 20, fontSize: 16, badgeSize: 18, iconGap: 8 },
}

// ── Badge bubble ─────────────────────────────────────────────────────────────

const BadgeBubble: React.FC<{ value: number | string; active: boolean; size: number }> = ({
  value,
  active,
  size,
}) => {
  const theme = useTheme()
  return (
    <View
      style={{
        minWidth: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: active ? theme.colors.primary : theme.colors.muted,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
      }}
    >
      <Text
        style={{
          fontSize: size * 0.6,
          fontWeight: '700',
          color: active ? theme.colors.onPrimary : theme.colors.background,
          lineHeight: size * 0.8,
        }}
      >
        {String(value)}
      </Text>
    </View>
  )
}

// ── Underline variant ────────────────────────────────────────────────────────

const UnderlineTabs: React.FC<TabsProps & { sz: typeof sizeMap['md'] }> = ({
  items,
  activeKey,
  onChange,
  scrollable,
  sz,
  style,
}) => {
  const theme = useTheme()
  const [tabLayouts, setTabLayouts] = useState<Record<string, { x: number; width: number }>>({})
  const indicatorX = useSharedValue(0)
  const indicatorW = useSharedValue(0)

  const handleLayout = (key: string, x: number, width: number) => {
    setTabLayouts((prev) => {
      const next = { ...prev, [key]: { x, width } }
      return next
    })
    if (key === activeKey) {
      indicatorX.value = withSpring(x, theme.animation.easing.spring)
      indicatorW.value = withSpring(width, theme.animation.easing.spring)
    }
  }

  React.useEffect(() => {
    const layout = tabLayouts[activeKey]
    if (layout) {
      indicatorX.value = withSpring(layout.x, theme.animation.easing.spring)
      indicatorW.value = withSpring(layout.width, theme.animation.easing.spring)
    }
  }, [activeKey, tabLayouts])

  const indicatorStyle = useAnimatedStyle(() => ({
    left: indicatorX.value,
    width: indicatorW.value,
  }))

  const Inner = (
    <>
      {items.map((item) => {
        const isActive = item.key === activeKey
        return (
          <Pressable
            key={item.key}
            style={{
              flex: scrollable ? undefined : 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: sz.py,
              paddingHorizontal: sz.px,
              minHeight: 44,
              gap: sz.iconGap,
              opacity: item.disabled ? 0.4 : 1,
            }}
            onPress={item.disabled ? undefined : () => onChange(item.key)}
            onLayout={(e) =>
              handleLayout(item.key, e.nativeEvent.layout.x, e.nativeEvent.layout.width)
            }
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive, disabled: item.disabled }}
            disabled={item.disabled}
          >
            {item.icon && (
              <View style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</View>
            )}
            <Text
              style={{
                fontSize: sz.fontSize,
                fontWeight: isActive ? '600' : '500',
                color: isActive ? theme.colors.primary : theme.colors.muted,
              }}
            >
              {item.label}
            </Text>
            {item.badge !== undefined && (
              <BadgeBubble value={item.badge} active={isActive} size={sz.badgeSize} />
            )}
          </Pressable>
        )
      })}
      {/* Sliding indicator */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            height: 2,
            borderRadius: 9999,
            backgroundColor: theme.colors.primary,
          },
          indicatorStyle,
        ]}
      />
    </>
  )

  return (
    <View
      style={[
        { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
        style,
      ]}
    >
      {scrollable ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row' }}>{Inner}</View>
        </ScrollView>
      ) : (
        <View style={{ flexDirection: 'row' }}>{Inner}</View>
      )}
    </View>
  )
}

// ── Pill variant ─────────────────────────────────────────────────────────────

const PillTabs: React.FC<TabsProps & { sz: typeof sizeMap['md'] }> = ({
  items,
  activeKey,
  onChange,
  scrollable,
  sz,
  style,
}) => {
  const theme = useTheme()
  const [tabLayouts, setTabLayouts] = useState<Record<string, { x: number; width: number; height: number }>>({})
  const pillX = useSharedValue(0)
  const pillW = useSharedValue(0)
  const pillH = useSharedValue(0)

  const handleLayout = (key: string, x: number, width: number, height: number) => {
    setTabLayouts((prev) => ({ ...prev, [key]: { x, width, height } }))
    if (key === activeKey) {
      pillX.value = withSpring(x, theme.animation.easing.spring)
      pillW.value = withSpring(width, theme.animation.easing.spring)
      pillH.value = withSpring(height, theme.animation.easing.spring)
    }
  }

  React.useEffect(() => {
    const layout = tabLayouts[activeKey]
    if (layout) {
      pillX.value = withSpring(layout.x, theme.animation.easing.spring)
      pillW.value = withSpring(layout.width, theme.animation.easing.spring)
      pillH.value = withSpring(layout.height, theme.animation.easing.spring)
    }
  }, [activeKey, tabLayouts])

  const pillStyle = useAnimatedStyle(() => ({
    left: pillX.value,
    width: pillW.value,
    height: pillH.value,
  }))

  const Inner = (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: 9999,
        padding: 4,
      }}
    >
      {/* Animated pill background */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 4,
            borderRadius: 9999,
            backgroundColor: theme.colors.surfaceRaised,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          },
          pillStyle,
        ]}
      />
      {items.map((item) => {
        const isActive = item.key === activeKey
        return (
          <Pressable
            key={item.key}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: sz.py,
              paddingHorizontal: sz.px,
              borderRadius: 9999,
              gap: sz.iconGap,
              opacity: item.disabled ? 0.4 : 1,
            }}
            onPress={item.disabled ? undefined : () => onChange(item.key)}
            onLayout={(e) =>
              handleLayout(
                item.key,
                e.nativeEvent.layout.x,
                e.nativeEvent.layout.width,
                e.nativeEvent.layout.height
              )
            }
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive, disabled: item.disabled }}
            disabled={item.disabled}
          >
            {item.icon && (
              <View style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</View>
            )}
            <Text
              style={{
                fontSize: sz.fontSize,
                fontWeight: isActive ? '600' : '500',
                color: isActive ? theme.colors.foreground : theme.colors.muted,
              }}
            >
              {item.label}
            </Text>
            {item.badge !== undefined && (
              <BadgeBubble value={item.badge} active={isActive} size={sz.badgeSize} />
            )}
          </Pressable>
        )
      })}
    </View>
  )

  return (
    <View style={style}>
      {scrollable ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Inner}
        </ScrollView>
      ) : (
        Inner
      )}
    </View>
  )
}

// ── Card / segmented variant ─────────────────────────────────────────────────

const CardTabs: React.FC<TabsProps & { sz: typeof sizeMap['md'] }> = ({
  items,
  activeKey,
  onChange,
  scrollable,
  sz,
  style,
}) => {
  const theme = useTheme()

  const Inner = (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
      }}
    >
      {items.map((item, i) => {
        const isActive = item.key === activeKey
        return (
          <Pressable
            key={item.key}
            style={[
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: sz.py,
                paddingHorizontal: sz.px,
                minHeight: 44,
                gap: sz.iconGap,
                backgroundColor: isActive ? theme.colors.surfaceRaised : 'transparent',
                opacity: item.disabled ? 0.4 : 1,
              },
              i < items.length - 1 && {
                borderRightWidth: 1,
                borderRightColor: theme.colors.border,
              },
            ]}
            onPress={item.disabled ? undefined : () => onChange(item.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive, disabled: item.disabled }}
            disabled={item.disabled}
          >
            {item.icon && (
              <View style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</View>
            )}
            <Text
              style={{
                fontSize: sz.fontSize,
                fontWeight: isActive ? '600' : '500',
                color: isActive ? theme.colors.foreground : theme.colors.muted,
              }}
            >
              {item.label}
            </Text>
            {item.badge !== undefined && (
              <BadgeBubble value={item.badge} active={isActive} size={sz.badgeSize} />
            )}
          </Pressable>
        )
      })}
    </View>
  )

  return (
    <View style={style}>
      {scrollable ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Inner}
        </ScrollView>
      ) : (
        Inner
      )}
    </View>
  )
}

// ── Public Tabs component ─────────────────────────────────────────────────────

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeKey,
  onChange,
  variant = 'underline',
  size = 'md',
  scrollable = false,
  style,
}) => {
  const sz = sizeMap[size]

  if (variant === 'pill') {
    return (
      <PillTabs
        items={items}
        activeKey={activeKey}
        onChange={onChange}
        variant={variant}
        size={size}
        scrollable={scrollable}
        sz={sz}
        style={style}
      />
    )
  }

  if (variant === 'card') {
    return (
      <CardTabs
        items={items}
        activeKey={activeKey}
        onChange={onChange}
        variant={variant}
        size={size}
        scrollable={scrollable}
        sz={sz}
        style={style}
      />
    )
  }

  // Default: underline
  return (
    <UnderlineTabs
      items={items}
      activeKey={activeKey}
      onChange={onChange}
      variant={variant}
      size={size}
      scrollable={scrollable}
      sz={sz}
      style={style}
    />
  )
}
