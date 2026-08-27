/** Normalizes an ErrorProp into the two things components actually render. */
export function resolveError(error) {
    if (typeof error === 'string')
        return { hasError: error.length > 0, message: error };
    return { hasError: error === true };
}
/** Normalizes a HapticProp to the style to fire, or null for "don't". */
export function resolveHaptic(haptic = true) {
    if (haptic === false || haptic === 'none')
        return null;
    if (haptic === true)
        return 'light';
    return haptic;
}
//# sourceMappingURL=props.js.map