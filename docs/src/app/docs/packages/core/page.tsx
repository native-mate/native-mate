import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: '@native-mate/core — Packages' }

export default function CorePackagePage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">@native-mate/core</h1>
      <p className="mb-2 text-zinc-400 text-lg">
        The runtime package for native-mate. Provides the token system, ThemeProvider, and
        primitive components used by all registry components.
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
        Installed automatically when you run <code className="text-zinc-300">npx native-mate init</code>.
        You can also install it manually:
      </p>
      <CodeBlock language="bash" code={`npm install @native-mate/core

# or
yarn add @native-mate/core

# or
pnpm add @native-mate/core`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Peer dependencies</h2>
      <ul className="mb-6 space-y-1 text-sm text-zinc-400 list-disc pl-5">
        <li><code className="text-zinc-300">react</code> &gt;= 18.0.0</li>
        <li><code className="text-zinc-300">react-native</code> &gt;= 0.73.0</li>
        <li><code className="text-zinc-300">react-native-reanimated</code> &gt;= 3.0.0</li>
      </ul>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Exports</h2>

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Theme</h3>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Export</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['ThemeProvider', 'Root provider — wraps your app with preset + color scheme'],
              ['useTheme()', 'Hook — returns the resolved theme tokens'],
              ['makeStyles(fn)', 'Creates a cached stylesheet factory from theme tokens'],
              ['presets', 'Object with all 4 preset token sets (zinc, slate, rose, midnight)'],
              ['resolveTokens()', 'Resolves a preset + mode into a flat theme object'],
            ].map(([name, desc], i) => (
              <tr key={name} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{name}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Primitives</h3>
      <p className="mb-3 text-sm text-zinc-400">
        Core also exports 4 primitive components used by other registry components:
      </p>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Component</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Text', 'Themed text with variant presets (h1-h6, body, caption, label, code)'],
              ['Icon', 'SVG icon wrapper with theme-aware sizing and color'],
              ['Spinner', 'Animated loading indicator in 3 sizes'],
              ['Separator', 'Horizontal or vertical divider line'],
            ].map(([name, desc], i) => (
              <tr key={name} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{name}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-6 mb-2 text-lg font-medium text-zinc-100">Utilities</h3>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Export</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['shadow(elevation)', 'Cross-platform shadow helper (iOS shadow* + Android elevation)'],
              ['useBreakpoint()', 'Returns current breakpoint (sm/md/lg/xl) based on window width'],
            ].map(([name, desc], i) => (
              <tr key={name} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{name}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
