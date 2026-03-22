import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: '@native-mate/cli — Packages' }

export default function CliPackagePage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">@native-mate/cli</h1>
      <p className="mb-2 text-zinc-400 text-lg">
        The command-line tool for native-mate. Initialize projects, add components,
        list the registry, and upgrade installed components.
      </p>
      <p className="mb-8">
        <a
          href="https://www.npmjs.com/package/@native-mate/cli"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300"
        >
          View on npm &rarr;
        </a>
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Installation</h2>
      <p className="mb-3 text-sm text-zinc-400">
        No global install needed — use <code className="text-zinc-300">npx</code> to run any command:
      </p>
      <CodeBlock language="bash" code={`npx @native-mate/cli init
npx @native-mate/cli add button`} />

      <p className="mt-3 mb-3 text-sm text-zinc-400">
        Or install globally:
      </p>
      <CodeBlock language="bash" code={`npm install -g @native-mate/cli
native-mate init`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Commands</h2>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Command</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['init', 'Initialize native-mate in your project — creates config, installs @native-mate/core'],
              ['add <components...>', 'Fetch components from registry and write to your project'],
              ['add --all', 'Install all available components at once'],
              ['list (ls)', 'List all available components grouped by category'],
              ['upgrade [components...]', 'Check for and apply component updates'],
            ].map(([cmd, desc], i) => (
              <tr key={cmd} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{cmd}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Features</h2>
      <ul className="space-y-2 text-sm text-zinc-400 list-disc pl-5">
        <li>Arrow-key navigation and multi-select for interactive component picking</li>
        <li>Automatic dependency resolution (components and npm packages)</li>
        <li>4 theme presets: zinc, slate, rose, midnight</li>
        <li>Overwrite protection with <code className="text-zinc-300">--overwrite</code> flag</li>
        <li>Custom registry support via <code className="text-zinc-300">-r</code> flag</li>
        <li>Version tracking and hash-based upgrade detection</li>
        <li>Auto-detects your package manager (npm, yarn, pnpm, bun)</li>
      </ul>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Full reference</h2>
      <ul className="space-y-1 text-sm">
        <li><a href="/docs/cli/init" className="text-blue-400 hover:text-blue-300">native-mate init</a></li>
        <li><a href="/docs/cli/add" className="text-blue-400 hover:text-blue-300">native-mate add</a></li>
        <li><a href="/docs/cli/list" className="text-blue-400 hover:text-blue-300">native-mate list</a></li>
        <li><a href="/docs/cli/upgrade" className="text-blue-400 hover:text-blue-300">native-mate upgrade</a></li>
      </ul>
    </article>
  )
}
