import { createContext, useContext, useMemo } from 'react'
import { resolveHaptic } from '../types/props'
import type { HapticProp } from '../types/props'

let Haptics: any = null
try { Haptics = require('expo-haptics') } catch { /* optional peer */ }

/** App-wide kill switch, set by ThemeProvider's `haptics` prop. */
export const HapticsEnabledContext = createContext<boolean>(true)

export interface HapticsApi {
  /** Fires the resolved style unless haptics are disabled app-wide. */
  trigger: (haptic?: HapticProp) => void
  /** Notification-style feedback for success/error/warning outcomes. */
  notify: (type: 'success' | 'error' | 'warning') => void
  enabled: boolean
}

// One entry point for every component's haptics, so an app can disable them
// globally (accessibility, battery, or a brand that simply doesn't want them)
// instead of passing haptic={false} to every call site.
export function useHaptics(): HapticsApi {
  const enabled = useContext(HapticsEnabledContext)

  return useMemo(() => ({
    enabled,
    trigger: (haptic?: HapticProp) => {
      if (!enabled || !Haptics) return
      const style = resolveHaptic(haptic)
      if (!style) return
      const map: Record<string, string> = {
        light: 'Light', medium: 'Medium', heavy: 'Heavy',
      }
      Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle?.[map[style]])
    },
    notify: (type) => {
      if (!enabled || !Haptics) return
      const map = { success: 'Success', error: 'Error', warning: 'Warning' } as const
      Haptics.notificationAsync?.(Haptics.NotificationFeedbackType?.[map[type]])
    },
  }), [enabled])
}
