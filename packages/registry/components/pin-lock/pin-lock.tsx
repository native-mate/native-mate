// native-mate: pin-lock@0.1.0 | hash:PLACEHOLDER
import React, { useState, useCallback, useEffect } from 'react'
import { View, Pressable, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { PinLockProps } from './pin-lock.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    ...fontStyle(theme.typography, 'bold'),
    color: theme.colors.foreground,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.muted,
    textAlign: 'center',
  },
  errorText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.destructive,
    textAlign: 'center',
    ...fontStyle(theme.typography, 'medium'),
  },
  attemptsText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.warning,
    textAlign: 'center',
    marginTop: 4,
  },
  lockText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.destructive,
    textAlign: 'center',
    ...fontStyle(theme.typography, 'semibold'),
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 48,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  dotFilled: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dotError: {
    backgroundColor: theme.colors.destructive,
    borderColor: theme.colors.destructive,
  },
  keypad: {
    gap: 16,
  },
  keypadRow: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
  },
  key: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  keyPressed: {
    backgroundColor: theme.colors.primary + '15',
  },
  keyText: {
    fontSize: 28,
    ...fontStyle(theme.typography, 'medium'),
    color: theme.colors.foreground,
  },
  keySubtext: {
    fontSize: 9,
    color: theme.colors.muted,
    letterSpacing: 2,
    marginTop: 1,
  },
  biometricButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyKey: {
    width: 72,
    height: 72,
  },
}))

// ── Dot ───────────────────────────────────────────────────────────

function Dot({
  filled,
  error,
}: {
  filled: boolean
  error: boolean
}) {
  const styles = useStyles()
  const scale = useSharedValue(1)
  const wasFilled = React.useRef(filled)

  useEffect(() => {
    if (filled && !wasFilled.current) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 8, stiffness: 400 }),
        withSpring(1, { damping: 12, stiffness: 300 }),
      )
    }
    wasFilled.current = filled
  }, [filled])

  const dotAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View
      style={[
        styles.dot,
        filled && (error ? styles.dotError : styles.dotFilled),
        dotAnimStyle,
      ]}
    />
  )
}

const keyLetters: Record<string, string> = {
  '2': 'ABC',
  '3': 'DEF',
  '4': 'GHI',
  '5': 'JKL',
  '6': 'MNO',
  '7': 'PQRS',
  '8': 'TUV',
  '9': 'WXYZ',
}

export const PinLock: React.FC<PinLockProps> = ({
  length = 4,
  onComplete,
  onBiometric,
  showBiometric = false,
  title = 'Enter PIN',
  subtitle,
  error = false,
  errorMessage,
  locked = false,
  lockDuration = 0,
  maxAttempts,
  attemptsRemaining,
  haptic = true,
  style,
  ...rest
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const [pin, setPin] = useState('')
  const [lockTimer, setLockTimer] = useState(lockDuration)
  const shakeX = useSharedValue(0)

  const shakeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }))

  // Lock timer countdown
  useEffect(() => {
    if (!locked || lockTimer <= 0) return
    const interval = setInterval(() => {
      setLockTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [locked, lockTimer])

  useEffect(() => {
    if (locked) setLockTimer(lockDuration)
  }, [locked, lockDuration])

  // Error shake
  useEffect(() => {
    if (error) {
      shakeX.value = withSequence(
        withTiming(-12, { duration: 50 }),
        withTiming(12, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      )
      if (haptic && Haptics) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      }
      setTimeout(() => setPin(''), 400)
    }
  }, [error])

  const handleKeyPress = useCallback(
    (digit: string) => {
      if (locked || pin.length >= length) return
      if (haptic && Haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
      const newPin = pin + digit
      setPin(newPin)
      if (newPin.length === length) {
        setTimeout(() => onComplete?.(newPin), 200)
      }
    },
    [pin, length, locked, haptic, onComplete],
  )

  const handleDelete = useCallback(() => {
    if (locked || pin.length === 0) return
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    setPin((prev) => prev.slice(0, -1))
  }, [pin, locked, haptic])

  const handleBiometric = useCallback(() => {
    if (haptic && Haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    onBiometric?.()
  }, [haptic, onBiometric])

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const renderKey = (digit: string, sub?: string) => (
    <Pressable
      key={digit}
      onPress={() => handleKeyPress(digit)}
      disabled={locked}
      style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${digit}${sub ? `, ${sub}` : ''}`}
    >
      <Text variant="title" style={styles.keyText}>
        {digit}
      </Text>
      {sub != null && (
        <Text variant="caption" style={styles.keySubtext}>
          {sub}
        </Text>
      )}
    </Pressable>
  )

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="form"
      accessibilityLabel={`PIN entry, ${length} digits`}
      {...rest}
    >
      <View style={styles.header}>
        <Text variant="title" style={styles.title}>
          {title}
        </Text>
        {locked && lockTimer > 0 ? (
          <Text variant="body" style={styles.lockText}>
            Try again in {formatTime(lockTimer)}
          </Text>
        ) : error && errorMessage ? (
          <Text variant="body" style={styles.errorText}>
            {errorMessage}
          </Text>
        ) : subtitle ? (
          <Text variant="body" style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
        {attemptsRemaining != null && attemptsRemaining > 0 && !locked && (
          <Text variant="caption" style={styles.attemptsText}>
            {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining
          </Text>
        )}
      </View>

      <Animated.View style={[styles.dotsRow, shakeAnimStyle]}>
        {Array.from({ length }).map((_, i) => (
          <Dot key={i} filled={i < pin.length} error={error} />
        ))}
      </Animated.View>

      <View style={styles.keypad}>
        <View style={styles.keypadRow}>
          {renderKey('1')}
          {renderKey('2', keyLetters['2'])}
          {renderKey('3', keyLetters['3'])}
        </View>
        <View style={styles.keypadRow}>
          {renderKey('4', keyLetters['4'])}
          {renderKey('5', keyLetters['5'])}
          {renderKey('6', keyLetters['6'])}
        </View>
        <View style={styles.keypadRow}>
          {renderKey('7', keyLetters['7'])}
          {renderKey('8', keyLetters['8'])}
          {renderKey('9', keyLetters['9'])}
        </View>
        <View style={styles.keypadRow}>
          {showBiometric && onBiometric ? (
            <Pressable
              onPress={handleBiometric}
              style={styles.biometricButton}
              disabled={locked}
              accessibilityRole="button"
              accessibilityLabel="Use biometric authentication"
            >
              <Ionicons
                name={Platform.OS === 'ios' ? 'finger-print' : 'finger-print'}
                size={28}
                color={locked ? theme.colors.muted : theme.colors.primary}
              />
            </Pressable>
          ) : (
            <View style={styles.emptyKey} />
          )}
          {renderKey('0')}
          <Pressable
            onPress={handleDelete}
            onLongPress={() => {
              if (haptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              setPin('')
            }}
            style={styles.deleteButton}
            disabled={locked || pin.length === 0}
            accessibilityRole="button"
            accessibilityLabel="Delete"
          >
            <Ionicons
              name="backspace-outline"
              size={26}
              color={
                pin.length > 0 && !locked
                  ? theme.colors.foreground
                  : theme.colors.muted
              }
            />
          </Pressable>
        </View>
      </View>
    </View>
  )
}
