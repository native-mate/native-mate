import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: '@native-mate/core — Packages' }

function ExportTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Export</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, desc], i) => (
            <tr key={name} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
              <td className="px-4 py-3 font-mono text-xs text-blue-400">{name}</td>
              <td className="px-4 py-3 text-xs text-zinc-400">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function CorePackagePage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">@native-mate/core</h1>
      <p className="mb-2 text-zinc-400 text-lg">
        The runtime package for native-mate. Provides the token system, ThemeProvider, primitives,
        and the shared contracts (haptics, errors, icons, strings, direction) every registry
        component is built on.
      </p>
      <p className="mb-8">
        <a
          href="https://www.npmjs.com/package/@native-mate/core"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300"
        >
          View on npm &rarr;
        </a>
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Installation</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Installed automatically when you run <code className="text-zinc-300">npx @native-mate/cli init</code>.
        You can also install it manually:
      </p>
      <CodeBlock language="bash" code={`npm install @native-mate/core

# or
yarn add @native-mate/core

# or
pnpm add @native-mate/core`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Peer dependencies</h2>
      <ul className="mb-4 space-y-1 text-sm text-zinc-400 list-disc pl-5">
        <li><code className="text-zinc-300">react</code> &gt;= 18.0.0</li>
        <li><code className="text-zinc-300">react-native</code> &gt;= 0.73.0</li>
        <li><code className="text-zinc-300">react-native-reanimated</code> &gt;= 3.0.0</li>
      </ul>

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Optional peers</h3>
      <p className="mb-3 text-sm text-zinc-400">
        These two are declared <code className="text-zinc-300">optional</code>, so package managers
        never install them for you. Core loads each behind a guarded require: when one is missing the
        feature degrades and a dev-only warning names the install command — nothing crashes.
      </p>
      <ul className="mb-3 space-y-2 text-sm text-zinc-400 list-disc pl-5">
        <li>
          <code className="text-zinc-300">expo-haptics</code> — powers{' '}
          <code className="text-zinc-300">useHaptics()</code>. Without it, haptic calls are no-ops.{' '}
          <code className="text-zinc-300">native-mate init</code> installs it for you, so haptics
          work out of the box.
        </li>
        <li>
          <code className="text-zinc-300">react-native-gesture-handler</code> &gt;= 2.0.0 — needed
          only for sheet drag-to-dismiss/snap points and toast swipe-to-dismiss. Without it the
          sheet still opens and dismisses via its backdrop and the toast still auto-dismisses.
          Install it yourself if you want the gestures — it requires a native rebuild.
        </li>
      </ul>
      <CodeBlock language="bash" code="npx expo install react-native-gesture-handler" />

      <h2 className="mt-10 mb-3 text-xl font-semibold text-zinc-50">Exports</h2>

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Theming</h3>
      <p className="mb-3 text-sm text-zinc-400">
        Reference: <a href="/docs/use-theme" className="text-blue-400 hover:text-blue-300">useTheme &amp; ThemeProvider</a>.
      </p>
      <ExportTable rows={[
        ['ThemeProvider', 'Root provider — preset, forcedColorScheme, overrides, respectReducedMotion, haptics, strings'],
        ['useTheme()', 'Returns the resolved theme for the active colour scheme'],
        ['makeStyles(fn)', 'Module-level style factory — returns a hook that rebuilds the StyleSheet only when the theme changes'],
      ]} />

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Tokens</h3>
      <p className="mb-3 text-sm text-zinc-400">
        Reference: <a href="/docs/tokens" className="text-blue-400 hover:text-blue-300">token system</a>{' '}
        and <a href="/docs/custom-tokens" className="text-blue-400 hover:text-blue-300">custom tokens</a>.
      </p>
      <ExportTable rows={[
        ['presets', 'All four preset token sets, keyed by name'],
        ['zinc, slate, rose, midnight', 'The individual TokenSet objects'],
        ['resolveTokens(preset, mode, overrides?)', 'Flattens a TokenSet for one colour scheme into a ResolvedTheme'],
        ['normalizeOverrides(overrides, mode)', 'Picks the light/dark branch, or passes a flat override set through'],
        ['fontStyle(typography, weight)', 'Returns { fontFamily } when fonts are themed, { fontWeight } when they are not'],
        ['textLineHeight(typography, fontSize)', 'Clip-safe line height — max(lineHeight.normal, round(fontSize × 1.3))'],
        ['monoFontFamily(typography)', 'Themed mono face, or the platform default (Menlo / monospace)'],
        ['collapseMotion(theme)', 'Returns the theme with animation.speed zeroed — the reduced-motion transform'],
      ]} />

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Motion</h3>
      <p className="mb-3 text-sm text-zinc-400">
        Reference: <a href="/docs/motion" className="text-blue-400 hover:text-blue-300">motion &amp; reduced motion</a>.
      </p>
      <ExportTable rows={[
        ['useMotion()', 'One place to ask "may I animate, and how fast?" — { reduced, timing, spring, loops }'],
        ['useReducedMotion()', 'Raw OS reduce-motion setting as a boolean'],
      ]} />

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Colour utilities</h3>
      <p className="mb-3 text-sm text-zinc-400">
        Reference: <a href="/docs/colors" className="text-blue-400 hover:text-blue-300">colour utilities</a>.
      </p>
      <ExportTable rows={[
        ['withAlpha(color, alpha)', 'Alpha-composites any token value (hex, rgb(), named) and always returns rgba()'],
        ['readableOn(background)', 'Picks a legible near-black/near-white foreground for an arbitrary fill'],
        ['relativeLuminance(color)', 'WCAG relative luminance, or null when the colour cannot be parsed'],
        ['parseColor(color)', 'Parses a colour string to [r, g, b, a], or null'],
      ]} />

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Prop contracts</h3>
      <p className="mb-3 text-sm text-zinc-400">
        The shared shapes every component agrees on since v0.5. Reference:{' '}
        <a href="/docs/prop-contracts" className="text-blue-400 hover:text-blue-300">prop contracts</a>.
      </p>
      <ExportTable rows={[
        ['resolveError(error?)', 'Normalizes ErrorProp into { hasError, message? }'],
        ['resolveHaptic(haptic?)', "Normalizes HapticProp to 'light' | 'medium' | 'heavy', or null for don't"],
        ['useHaptics()', 'Every component’s haptics entry point — { trigger, notify, enabled }'],
        ['HapticsEnabledContext', 'The context ThemeProvider’s haptics prop writes to'],
        ['ErrorProp, HapticProp, HapticStyle, IconProp', 'The contract types'],
      ]} />

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">i18n</h3>
      <p className="mb-3 text-sm text-zinc-400">
        Reference: <a href="/docs/i18n" className="text-blue-400 hover:text-blue-300">i18n</a>.
      </p>
      <ExportTable rows={[
        ['useStrings()', "Reads the merged string table inside ThemeProvider"],
        ['defaultStrings', 'The English defaults — the full key list'],
        ['mergeStrings(overrides?)', 'Merges a partial override set over defaultStrings'],
        ['StringsContext', 'The underlying context'],
        ['NativeMateStrings', 'Type of the string table'],
      ]} />

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">RTL</h3>
      <p className="mb-3 text-sm text-zinc-400">
        Reference: <a href="/docs/rtl" className="text-blue-400 hover:text-blue-300">RTL</a>.
      </p>
      <ExportTable rows={[
        ['isRTL()', 'Whether the app is laid out right-to-left'],
        ['directionalIcon(ltr, rtl)', 'Picks the correct glyph of a directional pair — RN flips layout, not iconography'],
        ['useDirection()', '{ isRTL, sign, icon } — sign is +1/-1 for translateX offsets and swipe distances'],
      ]} />

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Dev warnings</h3>
      <ExportTable rows={[
        ['devWarn(key, message)', 'Dev-only console warning, fired once per key'],
        ['deprecatedProp(oldName, newName, value, removedIn?)', 'Deprecation shim — warns once and returns the replacement value'],
      ]} />

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Primitives</h3>
      <p className="mb-3 text-sm text-zinc-400">
        Four components used by the rest of the registry:
      </p>
      <ExportTable rows={[
        ['Text', 'Themed text with variant, size, and weight presets'],
        ['Icon', 'Icon wrapper with theme-aware sizing and colour'],
        ['Spinner', 'Animated loading indicator'],
        ['Separator', 'Horizontal or vertical divider line'],
      ]} />

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Platform utilities</h3>
      <ExportTable rows={[
        ['shadow(elevation)', 'Cross-platform shadow helper (iOS shadow* + Android elevation)'],
        ['useBreakpoint()', 'Current breakpoint based on window width'],
      ]} />

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Types</h3>
      <p className="mb-8 text-sm text-zinc-400">
        Also exported: <code className="text-zinc-300">TokenSet</code>,{' '}
        <code className="text-zinc-300">ResolvedTheme</code>,{' '}
        <code className="text-zinc-300">ResolvedColors</code>,{' '}
        <code className="text-zinc-300">TokenColors</code>,{' '}
        <code className="text-zinc-300">ColorToken</code>,{' '}
        <code className="text-zinc-300">ThemePreset</code>,{' '}
        <code className="text-zinc-300">ThemeOverrides</code>,{' '}
        <code className="text-zinc-300">NativeMateTokenOverrides</code>,{' '}
        <code className="text-zinc-300">NativeMateConfig</code>,{' '}
        <code className="text-zinc-300">FontFamilyTokens</code>,{' '}
        <code className="text-zinc-300">FontWeightKey</code>,{' '}
        <code className="text-zinc-300">Motion</code>, <code className="text-zinc-300">SpeedKey</code>,{' '}
        <code className="text-zinc-300">HapticsApi</code>,{' '}
        <code className="text-zinc-300">Breakpoint</code>, and each primitive&apos;s props
        (<code className="text-zinc-300">TextProps</code>,{' '}
        <code className="text-zinc-300">IconProps</code>,{' '}
        <code className="text-zinc-300">SpinnerProps</code>,{' '}
        <code className="text-zinc-300">SeparatorProps</code>).
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Quick start</h2>
      <CodeBlock language="tsx" filename="App.tsx" code={`import { ThemeProvider } from '@native-mate/core'

export default function App() {
  return (
    <ThemeProvider preset="zinc">
      {/* your app */}
    </ThemeProvider>
  )
}`} />
    </article>
  )
}
