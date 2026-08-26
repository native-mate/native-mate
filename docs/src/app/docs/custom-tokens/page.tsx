import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'Custom tokens — native-mate' }

export default function CustomTokensPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Custom tokens</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Override any token by passing <code className="text-zinc-300">overrides</code> to
        ThemeProvider. Overridable fields: <code className="text-zinc-300">colors</code>,{' '}
        <code className="text-zinc-300">spacing</code>, <code className="text-zinc-300">radius</code>,{' '}
        <code className="text-zinc-300">typography</code> (family only), and{' '}
        <code className="text-zinc-300">animation</code> (speed only).
      </p>

      <div className="mb-8 rounded-xl border border-amber-800/50 bg-amber-950/20 p-4 text-sm text-amber-300">
        <strong>Note:</strong> <code className="text-amber-200">native-mate.json</code> does not
        carry tokens — it only holds <code className="text-amber-200">preset</code>,{' '}
        <code className="text-amber-200">componentsDir</code>, and{' '}
        <code className="text-amber-200">registry</code>. All theming happens at runtime through
        ThemeProvider overrides.
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Flat overrides</h2>
      <p className="mb-3 text-sm text-zinc-400">
        A flat overrides object applies to both light and dark schemes:
      </p>
      <CodeBlock language="tsx" code={`import { ThemeProvider } from '@native-mate/core'

export function App() {
  return (
    <ThemeProvider
      preset="zinc"
      overrides={{
        colors: {
          primary: '#0f766e',
          onPrimary: '#ffffff',
        },
        spacing: { lg: 20, xl: 28 },
        radius: { md: 6, lg: 12 },
      }}
    >
      <RootNavigator />
    </ThemeProvider>
  )
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Per-scheme overrides</h2>
      <p className="mb-3 text-sm text-zinc-400">
        To give light and dark different values, nest overrides under{' '}
        <code className="text-zinc-300">light</code> and <code className="text-zinc-300">dark</code>:
      </p>
      <CodeBlock language="tsx" code={`<ThemeProvider
  preset="zinc"
  overrides={{
    light: { colors: { primary: '#0f766e', onPrimary: '#ffffff' } },
    dark: { colors: { primary: '#14b8a6', onPrimary: '#042f2e' } },
  }}
>
  <RootNavigator />
</ThemeProvider>`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Custom fonts</h2>
      <p className="mb-3 text-sm text-zinc-400">
        For white-label or brand apps, override <code className="text-zinc-300">typography.family</code>{' '}
        to render every component in a custom font. Provide one family per weight — Android
        requires a per-weight family name (e.g. <code className="text-zinc-300">Poppins-SemiBold</code>):
      </p>
      <CodeBlock language="tsx" code={`<ThemeProvider
  preset="zinc"
  overrides={{
    typography: {
      family: {
        regular: 'Poppins-Regular',
        medium: 'Poppins-Medium',
        semibold: 'Poppins-SemiBold',
        bold: 'Poppins-Bold',
      },
    },
  }}
>
  <RootNavigator />
</ThemeProvider>`} />
      <p className="mt-3 mb-3 text-sm text-zinc-400">
        When <code className="text-zinc-300">family</code> is set, components resolve each text
        weight to <code className="text-zinc-300">fontFamily</code> and omit{' '}
        <code className="text-zinc-300">fontWeight</code>. When it is absent, components use the
        system font with numeric <code className="text-zinc-300">fontWeight</code> exactly as
        before — fully backward compatible. In custom components, use the exported{' '}
        <code className="text-zinc-300">fontStyle(theme.typography, 'semibold')</code> helper — it
        returns <code className="text-zinc-300">{'{ fontFamily }'}</code> or{' '}
        <code className="text-zinc-300">{'{ fontWeight }'}</code> as appropriate, and is what all
        registry components use internally.
      </p>

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
              ['border', 'Dividers, outlines, input borders'],
              ['primary', 'Brand/action colour (buttons, links)'],
              ['onPrimary', 'Text/icons on primary background'],
              ['foreground', 'Primary text'],
              ['onBackground', 'Content on the page background'],
              ['onSurface', 'Content on surface backgrounds'],
              ['muted', 'Secondary text, placeholders'],
              ['destructive', 'Errors, delete actions'],
              ['onDestructive', 'Text/icons on destructive background'],
              ['success', 'Success states'],
              ['onSuccess', 'Text/icons on success background'],
              ['warning', 'Warning states'],
              ['onWarning', 'Text/icons on warning background'],
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
