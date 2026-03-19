// native-mate: accordion@0.2.0 | hash:PLACEHOLDER
import React, { useState, useCallback } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, Separator } from '@native-mate/core'
import type { AccordionProps, AccordionItem } from './accordion.types'

const sizeMap = {
  sm: { py: 10, px: 12, fontSize: 13, iconSize: 14, chevronSize: 14 },
  md: { py: 14, px: 16, fontSize: 15, iconSize: 16, chevronSize: 16 },
  lg: { py: 18, px: 20, fontSize: 17, iconSize: 18, chevronSize: 18 },
}

const TIMING_CONFIG = { duration: 250, easing: Easing.out(Easing.cubic) }

// ── Single accordion item ─────────────────────────────────────────────────────

interface AccordionItemComponentProps {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
  size: NonNullable<AccordionProps['size']>
  variant: NonNullable<AccordionProps['variant']>
  isFirst: boolean
  isLast: boolean
}

const AccordionItemComponent: React.FC<AccordionItemComponentProps> = ({
  item,
  isOpen,
  onToggle,
  size,
  variant,
  isFirst,
  isLast,
}) => {
  const theme = useTheme()
  const sz = sizeMap[size]

  // Only chevron rotation needs manual animation
  const rotation = useSharedValue(isOpen ? 180 : 0)

  React.useEffect(() => {
    rotation.value = withTiming(isOpen ? 180 : 0, TIMING_CONFIG)
  }, [isOpen, rotation])

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
        }
      : {}

  return (
    <Animated.View
      layout={LinearTransition.duration(250).easing(Easing.out(Easing.cubic))}
      style={[
        { opacity: item.disabled ? 0.45 : 1, overflow: 'hidden' as const },
        itemBg,
        itemBorder,
        cardItemRadius,
      ]}
    >
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

      {/* Content — conditionally rendered; Reanimated Layout handles height animation */}
      {isOpen && (
        <Animated.View
          entering={FadeIn.duration(200).delay(50)}
          exiting={FadeOut.duration(100)}
        >
          <View style={{ paddingHorizontal: sz.px, paddingBottom: sz.py }}>
            {item.content}
          </View>
        </Animated.View>
      )}
    </Animated.View>
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

  const toggle = useCallback((key: string) => {
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
  }, [allowMultiple])

  const borderedContainer =
    variant === 'bordered'
      ? {
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          overflow: 'hidden' as const,
        }
      : {}

  return (
    <View style={[borderedContainer, style]}>
      {items.map((item, i) => (
        <React.Fragment key={item.key}>
          <AccordionItemComponent
            item={item}
            isOpen={openKeys.has(item.key)}
            onToggle={() => toggle(item.key)}
            size={size}
            variant={variant}
            isFirst={i === 0}
            isLast={i === items.length - 1}
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
