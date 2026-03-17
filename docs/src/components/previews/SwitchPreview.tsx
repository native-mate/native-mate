'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'

// --- Web Switch (mimics native-mate Switch) ---

type SwSize = 'sm' | 'md' | 'lg'

const sizeMap = {
  sm: { trackW: 38, trackH: 22, thumb: 16, padding: 3 },
  md: { trackW: 50, trackH: 28, thumb: 22, padding: 3 },
  lg: { trackW: 62, trackH: 34, thumb: 28, padding: 3 },
}

function Sw({
  value,
  onValueChange,
  label,
  description,
  disabled = false,
  size = 'md',
  color = '#6366f1',
  loading = false,
  labelPosition = 'right',
}: {
  value: boolean
  onValueChange?: (v: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: SwSize
  color?: string
  loading?: boolean
  labelPosition?: 'left' | 'right'
}) {
  const cfg = sizeMap[size]
  const thumbX = value ? cfg.trackW - cfg.thumb - cfg.padding * 2 : 0

  const labelEl = (label || description) ? (
    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
      {label && <span className={`text-sm font-medium leading-tight ${disabled ? 'text-zinc-600' : 'text-zinc-100'}`}>{label}</span>}
      {description && <span className="text-xs text-zinc-500 leading-snug">{description}</span>}
    </div>
  ) : null

  const trackEl = (
    <div
      onClick={!disabled && !loading ? () => onValueChange?.(!value) : undefined}
      className={`relative shrink-0 flex items-center ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{
        width: cfg.trackW, height: cfg.trackH,
        borderRadius: cfg.trackH / 2,
        backgroundColor: value ? color : '#3f3f46',
        padding: cfg.padding,
        transition: 'background-color 200ms ease',
      }}
    >
      <div style={{
        width: cfg.thumb, height: cfg.thumb,
        borderRadius: '50%',
        backgroundColor: '#fff',
        transform: `translateX(${thumbX}px)`,
        transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {loading && (
          <div style={{
            width: cfg.thumb * 0.55, height: cfg.thumb * 0.55,
            border: `1.5px solid ${color}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        )}
      </div>
    </div>
  )

  return (
    <div className={`flex items-center gap-3 ${labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row'}`}>
      {labelEl}
      {trackEl}
    </div>
  )
}

// --- Preview Block ---

function Preview({ title, code, children }: { title: string; code: string; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) Prism.highlightElement(codeRef.current)
  }, [code, expanded])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
      <div className="rounded-xl border border-zinc-800 overflow-hidden relative">
        <div className="flex items-center justify-center min-h-[120px] p-8 bg-zinc-950/50">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <div className="relative">
          <div className={`bg-zinc-950 overflow-hidden transition-all duration-300 ${expanded ? '' : 'max-h-[100px]'}`}>
            <pre className="!m-0 !bg-transparent !p-5 text-[13px] leading-6">
              <code ref={codeRef} className="language-tsx">{code}</code>
            </pre>
          </div>
          {!expanded && (
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent">
              <button onClick={() => setExpanded(true)} className="mb-4 px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-medium cursor-pointer hover:bg-white transition-colors">View Code</button>
            </div>
          )}
          {expanded && (
            <div className="flex justify-center gap-3 py-3 bg-zinc-950 border-t border-zinc-800/50">
              <button onClick={handleCopy} className="px-3 py-1 rounded-md text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">{copied ? 'Copied!' : 'Copy'}</button>
              <button onClick={() => setExpanded(false)} className="px-3 py-1 rounded-md text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">Collapse</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Switch Previews ---

export default function SwitchPreview({ part = 'all' }: { part?: 'first' | 'rest' | 'all' } = {}) {
  const first = part === 'all' || part === 'first'
  const rest = part === 'all' || part === 'rest'

  const [darkMode, setDarkMode] = useState(true)
  const [notifs, setNotifs] = useState(false)
  const [custom, setCustom] = useState(true)

  return (
    <div className="space-y-10">

      {first && (
      <Preview
        title="Default"
        code={`import { Switch } from "~/components/ui/switch"

export function SwitchDefault() {
  const [on, setOn] = useState(false)
  return <Switch value={on} onValueChange={setOn} label="Dark mode" />
}`}
      >
        <Sw value={darkMode} onValueChange={setDarkMode} label="Dark mode" />
      </Preview>
      )}

      {rest && (
      <Preview
        title="With Description"
        code={`import { Switch } from "~/components/ui/switch"

export function SwitchWithDesc() {
  const [on, setOn] = useState(true)
  return (
    <Switch
      value={on}
      onValueChange={setOn}
      label="Push notifications"
      description="Receive alerts on your device"
    />
  )
}`}
      >
        <Sw
          value={notifs}
          onValueChange={setNotifs}
          label="Push notifications"
          description="Receive alerts on your device"
        />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Sizes"
        code={`import { Switch } from "~/components/ui/switch"

export function SwitchSizes() {
  return (
    <View style={{ gap: 16 }}>
      <Switch value={true} onValueChange={() => {}} size="sm" label="Small" />
      <Switch value={true} onValueChange={() => {}} size="md" label="Medium" />
      <Switch value={true} onValueChange={() => {}} size="lg" label="Large" />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-5">
          <Sw value={true} size="sm" label="Small (38×22)" />
          <Sw value={true} size="md" label="Medium (50×28)" />
          <Sw value={true} size="lg" label="Large (62×34)" />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Custom Color"
        code={`import { Switch } from "~/components/ui/switch"

export function SwitchColors() {
  const [a, setA] = useState(true)
  return (
    <View style={{ gap: 16 }}>
      <Switch value={a} onValueChange={setA} label="Success" color="#10b981" />
      <Switch value={true} onValueChange={() => {}} label="Warning" color="#f59e0b" />
      <Switch value={true} onValueChange={() => {}} label="Rose" color="#f43f5e" />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-5">
          <Sw value={custom} onValueChange={setCustom} label="Email alerts" color="#10b981" />
          <Sw value={true} label="Marketing" color="#f59e0b" />
          <Sw value={true} label="Analytics" color="#f43f5e" />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Label Left"
        code={`import { Switch } from "~/components/ui/switch"

export function SwitchLabelLeft() {
  const [on, setOn] = useState(false)
  return (
    <Switch
      value={on}
      onValueChange={setOn}
      label="Dark mode"
      labelPosition="left"
    />
  )
}`}
      >
        <Sw value={darkMode} onValueChange={setDarkMode} label="Dark mode" labelPosition="left" />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Disabled"
        code={`import { Switch } from "~/components/ui/switch"

export function SwitchDisabled() {
  return (
    <View style={{ gap: 16 }}>
      <Switch value={false} onValueChange={() => {}} label="Disabled off" disabled />
      <Switch value={true} onValueChange={() => {}} label="Disabled on" disabled />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-5">
          <Sw value={false} label="Disabled off" disabled />
          <Sw value={true} label="Disabled on" disabled />
        </div>
      </Preview>
      )}

    </div>
  )
}
