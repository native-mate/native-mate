'use client'

import { useState } from 'react'
import { Nav } from '@/components/Nav'
import { CodeBlock } from '@/components/CodeBlock'

type Preset = 'zinc' | 'slate' | 'rose' | 'midnight'
type Mode = 'light' | 'dark'

const PRESET_TOKENS: Record<Preset, Record<string, { light: string; dark: string }>> = {
  zinc: {
    background: { light: '#ffffff', dark: '#0a0a0a' },
    surface: { light: '#f4f4f5', dark: '#18181b' },
    border: { light: '#e4e4e7', dark: '#27272a' },
    foreground: { light: '#09090b', dark: '#fafafa' },
    'muted-foreground': { light: '#71717a', dark: '#a1a1aa' },
    primary: { light: '#18181b', dark: '#fafafa' },
    'primary-foreground': { light: '#fafafa', dark: '#18181b' },
    destructive: { light: '#ef4444', dark: '#f87171' },
  },
  slate: {
    background: { light: '#ffffff', dark: '#0f172a' },
    surface: { light: '#f1f5f9', dark: '#1e293b' },
    border: { light: '#e2e8f0', dark: '#334155' },
    foreground: { light: '#0f172a', dark: '#f8fafc' },
    'muted-foreground': { light: '#64748b', dark: '#94a3b8' },
    primary: { light: '#1e293b', dark: '#f8fafc' },
    'primary-foreground': { light: '#f8fafc', dark: '#1e293b' },
    destructive: { light: '#ef4444', dark: '#f87171' },
  },
  rose: {
    background: { light: '#ffffff', dark: '#0a0a0a' },
    surface: { light: '#f4f4f5', dark: '#18181b' },
    border: { light: '#e4e4e7', dark: '#27272a' },
    foreground: { light: '#09090b', dark: '#fafafa' },
    'muted-foreground': { light: '#71717a', dark: '#a1a1aa' },
    primary: { light: '#e11d48', dark: '#fb7185' },
    'primary-foreground': { light: '#fff1f2', dark: '#0a0a0a' },
    destructive: { light: '#ef4444', dark: '#f87171' },
  },
  midnight: {
    background: { light: '#fafafa', dark: '#030303' },
    surface: { light: '#f0f0f0', dark: '#0d0d0d' },
    border: { light: '#d4d4d4', dark: '#1a1a1a' },
    foreground: { light: '#09090b', dark: '#ededed' },
    'muted-foreground': { light: '#737373', dark: '#737373' },
    primary: { light: '#7c3aed', dark: '#a78bfa' },
    'primary-foreground': { light: '#ffffff', dark: '#030303' },
    destructive: { light: '#ef4444', dark: '#f87171' },
  },
}

const PRESETS: Preset[] = ['zinc', 'slate', 'rose', 'midnight']

export default function ThemeStudioPage() {
  const [preset, setPreset] = useState<Preset>('zinc')
  const [mode, setMode] = useState<Mode>('dark')
  const [overrides, setOverrides] = useState<Record<string, string>>({})

  const tokens = PRESET_TOKENS[preset]
  const resolved = Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => [k, overrides[k] ?? v[mode]])
  )

  const configOutput = JSON.stringify(
    {
      preset,
      componentsDir: 'components/ui',
      tokens: Object.keys(overrides).length > 0 ? { colors: overrides } : undefined,
    },
    null,
    2
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold">Theme Studio</h1>
        <p className="mb-8 text-zinc-400">
          Preview and customise your theme. Copy the output to native-mate.json.
        </p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Controls */}
          <div className="space-y-6">
            {/* Preset picker */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Preset</p>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPreset(p)
                      setOverrides({})
                    }}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                      preset === p
                        ? 'border-zinc-400 bg-zinc-800 text-zinc-50'
                        : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode toggle */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Mode</p>
              <div className="flex rounded-lg border border-zinc-700 p-1">
                {(['light', 'dark'] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 rounded-md py-1.5 text-sm font-medium capitalize transition-colors ${
                      mode === m ? 'bg-zinc-700 text-zinc-50' : 'text-zinc-400 hover:text-zinc-50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Token overrides */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Token overrides
              </p>
              <div className="space-y-2">
                {Object.entries(tokens).map(([key]) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={overrides[key] ?? tokens[key][mode]}
                      onChange={(e) => setOverrides((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="h-7 w-7 flex-shrink-0 cursor-pointer rounded border border-zinc-600 bg-transparent p-0.5"
                    />
                    <span className="flex-1 text-xs font-mono text-zinc-400">{key}</span>
                    <span className="text-xs font-mono text-zinc-600">{resolved[key]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Preview</p>
            <div
              className="rounded-2xl border p-6 space-y-4"
              style={{ background: resolved.background, borderColor: resolved.border }}
            >
              {/* Card mock */}
              <div
                className="rounded-xl border p-4 space-y-3"
                style={{ background: resolved.surface, borderColor: resolved.border }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full"
                    style={{ background: resolved.primary }}
                  />
                  <div className="space-y-1">
                    <div className="h-3 w-24 rounded" style={{ background: resolved.foreground, opacity: 0.9 }} />
                    <div className="h-2 w-16 rounded" style={{ background: resolved['muted-foreground'], opacity: 0.6 }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded" style={{ background: resolved['muted-foreground'], opacity: 0.3 }} />
                  <div className="h-2 w-5/6 rounded" style={{ background: resolved['muted-foreground'], opacity: 0.3 }} />
                  <div className="h-2 w-3/4 rounded" style={{ background: resolved['muted-foreground'], opacity: 0.3 }} />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <div
                  className="flex-1 rounded-lg py-2.5 text-center text-xs font-semibold"
                  style={{ background: resolved.primary, color: resolved['primary-foreground'] }}
                >
                  Primary
                </div>
                <div
                  className="flex-1 rounded-lg border py-2.5 text-center text-xs font-semibold"
                  style={{ borderColor: resolved.border, color: resolved.foreground }}
                >
                  Outline
                </div>
              </div>

              {/* Input mock */}
              <div
                className="rounded-lg border px-3 py-2.5 text-xs"
                style={{ borderColor: resolved.border, color: resolved['muted-foreground'] }}
              >
                Enter your email…
              </div>

              {/* Destructive */}
              <div
                className="rounded-lg py-2 text-center text-xs font-semibold"
                style={{ background: resolved.destructive + '20', color: resolved.destructive }}
              >
                Error state
              </div>
            </div>
          </div>

          {/* Config output */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              native-mate.json output
            </p>
            <CodeBlock code={configOutput} language="json" />
            {Object.keys(overrides).length > 0 && (
              <button
                onClick={() => setOverrides({})}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Reset overrides
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
