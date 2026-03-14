import Link from 'next/link'

const components = [
  { name: 'Button', category: 'primitives', preview: 'Variants, loading state, icons' },
  { name: 'Input', category: 'forms', preview: 'Label, error, prefix/suffix' },
  { name: 'Card', category: 'layout', preview: 'Header, content, footer slots' },
  { name: 'Badge', category: 'display', preview: '5 variants + dot indicator' },
  { name: 'Avatar', category: 'display', preview: 'Image, initials, group stack' },
  { name: 'Sheet', category: 'overlay', preview: 'Bottom sheet with snap points' },
  { name: 'Dialog', category: 'overlay', preview: 'Modal with accessible focus' },
  { name: 'Toast', category: 'feedback', preview: 'Success, error, warning' },
  { name: 'Select', category: 'forms', preview: 'Built on Sheet, searchable' },
  { name: 'Accordion', category: 'layout', preview: 'Animated height, multi-open' },
  { name: 'Tabs', category: 'navigation', preview: 'Sliding indicator animation' },
  { name: 'Progress', category: 'feedback', preview: 'Linear + circular variants' },
]

const categoryColors: Record<string, string> = {
  primitives: 'bg-blue-900/40 text-blue-300',
  forms: 'bg-purple-900/40 text-purple-300',
  layout: 'bg-green-900/40 text-green-300',
  display: 'bg-amber-900/40 text-amber-300',
  overlay: 'bg-red-900/40 text-red-300',
  feedback: 'bg-cyan-900/40 text-cyan-300',
  navigation: 'bg-pink-900/40 text-pink-300',
}

export function ComponentShowcase() {
  return (
    <section className="border-t border-zinc-800 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 text-center text-3xl font-bold text-zinc-50">
          25 components. v1.
        </h2>
        <p className="mb-12 text-center text-zinc-400">
          Everything you need to ship a production app.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((c) => (
            <Link
              key={c.name}
              href={`/components/${c.name.toLowerCase()}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-600 hover:bg-zinc-800/50"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-zinc-50 group-hover:text-white">{c.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[c.category]}`}>
                  {c.category}
                </span>
              </div>
              <p className="text-xs text-zinc-500">{c.preview}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
          >
            View all 25 components
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
