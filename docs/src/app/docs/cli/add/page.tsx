import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'native-mate add — CLI' }

export default function CliAddPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">native-mate add</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Fetch one or more components from the registry and write them into your project.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Usage</h2>
      <CodeBlock language="bash" code="npx native-mate add <component> [components...] [options]" />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Examples</h2>
      <CodeBlock language="bash" code={`# Add a single component
npx native-mate add button

# Add multiple at once
npx native-mate add button card input badge avatar

# Use a custom registry
npx native-mate add button --registry https://my-registry.dev

# Overwrite existing files
npx native-mate add button --overwrite`} />

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
              ['--overwrite', 'Overwrite existing component files if they differ'],
            ].map(([flag, desc], i) => (
              <tr key={flag} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{flag}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">What it does</h2>
      <ol className="space-y-2 text-sm text-zinc-400 list-decimal pl-5">
        <li>Reads <code className="text-zinc-300">native-mate.json</code> to find your components directory</li>
        <li>Fetches the component JSON from the registry</li>
        <li>Resolves and installs component dependencies recursively</li>
        <li>Writes component source files to your project</li>
        <li>Installs any required npm packages via your package manager</li>
      </ol>
    </article>
  )
}
