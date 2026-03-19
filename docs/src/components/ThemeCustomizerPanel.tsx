'use client'

import React, { useState, useRef } from 'react'
import { presets, resolveTokens } from '@native-mate/core'
import type { ThemePreset } from '@native-mate/core'
import { useThemeCustomizer } from './ThemeCustomizerContext'

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESETS: { id: ThemePreset; label: string; swatch: string }[] = [
  { id: 'zinc',     label: 'Zinc',     swatch: '#71717a' },
  { id: 'slate',    label: 'Slate',    swatch: '#64748b' },
  { id: 'rose',     label: 'Rose',     swatch: '#e11d48' },
  { id: 'midnight', label: 'Midnight', swatch: '#818cf8' },
]

const TOKEN_GROUPS: { label: string; keys: string[] }[] = [
  { label: 'Surfaces', keys: ['background', 'surface', 'surfaceRaised', 'border'] },
  { label: 'Content',  keys: ['foreground', 'onBackground', 'onSurface', 'muted'] },
  { label: 'Brand',    keys: ['primary', 'onPrimary'] },
  { label: 'Status',   keys: ['destructive', 'onDestructive', 'success', 'onSuccess', 'warning', 'onWarning'] },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ThemeCustomizerPanel() {
  const customizer = useThemeCustomizer()
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const primaryRef = useRef<HTMLInputElement>(null)
  const tokenRefs = useRef<Record<string, HTMLInputElement | null>>({})

  if (!customizer) return null
  const { state, setPreset, setMode, setColorOverride, clearColorOverride, setRadiusMultiplier, reset } = customizer

  const resolvedBase = resolveTokens(presets[state.preset], state.mode)
  const currentPrimary = state.colorOverrides['primary'] ?? resolvedBase.colors.primary

  const isModified = state.preset !== 'zinc' || state.mode !== 'dark'
    || Object.keys(state.colorOverrides).length > 0 || state.radiusMultiplier !== 1

  const handleCopyConfig = () => {
    const lines: string[] = [
      '// native.config.ts',
      '',
      'export default {',
      `  theme: '${state.preset}',`,
      "  componentsDir: './components/ui',",
    ]
    const hasColors = Object.keys(state.colorOverrides).length > 0
    const hasRadius = state.radiusMultiplier !== 1
    if (hasColors || hasRadius) {
      lines.push('  tokens: {')
      lines.push(`    ${state.mode}: {`)
      if (hasColors) {
        lines.push('      colors: {')
        for (const [k, v] of Object.entries(state.colorOverrides)) lines.push(`        ${k}: '${v}',`)
        lines.push('      },')
      }
      if (hasRadius) {
        lines.push('      radius: {')
        for (const [k, v] of Object.entries(resolvedBase.radius))
          if (k !== 'full') lines.push(`        ${k}: ${Math.round(v * state.radiusMultiplier)},`)
        lines.push('      },')
      }
      lines.push('    },')
      lines.push('  },')
    }
    lines.push('}')
    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div
      className="mb-6 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-lg shadow-black/20 backdrop-blur-sm"
      style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.3)' }}
    >
      {/* ─── Toolbar ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">

        {/* Preset dots */}
        <div className="flex items-center gap-2">
          {PRESETS.map(p => {
            const active = state.preset === p.id
            return (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                title={p.label}
                className="group relative flex items-center gap-1.5 transition-all"
              >
                <span
                  style={{
                    width: 14, height: 14,
                    borderRadius: '50%',
                    background: p.swatch,
                    display: 'block',
                    outline: active ? `3px solid ${p.swatch}40` : '3px solid transparent',
                    outlineOffset: 1,
                    boxShadow: active ? `0 0 8px ${p.swatch}60` : 'none',
                    transition: 'all 0.15s',
                    transform: active ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
                <span
                  className="text-[11px] font-medium transition-colors"
                  style={{ color: active ? p.swatch : '#52525b' }}
                >
                  {p.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="h-5 w-px bg-zinc-800" />

        {/* Mode */}
        <div className="flex items-center rounded-lg bg-zinc-800/80 p-0.5">
          <button
            onClick={() => setMode('light')}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
              state.mode === 'light'
                ? 'bg-amber-500/20 text-amber-400 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-400'
            }`}
            title="Light mode"
          >
            <SunIcon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setMode('dark')}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
              state.mode === 'dark'
                ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-400'
            }`}
            title="Dark mode"
          >
            <MoonIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="h-5 w-px bg-zinc-800" />

        {/* Primary color — always visible */}
        <div className="flex items-center gap-2">
          <input
            ref={primaryRef}
            type="color"
            value={currentPrimary}
            onChange={e => setColorOverride('primary', e.target.value)}
            className="sr-only"
          />
          <button
            onClick={() => primaryRef.current?.click()}
            style={{ background: currentPrimary }}
            className="h-6 w-6 rounded-lg border-2 border-white/10 shadow-sm transition-transform hover:scale-110 active:scale-95"
            title="Primary color"
          />
          <span className="font-mono text-[11px] text-zinc-500">{currentPrimary.toUpperCase()}</span>
          {state.colorOverrides['primary'] && (
            <button
              onClick={() => clearColorOverride('primary')}
              className="text-[10px] text-zinc-700 transition-colors hover:text-zinc-400"
            >
              ✕
            </button>
          )}
        </div>

        <div className="h-5 w-px bg-zinc-800" />

        {/* Radius — inline mini slider */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-zinc-600">Radius</span>
          <input
            type="range"
            min={0}
            max={200}
            step={5}
            value={Math.round(state.radiusMultiplier * 100)}
            onChange={e => setRadiusMultiplier(Number(e.target.value) / 100)}
            className="w-20 accent-zinc-400"
            style={{ height: 4 }}
          />
          <span className="w-7 text-right font-mono text-[10px] text-zinc-500">
            {Math.round(state.radiusMultiplier * 100)}%
          </span>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setExpanded(e => !e)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all ${
              expanded
                ? 'border-zinc-600 bg-zinc-700/80 text-zinc-200'
                : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M3 12H1M23 12h-2M19.07 19.07l-1.41-1.41M5.34 5.34L3.93 3.93" />
            </svg>
            All tokens
          </button>

          {isModified && (
            <button
              onClick={reset}
              className="rounded-lg border border-zinc-800 px-2.5 py-1.5 text-[11px] text-zinc-600 transition-all hover:border-zinc-700 hover:text-zinc-400"
            >
              Reset
            </button>
          )}

          <button
            onClick={handleCopyConfig}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:bg-zinc-700 hover:text-zinc-100"
          >
            <CopyIcon className="h-3 w-3" />
            {copied ? 'Copied!' : 'Copy config'}
          </button>
        </div>
      </div>

      {/* ─── Expanded: all tokens ────────────────────────────────── */}
      {expanded && (
        <div className="border-t border-zinc-800/80 bg-black/20 px-4 py-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {TOKEN_GROUPS.map(group => (
              <div key={group.label}>
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
                  {group.label}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {group.keys.map(key => {
                    const baseVal = (resolvedBase.colors as Record<string, string>)[key] ?? '#888'
                    const current = state.colorOverrides[key] ?? baseVal
                    const overridden = !!state.colorOverrides[key]
                    return (
                      <div key={key} className="group relative">
                        <input
                          ref={el => { tokenRefs.current[key] = el }}
                          type="color"
                          value={current}
                          onChange={e => setColorOverride(key, e.target.value)}
                          className="sr-only"
                        />
                        <button
                          onClick={() => tokenRefs.current[key]?.click()}
                          className={`w-full overflow-hidden rounded-xl border transition-all hover:scale-[1.02] ${
                            overridden ? 'border-zinc-500' : 'border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <div style={{ background: current, height: 32 }} />
                          <div className="bg-zinc-900/90 px-2 py-1.5">
                            <div className="flex items-center justify-between">
                              <span className={`truncate font-mono text-[9px] ${overridden ? 'text-zinc-300' : 'text-zinc-500'}`}>
                                {key}
                              </span>
                              {overridden && (
                                <button
                                  onClick={e => { e.stopPropagation(); clearColorOverride(key) }}
                                  className="ml-1 text-[8px] text-zinc-600 hover:text-zinc-300"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                            <span className="font-mono text-[8px] text-zinc-700">{current.toUpperCase()}</span>
                          </div>
                        </button>
                        {overridden && (
                          <div className="pointer-events-none absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.8)]" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Radius preview row */}
          <div className="mt-4 border-t border-zinc-800/60 pt-4">
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
              Radius preview
            </p>
            <div className="flex items-end gap-3">
              {(['sm', 'md', 'lg', 'xl'] as const).map(k => (
                <div key={k} className="flex flex-col items-center gap-1.5">
                  <div
                    className="border border-zinc-700 bg-zinc-700/60"
                    style={{
                      width: 32, height: 32,
                      borderRadius: Math.max(0, Math.round(resolvedBase.radius[k] * state.radiusMultiplier)),
                    }}
                  />
                  <span className="text-[9px] text-zinc-600">{k}</span>
                  <span className="text-[8px] font-mono text-zinc-700">
                    {Math.max(0, Math.round(resolvedBase.radius[k] * state.radiusMultiplier))}px
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
