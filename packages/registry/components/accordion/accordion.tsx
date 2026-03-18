// native-mate: accordion@0.2.0 | hash:PLACEHOLDER
import React, { useState, useRef } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, Separator } from '@native-mate/core'
import type { AccordionProps, AccordionItem } from './accordion.types'

const sizeMap = {
  sm: { py: 10, px: 12, fontSize: 13, iconSize: 14, chevronSize: 14 },
  md: { py: 14, px: 16, fontSize: 15, iconSize: 16, chevronSize: 16 },
  lg: { py: 18, px: 20, fontSize: 17, iconSize: 18, chevronSize: 18 },
}

// ── Single accordion item ─────────────────────────────────────────────────────

interface AccordionItemComponentProps {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
  size: NonNullable<AccordionProps['size']>
  variant: NonNullable<AccordionProps['variant']>
  isFirst: boolean
  isLast: boolean
  contentHeight: number
}

const AccordionItemComponent: React.FC<AccordionItemComponentProps> = ({
  item,
  isOpen,
  onToggle,
  size,
  variant,
  isFirst,
  isLast,
  contentHeight,
}) => {
  const theme = useTheme()
  const sz = sizeMap[size]

  // Start open items at a large value so content is visible before measurement
  const heightAnim = useSharedValue(isOpen ? 9999 : 0)
  const opacityAnim = useSharedValue(isOpen ? 1 : 0)
  const rotation = useSharedValue(isOpen ? 180 : 0)

  const contentHeightRef = useRef(contentHeight)
  contentHeightRef.current = contentHeight

  // Animate when user toggles open/close
  React.useEffect(() => {
    const h = contentHeightRef.current
    heightAnim.value = withSpring(isOpen ? (h > 0 ? h : 9999) : 0, theme.animation.easing.spring)
    opacityAnim.value = withTiming(isOpen ? 1 : 0, { duration: 200 })
    rotation.value = withSpring(isOpen ? 180 : 0, theme.animation.easing.spring)
  }, [isOpen])

  // When measurement arrives for an already-open item, snap height (no animation flicker)
  React.useEffect(() => {
    if (isOpen && contentHeight > 0) {
      heightAnim.value = contentHeight
    }
  }, [contentHeight])

  const contentStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
    opacity: opacityAnim.value,
    overflow: 'hidden',
  }))

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  const cardItemRadius =
    variant === 'card'
      ? {
          borderTopLeftRadius: isFirst ? theme.radius.lg : theme.radius.md,
          borderTopRightRadius: isFirst ? theme.radius.lg : theme.radius.md,
          borderBottomLeftRadius: isLast ? theme.radius.lg : theme.radius.md,
          borderBottomRightRadius: isLast ? theme.radius.lg : theme.radius.md,
        }
      : {}

  const itemBg = variant === 'card' ? { backgroundColor: theme.colors.surfaceRaised } : {}

  const itemBorder =
    variant === 'card'
      ? {
          borderWidth: 1,
          borderColor: theme.colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
          overflow: 'hidden' as const,
        }
      : {}

  return (
    <View style={[{ opacity: item.disabled ? 0.45 : 1 }, itemBg, itemBorder, cardItemRadius]}>
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: sz.py,
          paddingHorizontal: sz.px,
          minHeight: 44,
          gap: sz.px / 2,
        }}
        onPress={item.disabled ? undefined : onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen, disabled: item.disabled }}
        disabled={item.disabled}
      >
        {item.icon && (
          <View style={{ marginRight: 4, opacity: 0.75 }}>{item.icon}</View>
        )}
        <Text
          variant="label"
          style={{ flex: 1, fontSize: sz.fontSize, color: theme.colors.foreground }}
        >
          {item.title}
        </Text>
        {item.trailing && (
          <View style={{ marginRight: 6 }}>{item.trailing}</View>
        )}
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={sz.chevronSize} color={theme.colors.muted} />
        </Animated.View>
      </Pressable>

      {/* Animated content area */}
      <Animated.View style={contentStyle}>
        <View
          style={{ paddingHorizontal: sz.px, paddingBottom: sz.py }}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height
            if (h > 0) {
              // Bubble measured height up via callback in item
              ;(item as any).__onMeasure?.(h)
            }
          }}
        >
          {item.content}
        </View>
      </Animated.View>
    </View>
  )
}

// ── Accordion container ───────────────────────────────────────────────────────

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  variant = 'ghost',
  size = 'md',
  defaultOpen,
  style,
}) => {
  const theme = useTheme()
  const [openKeys, setOpenKeys] = useState<Set<string>>(
    () => new Set(defaultOpen ?? [])
  )
  const [heights, setHeights] = useState<Record<string, number>>({})

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        if (!allowMultiple) next.clear()
        next.add(key)
      }
      return next
    })
  }

  const borderedContainer =
    variant === 'bordered'
      ? {
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          overflow: 'hidden' as const,
        }
      : {}

  // Inject measurement callback onto items so the inner onLayout can report back
  const enrichedItems = items.map((item) => ({
    ...item,
    __onMeasure: (h: number) => {
      setHeights((prev) => {
        if (prev[item.key] === h) return prev
        return { ...prev, [item.key]: h }
      })
    },
  }))

  return (
    <View style={[borderedContainer, style]}>
      {enrichedItems.map((item, i) => (
        <React.Fragment key={item.key}>
          <AccordionItemComponent
            item={item}
            isOpen={openKeys.has(item.key)}
            onToggle={() => toggle(item.key)}
            size={size}
            variant={variant}
            isFirst={i === 0}
            isLast={i === items.length - 1}
            contentHeight={heights[item.key] ?? 0}
          />
          {i < items.length - 1 && (
            variant === 'card'
              ? <View style={{ height: 8 }} />
              : <Separator />
          )}
        </React.Fragment>
      ))}
    </View>
  )
}
