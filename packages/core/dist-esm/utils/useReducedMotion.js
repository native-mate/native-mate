import * as Reanimated from 'react-native-reanimated';
// Wraps Reanimated's useReducedMotion (added in 3.5) with a safe fallback for
// older peers where the export doesn't exist.
export function useReducedMotion() {
    const hook = Reanimated.useReducedMotion;
    return hook ? hook() : false;
}
//# sourceMappingURL=useReducedMotion.js.map