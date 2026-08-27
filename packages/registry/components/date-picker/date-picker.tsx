// native-mate: date-picker@0.1.0 | hash:PLACEHOLDER
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, useStrings, Text, makeStyles, fontStyle, withAlpha } from '@native-mate/core'
import { Sheet } from '../sheet/sheet'
import type { DatePickerProps, Weekday } from './date-picker.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

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
  periodColumn: {
    gap: 6,
    paddingLeft: 4,
  },
  periodButton: {
    minWidth: 44,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
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

/** Rotate a Sunday-first 7-element array so `first` becomes index 0. */
function rotateWeek<T>(week: T[], first: number): T[] {
  return week.map((_, i) => week[(i + first) % 7])
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
          { backgroundColor: withAlpha(theme.colors.primary, 0.08) },
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
  visible?: boolean
  /** Weekday abbreviations, already rotated to start at `firstDayOfWeek`. */
  weekdays: string[]
  /** Full month names, Jan-first, for accessibility labels. */
  months: string[]
  firstDayOfWeek: number
  todayLabel: string
}

const CalendarGrid: React.FC<CalendarProps> = ({
  value,
  viewYear,
  viewMonth,
  onSelect,
  minimumDate,
  maximumDate,
  haptic: enableHaptic = true,
  visible = true,
  weekdays,
  months,
  firstDayOfWeek,
  todayLabel,
}) => {
  const theme = useTheme()
  const styles = useStyles()

  // Recompute "today" whenever the picker becomes visible so a long-lived
  // screen doesn't keep showing yesterday's date after midnight.
  const today = useMemo(() => new Date(), [visible])

  const weeks = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth)
    // Offset of the 1st within a week that starts on `firstDayOfWeek`.
    const firstDay = (getFirstDayOfWeek(viewYear, viewMonth) - firstDayOfWeek + 7) % 7
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
  }, [viewYear, viewMonth, firstDayOfWeek])

  return (
    <View style={styles.calendarGrid}>
      {/* Week day headers */}
      <View style={styles.weekRow}>
        {weekdays.map((day, i) => (
          <View key={`${day}-${i}`} style={styles.weekDay}>
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
              return <View key={`empty-${wi}-${di}`} style={styles.dayCell} />
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
                  accessibilityLabel={`${months[viewMonth]} ${day}, ${viewYear}${isSelected ? ', selected' : ''}${isToday ? `, ${todayLabel}` : ''}`}
                  accessibilityState={{ selected: isSelected, disabled: isDisabled }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      ...fontStyle(theme.typography, isSelected || isToday ? 'semibold' : 'regular'),
                      color: isDisabled
                        ? withAlpha(theme.colors.muted, 0.38)
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

// ── Locale resolution ────────────────────────────────────────────────────────

interface CalendarNames {
  months: string[]
  monthsShort: string[]
  weekdaysShort: string[]
  am: string
  pm: string
}

// 2021-08-01 (UTC) is a Sunday — the anchor for weekday-name extraction.
const WEEK_ANCHOR_UTC = Date.UTC(2021, 7, 1)

/**
 * Resolve calendar copy for `locale`, falling back to the strings slot.
 *
 * NOTE ON HERMES: `Intl` exists in Hermes, but the Android build only carries
 * the locale DATA the app was compiled with. A tag Hermes has no data for does
 * not throw — it silently formats in English. So this is a best-effort
 * enhancement, not a guarantee: apps that must render non-English month and
 * weekday names should pass their own `strings` to `StringsContext` rather than
 * relying on `locale`.
 */
function resolveNames(locale: string | undefined, fallback: CalendarNames): CalendarNames {
  if (!locale) return fallback
  try {
    const longFmt = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' })
    const shortFmt = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' })
    const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })

    const months: string[] = []
    const monthsShort: string[] = []
    for (let i = 0; i < 12; i++) {
      const d = new Date(Date.UTC(2021, i, 15))
      months.push(longFmt.format(d))
      monthsShort.push(shortFmt.format(d))
    }

    const weekdaysShort: string[] = []
    for (let i = 0; i < 7; i++) {
      weekdaysShort.push(weekdayFmt.format(new Date(WEEK_ANCHOR_UTC + i * 86400000)))
    }

    let { am, pm } = fallback
    try {
      const hourFmt = new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true, timeZone: 'UTC' })
      const period = (d: Date) =>
        hourFmt.formatToParts(d).find((p) => p.type === 'dayPeriod')?.value
      const resolvedAm = period(new Date(Date.UTC(2021, 0, 1, 9)))
      const resolvedPm = period(new Date(Date.UTC(2021, 0, 1, 21)))
      if (resolvedAm && resolvedPm && resolvedAm !== resolvedPm) {
        am = resolvedAm
        pm = resolvedPm
      }
    } catch {
      // formatToParts is missing in some Intl-less builds — keep the fallback.
    }

    if (months.every(Boolean) && weekdaysShort.every(Boolean)) {
      return { months, monthsShort, weekdaysShort, am, pm }
    }
  } catch {
    // Unknown tag, or no Intl at all. Never throw — fall through to strings.
  }
  return fallback
}

// ── DatePicker ───────────────────────────────────────────────────────────────

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  mode = 'date',
  minimumDate,
  maximumDate,
  visible = false,
  onClose,
  title,
  showConfirmButton = false,
  confirmLabel,
  cancelLabel,
  firstDayOfWeek = 0,
  locale,
  hour12,
  haptic = true,
  disabled = false,
  sheetHeight = 420,
  style,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const strings = useStrings()

  const [viewYear, setViewYear] = useState(value.getFullYear())
  const [viewMonth, setViewMonth] = useState(value.getMonth())
  const [pendingDate, setPendingDate] = useState(value)

  const names = useMemo(
    () =>
      resolveNames(locale, {
        months: strings.months,
        monthsShort: strings.monthsShort,
        weekdaysShort: strings.weekdaysShort,
        am: 'AM',
        pm: 'PM',
      }),
    [locale, strings]
  )

  const weekdays = useMemo(
    () => rotateWeek(names.weekdaysShort, firstDayOfWeek as Weekday),
    [names, firstDayOfWeek]
  )

  // 12h/24h: the caller wins, then whatever Intl reports for the locale, then
  // 24-hour (the safe default when Intl cannot answer).
  const use12Hour = useMemo(() => {
    if (typeof hour12 === 'boolean') return hour12
    try {
      return !!new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hour12
    } catch {
      return false
    }
  }, [hour12, locale])

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
        const newMonth = prev + direction
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
      setPendingDate(newDate)
      if (!showConfirmButton) onChange(newDate)
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

  const handleCancel = () => {
    if (haptic && Haptics) Haptics.selectionAsync()
    onClose?.()
  }

  const showCalendar = mode === 'date' || mode === 'datetime'
  const showTime = mode === 'time' || mode === 'datetime'

  const hours24 = pendingDate.getHours()
  const isPm = hours24 >= 12
  // 12h boundaries: 0 → 12 AM, 12 → 12 PM.
  const displayHour = use12Hour ? (hours24 % 12 === 0 ? 12 : hours24 % 12) : hours24

  const setHour12 = (h12: number) => {
    // 12 AM is hour 0, 12 PM is hour 12.
    handleTimeChange('hours', (h12 % 12) + (isPm ? 12 : 0))
  }

  const setPeriod = (pm: boolean) => {
    if (pm === isPm) return
    handleTimeChange('hours', pm ? hours24 + 12 : hours24 - 12)
  }

  const resolvedConfirmLabel = confirmLabel ?? strings.done
  const resolvedCancelLabel = cancelLabel ?? strings.cancel

  return (
    <Sheet
      visible={visible}
      onClose={() => onClose?.()}
      height={sheetHeight}
      title={title}
      // datetime stacks a calendar and a time row — let it scroll on short screens.
      scrollable={mode === 'datetime'}
    >
      <View
        style={[styles.container, { opacity: disabled ? 0.5 : 1 }, style]}
        pointerEvents={disabled ? 'none' : 'auto'}
      >
        {showCalendar && (
          <>
            {/* Month/Year navigation */}
            <View style={styles.header}>
              <Pressable
                style={styles.monthYearButton}
                accessibilityRole="text"
                accessibilityLabel={`${names.months[viewMonth]} ${viewYear}`}
              >
                <Text
                  style={{
                    fontSize: 17,
                    ...fontStyle(theme.typography, 'bold'),
                    color: theme.colors.foreground,
                  }}
                >
                  {names.months[viewMonth]} {viewYear}
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
              visible={visible}
              weekdays={weekdays}
              months={names.months}
              firstDayOfWeek={firstDayOfWeek}
              todayLabel={strings.today}
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
              value={displayHour}
              min={use12Hour ? 1 : 0}
              max={use12Hour ? 12 : 23}
              onChange={(v) => (use12Hour ? setHour12(v) : handleTimeChange('hours', v))}
              label="Hour"
              pad={!use12Hour}
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

            {use12Hour && (
              <View style={styles.periodColumn}>
                {[false, true].map((pm) => {
                  const active = pm === isPm
                  const label = pm ? names.pm : names.am
                  return (
                    <Pressable
                      key={label}
                      style={[
                        styles.periodButton,
                        {
                          backgroundColor: active
                            ? withAlpha(theme.colors.primary, 0.13)
                            : theme.colors.surface,
                        },
                      ]}
                      onPress={() => setPeriod(pm)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={label}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          ...fontStyle(theme.typography, active ? 'semibold' : 'regular'),
                          color: active ? theme.colors.primary : theme.colors.muted,
                        }}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            )}
          </View>
        )}

        {showConfirmButton && (
          <View
            style={[styles.confirmRow, { borderTopColor: theme.colors.border }]}
          >
            <Pressable
              style={styles.cancelButton}
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel={resolvedCancelLabel}
            >
              <Text
                style={{ fontSize: 15, ...fontStyle(theme.typography, 'semibold'), color: theme.colors.muted }}
              >
                {resolvedCancelLabel}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.confirmButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleConfirm}
              accessibilityRole="button"
              accessibilityLabel={resolvedConfirmLabel}
            >
              <Text
                style={{ fontSize: 15, ...fontStyle(theme.typography, 'semibold'), color: theme.colors.onPrimary }}
              >
                {resolvedConfirmLabel}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </Sheet>
  )
}
