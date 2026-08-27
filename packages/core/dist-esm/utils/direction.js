import { I18nManager } from 'react-native';
// RTL support. Layout is handled by using logical style properties
// (marginStart/paddingEnd/start/end) instead of physical ones — React Native
// flips those automatically. What it does NOT flip is iconography: a
// chevron-forward still points right in an RTL layout, where it means "back".
export function isRTL() {
    return I18nManager.isRTL;
}
/**
 * Picks the correct glyph for a directional icon pair.
 * `directionalIcon('chevron-forward', 'chevron-back')` returns the back glyph
 * under RTL, so "next" keeps pointing the way the user reads.
 */
export function directionalIcon(ltr, rtl) {
    return I18nManager.isRTL ? rtl : ltr;
}
export function useDirection() {
    const rtl = I18nManager.isRTL;
    return { isRTL: rtl, sign: rtl ? -1 : 1, icon: directionalIcon };
}
//# sourceMappingURL=direction.js.map