import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'native-mate list — CLI' }

export default function CliListPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">native-mate list</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        List all available components in the registry, grouped by category.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Usage</h2>
      <CodeBlock language="bash" code="npx native-mate list [options]" />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Alias</h2>
      <CodeBlock language="bash" code="npx native-mate ls" />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Options</h2>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Flag</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['-r, --registry <url>', 'Use a custom registry URL instead of the default'],
            ].map(([flag, desc], i) => (
              <tr key={flag} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{flag}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Output</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Displays all 28 components grouped by category (Input, Display, Feedback, Overlay, Layout)
        with their version and description.
      </p>
    </article>
  )
}
