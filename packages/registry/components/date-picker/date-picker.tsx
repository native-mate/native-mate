// native-mate: date-picker@0.1.0 | hash:PLACEHOLDER
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { View, Pressable, ScrollView, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles, fontStyle } from '@native-mate/core'
import type { DatePickerProps } from './date-picker.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

const SPRING = { damping: 18, stiffness: 200, mass: 0.7 }
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 12,
  },
  monthYearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
  },
  calendarGrid: {
    gap: 2,
  },
  weekRowDays: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  timeUnit: {
    alignItems: 'center',
    gap: 4,
  },
  timeButton: {
    width: 40,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeValue: {
    width: 56,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSeparator: {
    paddingBottom: 4,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
}))

// ── Helpers ──────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isDateInRange(date: Date, min?: Date, max?: Date): boolean {
  if (min && date < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return false
  if (max && date > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return false
  return true
}

// ── Time Spinner ─────────────────────────────────────────────────────────────

interface TimeSpinnerProps {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  label: string
  pad?: boolean
  haptic?: boolean
}

const TimeSpinner: React.FC<TimeSpinnerProps> = ({
  value,
  min,
  max,
  onChange,
  label,
  pad = true,
  haptic: enableHaptic = true,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const increment = () => {
    const next = value >= max ? min : value + 1
    if (enableHaptic && Haptics) Haptics.selectionAsync()
    onChange(next)
  }

  const decrement = () => {
    const next = value <= min ? max : value - 1
    if (enableHaptic && Haptics) Haptics.selectionAsync()
    onChange(next)
  }

  const display = pad ? String(value).padStart(2, '0') : String(value)

  return (
    <View style={styles.timeUnit}>
      <Text variant="caption" muted style={{ fontSize: 10 }}>
        {label}
      </Text>
      <Pressable
        style={[styles.timeButton, { backgroundColor: theme.colors.surface }]}
        onPress={increment}
        accessibilityLabel={`Increase ${label}`}
        accessibilityRole="button"
      >
        <Ionicons name="chevron-up" size={16} color={theme.colors.foreground} />
      </Pressable>
      <View
        style={[
          styles.timeValue,
          { backgroundColor: theme.colors.primary + '15' },
        ]}
      >
        <Text
          style={{
            fontSize: 22,
            ...fontStyle(theme.typography, 'bold'),
            color: theme.colors.primary,
            fontVariant: ['tabular-nums'],
          }}
        >
          {display}
        </Text>
      </View>
      <Pressable
        style={[styles.timeButton, { backgroundColor: theme.colors.surface }]}
        onPress={decrement}
        accessibilityLabel={`Decrease ${label}`}
        accessibilityRole="button"
      >
        <Ionicons name="chevron-down" size={16} color={theme.colors.foreground} />
      </Pressable>
    </View>
  )
}

// ── Calendar Grid ────────────────────────────────────────────────────────────

interface CalendarProps {
  value: Date
  viewYear: number
  viewMonth: number
  onSelect: (date: Date) => void
  minimumDate?: Date
  maximumDate?: Date
  haptic?: boolean
}

const CalendarGrid: React.FC<CalendarProps> = ({
  value,
  viewYear,
  viewMonth,
  onSelect,
  minimumDate,
  maximumDate,
  haptic: enableHaptic = true,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const today = useMemo(() => new Date(), [])

  const weeks = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth)
    const firstDay = getFirstDayOfWeek(viewYear, viewMonth)
    const rows: (number | null)[][] = []
    let currentWeek: (number | null)[] = []

    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        rows.push(currentWeek)
        currentWeek = []
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null)
      rows.push(currentWeek)
    }

    return rows
  }, [viewYear, viewMonth])

  return (
    <View style={styles.calendarGrid}>
      {/* Week day headers */}
      <View style={styles.weekRow}>
        {DAYS.map((day) => (
          <View key={day} style={styles.weekDay}>
            <Text
              style={{
                fontSize: 12,
                ...fontStyle(theme.typography, 'semibold'),
                color: theme.colors.muted,
              }}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar days */}
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRowDays}>
          {week.map((day, di) => {
            if (day === null) {
              return <View key={`empty-${di}`} style={styles.dayCell} />
            }

            const date = new Date(viewYear, viewMonth, day)
            const isSelected = isSameDay(date, value)
            const isToday = isSameDay(date, today)
            const isDisabled = !isDateInRange(date, minimumDate, maximumDate)

            return (
              <View key={day} style={styles.dayCell}>
                <Pressable
                  style={[
                    styles.dayCircle,
                    isSelected && { backgroundColor: theme.colors.primary },
                    isToday && !isSelected && {
                      borderWidth: 1.5,
                      borderColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => {
                    if (isDisabled) return
                    if (enableHaptic && Haptics) Haptics.selectionAsync()
                    onSelect(date)
                  }}
                  disabled={isDisabled}
                  accessibilityRole="button"
                  accessibilityLabel={`${MONTHS[viewMonth]} ${day}, ${viewYear}${isSelected ? ', selected' : ''}${isToday ? ', today' : ''}`}
                  accessibilityState={{ selected: isSelected, disabled: isDisabled }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      ...fontStyle(theme.typography, isSelected || isToday ? 'semibold' : 'regular'),
                      color: isDisabled
                        ? theme.colors.muted + '60'
                        : isSelected
                          ? theme.colors.onPrimary
                          : theme.colors.foreground,
                    }}
                  >
                    {day}
                  </Text>
                </Pressable>
              </View>
            )
          })}
        </View>
      ))}
    </View>
  )
}

