import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'native-mate upgrade — CLI' }

export default function CliUpgradePage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">native-mate upgrade</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Check installed components for updates and apply them — safely, with local-change detection.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Usage</h2>
      <CodeBlock language="bash" code="npx native-mate upgrade [components...] [options]" />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Examples</h2>
      <CodeBlock language="bash" code={`# Check all installed components
npx native-mate upgrade

# Upgrade specific components
npx native-mate upgrade button card

# Skip confirmation prompts
npx native-mate upgrade -y`} />

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Local change detection</h2>
      <p className="text-sm text-zinc-400">
        Each component file has a SHA-256 hash in its header comment. When you run upgrade, the CLI
        compares the on-disk file hash against the registry version. If your file differs from the
        original (you customised it), upgrade will warn you before overwriting.
      </p>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 font-mono text-xs text-zinc-400">
        <span className="text-zinc-500">// native-mate: </span>
        <span className="text-blue-400">button@0.1.0</span>
        <span className="text-zinc-500"> | hash:</span>
        <span className="text-green-400">a3f8c2d1e9b4</span>
      </div>

      <p className="mt-4 text-sm text-zinc-400">
        If the hash doesn&apos;t match, upgrade shows which files you&apos;ve changed and asks whether
        to overwrite. Use <code className="text-zinc-300">-y</code> to skip the prompt and always overwrite.
      </p>
    </article>
  )
}
