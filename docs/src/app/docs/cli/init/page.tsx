import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'native-mate init — CLI' }

export default function CliInitPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">native-mate init</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Set up native-mate in an existing React Native or Expo project.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Usage</h2>
      <CodeBlock language="bash" code="npx native-mate init [options]" />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">What it does</h2>
      <ol className="space-y-2 text-sm text-zinc-400 list-decimal pl-5">
        <li>Prompts for a theme preset and components directory</li>
        <li>Writes <code className="text-zinc-300">native-mate.json</code> to the project root</li>
        <li>Installs <code className="text-zinc-300">@native-mate/core</code> via your package manager</li>
        <li>Creates or updates <code className="text-zinc-300">.cursorrules</code> with native-mate guidelines</li>
      </ol>

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
              ['-p, --preset <name>', 'Set preset without prompting: zinc | slate | rose | midnight'],
              ['-y, --yes', 'Skip all prompts, use defaults (zinc preset, components/ui)'],
            ].map(([flag, desc], i) => (
              <tr key={flag} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{flag}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Output: native-mate.json</h2>
      <CodeBlock language="json" code={JSON.stringify({ preset: 'zinc', componentsDir: 'components/ui' }, null, 2)} />
    </article>
  )
}
