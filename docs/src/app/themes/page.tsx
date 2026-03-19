'use client'

import React, { useRef, useState } from 'react'
import { View } from 'react-native'
import { Nav } from '@/components/Nav'
import { ThemeCustomizerProvider, useThemeCustomizer } from '@/components/ThemeCustomizerContext'
import { PreviewWrapper } from '@/components/PreviewWrapper'
import { presets, resolveTokens } from '@native-mate/core'
import type { ThemePreset } from '@native-mate/core'

// Registry components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const c = <T,>(x: T) => x as React.FC<any>
import { Button      as _Button      } from '../../../../packages/registry/components/button/button'
import { Progress    as _Progress    } from '../../../../packages/registry/components/progress/progress'
import { Checkbox    as _Checkbox    } from '../../../../packages/registry/components/checkbox/checkbox'
import { Tag         as _Tag         } from '../../../../packages/registry/components/tag/tag'
import { Avatar      as _Avatar      } from '../../../../packages/registry/components/avatar/avatar'
import { Input       as _Input       } from '../../../../packages/registry/components/input/input'
import { Skeleton    as _Skeleton    } from '../../../../packages/registry/components/skeleton/skeleton'
import { Card        as _Card,
         CardHeader  as _CardHeader,
         CardContent as _CardContent,
         CardFooter  as _CardFooter  } from '../../../../packages/registry/components/card/card'

const Button      = c(_Button)
const Progress    = c(_Progress)
const Checkbox    = c(_Checkbox)
const Tag         = c(_Tag)
const Avatar      = c(_Avatar)
const Input       = c(_Input)
const Skeleton    = c(_Skeleton)
const Card        = c(_Card)
const CardHeader  = c(_CardHeader)
const CardContent = c(_CardContent)
const CardFooter  = c(_CardFooter)

// ─── Metadata ─────────────────────────────────────────────────────────────────

const TOKEN_GROUPS: { label: string; keys: string[] }[] = [
  { label: 'Surfaces', keys: ['background', 'surface', 'surfaceRaised', 'border'] },
  { label: 'Content',  keys: ['foreground', 'onBackground', 'onSurface', 'muted'] },
  { label: 'Brand',    keys: ['primary', 'onPrimary'] },
  { label: 'Status',   keys: ['destructive', 'onDestructive', 'success', 'onSuccess', 'warning', 'onWarning'] },
]

const PRESETS: { id: ThemePreset; label: string; band: string[] }[] = [
  { id: 'zinc',     label: 'Zinc',     band: ['#070709', '#0f0f11', '#252529', '#fafafa'] },
  { id: 'slate',    label: 'Slate',    band: ['#0f172a', '#1e293b', '#475569', '#f8fafc'] },
  { id: 'rose',     label: 'Rose',     band: ['#0c0a0b', '#1c1115', '#e11d48', '#fb7185'] },
  { id: 'midnight', label: 'Midnight', band: ['#000000', '#111111', '#2a2a2a', '#818cf8'] },
]

