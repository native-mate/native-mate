import { I18nManager } from 'react-native'

// RTL support. Layout is handled by using logical style properties
// (marginStart/paddingEnd/start/end) instead of physical ones — React Native
// flips those automatically. What it does NOT flip is iconography: a
// chevron-forward still points right in an RTL layout, where it means "back".
export function isRTL(): boolean {
  return I18nManager.isRTL
}

/**
 * Picks the correct glyph for a directional icon pair.
 * `directionalIcon('chevron-forward', 'chevron-back')` returns the back glyph
 * under RTL, so "next" keeps pointing the way the user reads.
 */
export function directionalIcon<T>(ltr: T, rtl: T): T {
  return I18nManager.isRTL ? rtl : ltr
}

export interface Direction {
  isRTL: boolean
  /** +1 in LTR, -1 in RTL — for translateX offsets and swipe distances. */
  sign: 1 | -1
  icon: <T>(ltr: T, rtl: T) => T
}

export function useDirection(): Direction {
  const rtl = I18nManager.isRTL
  return { isRTL: rtl, sign: rtl ? -1 : 1, icon: directionalIcon }
}
