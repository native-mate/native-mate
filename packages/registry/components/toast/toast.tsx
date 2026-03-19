// native-mate: toast@0.3.0 | hash:PLACEHOLDER
import React, { useEffect, useRef, createContext, useContext, useState, useCallback, useMemo } from 'react'
import { View, Pressable, PanResponder, Image, Modal, Platform } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, Text, makeStyles } from '@native-mate/core'
import type { ToastProps, ToastVariant, ToastContextValue, ToastConfig, ToastAction } from './toast.types'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch {}

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
}) => {
  const theme = useTheme()
  const styles = useStyles()
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
    default: '#fff',
    success: theme.colors.onSuccess,
    destructive: theme.colors.onDestructive,
    warning: theme.colors.onWarning,
  }[variant]

  const hide = useCallback(() => onHide(), [onHide])
  // Used to cancel stale exit-animation callbacks (race condition when fire() is called rapidly)
  const exitGenRef = useRef(0)

  const dismiss = useCallback(() => {
    exitGenRef.current += 1
    const gen = exitGenRef.current
    opacity.value = withTiming(0, { duration: 180 })
    translateY.value = withSpring(
      position === 'bottom' ? 120 : -120,
      { mass: 0.5, damping: 18, stiffness: 200 },
      () => { if (exitGenRef.current === gen) runOnJS(hide)() },
    )
  }, [position, hide])

  useEffect(() => {
    if (visible) {
      // Cancel any in-flight exit animation so its callback won't fire
      exitGenRef.current += 1
      cancelAnimation(opacity)
      cancelAnimation(translateY)
      setModalOpen(true)
      if (Haptics) {
        if (variant === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        else if (variant === 'destructive') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        else if (variant === 'warning') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
      }
      translateX.value = 0
      translateY.value = withSpring(0, { mass: 0.5, damping: 18, stiffness: 200 })
      opacity.value = withTiming(1, { duration: 200 })
      progressWidth.value = 100

      if (!persistent && duration > 0) {
        progressWidth.value = withTiming(0, { duration })
        const timer = setTimeout(() => dismiss(), duration)
        return () => clearTimeout(timer)
      }
    } else {
      exitGenRef.current += 1
      const gen = exitGenRef.current
      cancelAnimation(opacity)
      opacity.value = withTiming(0, { duration: 180 }, () => {
        if (exitGenRef.current === gen) runOnJS(setModalOpen)(false)
      })
    }
  }, [visible])

  // Swipe-to-dismiss — supports left/right AND vertical (up for bottom toast, down for top toast)
  const activeAxis = useRef<'x' | 'y' | null>(null)

  const panResponder = useRef(
    PanResponder.create({
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
            translateX.value = withTiming(gs.dx > 0 ? 500 : -500, { duration: 200 })
            opacity.value = withTiming(0, { duration: 200 }, () => runOnJS(hide)())
          } else {
            translateX.value = withSpring(0, { mass: 0.4, damping: 14, stiffness: 200 })
          }
        } else {
          // Bottom toast: swipe down (positive dy) dismisses; top toast: swipe up (negative dy) dismisses
          const dismissed = position === 'bottom' ? gs.dy > 60 : gs.dy < -60
          if (dismissed) {
            translateY.value = withTiming(position === 'bottom' ? 300 : -300, { duration: 200 })
            opacity.value = withTiming(0, { duration: 200 }, () => runOnJS(hide)())
          } else {
            translateY.value = withSpring(0, { mass: 0.4, damping: 14, stiffness: 200 })
          }
        }
        activeAxis.current = null
      },
    })
  ).current

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
    opacity: opacity.value,
  }))

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%` as any,
  }))

  // Merge single `action` + `actions` array into one list
  const allActions: ToastAction[] = [
    ...(action ? [action] : []),
    ...(actions ?? []),
  ]

  if (!modalOpen) return null

  // On web, render with fixed positioning directly (no Modal portal needed)
  if (Platform.OS === 'web') {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            position: 'fixed' as any,
            [position === 'top' ? 'top' : 'bottom']: 48,
            zIndex: 9999,
          },
          animatedStyle,
        ]}
        accessibilityRole="alert"
      >
        {/* Left side: avatar image OR icon badge */}
        {avatar ? (
          <Image source={avatar} style={{ width: 40, height: 40, borderRadius: 20, marginTop: 1 }} />
        ) : (
          <View style={[styles.icon, { backgroundColor: iconBg }]}>
            {icon ? icon : <Ionicons name={variantIconName[variant]} size={14} color={iconColor} />}
          </View>
        )}
        <View style={styles.content}>
          <Text variant="label">{message}</Text>
          {description && <Text variant="caption" muted>{description}</Text>}
          {allActions.length > 0 && (
            <View style={styles.actionsRow}>
              {allActions.map((a, idx) => (
                <Pressable key={idx} style={[styles.action, a.variant === 'primary' && { borderColor: theme.colors.primary }]} onPress={a.onPress}>
                  <Text variant="caption" style={{ fontWeight: '600', color: a.variant === 'primary' ? theme.colors.primary : theme.colors.foreground }}>{a.label}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
        {persistent && (
          <Pressable onPress={dismiss} hitSlop={8}>
            <Ionicons name="close" size={18} color={theme.colors.muted} />
          </Pressable>
        )}
        {showProgress && !persistent && (
          <View style={{ position: 'absolute', bottom: 0, left: 0, height: 3, backgroundColor: iconBg, opacity: 0.5, borderBottomLeftRadius: theme.radius.lg, borderBottomRightRadius: theme.radius.lg, width: '100%' }}>
            <Animated.View style={[{ height: 3, backgroundColor: iconBg }, progressStyle]} />
          </View>
        )}
      </Animated.View>
    )
  }

  return (
    <Modal visible={modalOpen} transparent animationType="none" onRequestClose={dismiss} statusBarTranslucent>
    <View pointerEvents="box-none" style={{ flex: 1 }}>
    <Animated.View
      style={[styles.container, { [position === 'top' ? 'top' : 'bottom']: 48 }, animatedStyle]}
      accessibilityRole="alert"
      {...panResponder.panHandlers}
    >
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
        {allActions.length > 0 && (
          <View style={styles.actionsRow}>
            {allActions.map((a, idx) => (
              <Pressable
                key={idx}
                style={[
                  styles.action,
                  a.variant === 'primary' && { borderColor: theme.colors.primary },
                ]}
                onPress={a.onPress}
              >
                <Text
                  variant="caption"
                  style={{
                    fontWeight: '600',
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
        <Pressable onPress={dismiss} hitSlop={8}>
          <Ionicons name="close" size={18} color={theme.colors.muted} />
        </Pressable>
      )}
      {showProgress && !persistent && (
        <View style={{
          position: 'absolute',
          bottom: 0, left: 0,
          height: 3,
          backgroundColor: iconBg,
          opacity: 0.5,
          borderBottomLeftRadius: theme.radius.lg,
          borderBottomRightRadius: theme.radius.lg,
          width: '100%',
        }}>
          <Animated.View
            style={[{ height: 3, backgroundColor: iconBg }, progressStyle]}
          />
        </View>
      )}
    </Animated.View>
    </View>
    </Modal>
  )
}

// ── useToast hook ─────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastConfig | null>(null)
  const [visible, setVisible] = useState(false)

  const show = useCallback((config: ToastConfig) => {
    setToast(config)
    setVisible(true)
  }, [])

  const hide = useCallback(() => {
    setVisible(false)
  }, [])

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      {toast && (
        <Toast
          {...toast}
          visible={visible}
          onHide={hide}
        />
      )}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}
