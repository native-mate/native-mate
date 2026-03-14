import Link from 'next/link'
import { Nav } from '@/components/Nav'

const sidebarItems = [
  {
    group: 'Introduction',
    items: [
      { label: 'Getting started', href: '/docs/getting-started' },
      { label: 'Installation', href: '/docs/installation' },
      { label: 'Configuration', href: '/docs/configuration' },
    ],
  },
  {
    group: 'Theming',
    items: [
      { label: 'Token system', href: '/docs/tokens' },
      { label: 'Presets', href: '/docs/presets' },
      { label: 'Dark mode', href: '/docs/dark-mode' },
      { label: 'Custom tokens', href: '/docs/custom-tokens' },
    ],
  },
  {
    group: 'CLI',
    items: [
      { label: 'native-mate init', href: '/docs/cli/init' },
      { label: 'native-mate add', href: '/docs/cli/add' },
      { label: 'native-mate upgrade', href: '/docs/cli/upgrade' },
    ],
  },
  {
    group: 'Utilities',
    items: [
      { label: 'makeStyles', href: '/docs/make-styles' },
      { label: 'useTheme', href: '/docs/use-theme' },
      { label: 'useBreakpoint', href: '/docs/use-breakpoint' },
    ],
  },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Nav />
      <div className="mx-auto flex max-w-6xl gap-0">
        {/* Sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 flex-shrink-0 overflow-y-auto border-r border-zinc-800 py-8 lg:block">
          <nav className="space-y-6 px-4">
            {sidebarItems.map((group) => (
              <div key={group.group}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  {group.group}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-md px-2 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 px-6 py-10 lg:px-10">{children}</main>
      </div>
    </div>
  )
}
