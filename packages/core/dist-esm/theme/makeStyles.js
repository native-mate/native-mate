import { StyleSheet } from 'react-native';
import { useTheme } from './useTheme';
// Exported for tests; not part of the public package surface.
export function stylesForTheme(cache, factory, theme) {
    let styles = cache.get(theme);
    if (!styles) {
        styles = StyleSheet.create(factory(theme));
        cache.set(theme, styles);
    }
    return styles;
}
export function makeStyles(factory) {
    // Cached per resolved theme, not per component instance: 200 mounted rows share
    // one StyleSheet.create per theme. The WeakMap self-cleans when a theme object
    // is replaced.
    const cache = new WeakMap();
    return function useStyles() {
        return stylesForTheme(cache, factory, useTheme());
    };
}
//# sourceMappingURL=makeStyles.js.map