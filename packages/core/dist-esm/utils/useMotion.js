import { useMemo } from 'react';
import { useTheme } from '../theme/useTheme';
import { useReducedMotion } from './useReducedMotion';
// One place for every component to ask "may I animate, and how fast?".
// Durations come from animation.speed tokens, so a ThemeProvider that collapsed
// them for reduced motion already yields 0 here too.
export function useMotion() {
    const theme = useTheme();
    const reduced = useReducedMotion();
    return useMemo(() => {
        const { speed, easing } = theme.animation;
        return {
            reduced,
            timing: (key = 'normal') => ({ duration: reduced ? 0 : speed[key] }),
            spring: () => reduced
                ? { damping: 100, stiffness: 1000, mass: 0.1 }
                : { ...easing.spring },
            loops: (count = -1) => (reduced ? 1 : count),
        };
    }, [theme, reduced]);
}
//# sourceMappingURL=useMotion.js.map