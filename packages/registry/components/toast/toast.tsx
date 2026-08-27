// native-mate: toast@0.3.0 | hash:PLACEHOLDER
import React, { useEffect, useRef, createContext, useContext, useState, useCallback, useMemo } from 'react'
import { View, Pressable, PanResponder, Image, Modal, Platform, AccessibilityInfo, StatusBar } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, useMotion, withAlpha, Text, makeStyles, fontStyle, useHaptics, useStrings } from '@native-mate/core'
import type {
  ToastProps,
  ToastVariant,
  ToastContextValue,
  ToastConfig,
  ToastAction,
  ToastProviderProps,
} from './toast.types'

const variantIconName: Record<ToastVariant, keyof typeof Ionicons.glyphMap> = {
  default:     'information-circle',
  success:     'checkmark-circle',
  destructive: 'close-circle',
  warning:     'warning',
}

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceRaised,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  icon: {
    width: 24, height: 24,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  content: { flex: 1, gap: 2 },
  action: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
}))

// ── Shared toast content ──────────────────────────────────────────────────────
// Single source of truth for what lives inside the animated container, so the
// native (Modal) and web (fixed) branches can never drift apart again.

interface ToastBodyProps {
  message: string
  description?: string
  variant: ToastVariant
  icon?: React.ReactNode
  avatar?: ToastProps['avatar']
  iconBg: string
  iconColor: string
  actions: ToastAction[]
  persistent: boolean
  showProgress: boolean
  onClose: () => void
  progressStyle: any
  testID?: string
}

