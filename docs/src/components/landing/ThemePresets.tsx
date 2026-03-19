const presets = [
  {
    name: 'Zinc',
    description: 'Clean neutral grays. The default.',
    primary: '#fafafa',
    surface: '#18181b',
    bg: '#0a0a0a',
    accent: '#fafafa',
    text: '#fafafa',
    muted: '#71717a',
    border: '#27272a',
  },
  {
    name: 'Slate',
    description: 'Cool blue-gray tones.',
    primary: '#f8fafc',
    surface: '#1e293b',
    bg: '#0f172a',
    accent: '#94a3b8',
    text: '#f1f5f9',
    muted: '#64748b',
    border: '#334155',
  },
  {
    name: 'Rose',
    description: 'Warm rose accents.',
    primary: '#fb7185',
    surface: '#1c1917',
    bg: '#0c0a09',
    accent: '#fb7185',
    text: '#fafaf9',
    muted: '#78716c',
    border: '#292524',
  },
  {
    name: 'Midnight',
    description: 'Deep dark with violet glow.',
    primary: '#a78bfa',
    surface: '#18181b',
    bg: '#09090b',
    accent: '#a78bfa',
    text: '#fafafa',
    muted: '#71717a',
    border: '#27272a',
  },
]

function PhoneMockup({ preset }: { preset: typeof presets[0] }) {
  return (
    <div className="rounded-[20px] p-4 overflow-hidden border" style={{ backgroundColor: preset.bg, borderColor: preset.border }}>
      {/* Status */}
      <div className="flex justify-between items-center mb-4 opacity-40">
        <span className="text-[9px] font-mono" style={{ color: preset.text }}>9:41</span>
        <div className="flex gap-1">
          <div className="w-3 h-1 rounded-full" style={{ backgroundColor: preset.muted }} />
          <div className="w-3 h-1 rounded-full" style={{ backgroundColor: preset.muted }} />
          <div className="w-3 h-1 rounded-full" style={{ backgroundColor: preset.muted }} />
        </div>
      </div>

      {/* Card mockup */}
      <div className="rounded-xl p-3 mb-3 border" style={{ backgroundColor: preset.surface, borderColor: preset.border }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.accent + '33' }} />
          <div>
            <div className="h-2 w-16 rounded mb-1" style={{ backgroundColor: preset.text + '30' }} />
            <div className="h-1.5 w-10 rounded" style={{ backgroundColor: preset.muted + '60' }} />
          </div>
        </div>
        <div className="h-1.5 w-full rounded mb-1.5" style={{ backgroundColor: preset.text + '15' }} />
        <div className="h-1.5 w-4/5 rounded" style={{ backgroundColor: preset.text + '10' }} />
      </div>

      {/* Button */}
      <div className="h-8 w-full rounded-xl flex items-center justify-center" style={{ backgroundColor: preset.primary + (preset.primary.startsWith('#fa') ? '15' : '') }}>
        <span className="text-[9px] font-semibold" style={{ color: preset.text }}>Get started</span>
      </div>

      {/* Badges */}
      <div className="flex gap-1.5 mt-3">
        <div className="px-2 py-0.5 rounded-full border" style={{ backgroundColor: preset.accent + '18', borderColor: preset.accent + '30' }}>
          <span className="text-[8px] font-semibold" style={{ color: preset.accent }}>Active</span>
        </div>
        <div className="px-2 py-0.5 rounded-full border" style={{ borderColor: preset.border }}>
          <span className="text-[8px]" style={{ color: preset.muted }}>Pending</span>
        </div>
      </div>
    </div>
  )
}

export function ThemePresets() {
  return (
    <section className="relative px-4 sm:px-5 py-16 sm:py-28">
      <div className="section-divider mb-0" />

      <div className="mx-auto max-w-6xl pt-14 sm:pt-28">
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-xs text-indigo-400 font-semibold uppercase tracking-[0.2em] mb-4">Design tokens</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-50 mb-4">
            Four presets.
            <br />
            <span className="gradient-text">Fully yours.</span>
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto leading-relaxed">
            Pick a preset on init. Override any token in native-mate.json. Hot-swap at runtime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {presets.map((p) => (
            <div key={p.name} className="group hover-glow rounded-2xl overflow-hidden border border-zinc-800 cursor-pointer">
              <div className="p-4">
                <PhoneMockup preset={p} />
              </div>
              <div className="px-4 pb-4">
                <p className="text-sm font-semibold text-zinc-100 mb-0.5">{p.name}</p>
                <p className="text-xs text-zinc-600">{p.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-8">
          All tokens are fully customizable ·{' '}
          <a href="/docs/tokens" className="text-indigo-400 hover:text-indigo-300 transition-colors">Read the theming docs →</a>
        </p>
      </div>
    </section>
  )
}
