'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const components = [
  { name: 'Text',      slug: 'text',      category: 'primitives', description: '13 variants, weights, color tokens, truncation' },
  { name: 'Icon',      slug: 'icon',      category: 'primitives', description: 'Ionicons wrapper, size presets, theme colors' },
  { name: 'Spinner',   slug: 'spinner',   category: 'primitives', description: 'Circle, dots, pulse — 3 variants, overlay mode' },
  { name: 'Separator', slug: 'separator', category: 'primitives', description: 'Horizontal/vertical, label, dashed, themed' },
  { name: 'Button', slug: 'button', category: 'primitives', description: 'Variants, sizes, loading state, icons' },
  { name: 'Input', slug: 'input', category: 'forms', description: 'Label, error, prefix/suffix, validation' },
  { name: 'Textarea', slug: 'textarea', category: 'forms', description: 'Auto-resize, character count' },
  { name: 'Checkbox', slug: 'checkbox', category: 'forms', description: 'Animated check, indeterminate state' },
  { name: 'Radio', slug: 'radio', category: 'forms', description: 'Group, animated selection' },
  { name: 'Switch', slug: 'switch', category: 'forms', description: 'iOS-style, loading, custom color' },
  { name: 'Slider', slug: 'slider', category: 'forms', description: 'Range, steps, marks, labels' },
  { name: 'Select', slug: 'select', category: 'forms', description: 'Searchable, multi-select, sections' },
  { name: 'OTP Input', slug: 'otp-input', category: 'forms', description: 'Shake animation, haptic, smooth focus' },
  { name: 'Card', slug: 'card', category: 'layout', description: 'Header, content, footer, accent stripe' },
  { name: 'Accordion', slug: 'accordion', category: 'layout', description: 'Ghost, bordered, card variants' },
  { name: 'Tabs', slug: 'tabs', category: 'layout', description: 'Underline, pill, card segmented' },
  { name: 'Badge', slug: 'badge', category: 'display', description: 'Soft/outline, animated pulse dot' },
  { name: 'Avatar', slug: 'avatar', category: 'display', description: 'Initials, status dot, group stack' },
  { name: 'Tag', slug: 'tag', category: 'display', description: 'Removable, colored variants' },
  { name: 'Skeleton', slug: 'skeleton', category: 'display', description: 'Pulse + shimmer animations' },
  { name: 'Progress', slug: 'progress', category: 'feedback', description: 'Linear + circular, animated' },
  { name: 'Toast', slug: 'toast', category: 'feedback', description: 'Success, error, warning, custom' },
  { name: 'Empty State', slug: 'empty-state', category: 'feedback', description: 'Compact, illustration variants' },
  { name: 'Alert', slug: 'alert', category: 'feedback', description: 'Info, warning, destructive' },
  { name: 'Modal', slug: 'modal', category: 'overlay', description: 'Animated, backdrop dismiss' },
  { name: 'Action Sheet', slug: 'action-sheet', category: 'overlay', description: 'iOS-style, animation presets' },
  { name: 'Sheet', slug: 'sheet', category: 'overlay', description: 'Bottom sheet, keyboard aware' },
]

const categoryConfig: Record<string, { label: string; color: string; dot: string }> = {
  primitives: { label: 'Primitives', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', dot: 'bg-blue-400' },
  forms:      { label: 'Forms',      color: 'text-violet-400 bg-violet-400/10 border-violet-400/20', dot: 'bg-violet-400' },
  layout:     { label: 'Layout',     color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', dot: 'bg-emerald-400' },
  display:    { label: 'Display',    color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', dot: 'bg-amber-400' },
  feedback:   { label: 'Feedback',   color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20', dot: 'bg-cyan-400' },
  overlay:    { label: 'Overlay',    color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', dot: 'bg-rose-400' },
}

const tabs = ['All', 'Forms', 'Layout', 'Display', 'Feedback', 'Overlay', 'Primitives']

export function ComponentShowcase() {
  const [active, setActive] = useState('All')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const filtered = active === 'All'
    ? components
    : components.filter((c) => c.category === active.toLowerCase())

  return (
    <section className="relative px-4 sm:px-5 py-14 sm:py-20">
      <div className="section-divider mb-0" />

      <div className="mx-auto max-w-6xl pt-10 sm:pt-16" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-xs text-zinc-600 font-medium uppercase tracking-[0.18em] mb-4">Component library</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-50 mb-4">
            27 components.<br />Production ready.
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">
            Everything you need to ship a polished mobile app. Each one animated, accessible, and typed.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer ${
                active === tab
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-100 shadow-[0_0_12px_rgba(255,255,255,0.04)]'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 bg-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((c) => {
              const cat = categoryConfig[c.category]
              return (
                <motion.div
                  key={c.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  <Link
                    href={`/components/${c.slug}`}
                    className="group relative flex flex-col rounded-xl p-4 border border-zinc-800/80 hover:border-zinc-700 bg-zinc-950/80 transition-all duration-200 cursor-pointer hover:bg-zinc-900/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-zinc-100 text-sm group-hover:text-white transition-colors">
                        {c.name}
                      </span>
                      <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${cat.color}`}>
                        <span className={`w-1 h-1 rounded-full ${cat.dot} flex-shrink-0`} />
                        {cat.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors">{c.description}</p>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Link
            href="/components"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-200 group cursor-pointer"
          >
            View all components
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
