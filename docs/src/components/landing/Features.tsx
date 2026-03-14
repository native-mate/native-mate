const features = [
  {
    icon: '⚡',
    title: 'New Architecture',
    description: 'Built exclusively for Fabric + TurboModules. No legacy bridge baggage.',
  },
  {
    icon: '🎨',
    title: 'Token-based theming',
    description: 'Semantic design tokens. Four presets. Dark mode with zero flicker.',
  },
  {
    icon: '✦',
    title: 'Reanimated 3',
    description: 'Every interaction runs on the UI thread. 60fps guaranteed.',
  },
  {
    icon: '📦',
    title: 'Copy, not install',
    description: 'Components live in your repo. Fork, change, own — no node_modules drama.',
  },
  {
    icon: '🔧',
    title: 'TypeScript first',
    description: 'Strict types, exported prop interfaces, full IntelliSense out of the box.',
  },
  {
    icon: '🤖',
    title: 'AI-ready',
    description: 'MCP server for Claude + Cursor. Generate components directly from your editor.',
  },
]

export function Features() {
  return (
    <section className="border-t border-zinc-800 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 text-center text-3xl font-bold text-zinc-50">
          Built the way you&apos;d build it
        </h2>
        <p className="mb-12 text-center text-zinc-400">
          No opinions forced on you. Just good defaults and full control.
        </p>
        <div className="grid grid-cols-1 gap-px bg-zinc-800 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="bg-zinc-950 p-6">
              <div className="mb-3 text-2xl">{f.icon}</div>
              <h3 className="mb-2 font-semibold text-zinc-50">{f.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
