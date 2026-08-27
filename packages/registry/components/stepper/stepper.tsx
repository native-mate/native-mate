// native-mate: stepper@0.1.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import { View, Pressable, StyleSheet, LayoutChangeEvent } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, useDirection, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { StepperProps, StepItem } from './stepper.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const sizeMap = {
  sm: { node: 24, fontSize: 11, descFontSize: 10, lineThickness: 2, iconSize: 12, dotSize: 8 },
  md: { node: 32, fontSize: 13, descFontSize: 11, lineThickness: 2, iconSize: 16, dotSize: 10 },
  lg: { node: 40, fontSize: 15, descFontSize: 13, lineThickness: 3, iconSize: 20, dotSize: 12 },
}

const SPRING = { damping: 16, stiffness: 180, mass: 0.6 }

const useStyles = makeStyles((theme) => ({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verticalContainer: {
    flexDirection: 'column',
  },
  horizontalStep: {
    flex: 1,
    alignItems: 'center',
  },
  verticalStep: {
    flexDirection: 'row',
    // 'stretch' lets the node column (and therefore the connector) grow to the
    // full height of the step's text content.
    alignItems: 'stretch',
  },
  nodeCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  horizontalLine: {
    position: 'absolute',
    top: '50%',
  },
  verticalLine: {
    position: 'absolute',
  },
  labelText: {
    textAlign: 'center',
    marginTop: 6,
  },
  descText: {
    textAlign: 'center',
    marginTop: 2,
  },
}))

// ── Animated connecting line ─────────────────────────────────────────────────

interface ConnectingLineProps {
  filled: boolean
  orientation: 'horizontal' | 'vertical'
  thickness: number
  activeColor: string
  upcomingColor: string
  length?: number
}

const ConnectingLine: React.FC<ConnectingLineProps> = ({
  filled,
  orientation,
  thickness,
  activeColor,
  upcomingColor,
  length,
}) => {
  const direction = useDirection()
  const fillProgress = useSharedValue(filled ? 1 : 0)
  // Track extent, measured once per layout pass. The fill spans the whole track
  // and is *scaled* into place, so the growth animation never touches layout.
  const trackLength = useSharedValue(0)

  useEffect(() => {
    fillProgress.value = withSpring(filled ? 1 : 0, SPRING)
  }, [filled])

  const isHorizontal = orientation === 'horizontal'
  // Hoisted out of the worklet: primitives only, so the closure never copies
  // the direction object.
  const dirSign = direction.sign

  const handleTrackLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    trackLength.value = isHorizontal ? width : height
  }

  // Every branch returns the same key set (a full four-part transform with
  // neutral values), so Reanimated never leaves a stale prop applied.
  const fillStyle = useAnimatedStyle(() => {
    const progress = fillProgress.value
    // `scaleX`/`scaleY` scale about the centre; translate back by half the
    // shrinkage so the fill stays pinned to the track's leading edge. `dirSign`
    // flips that edge under RTL, where the horizontal row itself is mirrored.
    const offset = (trackLength.value * (1 - progress)) / 2
    return {
      transform: [
        { translateX: isHorizontal ? -dirSign * offset : 0 },
        { translateY: isHorizontal ? 0 : -offset },
        { scaleX: isHorizontal ? progress : 1 },
        { scaleY: isHorizontal ? 1 : progress },
      ],
    }
  })

  if (isHorizontal) {
    return (
      <View
        onLayout={handleTrackLayout}
        style={{
          flex: 1,
          height: thickness,
          backgroundColor: upcomingColor,
          borderRadius: thickness,
          overflow: 'hidden',
          marginHorizontal: 4,
          alignSelf: 'center',
        }}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: activeColor,
              borderRadius: thickness,
            },
            fillStyle,
          ]}
        />
      </View>
    )
  }

  // Vertical: flexes to fill the step row's height so the connector still
  // reaches the next node when a step carries a long description.
  return (
    <View
      onLayout={handleTrackLayout}
      style={{
        width: thickness,
        flex: 1,
        minHeight: length ?? 24,
        marginVertical: 4,
        backgroundColor: upcomingColor,
        borderRadius: thickness,
        overflow: 'hidden',
        alignSelf: 'center',
      }}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: activeColor,
            borderRadius: thickness,
          },
          fillStyle,
        ]}
      />
    </View>
  )
}

