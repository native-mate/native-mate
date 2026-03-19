'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'text-amber-400',
    glow: 'group-hover:shadow-[0_0_24px_rgba(251,191,36,0.15)]',
    border: 'group-hover:border-amber-500/20',
    title: 'New Architecture',
    description: 'Built exclusively for Fabric + JSI. No legacy bridge. Full New Architecture compatibility from day one.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="3"/><path strokeLinecap="round" strokeLinejoin="round" d="M20.188 10.934l-1.442-.282a7.048 7.048 0 00-.52-1.253l.852-1.207A9 9 0 0015.8 5.474L14.6 6.33a7.03 7.03 0 00-1.252-.52l-.282-1.442a9.1 9.1 0 00-2.132 0l-.282 1.442a7.048 7.048 0 00-1.253.52L8.2 5.474A9 9 0 005.472 8.2L6.33 9.4a7.047 7.047 0 00-.52 1.252l-1.442.282a9.1 9.1 0 000 2.132l1.442.282a7.03 7.03 0 00.52 1.252l-.858 1.2a9 9 0 002.728 2.728l1.2-.858a7.048 7.048 0 001.252.52l.282 1.442a9.1 9.1 0 002.132 0l.282-1.442a7.03 7.03 0 001.252-.52l1.2.858a9 9 0 002.728-2.728l-.858-1.2a7.047 7.047 0 00.52-1.252l1.442-.282a9.1 9.1 0 000-2.132z"/>
      </svg>
    ),
    color: 'text-indigo-400',
    glow: 'group-hover:shadow-[0_0_24px_rgba(99,102,241,0.15)]',
    border: 'group-hover:border-indigo-500/20',
    title: 'Token-based theming',
    description: 'Semantic design tokens with four presets. Dark mode with zero flicker — swap themes at runtime.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    ),
    color: 'text-cyan-400',
    glow: 'group-hover:shadow-[0_0_24px_rgba(6,182,212,0.15)]',
    border: 'group-hover:border-cyan-500/20',
    title: 'Reanimated 4',
    description: 'Every interaction runs on the UI thread via JSI worklets. 60fps guaranteed, even on low-end devices.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    color: 'text-green-400',
    glow: 'group-hover:shadow-[0_0_24px_rgba(74,222,128,0.15)]',
    border: 'group-hover:border-green-500/20',
    title: 'Copy, not install',
    description: 'Components live in your codebase. Fork, rename, delete — no npm update hell, no peer dep conflicts.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: 'text-purple-400',
    glow: 'group-hover:shadow-[0_0_24px_rgba(167,139,250,0.15)]',
    border: 'group-hover:border-purple-500/20',
    title: 'TypeScript first',
    description: 'Strict types, exported prop interfaces, and full IntelliSense on every component, prop, and variant.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-rose-400',
    glow: 'group-hover:shadow-[0_0_24px_rgba(251,113,133,0.15)]',
    border: 'group-hover:border-rose-500/20',
    title: 'AI-native MCP',
    description: 'MCP server for Claude Code and Cursor. Generate, modify, and scaffold components directly from chat.',
  },
]

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.4, 0.25, 1] },
  }),
}

export function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative px-5 py-28">
      <div className="section-divider mb-0" />

      <div className="mx-auto max-w-6xl pt-16 sm:pt-28" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-xs text-indigo-400 font-semibold uppercase tracking-[0.2em] mb-4">Why native-mate</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-50 mb-4">
            Built the way
            <br />
            <span className="gradient-text">you&apos;d build it</span>
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">
            No framework lock-in. Just production-ready components that respect your architecture.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800/50 rounded-2xl overflow-hidden border border-zinc-800/80">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className={`group relative bg-[#0a0a0c] p-6 transition-all duration-300 cursor-default ${f.glow} ${f.border} border border-transparent`}
            >
              {/* Hover background */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/[0.03] to-transparent" />

              <div className={`${f.color} mb-4 relative z-10`}>{f.icon}</div>
              <h3 className="font-semibold text-zinc-100 mb-2 relative z-10">{f.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500 relative z-10">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
