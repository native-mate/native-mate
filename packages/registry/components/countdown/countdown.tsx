// native-mate: countdown@0.1.0 | hash:PLACEHOLDER
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { CountdownProps, CountdownFormat } from './countdown.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const sizeMap = {
  sm: { digitSize: 20, labelSize: 9, cardPx: 8, cardPy: 6, cardMin: 36, gap: 4, sepSize: 16 },
  md: { digitSize: 30, labelSize: 11, cardPx: 12, cardPy: 10, cardMin: 52, gap: 6, sepSize: 22 },
  lg: { digitSize: 42, labelSize: 13, cardPx: 16, cardPy: 14, cardMin: 68, gap: 8, sepSize: 30 },
}

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
}))

// ── Time calculation ─────────────────────────────────────────────────────────

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function calcTimeLeft(target: Date): TimeLeft {
  const now = new Date().getTime()
  const diff = Math.max(0, target.getTime() - now)
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    total: diff,
  }
}

function getUnits(format: CountdownFormat, time: TimeLeft): { value: number; label: string }[] {
  switch (format) {
    case 'dhms':
      return [
        { value: time.days, label: 'Days' },
        { value: time.hours, label: 'Hours' },
        { value: time.minutes, label: 'Min' },
        { value: time.seconds, label: 'Sec' },
      ]
    case 'hms':
      return [
        { value: time.days * 24 + time.hours, label: 'Hours' },
        { value: time.minutes, label: 'Min' },
        { value: time.seconds, label: 'Sec' },
      ]
    case 'ms':
      return [
        { value: time.days * 1440 + time.hours * 60 + time.minutes, label: 'Min' },
        { value: time.seconds, label: 'Sec' },
      ]
  }
}

// ── Animated digit ───────────────────────────────────────────────────────────

interface DigitCellProps {
  value: number
  prevValue: number
  digitSize: number
  color: string
  animated: boolean
}

const DigitCell: React.FC<DigitCellProps> = ({
  value,
  prevValue,
  digitSize,
  color,
  animated,
}) => {
  const theme = useTheme()
  const translateY = useSharedValue(0)
  const scale = useSharedValue(1)

  useEffect(() => {
    if (animated && value !== prevValue) {
      translateY.value = withSequence(
        withTiming(-4, { duration: 80 }),
        withSpring(0, { damping: 12, stiffness: 200, mass: 0.5 })
      )
      scale.value = withSequence(
        withTiming(1.1, { duration: 80 }),
        withSpring(1, { damping: 12, stiffness: 200, mass: 0.5 })
      )
    }
  }, [value, prevValue, animated])

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }))

  const display = String(value).padStart(2, '0')

  return (
    <Animated.View style={animStyle}>
      <Text
        style={{
          fontSize: digitSize,
          ...fontStyle(theme.typography, 'bold'),
          color,
          fontVariant: ['tabular-nums'],
          textAlign: 'center',
        }}
      >
        {display}
      </Text>
    </Animated.View>
  )
}

// ── Card unit ────────────────────────────────────────────────────────────────

interface CardUnitProps {
  value: number
  prevValue: number
  label: string
  size: keyof typeof sizeMap
  digitColor: string
  cardColor: string
  animated: boolean
}

const CardUnit: React.FC<CardUnitProps> = ({
  value,
  prevValue,
  label,
  size,
  digitColor,
  cardColor,
  animated,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const sz = sizeMap[size]

  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: cardColor,
            paddingHorizontal: sz.cardPx,
            paddingVertical: sz.cardPy,
            minWidth: sz.cardMin,
          },
        ]}
      >
        <DigitCell
          value={value}
          prevValue={prevValue}
          digitSize={sz.digitSize}
          color={digitColor}
          animated={animated}
        />
      </View>
      <Text
        style={{
          fontSize: sz.labelSize,
          ...fontStyle(theme.typography, 'medium'),
          color: theme.colors.muted,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
    </View>
  )
}

// ── Countdown ────────────────────────────────────────────────────────────────

export const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  onComplete,
  format = 'dhms',
  separator = ':',
  size = 'md',
  variant = 'card',
  label,
  digitColor: digitColorProp,
  cardColor: cardColorProp,
  animated = true,
  disabled = false,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const sz = sizeMap[size]

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(targetDate))
  const prevTimeRef = useRef<TimeLeft>(timeLeft)
  const completedRef = useRef(false)
  const timeLeftRef = useRef<TimeLeft>(timeLeft)

  useEffect(() => {
    timeLeftRef.current = timeLeft
  }, [timeLeft])

  const digitColor = digitColorProp ?? theme.colors.foreground
  const cardColor = cardColorProp ?? (theme.colors.surfaceRaised ?? theme.colors.surface)

  useEffect(() => {
    if (disabled) return

    const tick = () => {
      const newTime = calcTimeLeft(targetDate)
      prevTimeRef.current = timeLeftRef.current
      timeLeftRef.current = newTime
      setTimeLeft(newTime)

      if (newTime.total <= 0 && !completedRef.current) {
        completedRef.current = true
        if (Haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        onComplete?.()
      }
    }

    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [targetDate, disabled])

  useEffect(() => {
    completedRef.current = false
  }, [targetDate])

  const units = getUnits(format, timeLeft)
  const prevUnits = getUnits(format, prevTimeRef.current)

  if (variant === 'minimal') {
    const display = units
      .map((u) => String(u.value).padStart(2, '0'))
      .join(separator)

    return (
      <View style={[{ alignItems: 'center', opacity: disabled ? 0.5 : 1 }, style]}>
        {label && (
          <Text variant="caption" muted style={{ marginBottom: 4 }}>
            {label}
          </Text>
        )}
        <Text
          style={{
            fontSize: sz.digitSize,
            ...fontStyle(theme.typography, 'bold'),
            color: digitColor,
            fontVariant: ['tabular-nums'],
          }}
        >
          {display}
        </Text>
      </View>
    )
  }

  if (variant === 'inline') {
    return (
      <View style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}>
        {label && (
          <Text variant="caption" muted>
            {label}
          </Text>
        )}
        <View style={styles.row}>
          {units.map((unit, i) => (
            <React.Fragment key={unit.label}>
              <DigitCell
                value={unit.value}
                prevValue={prevUnits[i]?.value ?? unit.value}
                digitSize={sz.digitSize}
                color={digitColor}
                animated={animated}
              />
              {i < units.length - 1 && (
                <Text
                  style={{
                    fontSize: sz.sepSize,
                    ...fontStyle(theme.typography, 'bold'),
                    color: theme.colors.muted,
                    marginHorizontal: sz.gap,
                  }}
                >
                  {separator}
                </Text>
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    )
  }

  // Card variant (default)
  return (
    <View style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}>
      {label && (
        <Text
          variant="caption"
          muted
          style={{ marginBottom: 4, textAlign: 'center' }}
        >
          {label}
        </Text>
      )}
      <View style={[styles.row, { gap: sz.gap }]}>
        {units.map((unit, i) => (
          <React.Fragment key={unit.label}>
            <CardUnit
              value={unit.value}
              prevValue={prevUnits[i]?.value ?? unit.value}
              label={unit.label}
              size={size}
              digitColor={digitColor}
              cardColor={cardColor}
              animated={animated}
            />
            {i < units.length - 1 && (
              <Text
                style={{
                  fontSize: sz.sepSize,
                  ...fontStyle(theme.typography, 'bold'),
                  color: theme.colors.muted,
                  marginBottom: sz.labelSize + 8,
                }}
              >
                {separator}
              </Text>
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  )
}
