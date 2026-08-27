import { createContext, useContext, useMemo } from 'react';
import { resolveHaptic } from '../types/props';
let Haptics = null;
try {
    Haptics = require('expo-haptics');
}
catch { /* optional peer */ }
/** App-wide kill switch, set by ThemeProvider's `haptics` prop. */
export const HapticsEnabledContext = createContext(true);
// One entry point for every component's haptics, so an app can disable them
// globally (accessibility, battery, or a brand that simply doesn't want them)
// instead of passing haptic={false} to every call site.
export function useHaptics() {
    const enabled = useContext(HapticsEnabledContext);
    return useMemo(() => ({
        enabled,
        trigger: (haptic) => {
            if (!enabled || !Haptics)
                return;
            const style = resolveHaptic(haptic);
            if (!style)
                return;
            const map = {
                light: 'Light', medium: 'Medium', heavy: 'Heavy',
            };
            Haptics.impactAsync?.(Haptics.ImpactFeedbackStyle?.[map[style]]);
        },
        notify: (type) => {
            if (!enabled || !Haptics)
                return;
            const map = { success: 'Success', error: 'Error', warning: 'Warning' };
            Haptics.notificationAsync?.(Haptics.NotificationFeedbackType?.[map[type]]);
        },
    }), [enabled]);
}
//# sourceMappingURL=useHaptics.js.map