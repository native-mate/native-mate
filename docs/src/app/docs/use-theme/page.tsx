import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'useTheme — native-mate' }

export default function UseThemePage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">useTheme</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Access the full resolved theme — colours, spacing, radius, typography, and animation — from
        any component inside ThemeProvider.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Usage</h2>
      <CodeBlock language="tsx" code={`import { useTheme } from '@native-mate/core'

function PriceTag({ amount }: { amount: number }) {
  const theme = useTheme()

  return (
    <View
      style={{
        backgroundColor: theme.colors.success,
        borderRadius: theme.radius.sm,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
      }}
    >
      <Text
        style={{
          color: theme.colors.onSuccess,
          fontSize: theme.typography.size.sm,
          fontWeight: theme.typography.weight.semibold,
        }}
      >
        \${amount.toFixed(2)}
      </Text>
    </View>
  )
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Return type</h2>
      <CodeBlock language="ts" code={`interface ResolvedTheme {
  // Every colour token resolved to a single string for the active scheme.
  // The on* tokens also resolve under their *Foreground aliases.
  colors: ResolvedColors
  spacing: { xs; sm; md; lg; xl; '2xl'; '3xl' }
  radius: { sm; md; lg; xl; full }
  typography: {
    size: { xs; sm; md; lg; xl; '2xl'; '3xl' }
    weight: { regular; medium; semibold; bold }   // '400' | '500' | '600' | '700'
    lineHeight: { tight; normal; relaxed }        // absolute px
    family?: {                                    // set when fonts are themed
      regular; medium; semibold; bold
      mono?: string                               // optional code/tabular face
    }
  }
  animation: {
    speed: { fast: number; normal: number; slow: number }   // ms
    easing: {
      standard: readonly [number, number, number, number]
      decelerate: readonly [number, number, number, number]
      spring: { damping: number; stiffness: number; mass: number }
    }
  }
  colorScheme: 'light' | 'dark'
}`} />

      <h2 className="mt-10 mb-3 text-xl font-semibold text-zinc-50">ThemeProvider</h2>
      <p className="mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">useTheme()</code> reads the theme that{' '}
        <code className="text-zinc-300">ThemeProvider</code> resolved. Wrap your app once at the
        root:
      </p>
      <CodeBlock language="tsx" filename="App.tsx" code={`import { ThemeProvider } from '@native-mate/core'

export default function App() {
  return (
    <ThemeProvider
      preset="zinc"
      overrides={{ colors: { primary: '#0f766e' } }}
      respectReducedMotion
      haptics
      strings={{ cancel: 'Annuler', done: 'Terminé' }}
    >
      <RootNavigator />
    </ThemeProvider>
  )
}`} />

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Props</h3>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Prop</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Default</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['preset', `'zinc' | 'slate' | 'rose' | 'midnight'`, `'zinc'`, 'Base token set the theme is resolved from'],
              ['forcedColorScheme', `'light' | 'dark'`, '—', 'Pins the scheme instead of following the OS setting'],
              ['overrides', 'ThemeOverrides', '—', 'Flat or per-scheme token overrides applied over the preset'],
              ['respectReducedMotion', 'boolean', 'true', 'Collapses animation.speed to 0 when the OS reduce-motion setting is on'],
              ['haptics', 'boolean', 'true', 'App-wide haptics kill switch'],
              ['strings', 'Partial<NativeMateStrings>', '—', "Overrides for the library's user-facing copy, merged over English"],
              ['children', 'React.ReactNode', '—', 'Required'],
            ].map(([prop, type, def, desc], i) => (
              <tr key={prop} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{prop}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-300">{type}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">{def}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">haptics — the app-wide kill switch</h3>
      <p className="mb-3 text-sm text-zinc-400">
        Every component fires haptics through core&apos;s{' '}
        <code className="text-zinc-300">useHaptics()</code>, so{' '}
        <code className="text-zinc-300">haptics={'{false}'}</code> silences the whole registry in one
        place — for accessibility, battery, or a brand that simply doesn&apos;t want them. Individual
        call sites can still opt out with <code className="text-zinc-300">haptic={'{false}'}</code>;
        the provider wins when it is off.
      </p>
      <CodeBlock language="tsx" code={`<ThemeProvider preset="zinc" haptics={false}>
  <RootNavigator />
</ThemeProvider>`} />
      <p className="mt-3 mb-3 text-sm text-zinc-400">
        <code className="text-zinc-300">expo-haptics</code> is an optional peer dependency. When it
        is not installed, haptic calls are no-ops rather than crashes. See{' '}
        <a href="/docs/prop-contracts" className="text-blue-400 hover:text-blue-300">prop contracts</a>{' '}
        for the <code className="text-zinc-300">haptic</code> prop shape.
      </p>

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">strings — the i18n slot</h3>
      <p className="mb-3 text-sm text-zinc-400">
        Components read their user-facing copy from{' '}
        <code className="text-zinc-300">useStrings()</code>. Pass{' '}
        <code className="text-zinc-300">strings</code> to translate the library without patching
        component files — your overrides are merged over the English{' '}
        <code className="text-zinc-300">defaultStrings</code>, so a partial object is fine.
      </p>
      <CodeBlock language="tsx" code={`<ThemeProvider
  preset="zinc"
  strings={{
    cancel: 'Annuler',
    retry: 'Réessayer',
    resendIn: (seconds) => \`Renvoyer dans \${seconds}s\`,
  }}
>
  <RootNavigator />
</ThemeProvider>`} />
      <p className="mt-3 mb-3 text-sm text-zinc-400">
        Full key list and per-component prop overrides:{' '}
        <a href="/docs/i18n" className="text-blue-400 hover:text-blue-300">i18n</a>.
      </p>

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">respectReducedMotion</h3>
      <p className="mb-8 text-sm text-zinc-400">
        On by default. Every timing-based animation in the registry reads its duration from{' '}
        <code className="text-zinc-300">animation.speed</code>, so when the OS reduce-motion setting
        is on the provider zeroes those speeds and the whole registry becomes instant. Set it to{' '}
        <code className="text-zinc-300">false</code> to opt an app out. See{' '}
        <a href="/docs/motion" className="text-blue-400 hover:text-blue-300">motion</a> for{' '}
        <code className="text-zinc-300">useMotion()</code> and the reduced-motion contract.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Rules</h2>
      <ul className="space-y-2 text-sm text-zinc-400 list-disc pl-5">
        <li>Must be called inside a component wrapped by ThemeProvider</li>
        <li>Re-renders when theme changes (dark/light or preset change)</li>
        <li>For styles, prefer <code className="text-zinc-300">makeStyles</code> — it memoises the StyleSheet</li>
        <li>Use <code className="text-zinc-300">useTheme</code> directly when you need a value conditionally (e.g. an animation colour)</li>
      </ul>
    </article>
  )
}
