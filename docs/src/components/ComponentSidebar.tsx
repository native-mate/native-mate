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
      { name: 'Quantity Stepper', slug: 'quantity-stepper' },
      { name: 'Chip', slug: 'chip' },
      { name: 'Color Picker', slug: 'color-picker' },
      { name: 'Date Picker', slug: 'date-picker' },
      { name: 'Mention Input', slug: 'mention-input' },
      { name: 'Phone Input', slug: 'phone-input' },
      { name: 'PIN Lock', slug: 'pin-lock' },
      { name: 'Rating', slug: 'rating' },
      { name: 'Search Bar', slug: 'search-bar' },
      { name: 'Segmented Control', slug: 'segmented-control' },
      { name: 'Social Login Button', slug: 'social-login-button' },
      { name: 'Toggle Group', slug: 'toggle-group' },
      { name: 'Stepper', slug: 'stepper' },
      { name: 'File Upload', slug: 'file-upload' },
    ],
  },
  {
    group: 'Layout',
    items: [
      { name: 'Card', slug: 'card' },
      { name: 'Accordion', slug: 'accordion' },
      { name: 'Tabs', slug: 'tabs' },
      { name: 'Screen', slug: 'screen' },
      { name: 'Divider Label', slug: 'divider-label' },
      { name: 'Collapsible', slug: 'collapsible' },
      { name: 'Onboarding Screen', slug: 'onboarding-screen' },
      { name: 'Infinite Scroll', slug: 'infinite-scroll' },
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
      { name: 'Cart Item', slug: 'cart-item' },
      { name: 'Payment Card', slug: 'payment-card' },
      { name: 'Pricing Card', slug: 'pricing-card' },
      { name: 'Product Card', slug: 'product-card' },
      { name: 'Review Card', slug: 'review-card' },
      { name: 'Stat Card', slug: 'stat-card' },
      { name: 'Countdown', slug: 'countdown' },
      { name: 'Notification Card', slug: 'notification-card' },
      { name: 'Audio Player', slug: 'audio-player' },
      { name: 'Carousel', slug: 'carousel' },
      { name: 'Chat Bubble', slug: 'chat-bubble' },
      { name: 'Comment', slug: 'comment' },
      { name: 'Data Table', slug: 'data-table' },
      { name: 'Image', slug: 'image' },
      { name: 'List Item', slug: 'list-item' },
      { name: 'Markdown', slug: 'markdown' },
      { name: 'Timeline', slug: 'timeline' },
      { name: 'Video Player', slug: 'video-player' },
      { name: 'Reaction Bar', slug: 'reaction-bar' },
    ],
  },
  {
    group: 'Overlay',
    items: [
      { name: 'Sheet', slug: 'sheet' },
      { name: 'Action Sheet', slug: 'action-sheet' },
      { name: 'Biometric Prompt', slug: 'biometric-prompt' },
      { name: 'Bottom Sheet List', slug: 'bottom-sheet-list' },
      { name: 'Dialog', slug: 'dialog' },
      { name: 'Dropdown Menu', slug: 'dropdown-menu' },
      { name: 'Popover', slug: 'popover' },
      { name: 'Tooltip', slug: 'tooltip' },
    ],
  },
  {
    group: 'Feedback',
    items: [
      { name: 'Toast', slug: 'toast' },
      { name: 'Progress', slug: 'progress' },
      { name: 'Skeleton', slug: 'skeleton' },
      { name: 'Banner', slug: 'banner' },
      { name: 'Pull to Refresh', slug: 'pull-to-refresh' },
    ],
  },
  {
    group: 'Navigation',
    items: [
      { name: 'FAB', slug: 'fab' },
      { name: 'Speed Dial', slug: 'speed-dial' },
      { name: 'Bottom Bar', slug: 'bottom-bar' },
      { name: 'Breadcrumb', slug: 'breadcrumb' },
      { name: 'Header', slug: 'header' },
    ],
  },
  {
    group: 'Interaction',
    items: [
      { name: 'Draggable List', slug: 'draggable-list' },
      { name: 'Swipeable Row', slug: 'swipeable-row' },
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
