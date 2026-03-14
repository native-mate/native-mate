import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'Custom tokens — native-mate' }

export default function CustomTokensPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Custom tokens</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Override any token in <code className="text-zinc-300">native-mate.json</code> without
        touching component source. Changes apply instantly on hot reload.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Override colours</h2>
      <CodeBlock language="json" filename="native-mate.json" code={`{
  "preset": "zinc",
  "componentsDir": "components/ui",
  "tokens": {
    "colors": {
      "primary": "#6366f1",
      "primaryForeground": "#ffffff",
      "destructive": "#dc2626"
    }
  }
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Override spacing and radius</h2>
      <CodeBlock language="json" code={`{
  "preset": "zinc",
  "componentsDir": "components/ui",
  "tokens": {
    "spacing": { "lg": 20, "xl": 28 },
    "radius": { "md": 6, "lg": 12 }
  }
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Programmatic overrides</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Pass overrides directly to ThemeProvider for runtime switching (e.g. white-label brands):
      </p>
      <CodeBlock language="tsx" code={`import { ThemeProvider } from '@native-mate/core'

const BRAND_TOKENS = {
  colors: {
    primary: '#0f766e',
    primaryForeground: '#ffffff',
  },
}

export function App() {
  return (
    <ThemeProvider preset="zinc" overrides={BRAND_TOKENS}>
      <RootNavigator />
    </ThemeProvider>
  )
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Available colour tokens</h2>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Token</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['background', 'Screen/page background'],
              ['surface', 'Card, input, sheet background'],
              ['surfaceRaised', 'Elevated card, popover background'],
              ['border', 'Dividers, input borders'],
              ['foreground', 'Primary text'],
              ['mutedForeground', 'Secondary text, placeholders'],
              ['primary', 'Brand/action colour (buttons, links)'],
              ['primaryForeground', 'Text on primary background'],
              ['destructive', 'Errors, delete actions'],
              ['destructiveForeground', 'Text on destructive background'],
              ['success', 'Success states'],
              ['successForeground', 'Text on success background'],
              ['warning', 'Warning states'],
              ['warningForeground', 'Text on warning background'],
              ['muted', 'Muted/disabled fill'],
              ['overlay', 'Modal backdrop scrim'],
              ['ring', 'Focus ring colour'],
            ].map(([token, desc], i) => (
              <tr key={token} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{token}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}
