import { zinc } from './presets/zinc';
import { slate } from './presets/slate';
import { rose } from './presets/rose';
import { midnight } from './presets/midnight';
export { zinc, slate, rose, midnight };
export * from './types';
export const presets = { zinc, slate, rose, midnight };
// Docs-canonical *Foreground spellings → the on* tokens they mirror. The
// resolved theme carries both keys; overrides accept either (canonical wins
// when both are given).
export const COLOR_ALIASES = {
    primaryForeground: 'onPrimary',
    destructiveForeground: 'onDestructive',
    successForeground: 'onSuccess',
    warningForeground: 'onWarning',
    mutedForeground: 'muted',
};
const canonicalizeColorOverrides = (colors) => {
    const out = { ...colors };
    for (const [alias, canonical] of Object.entries(COLOR_ALIASES)) {
        if (out[alias] !== undefined && out[canonical] === undefined)
            out[canonical] = out[alias];
        delete out[alias];
    }
    return out;
};
const withColorAliases = (colors) => {
    for (const [alias, canonical] of Object.entries(COLOR_ALIASES)) {
        colors[alias] = colors[canonical];
    }
    return colors;
};
export function resolveTokens(preset, mode, overrides) {
    const resolvedColors = Object.fromEntries(Object.entries(preset.colors).map(([key, token]) => [key, token[mode]]));
    const colors = withColorAliases(overrides?.colors
        ? { ...resolvedColors, ...canonicalizeColorOverrides(overrides.colors) }
        : resolvedColors);
    const spacing = overrides?.spacing ? { ...preset.spacing, ...overrides.spacing } : preset.spacing;
    const radius = overrides?.radius ? { ...preset.radius, ...overrides.radius } : preset.radius;
    const typography = overrides?.typography?.family
        ? { ...preset.typography, family: overrides.typography.family }
        : preset.typography;
    const animation = overrides?.animation?.speed
        ? { ...preset.animation, speed: { ...preset.animation.speed, ...overrides.animation.speed } }
        : preset.animation;
    return { colors, spacing, radius, typography, animation, colorScheme: mode };
}
// A flat override set (no light/dark keys) applies to both color schemes.
export function normalizeOverrides(overrides, mode) {
    if (!overrides)
        return undefined;
    if ('light' in overrides || 'dark' in overrides) {
        return overrides[mode];
    }
    return overrides;
}
// Body-range sizes keep the normal lineHeight; larger sizes scale at 1.3× so
// ascenders/descenders never clip (fontSize > lineHeight clips, worst on Android).
export function textLineHeight(typography, fontSize) {
    return Math.max(typography.lineHeight.normal, Math.round(fontSize * 1.3));
}
// Reduced-motion convention: every timing-based animation reads a duration from
// animation.speed, so zeroing the speeds makes the whole registry instant.
export function collapseMotion(theme) {
    return {
        ...theme,
        animation: { ...theme.animation, speed: { fast: 0, normal: 0, slow: 0 } },
    };
}
export function fontStyle(typography, weight) {
    return typography.family
        ? { fontFamily: typography.family[weight] }
        : { fontWeight: typography.weight[weight] };
}
//# sourceMappingURL=index.js.map