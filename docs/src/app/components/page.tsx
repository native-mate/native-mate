import Link from 'next/link'
import { Nav } from '@/components/Nav'

const components = [
  // Primitives
  { name: 'Button', slug: 'button', category: 'Primitives', description: 'Tap interactions with variants, loading state, and icons.' },
  { name: 'Text', slug: 'text', category: 'Primitives', description: 'Typed typography with size, weight, and color tokens.' },
  { name: 'Icon', slug: 'icon', category: 'Primitives', description: 'SVG icon wrapper with size and color from tokens.' },
  { name: 'Spinner', slug: 'spinner', category: 'Primitives', description: 'Animated loading indicator in three sizes.' },
  { name: 'Separator', slug: 'separator', category: 'Primitives', description: 'Horizontal or vertical divider line.' },
  // Forms
  { name: 'Input', slug: 'input', category: 'Forms', description: 'Text input with label, error state, and prefix/suffix.' },
  { name: 'Textarea', slug: 'textarea', category: 'Forms', description: 'Auto-growing multi-line text input.' },
  { name: 'Checkbox', slug: 'checkbox', category: 'Forms', description: 'Animated checkbox with indeterminate state.' },
  { name: 'Switch', slug: 'switch', category: 'Forms', description: 'Toggle switch with smooth Reanimated transition.' },
  { name: 'Slider', slug: 'slider', category: 'Forms', description: 'Range slider with haptic feedback at extremes.' },
  { name: 'Select', slug: 'select', category: 'Forms', description: 'Bottom-sheet select built on Sheet. Searchable.' },
  // Layout
  { name: 'Card', slug: 'card', category: 'Layout', description: 'Container with header, content, and footer slots.' },
  { name: 'Accordion', slug: 'accordion', category: 'Layout', description: 'Animated height expansion, single or multi-open.' },
  { name: 'Tabs', slug: 'tabs', category: 'Layout', description: 'Horizontal tabs with sliding indicator animation.' },
  // Display
  { name: 'Badge', slug: 'badge', category: 'Display', description: '5 semantic variants + dot indicator.' },
  { name: 'Avatar', slug: 'avatar', category: 'Display', description: 'Image, initials fallback, status dot, and group stack.' },
  { name: 'Tag', slug: 'tag', category: 'Display', description: 'Compact dismissible label chip.' },
  { name: 'EmptyState', slug: 'empty-state', category: 'Display', description: 'Icon + heading + description + action.' },
  // Overlay
  { name: 'Sheet', slug: 'sheet', category: 'Overlay', description: 'Bottom sheet with snap points and drag-to-close.' },
  { name: 'Dialog', slug: 'dialog', category: 'Overlay', description: 'Modal dialog with accessible focus management.' },
  { name: 'ActionSheet', slug: 'action-sheet', category: 'Overlay', description: 'iOS-style action sheet built on Sheet.' },
  { name: 'Tooltip', slug: 'tooltip', category: 'Overlay', description: 'Contextual bubble anchored to any element.' },
  // Feedback
  { name: 'Toast', slug: 'toast', category: 'Feedback', description: 'Auto-dismissing notification with success/error/warning.' },
  { name: 'Progress', slug: 'progress', category: 'Feedback', description: 'Linear bar and circular ring variants.' },
  { name: 'SkeletonLoader', slug: 'skeleton', category: 'Feedback', description: 'Shimmer placeholder for loading content.' },
]

const categories = ['Primitives', 'Forms', 'Layout', 'Display', 'Overlay', 'Feedback']

const categoryColor: Record<string, string> = {
  Primitives: 'text-blue-400 bg-blue-900/30',
  Forms: 'text-purple-400 bg-purple-900/30',
  Layout: 'text-green-400 bg-green-900/30',
  Display: 'text-amber-400 bg-amber-900/30',
  Overlay: 'text-red-400 bg-red-900/30',
  Feedback: 'text-cyan-400 bg-cyan-900/30',
}

export const metadata = {
  title: 'Components — native-mate',
}

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold">Components</h1>
        <p className="mb-10 text-zinc-400">25 production-ready components. Click any to see docs and usage.</p>

        {categories.map((cat) => (
          <div key={cat} className="mb-12">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">{cat}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {components
                .filter((c) => c.category === cat)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/components/${c.slug}`}
                    className="group rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-zinc-600 hover:bg-zinc-800/60"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-zinc-50">{c.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${categoryColor[cat]}`}>{cat}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-500 group-hover:text-zinc-400">{c.description}</p>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
