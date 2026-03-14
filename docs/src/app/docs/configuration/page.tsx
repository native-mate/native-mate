import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'Configuration — native-mate' }

export default function ConfigurationPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Configuration</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        All native-mate settings live in <code className="text-zinc-300">native-mate.json</code> at
        your project root. The CLI reads and writes this file automatically.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Full config reference</h2>
      <CodeBlock language="json" filename="native-mate.json" code={`{
  "preset": "zinc",
  "componentsDir": "components/ui",
  "registry": "https://registry.native-mate.dev",
  "tokens": {
    "colors": {
      "primary": "#6366f1",
      "primaryForeground": "#ffffff"
    },
    "spacing": {
      "lg": 20
    },
    "radius": {
      "md": 8
    }
  }
}`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Fields</h2>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Field</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Default</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['preset', 'string', '"zinc"', 'Active theme preset: zinc | slate | rose | midnight'],
              ['componentsDir', 'string', '"components/ui"', 'Directory where components are installed'],
              ['registry', 'string', 'registry.native-mate.dev', 'Custom registry URL for private component libraries'],
              ['tokens.colors', 'object', '—', 'Override specific colour tokens'],
              ['tokens.spacing', 'object', '—', 'Override spacing scale values'],
              ['tokens.radius', 'object', '—', 'Override border radius values'],
            ].map(([field, type, def, desc], i) => (
              <tr key={field} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{field}</td>
                <td className="px-4 py-3 font-mono text-xs text-amber-400">{type}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">{def}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}
