// native-mate: speed-dial@0.1.0 | hash:PLACEHOLDER
import React, { useState, useCallback, useEffect } from 'react'
import { View, Pressable, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, shadow } from '@native-mate/core'
import type { SpeedDialProps, SpeedDialAction } from './speed-dial.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const FAB_SIZE = 56
const MINI_FAB_SIZE = 44
const ACTION_GAP = 16

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'flex-end',
  },
  bottomLeft: {
    left: 24,
    right: 'auto' as any,
    alignItems: 'flex-start',
  },
  bottomCenter: {
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: -Dimensions.get('window').height,
    left: -Dimensions.get('window').width,
    right: -Dimensions.get('window').width,
    bottom: -24,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  actionsContainer: {
    gap: ACTION_GAP,
    paddingBottom: ACTION_GAP,
  },
  actionsLeft: {
    flexDirection: 'row',
    gap: ACTION_GAP,
    paddingRight: ACTION_GAP,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionRowLeft: {
    flexDirection: 'row-reverse',
  },
  label: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    ...shadow(2),
  },
  labelText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.foreground,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow(4),
  },
  miniFab: {
    width: MINI_FAB_SIZE,
    height: MINI_FAB_SIZE,
    borderRadius: MINI_FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow(3),
  },
}))

function ActionItem({
  action,
  index,
  progress,
  direction,
  position,
  haptic,
  onPress,
}: {
  action: SpeedDialAction
  index: number
  progress: Animated.SharedValue<number>
  direction: 'up' | 'left'
  position: string
  haptic: boolean
  onPress: () => void
}) {
  const theme = useTheme()
  const styles = useStyles()
  const itemScale = useSharedValue(0)
  const itemOpacity = useSharedValue(0)

  useEffect(() => {
    // Staggered animation
    const delay = index * 50
    itemScale.value = withDelay(
      delay,
      withSpring(progress.value, { damping: 12, stiffness: 200 }),
    )
    itemOpacity.value = withDelay(delay, withTiming(progress.value, { duration: 200 }))
  }, [])

  const animStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.3, 1])
    const translateY = direction === 'up'
      ? interpolate(progress.value, [0, 1], [20, 0])
      : 0
    const translateX = direction === 'left'
      ? interpolate(progress.value, [0, 1], [20, 0])
      : 0

    return {
      transform: [{ scale }, { translateY }, { translateX }],
      opacity: progress.value,
    }
  })

  const handlePress = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    action.onPress()
    onPress()
  }, [haptic, action.onPress, onPress])

  const isLeft = position === 'bottom-left'

  return (
    <Animated.View
      style={[
        styles.actionRow,
        isLeft && styles.actionRowLeft,
        animStyle,
      ]}
    >
      <View style={styles.label}>
        <Text variant="caption" style={styles.labelText}>
          {action.label}
        </Text>
      </View>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={action.label}
      >
        <View
          style={[
            styles.miniFab,
            { backgroundColor: action.color ?? theme.colors.surface },
          ]}
        >
          <Ionicons
            name={action.icon as any}
            size={22}
            color={action.iconColor ?? theme.colors.foreground}
          />
        </View>
      </Pressable>
    </Animated.View>
  )
}

export const SpeedDial: React.FC<SpeedDialProps> = ({
  icon = 'add',
  actions,
  open: controlledOpen,
  onToggle,
  position = 'bottom-right',
  direction = 'up',
  color,
  iconColor,
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen ?? internalOpen
  const progress = useSharedValue(0)
  const rotation = useSharedValue(0)

  useEffect(() => {
    progress.value = withSpring(isOpen ? 1 : 0, { damping: 15, stiffness: 200 })
    rotation.value = withSpring(isOpen ? 45 : 0, { damping: 12, stiffness: 200 })
  }, [isOpen])

  const fabAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  const backdropAnimStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    pointerEvents: isOpen ? 'auto' as const : 'none' as const,
  }))

  const toggle = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    const nextOpen = !isOpen
    if (controlledOpen == null) {
      setInternalOpen(nextOpen)
    }
    onToggle?.(nextOpen)
  }, [haptic, isOpen, controlledOpen, onToggle])

  const close = useCallback(() => {
    if (controlledOpen == null) {
      setInternalOpen(false)
    }
    onToggle?.(false)
  }, [controlledOpen, onToggle])

  const positionStyle =
    position === 'bottom-left'
      ? styles.bottomLeft
      : position === 'bottom-center'
        ? styles.bottomCenter
        : undefined

  const fabBg = color ?? theme.colors.primary
  const fabIconColor = iconColor ?? theme.colors.onPrimary

  return (
    <View
      style={[styles.container, positionStyle, style]}
      pointerEvents="box-none"
      {...rest}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropAnimStyle]}>
        <Pressable
          style={{ flex: 1 }}
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Close speed dial"
        />
      </Animated.View>

      {/* Actions */}
      {isOpen && direction === 'up' && (
        <View style={styles.actionsContainer}>
          {actions.map((action, i) => (
            <ActionItem
              key={i}
              action={action}
              index={i}
              progress={progress}
              direction={direction}
              position={position}
              haptic={haptic}
              onPress={close}
            />
          ))}
        </View>
      )}

      {/* Main FAB */}
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={isOpen ? 'Close menu' : 'Open menu'}
        accessibilityState={{ expanded: isOpen }}
      >
        <Animated.View style={[styles.fab, { backgroundColor: fabBg }, fabAnimStyle]}>
          <Ionicons name={icon as any} size={26} color={fabIconColor} />
        </Animated.View>
      </Pressable>

      {/* Actions for left direction */}
      {isOpen && direction === 'left' && (
        <View style={styles.actionsLeft}>
          {actions.map((action, i) => (
            <ActionItem
              key={i}
              action={action}
              index={i}
              progress={progress}
              direction={direction}
              position={position}
              haptic={haptic}
              onPress={close}
            />
          ))}
        </View>
      )}
    </View>
  )
}