// ─── Icons ─────────────────────────────────────────────────────────────────────

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" />
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

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar() {
  const customizer = useThemeCustomizer()!
  const { state, setPreset, setMode, setColorOverride, clearColorOverride,
          resetColorOverrides, setRadiusMultiplier, reset } = customizer

  const resolvedBase = resolveTokens(presets[state.preset], state.mode)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const overrideCount = Object.keys(state.colorOverrides).length
  const isModified = state.preset !== 'zinc' || state.mode !== 'dark' || overrideCount > 0 || state.radiusMultiplier !== 1

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-800/80 px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">Customizer</p>
        <p className="mt-0.5 text-sm font-semibold text-zinc-200">Design tokens</p>
      </div>

      {/* Scrollable controls */}
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">

        {/* Preset */}
        <div>
          <SectionLabel>Preset</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map(p => {
              const active = state.preset === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`overflow-hidden rounded-xl border transition-all ${
                    active ? 'border-zinc-500 shadow-[0_0_12px_rgba(255,255,255,0.05)]' : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Color strip */}
                  <div className="flex h-8">
                    {p.band.map((col, i) => (
                      <div key={i} style={{ flex: 1, background: col }} />
                    ))}
                  </div>
                  <div className={`px-2.5 py-1.5 ${active ? 'bg-zinc-800' : 'bg-zinc-900'}`}>
                    <span className={`text-xs font-medium ${active ? 'text-zinc-100' : 'text-zinc-500'}`}>
                      {p.label}
                    </span>
                    {active && <span className="ml-1.5 text-[9px] text-zinc-500">active</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Mode */}
        <div>
          <SectionLabel>Color mode</SectionLabel>
          <div className="flex overflow-hidden rounded-xl border border-zinc-800 p-1 gap-1">
            <button
              onClick={() => setMode('light')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
                state.mode === 'light'
                  ? 'bg-amber-500/15 text-amber-300 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              <SunIcon className="h-3.5 w-3.5" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setMode('dark')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
                state.mode === 'dark'
                  ? 'bg-blue-500/15 text-blue-300 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              <MoonIcon className="h-3.5 w-3.5" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        {/* Color tokens */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <SectionLabel>
              Colors {overrideCount > 0 && (
                <span className="ml-1.5 rounded-full bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-blue-400">
                  {overrideCount} custom
                </span>
              )}
            </SectionLabel>
            {overrideCount > 0 && (
              <button
                onClick={resetColorOverrides}
                className="text-[10px] text-zinc-700 transition-colors hover:text-zinc-400"
              >
                reset all
              </button>
            )}
          </div>

          <div className="space-y-4">
            {TOKEN_GROUPS.map(group => (
              <div key={group.label}>
                <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-700">{group.label}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {group.keys.map(key => {
                    const baseVal = (resolvedBase.colors as Record<string, string>)[key] ?? '#888'
                    const current = state.colorOverrides[key] ?? baseVal
                    const overridden = !!state.colorOverrides[key]
                    return (
                      <div key={key} className="group relative">
                        <input
                          ref={el => { inputRefs.current[key] = el }}
                          type="color"
                          value={current}
                          onChange={e => setColorOverride(key, e.target.value)}
                          className="sr-only"
                        />
                        <button
                          onClick={() => inputRefs.current[key]?.click()}
                          className={`w-full overflow-hidden rounded-xl border transition-all duration-150 hover:scale-[1.03] active:scale-[0.98] ${
                            overridden
                              ? 'border-blue-500/40 shadow-[0_0_8px_rgba(96,165,250,0.15)]'
                              : 'border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <div style={{ background: current, height: 36 }} />
                          <div className="bg-zinc-900/95 px-2 py-1.5">
                            <p className={`truncate font-mono text-[9px] leading-tight ${overridden ? 'text-zinc-300' : 'text-zinc-500'}`}>
                              {key}
                            </p>
                            <p className="font-mono text-[8px] text-zinc-700">{current.toUpperCase()}</p>
                          </div>
                        </button>
                        {overridden && (
                          <>
                            <div className="pointer-events-none absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.9)]" />
                            <button
                              onClick={e => { e.stopPropagation(); clearColorOverride(key) }}
                              className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/40 text-[8px] text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white"
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radius */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <SectionLabel>Border radius</SectionLabel>
            <span className="font-mono text-[11px] text-zinc-400">{state.radiusMultiplier.toFixed(2)}x</span>
          </div>

          <input
            type="range" min={0} max={200} step={5}
            value={Math.round(state.radiusMultiplier * 100)}
            onChange={e => setRadiusMultiplier(Number(e.target.value) / 100)}
            className="w-full accent-zinc-400"
            style={{ accentColor: resolvedBase.colors.primary }}
          />
          <div className="mt-1 flex justify-between text-[9px] text-zinc-700">
            <span>Sharp</span>
            <span>Round</span>
          </div>

          <div className="mt-3 flex items-end gap-2">
            {(['sm', 'md', 'lg', 'xl'] as const).map(k => {
              const r = Math.max(0, Math.round(resolvedBase.radius[k] * state.radiusMultiplier))
              return (
                <div key={k} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className="w-full border border-zinc-700 bg-zinc-800"
                    style={{ height: 32, borderRadius: r }}
                  />
                  <span className="text-[8px] text-zinc-600">{k}</span>
                  <span className="text-[8px] font-mono text-zinc-700">{r}px</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Footer */}
      {isModified && (
        <div className="border-t border-zinc-800/80 px-4 py-3">
          <button
            onClick={reset}
            className="w-full rounded-xl border border-zinc-800 py-2 text-xs font-medium text-zinc-600 transition-all hover:border-zinc-700 hover:text-zinc-300"
          >
            Reset all changes
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Live showcase ────────────────────────────────────────────────────────────

function Showcase() {
  const customizer = useThemeCustomizer()!
  const [email, setEmail] = useState('')
  const [remember, setRemember] = useState(false)
  const [notify, setNotify] = useState(true)
  const { resolvedTheme } = customizer

  const bg = resolvedTheme.colors.background
  const border = resolvedTheme.colors.border
  const muted = resolvedTheme.colors.muted
  const fg = resolvedTheme.colors.foreground

  return (
    <div
      className="h-full overflow-y-auto rounded-2xl border transition-colors duration-200"
      style={{ background: bg, borderColor: border }}
    >
      <PreviewWrapper>
        <View style={{ padding: 16, gap: 12, flex: 1 }}>

          {/* ── Row 1: Sign In | Profile | Storage — equal height ── */}
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}>

            {/* Panel 1: Sign In */}
            <View style={{ flex: 1 }}>
              <Card variant="outline" style={{ flex: 1 }}>
                <CardHeader title="Sign in" subtitle="Welcome back! Enter your details." />
                <CardContent>
                  <View style={{ gap: 12 }}>
                    <Input
                      label="Email"
                      placeholder="you@example.com"
                      value={email}
                      onChangeText={setEmail}
                    />
                    <Input
                      label="Password"
                      placeholder="••••••••"
                      secureTextEntry
                    />
                    <Checkbox
                      checked={remember}
                      onChange={setRemember}
                      label="Remember me for 30 days"
                    />
                    <View style={{ marginTop: 4 }}>
                      <Button fullWidth>Sign in</Button>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>

            {/* Panel 2: Profile */}
            <View style={{ flex: 1 }}>
              <Card variant="outline" style={{ flex: 1 }}>
                <CardContent>
                  <View style={{ gap: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces&auto=format" name="Thomas Miller" size="lg" shape="square" status="online" />
                      <View style={{ flex: 1, gap: 3 }}>
                        <span style={{ fontSize: 15, fontWeight: '600', color: fg }}>Thomas Miller</span>
                        <span style={{ fontSize: 12, color: muted }}>Senior Designer · native-mate</span>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      <Tag label="design" />
                      <Tag label="react-native" onRemove={() => {}} />
                      <Tag label="v1.0" />
                    </View>
                    <Progress value={78} showValue label="Profile completeness" />
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <Button variant="outline" size="sm" style={{ flex: 1 }}>Message</Button>
                      <Button size="sm" style={{ flex: 1 }}>Follow</Button>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>

            {/* Panel 3: Storage */}
            <View style={{ flex: 1 }}>
              <Card variant="outline" style={{ flex: 1 }}>
                <CardHeader title="Storage" subtitle="2.4 GB of 5 GB used" />
                <CardContent>
                  <View style={{ gap: 12 }}>
                    <Progress value={47} showValue label="Documents" />
                    <Progress value={72} showValue label="Photos" />
                    <Progress value={23} showValue label="Videos" />
                  </View>
                </CardContent>
                <CardFooter separated align="apart">
                  <span style={{ fontSize: 11, color: muted }}>2.4 / 5 GB</span>
                  <Button variant="outline" size="sm">Upgrade plan</Button>
                </CardFooter>
              </Card>
            </View>

          </View>

          {/* ── Row 2: Activity Feed ── */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Card variant="outline">
                <CardHeader title="Recent Activity" subtitle="Latest updates" />
                <CardContent>
                  <View style={{ gap: 14 }}>
                    {[
                      { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces&auto=format', name: 'Alex Johnson', status: 'online' as const },
                      { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces&auto=format', name: 'Kate Ross',     status: undefined },
                      { src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces&auto=format', name: 'Sam Park',     status: 'busy' as const },
                    ].map((item, i) => (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Avatar src={item.src} name={item.name} size="sm" status={item.status} />
                        <View style={{ flex: 1, gap: 5 }}>
                          <Skeleton width={`${75 - i * 10}%`} height={11} borderRadius={4} />
                          <Skeleton width={`${50 - i * 5}%`} height={9} borderRadius={4} />
                        </View>
                      </View>
                    ))}
                    <Checkbox
                      checked={notify}
                      onChange={setNotify}
                      label="Notify me on new activity"
                    />
                  </View>
                </CardContent>
              </Card>
            </View>
          </View>

        </View>
      </PreviewWrapper>
    </div>
  )
}


// ─── Config output ────────────────────────────────────────────────────────────

function ConfigPanel() {
  const customizer = useThemeCustomizer()!
  const [copied, setCopied] = useState(false)
  const { state } = customizer
  const resolvedBase = resolveTokens(presets[state.preset], state.mode)

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
      for (const [k, v] of Object.entries(state.colorOverrides))
        lines.push(`        ${k}: '${v}',`)
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

  const config = lines.join('\n')

  const handleCopy = () => {
    navigator.clipboard.writeText(config)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const tokenCount = Object.keys(state.colorOverrides).length
  const hasChanges = hasColors || hasRadius

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-800/80 px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">Output</p>
        <p className="mt-0.5 text-sm font-semibold text-zinc-200">Config file</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Stats */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <StatChip label="Preset" value={state.preset} color="#71717a" />
          <StatChip label="Mode" value={state.mode} color={state.mode === 'dark' ? '#818cf8' : '#f59e0b'} />
          <StatChip label="Overrides" value={tokenCount > 0 ? `${tokenCount} tokens` : 'none'} color={tokenCount > 0 ? '#60a5fa' : '#3f3f46'} />
          <StatChip label="Radius" value={`${Math.round(state.radiusMultiplier * 100)}%`} color={state.radiusMultiplier !== 1 ? '#34d399' : '#3f3f46'} />
        </div>

        {/* Code */}
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-3 py-2">
            <span className="font-mono text-[10px] text-zinc-500">native.config.ts</span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
                copied ? 'text-green-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {copied ? (
                <>
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto bg-zinc-950 p-4 font-mono text-[11px] leading-relaxed text-zinc-300">
            <code>{config}</code>
          </pre>
        </div>

        {!hasChanges && (
          <p className="mt-3 text-center text-[11px] text-zinc-700">
            Customize tokens to see your config here
          </p>
        )}

        <p className="mt-4 text-[10px] leading-relaxed text-zinc-700">
          Place this file at your project root. Run{' '}
          <code className="rounded bg-zinc-900 px-1 py-0.5 text-zinc-500">npx native-mate init</code>{' '}
          to apply.
        </p>
      </div>
    </div>
  )
}

function StatChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2">
      <p className="text-[9px] font-medium uppercase tracking-wider text-zinc-600">{label}</p>
      <p className="mt-0.5 text-xs font-semibold" style={{ color }}>{value}</p>
    </div>
  )
}

// ─── Shared label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
      {children}
    </p>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ThemeStudioPage() {
  return (
    <ThemeCustomizerProvider>
      <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
        <Nav />

        {/* Page header */}
        <div className="border-b border-zinc-800/60 bg-zinc-950 px-6 py-5" style={{ marginTop: '3.5rem' }}>
          <div className="mx-auto flex max-w-[1600px] items-end justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-50">Theme Studio</h1>
              <p className="mt-0.5 text-sm text-zinc-500">
                Customize every design token and copy your config.
              </p>
            </div>
          </div>
        </div>

        {/* 3-column workspace */}
        <div
          className="flex flex-1 overflow-hidden"
          style={{ height: 'calc(100vh - 3.5rem - 73px)' }}
        >
          {/* Left — token controls */}
          <aside className="hidden w-64 flex-shrink-0 overflow-hidden border-r border-zinc-800/80 lg:flex lg:flex-col">
            <Sidebar />
          </aside>

          {/* Center — live preview */}
          <main className="flex min-w-0 flex-1 overflow-hidden p-3 sm:p-4">
            <Showcase />
          </main>

          {/* Right — config output */}
          <aside className="hidden w-64 flex-shrink-0 overflow-hidden border-l border-zinc-800/80 xl:flex xl:flex-col">
            <ConfigPanel />
          </aside>
        </div>
      </div>
    </ThemeCustomizerProvider>
  )
}
