import type React from 'react'

// Shared prop contracts. Before v0.5 these shapes differed per component:
// `error` was a string in input/phone-input but boolean + errorMessage in
// otp-input; haptics were a union in button, a boolean elsewhere, and bespoke
// names (hapticOnFocus, hapticOnDrag) in others; `icon` was sometimes a string
// cast to any and handed to Ionicons, locking callers to one icon set.

/** A string renders as the message; `true` sets error styling with no text. */
export type ErrorProp = string | boolean

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'none'

/** `false` disables; `true` means 'light'. */
export type HapticProp = boolean | HapticStyle

/** Always a node — never a string. Components own their own default icons. */
export type IconProp = React.ReactNode

/** Normalizes an ErrorProp into the two things components actually render. */
export function resolveError(error?: ErrorProp): { hasError: boolean; message?: string } {
  if (typeof error === 'string') return { hasError: error.length > 0, message: error }
  return { hasError: error === true }
}

/** Normalizes a HapticProp to the style to fire, or null for "don't". */
export function resolveHaptic(haptic: HapticProp = true): Exclude<HapticStyle, 'none'> | null {
  if (haptic === false || haptic === 'none') return null
  if (haptic === true) return 'light'
  return haptic
}
