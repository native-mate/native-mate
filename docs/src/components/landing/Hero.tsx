'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.4, 0.25, 1] },
  }),
}

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-5 pt-24 sm:pt-32 lg:pt-36 pb-14 sm:pb-16">
      {/* ── Minimal glow ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft ambient wash */}
        <div className="absolute left-1/2 top-[8%] -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[160px] bg-purple-600/15" />
        {/* Core glow */}
        <div className="absolute left-1/2 top-[10%] -translate-x-1/2 w-[350px] h-[250px] rounded-full blur-[80px] bg-violet-500/25" />
      </div>
      {/* Hard black fade at bottom — no glow leaks into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#070709] via-[#070709] to-transparent" />

      {/* Pill badge */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm px-3.5 py-1 text-xs text-zinc-400 cursor-pointer hover:border-zinc-700 transition-colors duration-200"
      >
        <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">NEW</span>
        MCP Integration + VS Code Extension
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </motion.div>

      {/* Title */}
      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative max-w-3xl text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold tracking-[-0.03em] text-white mb-4 sm:mb-5 leading-[1.05]"
      >
        The Component Library{' '}
        <span className="shimmer-text">for React Native</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="max-w-2xl text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed mb-8 sm:mb-10 px-2"
      >
        28 production-ready components built on{' '}
        <span className="text-zinc-200 font-medium">Reanimated 4</span> and React Native{' '}
        <span className="text-zinc-200 font-medium">New Architecture</span>.
        Optimized for <span className="text-zinc-200 font-medium">Expo SDK 54</span>, fully typed,
        and scaffoldable via MCP or VS Code — ship polished apps faster.
      </motion.p>

      {/* CTAs */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-10 sm:mb-12 w-full sm:w-auto"
      >
        <Link
          href="/docs/getting-started"
          className="group relative w-full sm:w-auto rounded-lg bg-white text-black px-6 py-2.5 text-sm font-semibold hover:bg-zinc-100 transition-all duration-200 text-center overflow-hidden hover:shadow-[0_0_24px_rgba(255,255,255,0.15)]"
        >
          Get Started
        </Link>
        <Link
          href="/components"
          className="w-full sm:w-auto text-sm font-medium text-zinc-400 hover:text-white transition-colors py-2.5 text-center group"
        >
          Browse Components
          <span className="inline-block ml-1 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </Link>
      </motion.div>

      {/* Tech stack strip */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] text-zinc-600"
      >
        {['Reanimated 4', 'New Architecture', 'Expo SDK 54', 'TypeScript', 'MCP Ready', 'VS Code Extension'].map((item, i, arr) => (
          <React.Fragment key={item}>
            <span className="hover:text-zinc-400 transition-colors cursor-default">{item}</span>
            {i < arr.length - 1 && <span className="text-zinc-800">·</span>}
          </React.Fragment>
        ))}
      </motion.div>
    </section>
  )
}
