import { CodeBlock } from '@/components/CodeBlock'

export const metadata = { title: 'native-mate migrate — CLI' }

export default function CliMigratePage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">native-mate migrate</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Apply the codemods for a native-mate release. Renames the props that changed, and flags the
        one case a codemod cannot decide for you.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Usage</h2>
      <CodeBlock language="bash" code="npx @native-mate/cli migrate [version] [options]" />
      <p className="mt-3 text-sm text-zinc-400">
        <code className="text-zinc-300">version</code> defaults to{' '}
        <code className="text-zinc-300">v0.5</code>, which is currently the only supported target —
        anything else exits with an error. The <code className="text-zinc-300">v</code> prefix is
        optional (<code className="text-zinc-300">0.5</code> and{' '}
        <code className="text-zinc-300">v0.5</code> are the same).
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Examples</h2>
      <CodeBlock language="bash" code={`# Preview the v0.5 codemod across the project
npx @native-mate/cli migrate --dry

# Apply it
npx @native-mate/cli migrate

# Apply it to one subtree only
npx @native-mate/cli migrate v0.5 -p src/screens`} />

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
              ['--dry', 'Report what would change without writing any files'],
              ['-p, --path <dir>', 'Limit the scan to a subdirectory (relative or absolute)'],
            ].map(([flag, desc], i) => (
              <tr key={flag} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{flag}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">What it rewrites</h2>
      <p className="mb-3 text-sm text-zinc-400">
        v0.5 unified prop names across the registry. The codemod applies these renames:
      </p>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Before</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">After</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400">Why</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['errorMessage', 'error', 'One error contract: a string renders as the message, true sets error styling with no text'],
              ['hapticOnFocus', 'haptic', 'One haptic contract across every component'],
              ['hapticOnDrag', 'haptic', 'One haptic contract across every component'],
              ['hapticOnPress', 'haptic', 'One haptic contract across every component'],
            ].map(([from, to, why], i) => (
              <tr key={from} className={i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/50'}>
                <td className="px-4 py-3 font-mono text-xs text-blue-400">{from}</td>
                <td className="px-4 py-3 font-mono text-xs text-green-400">{to}</td>
                <td className="px-4 py-3 text-xs text-zinc-400">{why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-zinc-400">
        Both the valued form (<code className="text-zinc-300">errorMessage={'{msg}'}</code>,{' '}
        <code className="text-zinc-300">errorMessage=&quot;Required&quot;</code>) and the shorthand
        boolean form (<code className="text-zinc-300">hapticOnPress</code>) are rewritten. See{' '}
        <a href="/docs/prop-contracts" className="text-blue-400 hover:text-blue-300">prop contracts</a>{' '}
        for the resulting shapes.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">What it does not rewrite</h2>
      <p className="mb-3 text-sm text-zinc-400">
        String-valued <code className="text-zinc-300">icon</code> props are{' '}
        <strong className="text-zinc-200">flagged, never rewritten</strong>.{' '}
        <code className="text-zinc-300">icon</code> is now a{' '}
        <code className="text-zinc-300">ReactNode</code>, so the replacement is a JSX element — and
        the codemod cannot choose which icon set that element comes from, or what size and colour it
        should carry. The migrate report lists every file and count so you can do it by hand:
      </p>
      <CodeBlock language="tsx" code={`// before
<Button icon="star" />

// after — you pick the icon set
<Button icon={<Ionicons name="star" size={16} />} />`} />

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-400">
        <strong className="text-zinc-200">It matches JSX attributes, not identifiers.</strong> Both
        rename patterns are anchored to JSX-attribute syntax — a name immediately followed by{' '}
        <code className="text-zinc-300">={'{'}</code>, <code className="text-zinc-300">=&quot;</code>,
        or <code className="text-zinc-300">=&apos;</code> with no space before the{' '}
        <code className="text-zinc-300">=</code>, or a bare name not followed by{' '}
        <code className="text-zinc-300">=</code>, <code className="text-zinc-300">:</code>, or a word
        character. So <code className="text-zinc-300">const errorMessage = getError()</code>, an
        object key like <code className="text-zinc-300">{'{ errorMessage: msg }'}</code>, and a
        property access are all left alone.
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Scan scope</h2>
      <p className="mb-8 text-sm text-zinc-400">
        Walks the working directory (or <code className="text-zinc-300">--path</code>) for{' '}
        <code className="text-zinc-300">.ts</code>, <code className="text-zinc-300">.tsx</code>,{' '}
        <code className="text-zinc-300">.js</code>, and <code className="text-zinc-300">.jsx</code>{' '}
        files, skipping <code className="text-zinc-300">node_modules</code>,{' '}
        <code className="text-zinc-300">.git</code>, <code className="text-zinc-300">.expo</code>,{' '}
        <code className="text-zinc-300">.next</code>, <code className="text-zinc-300">dist</code>,{' '}
        <code className="text-zinc-300">build</code>, <code className="text-zinc-300">ios</code>, and{' '}
        <code className="text-zinc-300">android</code>.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Dry-run output</h2>
      <CodeBlock language="bash" code={`$ npx @native-mate/cli migrate --dry

│  native-mate migrate
│
◇  Scanning 214 file(s) under /Users/me/my-app
│
◇  errorMessage → error (7)
◇  hapticOnPress → haptic (3)
│
▲  4 string-valued icon prop(s) need a manual edit — icon is now a ReactNode:
│    icon="star"  →  icon={<Ionicons name="star" size={16} />}
│    src/screens/Cart.tsx ×2
│    src/components/Row.tsx ×2
│
└  Dry run — 6 file(s) would change. Re-run without --dry to apply.`} />
      <p className="mt-3 text-sm text-zinc-400">
        When nothing matches, migrate exits with{' '}
        <code className="text-zinc-300">Already on the v0.5 prop contracts — nothing to change.</code>{' '}
        Without <code className="text-zinc-300">--dry</code> the final line reports how many files
        were written instead.
      </p>

      <div className="mt-6 rounded-xl border border-amber-800/50 bg-amber-950/20 p-4 text-sm text-amber-300">
        <strong>Commit first.</strong> migrate rewrites files in place with no backup — run it on a
        clean working tree, or with <code className="text-amber-200">--dry</code> first, so the diff
        is reviewable.
      </div>
    </article>
  )
}
