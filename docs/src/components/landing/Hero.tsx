'use client'

import React from 'react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-5 pt-36 pb-16">
      {/* Pill badge */}
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3.5 py-1 text-xs text-zinc-400">
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">NEW</span>
        MCP Integration + VS Code Extension
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="max-w-3xl text-5xl sm:text-6xl lg:text-[72px] font-bold tracking-[-0.03em] text-white mb-5 leading-[1.05]">
        The Component Library for React Native
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed mb-10">
        27 production-ready components built on{' '}
        <span className="text-zinc-200 font-medium">Reanimated 4</span> and React Native{' '}
        <span className="text-zinc-200 font-medium">New Architecture</span>.
        Optimized for <span className="text-zinc-200 font-medium">Expo SDK 54</span>, fully typed,
        and scaffoldable via MCP or VS Code — ship polished apps faster.
      </p>

      {/* CTAs */}
      <div className="flex items-center gap-4 mb-12">
        <Link
          href="/docs/getting-started"
          className="rounded-lg bg-white text-black px-5 py-2.5 text-sm font-semibold hover:bg-zinc-100 transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/components"
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors py-2.5"
        >
          Browse Components
        </Link>
      </div>

      {/* Tech stack strip */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-zinc-600">
        {['Reanimated 4', 'New Architecture', 'Expo SDK 54', 'TypeScript', 'MCP Ready', 'VS Code Extension'].map((item, i, arr) => (
          <React.Fragment key={item}>
            <span>{item}</span>
            {i < arr.length - 1 && <span className="text-zinc-800">·</span>}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}
