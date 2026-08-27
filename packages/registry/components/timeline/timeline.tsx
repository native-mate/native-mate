// native-mate: timeline@0.1.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  FadeInDown,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { TimelineProps, TimelineItem, TimelineItemStatus } from './timeline.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const sizeMap = {
  sm: { node: 20, lineWidth: 2, iconSize: 10, fontSize: 13, descFontSize: 12, gap: 10 },
  md: { node: 28, lineWidth: 2, iconSize: 14, fontSize: 14, descFontSize: 13, gap: 12 },
  lg: { node: 36, lineWidth: 3, iconSize: 18, fontSize: 16, descFontSize: 14, gap: 14 },
}

const SPRING = { damping: 16, stiffness: 180, mass: 0.6 }

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  nodeColumn: {
    alignItems: 'center',
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  line: {
    flex: 1,
    minHeight: 24,
  },
  contentColumn: {
    flex: 1,
    paddingBottom: 20,
  },
}))

// ── Pulse node for active status ─────────────────────────────────────────────

interface TimelineNodeProps {
  status: TimelineItemStatus
  size: keyof typeof sizeMap
  completedColor: string
  activeColor: string
  errorColor: string
  upcomingColor: string
  icon?: React.ReactNode
}

const TimelineNode = React.memo<TimelineNodeProps>(({
  status,
  size,
  completedColor,
  activeColor,
  errorColor,
  upcomingColor,
  icon,
}) => {
  const theme = useTheme()
  const sz = sizeMap[size]
  const pulseScale = useSharedValue(1)
  const pulseOpacity = useSharedValue(0)

  useEffect(() => {
    if (status === 'active') {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    } else {
      pulseScale.value = 1
      pulseOpacity.value = 0
    }
  }, [status])

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }))

  const colorMap: Record<TimelineItemStatus, string> = {
    completed: completedColor,
    active: activeColor,
    upcoming: upcomingColor,
    error: errorColor,
  }

  const nodeColor = colorMap[status]
  const bgColor = status === 'completed' || status === 'active' || status === 'error'
    ? nodeColor
    : 'transparent'

  const renderContent = () => {
    if (icon) return icon
    if (status === 'completed') {
      return <Ionicons name="checkmark" size={sz.iconSize} color={theme.colors.onPrimary} />
    }
    if (status === 'error') {
      return <Ionicons name="close" size={sz.iconSize} color={theme.colors.onDestructive} />
    }
    if (status === 'active') {
      return (
        <View
          style={{
            width: sz.node * 0.35,
            height: sz.node * 0.35,
            borderRadius: sz.node,
            backgroundColor: theme.colors.onPrimary,
          }}
        />
      )
    }
    return null
  }

  return (
    <View style={{ width: sz.node, height: sz.node, alignItems: 'center', justifyContent: 'center' }}>
      {status === 'active' && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: sz.node,
              height: sz.node,
              borderRadius: sz.node / 2,
              backgroundColor: activeColor,
            },
            pulseStyle,
          ]}
        />
      )}
      <View
        style={{
          width: sz.node,
          height: sz.node,
          borderRadius: sz.node / 2,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: nodeColor,
          backgroundColor: bgColor,
        }}
      >
        {renderContent()}
      </View>
    </View>
  )
})

TimelineNode.displayName = 'TimelineNode'

// ── Timeline item row ────────────────────────────────────────────────────────

interface TimelineItemRowProps {
  item: TimelineItem
  index: number
  isLast: boolean
  size: keyof typeof sizeMap
  animated: boolean
  staggerDelay: number
  completedColor: string
  activeColor: string
  errorColor: string
  upcomingColor: string
  onPress?: (key: string) => void
  haptic: boolean
  testID?: string
}

