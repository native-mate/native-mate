'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ─── Search data ──────────────────────────────────────────────────────────────

interface SearchItem {
  title: string
  href: string
  group: string
  keywords?: string
}

const SEARCH_ITEMS: SearchItem[] = [
  // Components — Primitives
  { title: 'Button',      href: '/components/button',      group: 'Components', keywords: 'press tap click interaction' },
  // Forms
  { title: 'Input',       href: '/components/input',       group: 'Components', keywords: 'text field form' },
  { title: 'Textarea',    href: '/components/textarea',    group: 'Components', keywords: 'multiline text area form' },
  { title: 'Checkbox',    href: '/components/checkbox',    group: 'Components', keywords: 'check tick toggle boolean' },
  { title: 'Radio',       href: '/components/radio',       group: 'Components', keywords: 'select option group' },
  { title: 'Switch',      href: '/components/switch',      group: 'Components', keywords: 'toggle on off boolean' },
  { title: 'Slider',      href: '/components/slider',      group: 'Components', keywords: 'range value number' },
  { title: 'Select',      href: '/components/select',      group: 'Components', keywords: 'dropdown picker option list' },
  { title: 'OTP Input',   href: '/components/otp-input',   group: 'Components', keywords: 'otp code pin verification' },
  // Layout
  { title: 'Card',        href: '/components/card',        group: 'Components', keywords: 'container surface box' },
  { title: 'Accordion',   href: '/components/accordion',   group: 'Components', keywords: 'expand collapse disclosure' },
  { title: 'Tabs',        href: '/components/tabs',        group: 'Components', keywords: 'tab navigation switch panel' },
  { title: 'Screen',      href: '/components/screen',      group: 'Components', keywords: 'layout page scroll safe area' },
  // Display
  { title: 'Badge',       href: '/components/badge',       group: 'Components', keywords: 'label chip status tag' },
  { title: 'Avatar',      href: '/components/avatar',      group: 'Components', keywords: 'user photo initials profile' },
  { title: 'Tag',         href: '/components/tag',         group: 'Components', keywords: 'chip label removable' },
  { title: 'Alert',       href: '/components/alert',       group: 'Components', keywords: 'warning error success message' },
  { title: 'Empty State', href: '/components/empty-state', group: 'Components', keywords: 'no data placeholder' },
  // Overlay
  { title: 'Sheet',       href: '/components/sheet',       group: 'Components', keywords: 'bottom sheet drawer' },
  { title: 'Dialog',      href: '/components/dialog',      group: 'Components', keywords: 'modal popup overlay' },
  { title: 'Action Sheet',href: '/components/action-sheet',group: 'Components', keywords: 'actions ios menu' },
  // Feedback
  { title: 'Toast',       href: '/components/toast',       group: 'Components', keywords: 'notification snackbar message' },
  { title: 'Progress',    href: '/components/progress',    group: 'Components', keywords: 'loading bar circular linear' },
  { title: 'Skeleton',    href: '/components/skeleton',    group: 'Components', keywords: 'placeholder shimmer loading' },
  // Docs
  { title: 'Getting Started',    href: '/docs/getting-started',    group: 'Docs' },
  { title: 'Installation',       href: '/docs/installation',       group: 'Docs', keywords: 'install setup npm expo' },
  { title: 'Configuration',      href: '/docs/configuration',      group: 'Docs', keywords: 'config setup native.config' },
  { title: 'Dark Mode',          href: '/docs/dark-mode',          group: 'Docs', keywords: 'theme dark light' },
  { title: 'Custom Tokens',      href: '/docs/custom-tokens',      group: 'Docs', keywords: 'tokens colors customize' },
  { title: 'useTheme',           href: '/docs/use-theme',          group: 'Docs', keywords: 'hook theme access' },
  { title: 'makeStyles',         href: '/docs/make-styles',        group: 'Docs', keywords: 'styles stylesheet hook' },
  { title: 'Tokens Reference',   href: '/docs/tokens',             group: 'Docs', keywords: 'colors spacing radius' },
  { title: 'Presets',            href: '/docs/presets',            group: 'Docs', keywords: 'zinc slate rose midnight' },
  { title: 'CLI — init',         href: '/docs/cli/init',           group: 'Docs', keywords: 'cli init setup' },
  { title: 'CLI — add',          href: '/docs/cli/add',            group: 'Docs', keywords: 'cli add install component' },
  { title: 'CLI — upgrade',      href: '/docs/cli/upgrade',        group: 'Docs', keywords: 'cli upgrade update' },
  { title: 'Theme Studio',       href: '/themes',                  group: 'Docs', keywords: 'customize theme tokens preview' },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Filter results
  const q = query.toLowerCase().trim()
  const results = q === ''
    ? SEARCH_ITEMS.slice(0, 12)
    : SEARCH_ITEMS.filter(item =>
        item.title.toLowerCase().includes(q) ||
        (item.keywords ?? '').toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q),
      ).slice(0, 12)

  // Group results
  const groups = results.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  // Flat index for keyboard nav
  const flat = results

  const navigate = useCallback((href: string) => {
    router.push(href)
    onClose()
  }, [router, onClose])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, flat.length - 1)); return }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); return }
      if (e.key === 'Enter' && flat[cursor]) { navigate(flat[cursor].href); return }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, cursor, flat, navigate, onClose])

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-cursor="true"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  // Reset cursor when results change
  useEffect(() => { setCursor(0) }, [query])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-900 shadow-2xl"
        style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.05) inset, 0 25px 60px rgba(0,0,0,0.6)' }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3.5">
          <svg className="h-4 w-4 flex-shrink-0 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search documentation..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 outline-none"
          />
          <kbd className="hidden rounded-md border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500 sm:inline">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <ul
          ref={listRef}
          className="max-h-[360px] overflow-y-auto py-2"
        >
          {results.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-zinc-600">
              No results for &ldquo;{query}&rdquo;
            </li>
          ) : (
            Object.entries(groups).map(([group, items]) => (
              <React.Fragment key={group}>
                <li className="px-4 pb-1 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">{group}</p>
                </li>
                {items.map(item => {
                  const idx = flat.indexOf(item)
                  const active = idx === cursor
                  return (
                    <li key={item.href} data-cursor={active || undefined}>
                      <button
                        onMouseEnter={() => setCursor(idx)}
                        onClick={() => navigate(item.href)}
                        className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                          active ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border text-[10px] ${
                          active ? 'border-zinc-600 bg-zinc-700 text-zinc-300' : 'border-zinc-800 text-zinc-600'
                        }`}>
                          {group === 'Components' ? '⬡' : '📄'}
                        </span>
                        <span className="flex-1 text-sm font-medium">{item.title}</span>
                        {active && (
                          <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
                            ↵
                          </kbd>
                        )}
                      </button>
                    </li>
                  )
                })}
              </React.Fragment>
            ))
          )}
        </ul>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-2.5">
          <div className="flex items-center gap-3 text-[10px] text-zinc-700">
            <span><kbd className="rounded border border-zinc-800 px-1">↑</kbd><kbd className="ml-0.5 rounded border border-zinc-800 px-1">↓</kbd> navigate</span>
            <span><kbd className="rounded border border-zinc-800 px-1.5">↵</kbd> open</span>
            <span><kbd className="rounded border border-zinc-800 px-1.5">ESC</kbd> close</span>
          </div>
          <span className="text-[10px] text-zinc-700">{results.length} results</span>
        </div>
      </div>
    </div>
  )
}
