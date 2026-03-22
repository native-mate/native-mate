import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'VS Code Extension — Integrations' }

export default function VsCodePage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">VS Code Extension</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Add and manage native-mate components directly from the VS Code command palette.
        No terminal needed.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Installation</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Search for <code className="text-zinc-300">native-mate</code> in the VS Code Extensions
        marketplace, or install from the command line:
      </p>
      <CodeBlock language="bash" code="code --install-extension native-mate.native-mate" />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Commands</h2>
      <p className="mb-3 text-sm text-zinc-400">
        Open the command palette (<code className="text-zinc-300">Cmd+Shift+P</code> /
        {' '}<code className="text-zinc-300">Ctrl+Shift+P</code>) and type &ldquo;native-mate&rdquo;:
      </p>
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
              ['native-mate: Add component', 'Browse and add components via a searchable quick pick menu'],
              ['native-mate: Upgrade components', 'Check and apply updates for installed components'],
              ['native-mate: Open Theme Studio', 'Preview theme presets and copy config to native-mate.json'],
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
        <li>
          <strong className="text-zinc-200">Quick Pick component browser</strong> — multi-select
          components with search, category labels, and descriptions
        </li>
        <li>
          <strong className="text-zinc-200">Auto-detects package manager</strong> — uses npm, yarn,
          pnpm, or bun based on your lockfile
        </li>
        <li>
          <strong className="text-zinc-200">Status bar shortcut</strong> — a persistent button in
          the status bar for quick access when a <code className="text-zinc-300">native-mate.json</code> is detected
        </li>
        <li>
          <strong className="text-zinc-200">Theme Studio panel</strong> — preview all 4 presets
          (zinc, slate, rose, midnight) and copy the config JSON
        </li>
        <li>
          <strong className="text-zinc-200">Auto-init prompt</strong> — if no config is found,
          offers to run <code className="text-zinc-300">native-mate init</code> for you
        </li>
      </ul>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Requirements</h2>
      <ul className="space-y-1 text-sm text-zinc-400 list-disc pl-5">
        <li>VS Code &gt;= 1.85.0</li>
        <li>A project with <code className="text-zinc-300">native-mate.json</code> (or let the extension create one)</li>
      </ul>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Activation</h2>
      <p className="text-sm text-zinc-400">
        The extension activates automatically when it detects a{' '}
        <code className="text-zinc-300">native-mate.json</code> file in your workspace.
        The status bar button appears once activated.
      </p>
    </article>
  )
}