const TimelineItemRow = React.memo<TimelineItemRowProps>(({
  item,
  index,
  isLast,
  size,
  animated,
  staggerDelay,
  completedColor,
  activeColor,
  errorColor,
  upcomingColor,
  onPress,
  haptic: enableHaptic,
  testID,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const sz = sizeMap[size]
  const status = item.status ?? 'upcoming'

  const opacity = useSharedValue(animated ? 0 : 1)
  const translateY = useSharedValue(animated ? 20 : 0)

  useEffect(() => {
    if (!animated) return
    // Deferring the trigger by a tick (rather than calling withDelay/withTiming
    // synchronously inside the mount effect) mirrors the working pattern in
    // bottom-sheet-list.tsx — Reanimated's initial style commit on web isn't
    // reliably picked up when the animation is kicked off in the same tick
    // the shared values are created, which otherwise leaves items stuck at
    // opacity: 0.
    const t = setTimeout(() => {
      const delay = index * staggerDelay
      opacity.value = withDelay(delay, withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }))
      translateY.value = withDelay(delay, withSpring(0, SPRING))
    }, 10)
    return () => clearTimeout(t)
  }, [animated, index, staggerDelay])

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  const lineColor =
    status === 'completed'
      ? completedColor + '60'
      : status === 'error'
        ? errorColor + '40'
        : upcomingColor + '30'

  const handlePress = () => {
    if (enableHaptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress?.(item.key)
  }

  const formattedTime = item.timestamp
    ? typeof item.timestamp === 'string'
      ? item.timestamp
      : item.timestamp.toLocaleString()
    : undefined

  return (
    <Animated.View style={[styles.itemRow, animStyle]} testID={testID}>
      {/* Node column */}
      <View style={[styles.nodeColumn, { marginRight: sz.gap }]}>
        <TimelineNode
          status={status}
          size={size}
          completedColor={completedColor}
          activeColor={activeColor}
          errorColor={errorColor}
          upcomingColor={upcomingColor}
          icon={item.icon}
        />
        {!isLast && (
          <View
            style={[
              styles.line,
              {
                width: sz.lineWidth,
                backgroundColor: lineColor,
                borderRadius: sz.lineWidth,
              },
            ]}
          />
        )}
      </View>

      {/* Content column */}
      <Pressable
        style={[styles.contentColumn, { paddingTop: 2 }]}
        onPress={onPress ? handlePress : undefined}
        disabled={!onPress}
        accessibilityRole={onPress ? 'button' : 'text'}
        accessibilityLabel={`${item.title}${status === 'completed' ? ', completed' : status === 'active' ? ', current' : status === 'error' ? ', error' : ''}`}
      >
        <Text
          style={{
            fontSize: sz.fontSize,
            ...fontStyle(theme.typography, status === 'active' ? 'bold' : 'semibold'),
            color:
              status === 'upcoming'
                ? theme.colors.muted
                : status === 'error'
                  ? errorColor
                  : theme.colors.foreground,
          }}
        >
          {item.title}
        </Text>

        {item.description && (
          <Text
            style={{
              fontSize: sz.descFontSize,
              color: theme.colors.muted,
              marginTop: 2,
              lineHeight: sz.descFontSize * 1.5,
            }}
          >
            {item.description}
          </Text>
        )}

        {formattedTime && (
          <Text
            style={{
              fontSize: sz.descFontSize - 2,
              color: theme.colors.muted + '90',
              marginTop: 4,
              fontVariant: ['tabular-nums'],
            }}
          >
            {formattedTime}
          </Text>
        )}

        {item.content && (
          <View style={{ marginTop: 8 }}>{item.content}</View>
        )}
      </Pressable>
    </Animated.View>
  )
})

TimelineItemRow.displayName = 'TimelineItemRow'

// ── Timeline ─────────────────────────────────────────────────────────────────

export const Timeline = React.memo<TimelineProps>(({
  items,
  animated = true,
  staggerDelay = 100,
  size = 'md',
  completedColor,
  activeColor,
  errorColor,
  haptic = true,
  onItemPress,
  style,
  testID,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const cColor = completedColor ?? theme.colors.primary
  const aColor = activeColor ?? theme.colors.primary
  const eColor = errorColor ?? theme.colors.destructive
  const uColor = theme.colors.muted

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="list"
      testID={testID}
    >
      {items.map((item, i) => (
        <TimelineItemRow
          key={item.key}
          item={item}
          index={i}
          isLast={i === items.length - 1}
          size={size}
          animated={animated}
          staggerDelay={staggerDelay}
          completedColor={cColor}
          activeColor={aColor}
          errorColor={eColor}
          upcomingColor={uColor}
          onPress={onItemPress}
          haptic={haptic}
          testID={testID ? `${testID}-item-${i}` : undefined}
        />
      ))}
    </View>
  )
})

Timeline.displayName = 'Timeline'
