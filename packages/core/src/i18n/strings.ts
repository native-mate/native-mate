// Every user-facing string the registry renders. Components read these through
// useStrings() so an app can translate the library without patching components,
// and each component still takes a local prop override for one-off changes.
export interface NativeMateStrings {
  cancel: string
  confirm: string
  clear: string
  close: string
  done: string
  dismiss: string
  retry: string
  resend: string
  resendPrompt: string
  resendIn: (seconds: number) => string
  loadingMore: string
  empty: string
  emptyBody: string
  readMore: string
  readLess: string
  search: string
  selectAll: string
  outOfStock: string
  showPassword: string
  hidePassword: string
  verificationCode: string
  today: string
  months: string[]
  monthsShort: string[]
  weekdaysShort: string[]
}

// English defaults. No other locale data ships — apps that need more pass their
// own, since they already have an i18n library.
export const defaultStrings: NativeMateStrings = {
  cancel: 'Cancel',
  confirm: 'Confirm',
  clear: 'Clear',
  close: 'Close',
  done: 'Done',
  dismiss: 'Dismiss',
  retry: 'Retry',
  resend: 'Resend',
  resendPrompt: "Didn't receive the code?",
  resendIn: (seconds: number) => `Resend in ${seconds}s`,
  loadingMore: 'Loading more…',
  empty: 'No items yet',
  emptyBody: 'Check back later.',
  readMore: 'Read more',
  readLess: 'Read less',
  search: 'Search',
  selectAll: 'Select all',
  outOfStock: 'Out of Stock',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  verificationCode: 'Verification code',
  today: 'Today',
  months: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
}

export function mergeStrings(overrides?: Partial<NativeMateStrings>): NativeMateStrings {
  return overrides ? { ...defaultStrings, ...overrides } : defaultStrings
}
