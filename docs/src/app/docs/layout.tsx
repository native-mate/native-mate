import React from 'react'
import Link from 'next/link'
import { Nav } from '@/components/Nav'
import { ScrollProgress } from '@/components/ScrollProgress'

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
      { label: 'native-mate list', href: '/docs/cli/list' },
      { label: 'native-mate upgrade', href: '/docs/cli/upgrade' },
    ],
  },
  {
    group: 'Packages',
    items: [
      { label: '@native-mate/core', href: '/docs/packages/core' },
      { label: '@native-mate/cli', href: '/docs/packages/cli' },
    ],
  },
  {
    group: 'Integrations',
    items: [
      { label: 'MCP Server', href: '/docs/integrations/mcp' },
      { label: 'VS Code Extension', href: '/docs/integrations/vscode' },
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
    <div className="min-h-screen text-zinc-50" style={{ background: '#070709' }}>
      <Nav />
      <ScrollProgress />
      <div className="mx-auto flex max-w-6xl pt-14">
        {/* Sidebar */}
        <aside
          className="sticky top-14 hidden max-h-[calc(100vh-3.5rem)] w-56 flex-shrink-0 self-start overflow-y-auto py-8 lg:block [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' } as React.CSSProperties}
        >
          <nav className="space-y-6 pl-6 pr-4">
            {sidebarItems.map((group) => (
              <div key={group.group}>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                  {group.group}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center py-1 text-sm text-zinc-500 transition-colors duration-150 hover:text-zinc-200"
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
        <main className="min-w-0 flex-1 px-6 py-10 lg:px-12 lg:py-12">{children}</main>
      </div>
    </div>
  )
}
