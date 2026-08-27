// native-mate's first production consumer is JavaScript, so every rule the
// library wants to GUARANTEE needs a runtime check — a type alone is invisible
// there. Warnings are dev-only and fire once per key, so a 200-row list emits
// one line, not two hundred.
const warned = new Set<string>()

declare const __DEV__: boolean | undefined
// Not typed as node's process: core has no @types/node, and this must resolve
// in React Native, Node, and the browser alike.
declare const process: { env?: { NODE_ENV?: string } } | undefined

function isDev(): boolean {
  if (typeof __DEV__ !== 'undefined') return !!__DEV__
  return typeof process !== 'undefined' && process?.env?.NODE_ENV !== 'production'
}

export function devWarn(key: string, message: string): void {
  if (!isDev() || warned.has(key)) return
  warned.add(key)
  console.warn(`[native-mate] ${message}`)
}

/** Deprecated prop shim: warns once and returns the replacement value. */
export function deprecatedProp<T>(
  oldName: string,
  newName: string,
  value: T,
  removedIn = 'v0.6',
): T {
  devWarn(
    `deprecated:${oldName}`,
    `\`${oldName}\` is deprecated and will be removed in ${removedIn}. ` +
      `Use \`${newName}\`. Run: npx @native-mate/cli migrate v0.5`,
  )
  return value
}

/** Test seam — resets the once-per-key memo. */
export function __resetDevWarnings(): void {
  warned.clear()
}