// ── DatePicker ───────────────────────────────────────────────────────────────

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  mode = 'date',
  minimumDate,
  maximumDate,
  visible = true,
  onClose,
  title,
  showConfirmButton = false,
  confirmLabel = 'Done',
  haptic = true,
  disabled = false,
  sheetHeight = 420,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  const [viewYear, setViewYear] = useState(value.getFullYear())
  const [viewMonth, setViewMonth] = useState(value.getMonth())
  const [pendingDate, setPendingDate] = useState(value)

  useEffect(() => {
    if (visible) {
      setViewYear(value.getFullYear())
      setViewMonth(value.getMonth())
      setPendingDate(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, visible])

  const navigateMonth = useCallback(
    (direction: -1 | 1) => {
      if (haptic && Haptics) Haptics.selectionAsync()
      setViewMonth((prev) => {
        let newMonth = prev + direction
        if (newMonth < 0) {
          setViewYear((y) => y - 1)
          return 11
        }
        if (newMonth > 11) {
          setViewYear((y) => y + 1)
          return 0
        }
        return newMonth
      })
    },
    [haptic]
  )

  const handleDaySelect = useCallback(
    (date: Date) => {
      const newDate = new Date(pendingDate)
      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
      if (showConfirmButton) {
        setPendingDate(newDate)
      } else {
        setPendingDate(newDate)
        onChange(newDate)
      }
    },
    [pendingDate, showConfirmButton, onChange]
  )

  const handleTimeChange = useCallback(
    (field: 'hours' | 'minutes', val: number) => {
      const newDate = new Date(pendingDate)
      if (field === 'hours') newDate.setHours(val)
      else newDate.setMinutes(val)
      setPendingDate(newDate)
      if (!showConfirmButton) onChange(newDate)
    },
    [pendingDate, showConfirmButton, onChange]
  )

  const handleConfirm = () => {
    if (haptic && Haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onChange(pendingDate)
    onClose?.()
  }

  if (!visible) return null

  const showCalendar = mode === 'date' || mode === 'datetime'
  const showTime = mode === 'time' || mode === 'datetime'

  return (
    <View
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      {title && (
        <Text
          variant="heading"
          style={{ marginBottom: 12, textAlign: 'center' }}
        >
          {title}
        </Text>
      )}

      {showCalendar && (
        <>
          {/* Month/Year navigation */}
          <View style={styles.header}>
            <Pressable
              style={styles.monthYearButton}
              accessibilityRole="text"
              accessibilityLabel={`${MONTHS[viewMonth]} ${viewYear}`}
            >
              <Text
                style={{
                  fontSize: 17,
                  ...fontStyle(theme.typography, 'bold'),
                  color: theme.colors.foreground,
                }}
              >
                {MONTHS[viewMonth]} {viewYear}
              </Text>
            </Pressable>

            <View style={styles.navButtons}>
              <Pressable
                style={[
                  styles.navButton,
                  { backgroundColor: theme.colors.surface },
                ]}
                onPress={() => navigateMonth(-1)}
                accessibilityLabel="Previous month"
                accessibilityRole="button"
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={theme.colors.foreground}
                />
              </Pressable>
              <Pressable
                style={[
                  styles.navButton,
                  { backgroundColor: theme.colors.surface },
                ]}
                onPress={() => navigateMonth(1)}
                accessibilityLabel="Next month"
                accessibilityRole="button"
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.colors.foreground}
                />
              </Pressable>
            </View>
          </View>

          <CalendarGrid
            value={pendingDate}
            viewYear={viewYear}
            viewMonth={viewMonth}
            onSelect={handleDaySelect}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            haptic={haptic}
          />
        </>
      )}

      {showTime && (
        <View
          style={[
            styles.timeContainer,
            showCalendar && { borderTopColor: theme.colors.border },
          ]}
        >
          <TimeSpinner
            value={pendingDate.getHours()}
            min={0}
            max={23}
            onChange={(v) => handleTimeChange('hours', v)}
            label="Hour"
            haptic={haptic}
          />
          <Text
            style={[
              styles.timeSeparator,
              { fontSize: 28, ...fontStyle(theme.typography, 'bold'), color: theme.colors.foreground },
            ]}
          >
            :
          </Text>
          <TimeSpinner
            value={pendingDate.getMinutes()}
            min={0}
            max={59}
            onChange={(v) => handleTimeChange('minutes', v)}
            label="Min"
            haptic={haptic}
          />
        </View>
      )}

      {showConfirmButton && (
        <View
          style={[styles.confirmRow, { borderTopColor: theme.colors.border }]}
        >
          <Pressable
            style={[
              styles.confirmButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={handleConfirm}
            accessibilityRole="button"
            accessibilityLabel={confirmLabel}
          >
            <Text
              style={{ fontSize: 15, ...fontStyle(theme.typography, 'semibold'), color: theme.colors.onPrimary }}
            >
              {confirmLabel}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}
