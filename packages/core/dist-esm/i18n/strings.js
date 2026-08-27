// English defaults. No other locale data ships — apps that need more pass their
// own, since they already have an i18n library.
export const defaultStrings = {
    cancel: 'Cancel',
    confirm: 'Confirm',
    clear: 'Clear',
    close: 'Close',
    done: 'Done',
    dismiss: 'Dismiss',
    retry: 'Retry',
    resend: 'Resend',
    resendPrompt: "Didn't receive the code?",
    resendIn: (seconds) => `Resend in ${seconds}s`,
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
};
export function mergeStrings(overrides) {
    return overrides ? { ...defaultStrings, ...overrides } : defaultStrings;
}
//# sourceMappingURL=strings.js.map