// ── Step node ────────────────────────────────────────────────────────────────

interface StepNodeProps {
  step: StepItem
  index: number
  status: 'completed' | 'active' | 'upcoming'
  variant: NonNullable<StepperProps['variant']>
  size: keyof typeof sizeMap
  completedColor: string
  activeColor: string
  upcomingColor: string
  onPress?: () => void
  testID?: string
}

const StepNode = React.memo<StepNodeProps>(({
  step,
  index,
  status,
  variant,
  size,
  completedColor,
  activeColor,
  upcomingColor,
  onPress,
  testID,
}) => {
  const theme = useTheme()
  const sz = sizeMap[size]
  const pulseScale = useSharedValue(1)

  useEffect(() => {
    if (status === 'active') {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    } else {
      pulseScale.value = withSpring(1, SPRING)
    }
  }, [status])

  const animatedNodeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }))

  const nodeColor =
    status === 'completed'
      ? completedColor
      : status === 'active'
        ? activeColor
        : upcomingColor

  const bgColor =
    status === 'completed'
      ? completedColor
      : status === 'active'
        ? activeColor
        : 'transparent'

  const textColor =
    status === 'upcoming'
      ? upcomingColor
      : theme.colors.onPrimary

  const renderNodeContent = () => {
    if (status === 'completed') {
      return (
        <Ionicons name="checkmark" size={sz.iconSize} color={theme.colors.onPrimary} />
      )
    }

    if (variant === 'dot') {
      return (
        <View
          style={{
            width: sz.dotSize,
            height: sz.dotSize,
            borderRadius: sz.dotSize / 2,
            backgroundColor: status === 'active' ? theme.colors.onPrimary : upcomingColor,
          }}
        />
      )
    }

    if (variant === 'icon' && step.icon) {
      return step.icon
    }

    return (
      <Text
        style={{
          fontSize: sz.fontSize - 2,
          ...fontStyle(theme.typography, 'bold'),
          color: textColor,
        }}
      >
        {index + 1}
      </Text>
    )
  }

  const isInteractive = status === 'completed' && onPress

  return (
    <Pressable
      onPress={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
      hitSlop={Math.max(0, Math.ceil((44 - sz.node) / 2))}
      accessibilityRole="button"
      accessibilityLabel={`Step ${index + 1}: ${step.label}${status === 'completed' ? ', completed' : status === 'active' ? ', current' : ', upcoming'}`}
      accessibilityState={{ disabled: !isInteractive }}
      testID={testID}
    >
      <Animated.View
        style={[
          {
            width: sz.node,
            height: sz.node,
            borderRadius: sz.node / 2,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: nodeColor,
            backgroundColor: bgColor,
          },
          animatedNodeStyle,
        ]}
      >
        {renderNodeContent()}
      </Animated.View>
    </Pressable>
  )
})

StepNode.displayName = 'StepNode'

// ── Stepper ──────────────────────────────────────────────────────────────────