const ToastBody: React.FC<ToastBodyProps> = ({
  message,
  description,
  variant,
  icon,
  avatar,
  iconBg,
  iconColor,
  actions,
  persistent,
  showProgress,
  onClose,
  progressStyle,
  testID,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const strings = useStrings()

  return (
    <>
      {/* Left side: avatar image OR icon badge */}
      {avatar ? (
        <Image
          source={avatar}
          style={{ width: 40, height: 40, borderRadius: 20, marginTop: 1 }}
        />
      ) : (
        <View style={[styles.icon, { backgroundColor: iconBg }]}>
          {icon
            ? icon
            : <Ionicons name={variantIconName[variant]} size={14} color={iconColor} />
          }
        </View>
      )}

      <View style={styles.content}>
        <Text variant="label">{message}</Text>
        {description && <Text variant="caption" muted>{description}</Text>}
        {actions.length > 0 && (
          <View style={styles.actionsRow}>
            {actions.map((a, idx) => (
              <Pressable
                key={idx}
                testID={testID ? (idx === 0 ? `${testID}-action` : `${testID}-action-${idx}`) : undefined}
                style={[
                  styles.action,
                  a.variant === 'primary' && { borderColor: theme.colors.primary },
                ]}
                onPress={a.onPress}
              >
                <Text
                  variant="caption"
                  style={{
                    ...fontStyle(theme.typography, 'semibold'),
                    color: a.variant === 'primary' ? theme.colors.primary : theme.colors.foreground,
                  }}
                >
                  {a.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {persistent && (
        <Pressable
          testID={testID ? `${testID}-close` : undefined}
          onPress={onClose}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={strings.dismiss}
        >
          <Ionicons name="close" size={18} color={theme.colors.muted} />
        </Pressable>
      )}

      {showProgress && !persistent && (
        <View
          testID={testID ? `${testID}-progress` : undefined}
          style={{
            position: 'absolute',
            bottom: 0, left: 0,
            height: 3,
            // withAlpha() instead of dimming the whole track with `opacity`,
            // which also washed out the fill rendered inside it.
            backgroundColor: withAlpha(iconBg, 0.25),
            borderBottomLeftRadius: theme.radius.lg,
            borderBottomRightRadius: theme.radius.lg,
            width: '100%',
          }}
        >
          <Animated.View style={[{ height: 3, backgroundColor: iconBg }, progressStyle]} />
        </View>
      )}
    </>
  )
}

export const Toast: React.FC<ToastProps> = ({
  message,
  description,
  variant = 'default',
  duration = 3000,
  visible,
  onHide,
  position = 'bottom',
  action,
  actions,
  showProgress = false,
  persistent = false,
  icon,
  avatar,
  haptic = true,
  offset = 0,
  testID,
  id,
}) => {
  const theme = useTheme()
  const styles = useStyles()
  const motion = useMotion()
  const haptics = useHaptics()
  // Keep Modal mounted while animating out so the exit animation plays fully
  const [modalOpen, setModalOpen] = useState(false)
  const translateY = useSharedValue(position === 'bottom' ? 120 : -120)
  const translateX = useSharedValue(0)
  const opacity = useSharedValue(0)
  const progressWidth = useSharedValue(100)

  const iconBg = {
    default: theme.colors.muted,
    success: theme.colors.success,
    destructive: theme.colors.destructive,
    warning: theme.colors.warning,
  }[variant]

  const iconColor = {
    // No onMuted token exists; background is the correct inversion on the
    // muted bg in both color schemes (white-on-gray light, near-black-on-gray dark).
    default: theme.colors.background,
    success: theme.colors.onSuccess,
    destructive: theme.colors.onDestructive,
    warning: theme.colors.onWarning,
  }[variant]

  // Distance from the screen edge to the toast, without relying on
  // react-native-safe-area-context (not a declared dependency of this
  // component) — Android accounts for the status bar, iOS uses a sane
  // default that clears the notch/Dynamic Island on modern devices.
  // `offset` is added on top so callers (and the stacking provider) can push
  // a toast further in from the edge.
  const platformInset = Platform.select({
    android: (StatusBar.currentHeight ?? 24) + 8,
    ios: 56,
    default: 48,
  }) as number
  const edgeOffset = platformInset + offset

  // Motion tokens resolved on the JS thread — never inside a worklet.
  const fast = motion.timing('fast')
  const normal = motion.timing('normal')
  const spring = motion.spring()

  // onHide can change identity between renders while the enter/exit effect is
  // keyed only on [visible, id]; a ref keeps the animation callbacks current.
  const onHideRef = useRef(onHide)
  onHideRef.current = onHide
  const hide = useCallback(() => { onHideRef.current() }, [])
  // Used to cancel stale exit-animation callbacks (race condition when fire() is called rapidly)
  const exitGenRef = useRef(0)

  const dismiss = useCallback(() => {
    exitGenRef.current += 1
    const gen = exitGenRef.current
    opacity.value = withTiming(0, fast)
    translateY.value = withSpring(
      position === 'bottom' ? 120 : -120,
      spring,
      () => { if (exitGenRef.current === gen) runOnJS(hide)() },
    )
  }, [position, hide, fast.duration, spring.damping, spring.stiffness, spring.mass])

  // Parent-driven exit (provider `dismiss(id)`): fade out, unmount the Modal,
  // then report so the queue can drop this entry. `hide` is idempotent.
  const finishExit = useCallback(() => {
    setModalOpen(false)
    onHideRef.current()
  }, [])

  useEffect(() => {
    if (visible) {
      // Cancel any in-flight exit animation so its callback won't fire
      exitGenRef.current += 1
      cancelAnimation(opacity)
      cancelAnimation(translateY)
      setModalOpen(true)
      // Notification feedback, not an impact — `haptic` only gates it on/off.
      if (haptic !== false && haptic !== 'none') {
        if (variant === 'success') haptics.notify('success')
        else if (variant === 'destructive') haptics.notify('error')
        else if (variant === 'warning') haptics.notify('warning')
      }
      translateX.value = 0
      translateY.value = withSpring(0, spring)
      opacity.value = withTiming(1, normal)
      progressWidth.value = 100

      if (Platform.OS === 'ios') {
        AccessibilityInfo.announceForAccessibility(
          description ? `${message}. ${description}` : message
        )
      }

      if (!persistent && duration > 0) {
        // Content timing, not a motion token: the bar must track the toast's
        // own `duration`. It simply doesn't animate under reduced motion.
        if (!motion.reduced) {
          progressWidth.value = withTiming(0, { duration })
        }
        const timer = setTimeout(() => dismiss(), duration)
        return () => clearTimeout(timer)
      }
    } else {
      exitGenRef.current += 1
      const gen = exitGenRef.current
      cancelAnimation(opacity)
      opacity.value = withTiming(0, fast, () => {
        if (exitGenRef.current === gen) runOnJS(finishExit)()
      })
    }
    // `id` is included so a new toast shown while one is already visible
    // (visible stays true, only the content/id changes) restarts this
    // effect — clearing the previous auto-dismiss timer and starting a
    // fresh one for the new content instead of inheriting the old timer.
  }, [visible, id])

  // Swipe-to-dismiss — supports left/right AND vertical (up for bottom toast, down for top toast)
  const activeAxis = useRef<'x' | 'y' | null>(null)

  const panResponder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 5 || Math.abs(gs.dy) > 5,
      onPanResponderGrant: () => {
        activeAxis.current = null
      },
      onPanResponderMove: (_, gs) => {
        // Lock to the dominant axis on first move
        if (!activeAxis.current) {
          activeAxis.current = Math.abs(gs.dx) >= Math.abs(gs.dy) ? 'x' : 'y'
        }
        if (activeAxis.current === 'x') {
          translateX.value = gs.dx
        } else {
          // Follow finger vertically; gs.dy is relative to grant position
          translateY.value = gs.dy
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (activeAxis.current === 'x') {
          if (Math.abs(gs.dx) > 80) {
            translateX.value = withTiming(gs.dx > 0 ? 500 : -500, normal)
            opacity.value = withTiming(0, normal, () => runOnJS(hide)())
          } else {
            translateX.value = withSpring(0, spring)
          }
        } else {
          // Bottom toast: swipe down (positive dy) dismisses; top toast: swipe up (negative dy) dismisses
          const dismissed = position === 'bottom' ? gs.dy > 60 : gs.dy < -60
          if (dismissed) {
            translateY.value = withTiming(position === 'bottom' ? 300 : -300, normal)
            opacity.value = withTiming(0, normal, () => runOnJS(hide)())
          } else {
            translateY.value = withSpring(0, spring)
          }
        }
        activeAxis.current = null
      },
    }),
    [position, hide, normal.duration, spring.damping, spring.stiffness, spring.mass],
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
    opacity: opacity.value,
  }))

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%` as any,
  }))

  // Merge single `action` + `actions` array into one list
  const allActions: ToastAction[] = useMemo(
    () => [...(action ? [action] : []), ...(actions ?? [])],
    [action, actions],
  )

  if (!modalOpen) return null

  const body = (
    <ToastBody
      message={message}
      description={description}
      variant={variant}
      icon={icon}
      avatar={avatar}
      iconBg={iconBg}
      iconColor={iconColor}
      actions={allActions}
      persistent={persistent}
      showProgress={showProgress}
      onClose={dismiss}
      progressStyle={progressStyle}
      testID={testID}
    />
  )

  // On web, render with fixed positioning directly (no Modal portal needed)
  if (Platform.OS === 'web') {
    return (
      <View
        pointerEvents="box-none"
        style={{ position: 'fixed' as any, top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
      >
        <Animated.View
          testID={testID}
          style={[
            styles.container,
            { [position === 'top' ? 'top' : 'bottom']: edgeOffset },
            animatedStyle,
          ]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          {...panResponder.panHandlers}
        >
          {body}
        </Animated.View>
      </View>
    )
  }

  return (
    <Modal visible={modalOpen} transparent animationType="none" onRequestClose={dismiss} statusBarTranslucent>
      <View pointerEvents="box-none" style={{ flex: 1 }}>
        <Animated.View
          testID={testID}
          style={[styles.container, { [position === 'top' ? 'top' : 'bottom']: edgeOffset }, animatedStyle]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          {...panResponder.panHandlers}
        >
          {body}
        </Animated.View>
      </View>
    </Modal>
  )
}

// ── useToast hook ─────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

type EntryState = 'pending' | 'visible' | 'exiting'

interface ToastEntry {
  config: ToastConfig & { id: string }
  state: EntryState
  /** Bumped by update() so the Toast restarts its auto-dismiss timer. */
  rev: number
}

// Vertical gap between stacked toasts when `max` > 1.
const STACK_GAP = 76

export function ToastProvider({ children, max = 1 }: ToastProviderProps) {
  const [entries, setEntries] = useState<ToastEntry[]>([])
  // Monotonically increasing id so every show() call is a distinct queue entry.
  const nextIdRef = useRef(0)
  const maxRef = useRef(max)
  maxRef.current = max

  // Promote queued toasts into the visible slots freed by dismissals.
  // `exiting` entries no longer hold a slot, so the next one starts entering
  // while the outgoing one is still animating away.
  const promote = useCallback((list: ToastEntry[]): ToastEntry[] => {
    const limit = Math.max(1, maxRef.current)
    let shown = list.filter((e) => e.state === 'visible').length
    return list.map((e) => {
      if (e.state === 'pending' && shown < limit) {
        shown += 1
        return { ...e, state: 'visible' as EntryState }
      }
      return e
    })
  }, [])

  // A raised `max` should immediately reveal anything already queued.
  useEffect(() => {
    setEntries((prev) => (prev.some((e) => e.state === 'pending') ? promote(prev) : prev))
  }, [max, promote])

  const show = useCallback((config: ToastConfig): string => {
    nextIdRef.current += 1
    const id = config.id ?? `toast-${nextIdRef.current}`
    setEntries((prev) =>
      promote([
        ...prev.filter((e) => e.config.id !== id),
        { config: { ...config, id }, state: 'pending', rev: 0 },
      ]),
    )
    return id
  }, [promote])

  // Called once a toast has finished animating out.
  const remove = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.config.id !== id)
      return next.length === prev.length ? prev : promote(next)
    })
  }, [promote])

  const dismiss = useCallback((id: string) => {
    setEntries((prev) => {
      const entry = prev.find((e) => e.config.id === id)
      if (!entry || entry.state === 'exiting') return prev
      // Never rendered yet — drop it from the queue outright.
      if (entry.state === 'pending') return promote(prev.filter((e) => e.config.id !== id))
      return promote(prev.map((e) => (e.config.id === id ? { ...e, state: 'exiting' as EntryState } : e)))
    })
  }, [promote])

  // Backwards-compatible imperative API: dismisses the oldest visible toast.
  const hide = useCallback(() => {
    setEntries((prev) => {
      const first = prev.find((e) => e.state === 'visible')
      if (!first) return prev
      return promote(prev.map((e) => (e === first ? { ...e, state: 'exiting' as EntryState } : e)))
    })
  }, [promote])

  const update = useCallback((id: string, config: Partial<ToastConfig>) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.config.id === id
          ? { ...e, config: { ...e.config, ...config, id }, rev: e.rev + 1 }
          : e,
      ),
    )
  }, [])

  const value = useMemo<ToastContextValue>(
    () => ({ show, hide, dismiss, update }),
    [show, hide, dismiss, update],
  )

  // Anything not still queued is mounted; stacking only kicks in when more
  // than one toast may be visible, so max=1 keeps the exact previous layout.
  const rendered = entries.filter((e) => e.state !== 'pending')
  const gap = max > 1 ? STACK_GAP : 0
  const stackCount = { top: 0, bottom: 0 }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {rendered.map((entry) => {
        const pos = entry.config.position === 'top' ? 'top' : 'bottom'
        const index = stackCount[pos]
        stackCount[pos] += 1
        return (
          <Toast
            key={entry.config.id}
            {...entry.config}
            id={`${entry.config.id}#${entry.rev}`}
            offset={(entry.config.offset ?? 0) + index * gap}
            visible={entry.state === 'visible'}
            onHide={() => remove(entry.config.id)}
          />
        )
      })}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}
