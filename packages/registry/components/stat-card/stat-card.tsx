// native-mate: stat-card@0.1.0 | hash:PLACEHOLDER
import React, { useEffect, useMemo } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useDerivedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { StatCardProps, ChangeType } from './stat-card.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const SPRING = { damping: 18, stiffness: 200, mass: 0.7 }

const useStyles = makeStyles((theme) => ({
  card: {
    padding: 16,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceRaised ?? theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  // Skeleton
  skeletonTitle: {
    height: 12,
    width: '40%',
    borderRadius: 6,
  },
  skeletonValue: {
    height: 28,
    width: '60%',
    borderRadius: 8,
    marginTop: 4,
  },
  skeletonChange: {
    height: 16,
    width: '30%',
    borderRadius: 6,
    marginTop: 4,
  },
}))

// ── Animated number display ──────────────────────────────────────────────────

interface AnimatedValueProps {
  value: number
  format: NonNullable<StatCardProps['format']>
  prefix: string
  suffix: string
  decimals: number
  animated: boolean
  color: string
  typography: ReturnType<typeof useTheme>['typography']
}

const AnimatedValue: React.FC<AnimatedValueProps> = ({
  value: targetValue,
  format,
  prefix,
  suffix,
  decimals,
  animated,
  color,
  typography,
}) => {
  const [displayText, setDisplayText] = React.useState('')

  // Poll the shared value on JS thread for display
  useEffect(() => {
    if (!animated) {
      setDisplayText(formatValue(targetValue, format, prefix, suffix, decimals))
      return
    }

    let frame: number
    const startTime = Date.now()
    const duration = 1200

    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * targetValue
      setDisplayText(formatValue(current, format, prefix, suffix, decimals))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [targetValue, animated, format, prefix, suffix, decimals])

  return (
    <Text
      style={{
        fontSize: 28,
        ...fontStyle(typography, 'bold'),
        color,
        fontVariant: ['tabular-nums'],
      }}
    >
      {displayText}
    </Text>
  )
}

function formatValue(
  val: number,
  format: NonNullable<StatCardProps['format']>,
  prefix: string,
  suffix: string,
  decimals: number
): string {
  let formatted: string

  switch (format) {
    case 'currency':
      formatted = val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      break
    case 'percent':
      formatted = val.toFixed(decimals)
      break
    default:
      formatted = Math.round(val).toLocaleString()
      break
  }

  return `${prefix}${formatted}${suffix}`
}

// ── StatCard ─────────────────────────────────────────────────────────────────

export const StatCard = React.memo<StatCardProps>(({
  title,
  value,
  previousValue,
  change: changeProp,
  changeType: changeTypeProp,
  icon,
  format = 'number',
  prefix = '',
  suffix = '',
  loading = false,
  animated = true,
  decimals: decimalsProp,
  currency = 'USD',
  haptic = true,
  onPress,
  style,
  testID,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const decimals =
    decimalsProp ?? (format === 'currency' ? 2 : format === 'percent' ? 1 : 0)

  const effectivePrefix = prefix || (format === 'currency' ? '$' : '')
  const effectiveSuffix = suffix || (format === 'percent' ? '%' : '')

  // Calculate change
  const changeAmount = useMemo(() => {
    if (changeProp !== undefined) return changeProp
    if (previousValue !== undefined && previousValue !== 0) {
      return ((value - previousValue) / Math.abs(previousValue)) * 100
    }
    return undefined
  }, [changeProp, previousValue, value])

  const changeType: ChangeType = useMemo(() => {
    if (changeTypeProp) return changeTypeProp
    if (changeAmount === undefined) return 'neutral'
    if (changeAmount > 0) return 'increase'
    if (changeAmount < 0) return 'decrease'
    return 'neutral'
  }, [changeTypeProp, changeAmount])

  const changeColor =
    changeType === 'increase'
      ? theme.colors.success
      : changeType === 'decrease'
        ? theme.colors.destructive
        : theme.colors.muted

  const changeIcon =
    changeType === 'increase'
      ? 'trending-up'
      : changeType === 'decrease'
        ? 'trending-down'
        : 'remove'

  const scaleAnim = useSharedValue(1)
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }))

  const handlePressIn = () => {
    if (onPress) scaleAnim.value = withSpring(0.97, SPRING)
  }

  const handlePressOut = () => {
    scaleAnim.value = withSpring(1, SPRING)
  }

  const handlePress = () => {
    if (haptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress?.()
  }

  // ── Loading skeleton ──
  if (loading) {
    return (
      <View style={[styles.card, style]} testID={testID}>
        <View
          style={[
            styles.skeletonTitle,
            { backgroundColor: theme.colors.surface },
          ]}
        />
        <View
          style={[
            styles.skeletonValue,
            { backgroundColor: theme.colors.surface },
          ]}
        />
        <View
          style={[
            styles.skeletonChange,
            { backgroundColor: theme.colors.surface },
          ]}
        />
      </View>
    )
  }

  const Wrapper = onPress ? Pressable : View

  return (
    <Animated.View style={pressStyle}>
      <Wrapper
        style={[styles.card, style]}
        onPress={onPress ? handlePress : undefined}
        onPressIn={onPress ? handlePressIn : undefined}
        onPressOut={onPress ? handlePressOut : undefined}
        accessibilityRole={onPress ? 'button' : 'text'}
        accessibilityLabel={`${title}: ${effectivePrefix}${value}${effectiveSuffix}${changeAmount !== undefined ? `, ${changeType === 'increase' ? 'up' : changeType === 'decrease' ? 'down' : ''} ${Math.abs(changeAmount).toFixed(1)}%` : ''}`}
        testID={testID}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text
            style={{
              fontSize: 13,
              ...fontStyle(theme.typography, 'medium'),
              color: theme.colors.muted,
            }}
          >
            {title}
          </Text>
          {icon && (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.primary + '12' },
              ]}
            >
              {icon}
            </View>
          )}
        </View>

        {/* Value */}
        <View style={styles.valueRow}>
          <AnimatedValue
            value={value}
            format={format}
            prefix={effectivePrefix}
            suffix={effectiveSuffix}
            decimals={decimals}
            animated={animated}
            color={theme.colors.foreground}
            typography={theme.typography}
          />
        </View>

        {/* Change indicator */}
        {changeAmount !== undefined && (
          <View style={styles.changeRow}>
            <View
              style={[
                styles.changeBadge,
                { backgroundColor: changeColor + '15' },
              ]}
            >
              <Ionicons
                name={changeIcon as any}
                size={14}
                color={changeColor}
              />
              <Text
                style={{
                  fontSize: 12,
                  ...fontStyle(theme.typography, 'semibold'),
                  color: changeColor,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {Math.abs(changeAmount).toFixed(1)}%
              </Text>
            </View>
            {previousValue !== undefined && (
              <Text
                style={{
                  fontSize: 11,
                  color: theme.colors.muted,
                }}
              >
                vs {effectivePrefix}{previousValue.toLocaleString()}{effectiveSuffix}
              </Text>
            )}
          </View>
        )}
      </Wrapper>
    </Animated.View>
  )
})
StatCard.displayName = 'StatCard'