export const Stepper = React.memo<StepperProps>(({
  steps,
  currentStep,
  orientation = 'horizontal',
  variant = 'numbered',
  onStepPress,
  completedColor,
  activeColor,
  upcomingColor,
  size = 'md',
  haptic = true,
  style,
  testID,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const sz = sizeMap[size]

  const cColor = completedColor ?? theme.colors.primary
  const aColor = activeColor ?? theme.colors.primary
  const uColor = upcomingColor ?? theme.colors.muted

  const handleStepPress = (index: number) => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    onStepPress?.(index)
  }

  // Out-of-range values previously rendered every step as completed (or every
  // step as upcoming) with no indication anything was wrong.
  const lastIndex = Math.max(0, steps.length - 1)
  const safeStep = Number.isFinite(currentStep)
    ? Math.min(lastIndex, Math.max(0, Math.trunc(currentStep)))
    : 0

  const getStatus = (index: number): 'completed' | 'active' | 'upcoming' => {
    if (index < safeStep) return 'completed'
    if (index === safeStep) return 'active'
    return 'upcoming'
  }

  const progressA11y = {
    accessibilityRole: 'progressbar' as const,
    accessibilityValue: { min: 0, max: lastIndex, now: safeStep },
    accessibilityLiveRegion: 'polite' as const,
    accessibilityLabel: steps.length
      ? `Step ${safeStep + 1} of ${steps.length}: ${steps[safeStep]?.label ?? ''}`
      : undefined,
  }

  if (orientation === 'vertical') {
    return (
      <View style={[styles.verticalContainer, style]} testID={testID} {...progressA11y}>
        {steps.map((step, i) => {
          const status = getStatus(i)
          const isLast = i === steps.length - 1
          return (
            <View key={i} style={styles.verticalStep}>
              <View style={{ alignItems: 'center' }}>
                <StepNode
                  step={step}
                  index={i}
                  status={status}
                  variant={variant}
                  size={size}
                  completedColor={cColor}
                  activeColor={aColor}
                  upcomingColor={uColor}
                  onPress={
                    onStepPress && status === 'completed'
                      ? () => handleStepPress(i)
                      : undefined
                  }
                  testID={testID ? `${testID}-item-${i}` : undefined}
                />
                {!isLast && (
                  <ConnectingLine
                    filled={i < safeStep}
                    orientation="vertical"
                    thickness={sz.lineThickness}
                    activeColor={cColor}
                    upcomingColor={uColor + '40'}
                  />
                )}
              </View>
              <View style={{ flex: 1, marginStart: 12, paddingTop: 4, paddingBottom: isLast ? 0 : 24 }}>
                <Text
                  style={{
                    fontSize: sz.fontSize,
                    ...fontStyle(theme.typography, status === 'active' ? 'semibold' : 'medium'),
                    color: status === 'upcoming' ? uColor : theme.colors.foreground,
                  }}
                >
                  {step.label}
                </Text>
                {step.description && (
                  <Text
                    style={{
                      fontSize: sz.descFontSize,
                      color: theme.colors.muted,
                      marginTop: 2,
                    }}
                  >
                    {step.description}
                  </Text>
                )}
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  // Horizontal
  return (
    <View style={[styles.horizontalContainer, style]} testID={testID} {...progressA11y}>
      {steps.map((step, i) => {
        const status = getStatus(i)
        return (
          <React.Fragment key={i}>
            <View style={styles.horizontalStep}>
              <StepNode
                step={step}
                index={i}
                status={status}
                variant={variant}
                size={size}
                completedColor={cColor}
                activeColor={aColor}
                upcomingColor={uColor}
                onPress={
                  onStepPress && status === 'completed'
                    ? () => handleStepPress(i)
                    : undefined
                }
                testID={testID ? `${testID}-item-${i}` : undefined}
              />
              <Text
                style={[
                  styles.labelText,
                  {
                    fontSize: sz.fontSize,
                    ...fontStyle(theme.typography, status === 'active' ? 'semibold' : 'medium'),
                    color: status === 'upcoming' ? uColor : theme.colors.foreground,
                  },
                ]}
                numberOfLines={1}
              >
                {step.label}
              </Text>
              {step.description && (
                <Text
                  style={[
                    styles.descText,
                    {
                      fontSize: sz.descFontSize,
                      color: theme.colors.muted,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {step.description}
                </Text>
              )}
            </View>
            {i < steps.length - 1 && (
              <ConnectingLine
                filled={i < safeStep}
                orientation="horizontal"
                thickness={sz.lineThickness}
                activeColor={cColor}
                upcomingColor={uColor + '40'}
              />
            )}
          </React.Fragment>
        )
      })}
    </View>
  )
})

Stepper.displayName = 'Stepper'
