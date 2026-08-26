// native-mate: stepper@0.1.0 | hash:PLACEHOLDER
import React, { useEffect } from 'react'
import { View, Pressable } from 'react-native'
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
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
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
    alignItems: 'flex-start',
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
}) => {
  const fillProgress = useSharedValue(filled ? 1 : 0)

  useEffect(() => {
    fillProgress.value = withSpring(filled ? 1 : 0, SPRING)
  }, [filled])

  const bgStyle = useAnimatedStyle(() => {
    if (orientation === 'horizontal') {
      return { width: `${fillProgress.value * 100}%` as any, height: thickness }
    }
    return { height: `${fillProgress.value * 100}%` as any, width: thickness }
  })

  if (orientation === 'horizontal') {
    return (
      <View
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
            {
              backgroundColor: activeColor,
              borderRadius: thickness,
              height: thickness,
            },
            bgStyle,
          ]}
        />
      </View>
    )
  }

  return (
    <View
      style={{
        width: thickness,
        height: 24,
        backgroundColor: upcomingColor,
        borderRadius: thickness,
        overflow: 'hidden',
        alignSelf: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: activeColor,
            borderRadius: thickness,
            width: thickness,
          },
          bgStyle,
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
}

const StepNode: React.FC<StepNodeProps> = ({
  step,
  index,
  status,
  variant,
  size,
  completedColor,
  activeColor,
  upcomingColor,
  onPress,
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
      accessibilityRole="button"
      accessibilityLabel={`Step ${index + 1}: ${step.label}${status === 'completed' ? ', completed' : status === 'active' ? ', current' : ', upcoming'}`}
      accessibilityState={{ disabled: !isInteractive }}
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
}

// ── Stepper ──────────────────────────────────────────────────────────────────

export const Stepper: React.FC<StepperProps> = ({
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

  const getStatus = (index: number): 'completed' | 'active' | 'upcoming' => {
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'active'
    return 'upcoming'
  }

  if (orientation === 'vertical') {
    return (
      <View style={[styles.verticalContainer, style]}>
        {steps.map((step, i) => {
          const status = getStatus(i)
          return (
            <View key={i}>
              <View style={styles.verticalStep}>
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
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 12, paddingTop: 4, paddingBottom: i < steps.length - 1 ? 4 : 0 }}>
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
              {i < steps.length - 1 && (
                <View style={{ marginLeft: sz.node / 2 - sz.lineThickness / 2 }}>
                  <ConnectingLine
                    filled={i < currentStep}
                    orientation="vertical"
                    thickness={sz.lineThickness}
                    activeColor={cColor}
                    upcomingColor={uColor + '40'}
                  />
                </View>
              )}
            </View>
          )
        })}
      </View>
    )
  }

  // Horizontal
  return (
    <View style={[styles.horizontalContainer, style]}>
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
                filled={i < currentStep}
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
}
