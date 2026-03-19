'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SIDEBAR_GROUPS = [
  {
    group: 'Primitives',
    items: [
      { name: 'Button',    slug: 'button'    },
      { name: 'Text',      slug: 'text'      },
      { name: 'Icon',      slug: 'icon'      },
      { name: 'Spinner',   slug: 'spinner'   },
      { name: 'Separator', slug: 'separator' },
    ],
  },
  {
    group: 'Forms',
    items: [
      { name: 'Input', slug: 'input' },
      { name: 'Textarea', slug: 'textarea' },
      { name: 'Checkbox', slug: 'checkbox' },
      { name: 'Radio', slug: 'radio' },
      { name: 'Switch', slug: 'switch' },
      { name: 'Slider', slug: 'slider' },
      { name: 'Select', slug: 'select' },
      { name: 'OTP Input', slug: 'otp-input' },
    ],
  },
  {
    group: 'Layout',
    items: [
      { name: 'Card', slug: 'card' },
      { name: 'Accordion', slug: 'accordion' },
      { name: 'Tabs', slug: 'tabs' },
      { name: 'Screen', slug: 'screen' },
    ],
  },
  {
    group: 'Display',
    items: [
      { name: 'Badge', slug: 'badge' },
      { name: 'Avatar', slug: 'avatar' },
      { name: 'Tag', slug: 'tag' },
      { name: 'Alert', slug: 'alert' },
      { name: 'Empty State', slug: 'empty-state' },
    ],
  },
  {
    group: 'Overlay',
    items: [
      { name: 'Sheet', slug: 'sheet' },
      { name: 'Dialog', slug: 'dialog' },
      { name: 'Action Sheet', slug: 'action-sheet' },
    ],
  },
  {
    group: 'Feedback',
    items: [
      { name: 'Toast', slug: 'toast' },
      { name: 'Progress', slug: 'progress' },
      { name: 'Skeleton', slug: 'skeleton' },
    ],
  },
]

export function ComponentSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="sticky top-14 hidden max-h-[calc(100vh-3.5rem)] w-56 flex-shrink-0 self-start overflow-y-auto py-8 lg:block [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' } as React.CSSProperties}
    >
      <nav className="space-y-5 pl-6 pr-4">
        {SIDEBAR_GROUPS.map((group) => (
          <div key={group.group}>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const href = `/components/${item.slug}`
                const isActive = pathname === href
                return (
                  <li key={item.slug}>
                    <Link
                      href={href}
                      className={`flex items-center py-1 text-sm transition-colors duration-150 ${
                        isActive
                          ? 'font-medium text-zinc-100'
                          : 'text-zinc-500 hover:text-zinc-200'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
