// native-mate: tabs@0.1.0 | hash:PLACEHOLDER
import React, { useRef, useState } from 'react'
import { View, Pressable, ScrollView } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { TabsProps } from './tabs.types'

const useStyles = makeStyles((theme) => ({
  container: { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  tab: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  indicator: { position: 'absolute', bottom: 0, height: 2, borderRadius: theme.radius.full, backgroundColor: theme.colors.primary },
}))

export const Tabs: React.FC<TabsProps> = ({ items, activeKey, onChange }) => {
  const theme = useTheme()
  const styles = useStyles()
  const [tabLayouts, setTabLayouts] = useState<Record<string, { x: number; width: number }>>({})
  const indicatorX = useSharedValue(0)
  const indicatorW = useSharedValue(0)

  const handleLayout = (key: string, x: number, width: number) => {
    setTabLayouts((prev) => ({ ...prev, [key]: { x, width } }))
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

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item) => (
          <Pressable
            key={item.key}
            style={styles.tab}
            onPress={() => onChange(item.key)}
            onLayout={(e) => handleLayout(item.key, e.nativeEvent.layout.x, e.nativeEvent.layout.width)}
            accessibilityRole="tab"
            accessibilityState={{ selected: item.key === activeKey }}
          >
            <Text variant="label" color={item.key === activeKey ? theme.colors.primary : theme.colors.muted}>
              {item.label}
            </Text>
          </Pressable>
        ))}
        <Animated.View style={[styles.indicator, indicatorStyle]} />
      </ScrollView>
    </View>
  )
}
