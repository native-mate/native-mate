import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext } from './ThemeContext';
import { presets, resolveTokens, normalizeOverrides, collapseMotion } from '../tokens';
import { useReducedMotion } from '../utils/useReducedMotion';
export const ThemeProvider = ({ preset = 'zinc', forcedColorScheme, overrides, respectReducedMotion = true, children, }) => {
    const systemColorScheme = useColorScheme();
    const mode = forcedColorScheme ?? systemColorScheme ?? 'light';
    // Overrides are small plain-JSON objects; keying the memo on their content
    // keeps the theme referentially stable when callers pass them inline, so a
    // parent re-render doesn't restyle the whole app.
    const overridesKey = overrides ? JSON.stringify(overrides) : '';
    const reducedMotion = useReducedMotion();
    const theme = useMemo(() => {
        const resolved = resolveTokens(presets[preset], mode, normalizeOverrides(overrides, mode));
        return respectReducedMotion && reducedMotion ? collapseMotion(resolved) : resolved;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preset, mode, overridesKey, respectReducedMotion, reducedMotion]);
    return _jsx(ThemeContext.Provider, { value: theme, children: children });
};
//# sourceMappingURL=ThemeProvider.js.map