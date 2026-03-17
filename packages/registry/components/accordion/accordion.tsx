// native-mate: accordion@0.1.0 | hash:PLACEHOLDER
import React, { useState } from 'react'
import { View, Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, Separator, makeStyles } from '@native-mate/core'
import type { AccordionProps } from './accordion.types'

const useStyles = makeStyles((theme) => ({
  item: { overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.sm, minHeight: 44 },
  content: { paddingHorizontal: theme.spacing.sm, paddingBottom: theme.spacing.md },
}))

const AccordionItemComponent: React.FC<{ item: AccordionProps['items'][0]; isOpen: boolean; onToggle: () => void }> = ({ item, isOpen, onToggle }) => {
  const theme = useTheme()
  const styles = useStyles()
  const [contentHeight, setContentHeight] = useState(0)
  const height = useSharedValue(0)
  const rotation = useSharedValue(0)

  React.useEffect(() => {
    height.value = withSpring(isOpen ? contentHeight : 0, theme.animation.easing.spring)
    rotation.value = withSpring(isOpen ? 180 : 0, theme.animation.easing.spring)
  }, [isOpen, contentHeight])

  const contentStyle = useAnimatedStyle(() => ({ height: height.value, overflow: 'hidden' }))
  const chevronStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }))

  return (
    <View style={styles.item}>
      <Pressable style={styles.header} onPress={onToggle} accessibilityRole="button" accessibilityState={{ expanded: isOpen }}>
        <Text variant="label">{item.title}</Text>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={16} color={theme.colors.muted} />
        </Animated.View>
      </Pressable>
      <Separator />
      <Animated.View style={contentStyle}>
        <View style={styles.content} onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}>
          {item.content}
        </View>
      </Animated.View>
    </View>
  )
}

export const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false }) => {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set())

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) }
      else { if (!allowMultiple) next.clear(); next.add(key) }
      return next
    })
  }

  return (
    <View>
      {items.map((item, i) => (
        <React.Fragment key={item.key}>
          <AccordionItemComponent item={item} isOpen={openKeys.has(item.key)} onToggle={() => toggle(item.key)} />
          {i < items.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </View>
  )
}
