import { CodeBlock } from '@/components/CodeBlock'
import Link from 'next/link'

export const metadata = { title: 'Presets — native-mate' }

const PRESETS = [
  {
    name: 'zinc',
    title: 'Zinc',
    description: 'The default. Clean neutral grays that work in any app.',
    bg: '#0a0a0a',
    surface: '#18181b',
    primary: '#fafafa',
    accent: '#3f3f46',
  },
  {
    name: 'slate',
    title: 'Slate',
    description: 'Cool blue-gray tones. Great for productivity tools.',
    bg: '#0f172a',
    surface: '#1e293b',
    primary: '#f8fafc',
    accent: '#334155',
  },
  {
    name: 'rose',
    title: 'Rose',
    description: 'Warm rose primary. Ideal for lifestyle, health, or social apps.',
    bg: '#0a0a0a',
    surface: '#18181b',
    primary: '#fb7185',
    accent: '#3f3f46',
  },
  {
    name: 'midnight',
    title: 'Midnight',
    description: 'Deep dark with violet accents. Perfect for developer or finance tools.',
    bg: '#030303',
    surface: '#0d0d0d',
    primary: '#a78bfa',
    accent: '#1a1a1a',
  },
]

export default function PresetsPage() {
  return (
    <article className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Presets</h1>
      <p className="mb-8 text-zinc-400 text-lg">
        Four built-in presets. Pick one on init, switch any time, or override individual tokens
        without changing the preset.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-10">
        {PRESETS.map((p) => (
          <div
            key={p.name}
            className="rounded-xl border border-white/5 overflow-hidden"
            style={{ background: p.bg }}
          >
            <div className="p-4 space-y-3">
              <div className="h-7 w-full rounded-md" style={{ background: p.surface }} />
              <div className="h-2.5 w-3/4 rounded" style={{ background: p.accent }} />
              <div className="h-2.5 w-1/2 rounded" style={{ background: p.accent }} />
              <div
                className="h-8 w-full rounded-md"
                style={{ background: p.primary }}
              />
            </div>
            <div className="px-4 py-3 border-t border-white/5">
              <p className="text-sm font-semibold" style={{ color: '#fafafa' }}>{p.title}</p>
              <p className="text-xs mt-0.5" style={{ color: '#71717a' }}>{p.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Switching preset</h2>
      <CodeBlock language="json" filename="native-mate.json" code={`{ "preset": "rose", "componentsDir": "components/ui" }`} />

      <p className="mt-4 text-sm text-zinc-400">
        The preset is read by ThemeProvider at runtime. Changing it takes effect immediately on the
        next hot reload — no rebuild required.
      </p>

      <h2 className="mt-8 mb-3 text-xl font-semibold text-zinc-50">Customise from Theme Studio</h2>
      <p className="text-sm text-zinc-400">
        Use the{' '}
        <Link href="/themes" className="text-zinc-300 underline hover:text-white">
          Theme Studio
        </Link>{' '}
        to preview presets and generate a native-mate.json with your overrides.
      </p>
    </article>
  )
}
