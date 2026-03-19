'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { SearchDialog } from './SearchDialog'

const navLinks = [
  { label: 'Docs', href: '/docs/getting-started' },
  { label: 'Components', href: '/components' },
  { label: 'Themes', href: '/themes' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/70 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image src="/logo.png" alt="native-mate" width={22} height={22} className="flex-shrink-0 invert" />
            <span className="text-[15px] font-semibold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
              native-mate
            </span>
            <span className="hidden sm:inline rounded-md bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400 leading-none">
              v1.0
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-200 rounded-md hover:bg-white/[0.04]"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/native-mate/native-mate"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-200 rounded-md hover:bg-white/[0.04] flex items-center gap-1.5 ml-1"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </nav>

          {/* Right side: search + CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex w-56 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-sm text-zinc-500 transition-all hover:border-zinc-700 hover:bg-zinc-800/60 hover:text-zinc-300"
            >
              <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <span className="flex-1 text-left text-xs">Search...</span>
              <div className="flex items-center gap-1.5">
                <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-600">⌘</kbd>
                <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-600">K</kbd>
              </div>
            </button>

            <Link
              href="/docs/getting-started"
              className="rounded-lg bg-white text-black px-4 py-1.5 text-sm font-semibold hover:bg-zinc-100 transition-colors"
            >
              Get started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="flex flex-col justify-center gap-[5px] p-2 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className={`block h-px w-5 bg-zinc-400 transition-all duration-300 origin-center ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`block h-px w-5 bg-zinc-400 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-5 bg-zinc-400 transition-all duration-300 origin-center ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`overflow-hidden transition-all duration-300 md:hidden ${open ? 'max-h-72' : 'max-h-0'}`}>
          <div className="border-t border-white/[0.06] bg-black/80 backdrop-blur-xl px-5 py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm text-zinc-400 hover:text-zinc-100 rounded-md hover:bg-white/[0.04] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-white/[0.06] my-2" />
              <button
                onClick={() => { setOpen(false); setSearchOpen(true) }}
                className="px-3 py-2.5 text-sm text-left text-zinc-400 hover:text-zinc-100 rounded-md hover:bg-white/[0.04] transition-colors flex items-center gap-2"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                Search docs
              </button>
              <div className="h-px bg-white/[0.06] my-2" />
              <Link
                href="/docs/getting-started"
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
              >
                Get started →
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
