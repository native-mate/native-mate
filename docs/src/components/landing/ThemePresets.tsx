const presets = [
  {
    name: 'Zinc',
    description: 'Clean neutral grays. The default.',
    bg: 'bg-zinc-900',
    accent: 'bg-zinc-50',
    surface: 'bg-zinc-800',
    text: 'text-zinc-50',
  },
  {
    name: 'Slate',
    description: 'Cool blue-gray tones.',
    bg: 'bg-slate-900',
    accent: 'bg-slate-200',
    surface: 'bg-slate-800',
    text: 'text-slate-50',
  },
  {
    name: 'Rose',
    description: 'Warm rose accents.',
    bg: 'bg-zinc-900',
    accent: 'bg-rose-500',
    surface: 'bg-zinc-800',
    text: 'text-zinc-50',
  },
  {
    name: 'Midnight',
    description: 'Deep dark-mode first.',
    bg: 'bg-neutral-950',
    accent: 'bg-violet-500',
    surface: 'bg-neutral-900',
    text: 'text-neutral-50',
  },
]

export function ThemePresets() {
  return (
    <section className="border-t border-zinc-800 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 text-center text-3xl font-bold text-zinc-50">
          Four presets. Fully yours.
        </h2>
        <p className="mb-12 text-center text-zinc-400">
          Pick a preset on init. Override any token in native-mate.json.
        </p>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {presets.map((p) => (
            <div key={p.name} className={`rounded-2xl ${p.bg} overflow-hidden border border-white/5`}>
              {/* Mini UI mockup */}
              <div className="p-4">
                <div className={`mb-3 h-8 w-full rounded-lg ${p.surface}`} />
                <div className={`mb-2 h-3 w-3/4 rounded ${p.surface}`} />
                <div className={`mb-4 h-3 w-1/2 rounded ${p.surface}`} />
                <div className={`h-8 w-full rounded-lg ${p.accent}`} />
              </div>
              <div className={`border-t border-white/5 px-4 py-3 ${p.bg}`}>
                <p className={`text-sm font-semibold ${p.text}`}>{p.name}</p>
                <p className="text-xs text-white/40">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
