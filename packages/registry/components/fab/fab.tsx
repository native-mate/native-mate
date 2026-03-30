// native-mate: fab@0.1.0 | hash:PLACEHOLDER
import React, { useCallback, useState } from 'react'
import { View, Pressable, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, shadow } from '@native-mate/core'
import type { FabProps, FabAction, FabSize, FabVariant, HapticStyle } from './fab.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const triggerHaptic = (style: HapticStyle) => {
  if (!Haptics || style === 'none') return
  const map = { light: 'Light', medium: 'Medium', heavy: 'Heavy' } as const
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[map[style]])
}

const sizeMap: Record<FabSize, { size: number; icon: number; padding: number }> = {
  sm: { size: 40, icon: 18, padding: 10 },
  md: { size: 56, icon: 24, padding: 16 },
  lg: { size: 68, icon: 28, padding: 20 },
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    zIndex: 1000,
    alignItems: 'center',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    ...shadow(6),
  },
  speedDialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  speedDialBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow(4),
  },
  speedDialLabel: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 12,
    ...shadow(2),
  },
  overlay: {
    position: 'absolute',
    top: -9999,
    left: -9999,
    right: -9999,
    bottom: -9999,
  },
}))

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const SpeedDialAction: React.FC<{
  action: FabAction
  index: number
  expanded: boolean
  theme: any
  haptic: HapticStyle
}> = ({ action, index, expanded, theme, haptic }) => {
  const styles = useStyles()
  const progress = useSharedValue(0)
  const scale = useSharedValue(1)

  React.useEffect(() => {
    progress.value = withSpring(expanded ? 1 : 0, {
      damping: 14,
      stiffness: 200,
      mass: 0.8,
    })
  }, [expanded])

  const animStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [20, 0],
      Extrapolation.CLAMP,
    )
    const opacity = progress.value
    return {
      opacity,
      transform: [{ translateY }, { scale: scale.value }],
    }
  })

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 })
    triggerHaptic(haptic)
  }, [haptic])

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 })
  }, [])

  const btnColor = action.color ?? theme.colors.surface
  const iconColor = action.color ? '#fff' : theme.colors.foreground

  return (
    <Animated.View style={[styles.speedDialItem, animStyle]}>
      {action.label && (
        <View style={[styles.speedDialLabel, { backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface }]}>
          <Text style={{ fontSize: 13, fontWeight: '500', color: theme.colors.foreground }}>
            {action.label}
          </Text>
        </View>
      )}
      <AnimatedPressable
        onPress={action.onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.speedDialBtn, { backgroundColor: btnColor }]}
        accessibilityRole="button"
        accessibilityLabel={action.label ?? action.icon}
      >
        <Ionicons name={action.icon as any} size={20} color={iconColor} />
      </AnimatedPressable>
    </Animated.View>
  )
}

export const Fab: React.FC<FabProps> = ({
  icon,
  onPress,
  position = 'bottom-right',
  size = 'md',
  variant = 'default',
  label,
  actions,
  disabled = false,
  haptic = 'medium',
  color,
  bottomOffset = 24,
  sideOffset = 16,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [expanded, setExpanded] = useState(false)

  const scale = useSharedValue(1)
  const rotation = useSharedValue(0)

  const dims = sizeMap[size]

  const variantColors: Record<FabVariant, string> = {
    default: theme.colors.primary,
    secondary: theme.colors.surface,
    destructive: theme.colors.destructive,
  }

  const variantTextColors: Record<FabVariant, string> = {
    default: theme.colors.onPrimary,
    secondary: theme.colors.foreground,
    destructive: theme.colors.onDestructive ?? '#fff',
  }

  const bgColor = color ?? variantColors[variant]
  const fgColor = color ? '#fff' : variantTextColors[variant]

  const positionStyle: Record<string, any> = {
    'bottom-right': { bottom: bottomOffset, right: sideOffset, alignItems: 'flex-end' },
    'bottom-left': { bottom: bottomOffset, left: sideOffset, alignItems: 'flex-start' },
    'bottom-center': { bottom: bottomOffset, left: 0, right: 0, alignItems: 'center' },
  }

  const fabAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }))

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 12, stiffness: 260 })
    triggerHaptic(haptic)
  }, [haptic])

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 260 })
  }, [])

  const handlePress = useCallback(() => {
    if (actions && actions.length > 0) {
      const next = !expanded
      setExpanded(next)
      rotation.value = withSpring(next ? 45 : 0, { damping: 14, stiffness: 200 })
    } else {
      onPress?.()
    }
  }, [actions, expanded, onPress])

  const fabHeight = label ? dims.size : dims.size
  const fabWidth = label ? undefined : dims.size

  return (
    <View style={[styles.wrapper, positionStyle[position], style]} pointerEvents="box-none">
      {/* Overlay to dismiss speed dial */}
      {expanded && (
        <Pressable
          style={styles.overlay}
          onPress={() => {
            setExpanded(false)
            rotation.value = withSpring(0, { damping: 14, stiffness: 200 })
          }}
        />
      )}

      {/* Speed dial actions */}
      {actions && actions.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          {actions.map((action, i) => (
            <SpeedDialAction
              key={`${action.icon}-${i}`}
              action={{
                ...action,
                onPress: () => {
                  action.onPress()
                  setExpanded(false)
                  rotation.value = withSpring(0, { damping: 14, stiffness: 200 })
                },
              }}
              index={i}
              expanded={expanded}
              theme={theme}
              haptic={haptic}
            />
          ))}
        </View>
      )}

      {/* Main FAB */}
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label ?? 'Floating action button'}
        accessibilityState={{ disabled, expanded: actions ? expanded : undefined }}
        style={[
          styles.fab,
          {
            backgroundColor: bgColor,
            width: fabWidth,
            height: fabHeight,
            paddingHorizontal: label ? dims.padding + 4 : 0,
            gap: label ? 8 : 0,
          },
          disabled && { opacity: 0.5 },
          fabAnimStyle,
        ]}
      >
        <Ionicons name={icon as any} size={dims.icon} color={fgColor} />
        {label && (
          <Text style={{ color: fgColor, fontSize: 15, fontWeight: '600' }}>
            {label}
          </Text>
        )}
      </AnimatedPressable>
    </View>
  )
}
