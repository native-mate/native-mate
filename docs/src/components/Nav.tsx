'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-zinc-50">native-mate</span>
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs font-medium text-zinc-400">v0.1</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/docs" className="text-sm text-zinc-400 transition-colors hover:text-zinc-50">
            Docs
          </Link>
          <Link href="/components" className="text-sm text-zinc-400 transition-colors hover:text-zinc-50">
            Components
          </Link>
          <Link href="/themes" className="text-sm text-zinc-400 transition-colors hover:text-zinc-50">
            Theme Studio
          </Link>
          <a
            href="https://github.com/native-mate/native-mate"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-50"
          >
            GitHub
          </a>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/docs/getting-started"
            className="rounded-lg bg-zinc-50 px-4 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          >
            Get started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 bg-zinc-400 transition-transform ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-zinc-400 transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-zinc-400 transition-transform ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="/docs" className="text-sm text-zinc-400">Docs</Link>
            <Link href="/components" className="text-sm text-zinc-400">Components</Link>
            <Link href="/themes" className="text-sm text-zinc-400">Theme Studio</Link>
            <Link href="/docs/getting-started" className="text-sm font-medium text-zinc-50">Get started →</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
