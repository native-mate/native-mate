'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'

// --- Web Progress ---

type ProgSize = 'sm' | 'md' | 'lg'

const heights: Record<ProgSize, number> = { sm: 4, md: 8, lg: 12 }
const circleSizes: Record<ProgSize, number> = { sm: 36, md: 52, lg: 68 }
const circleStroke: Record<ProgSize, number> = { sm: 3, md: 4, lg: 5 }

function LinearProgress({
  value,
  size = 'md',
  color = '#6366f1',
  trackColor = '#27272a',
  showValue = false,
  label,
  indeterminate = false,
}: {
  value: number
  size?: ProgSize
  color?: string
  trackColor?: string
  showValue?: boolean
  label?: string
  indeterminate?: boolean
}) {
  const h = heights[size]
  const clamped = Math.min(100, Math.max(0, value))
  const [shimmer, setShimmer] = useState(0)

  useEffect(() => {
    if (!indeterminate) return
    let frame: number
    let start: number | null = null
    const dur = 1200
    const animate = (ts: number) => {
      if (!start) start = ts
      const elapsed = (ts - start) % dur
      setShimmer(elapsed / dur)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [indeterminate])

  return (
    <div>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-zinc-500">{label}</span>}
          {showValue && !indeterminate && (
            <span style={{ fontSize: 11, color, fontWeight: 600 }}>{Math.round(clamped)}%</span>
          )}
        </div>
      )}
      <div style={{ height: h, borderRadius: h, backgroundColor: trackColor, overflow: 'hidden', position: 'relative' }}>
        {indeterminate ? (
          <div style={{
            position: 'absolute',
            height: '100%',
            width: '35%',
            backgroundColor: color,
            borderRadius: h,
            left: `${(shimmer * 130 - 20)}%`,
            transition: 'none',
          }} />
        ) : (
          <div style={{
            height: '100%',
            width: `${clamped}%`,
            backgroundColor: color,
            borderRadius: h,
            transition: 'width 500ms ease',
          }} />
        )}
      </div>
    </div>
  )
}

function CircularProgress({
  value,
  size = 'md',
  color = '#6366f1',
  trackColor = '#27272a',
  showValue = false,
}: {
  value: number
  size?: ProgSize
  color?: string
  trackColor?: string
  showValue?: boolean
}) {
  const sz = circleSizes[size]
  const stroke = circleStroke[size]
  const r = (sz - stroke) / 2
  const circ = 2 * Math.PI * r
  const clamped = Math.min(100, Math.max(0, value))
  const dash = (clamped / 100) * circ

  return (
    <div style={{ position: 'relative', width: sz, height: sz, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={sz} height={sz} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={sz/2} cy={sz/2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <circle
          cx={sz/2} cy={sz/2} r={r}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ - dash}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 500ms ease' }}
        />
      </svg>
      {showValue && (
        <span style={{ position: 'absolute', fontSize: sz * 0.18, fontWeight: 700, color }}>{Math.round(clamped)}%</span>
      )}
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
        <div className="flex items-center justify-center min-h-[100px] p-8 bg-zinc-950/50">
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

// --- Progress Previews ---

export default function ProgressPreview({ part = 'all' }: { part?: 'first' | 'rest' | 'all' } = {}) {
  const first = part === 'all' || part === 'first'
  const rest = part === 'all' || part === 'rest'
  const [val, setVal] = useState(65)

  return (
    <div className="space-y-10">

      {first && (
      <Preview
        title="Linear with Label"
        code={`import { Progress } from "~/components/ui/progress"

export function ProgressDefault() {
  const [value, setValue] = useState(65)
  return <Progress value={value} animated showValue label="Upload progress" />
}`}
      >
        <div className="space-y-3">
          <LinearProgress value={val} showValue label="Upload progress" />
          <div className="flex gap-2">
            <button onClick={() => setVal((v) => Math.max(0, v - 10))} className="px-3 py-1 rounded-lg border border-zinc-700 text-xs text-zinc-300 hover:border-zinc-500 transition-colors cursor-pointer">-10%</button>
            <button onClick={() => setVal((v) => Math.min(100, v + 10))} className="px-3 py-1 rounded-lg border border-zinc-700 text-xs text-zinc-300 hover:border-zinc-500 transition-colors cursor-pointer">+10%</button>
          </div>
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Sizes"
        code={`import { Progress } from "~/components/ui/progress"

export function ProgressSizes() {
  return (
    <View style={{ gap: 16 }}>
      <Progress value={65} size="sm" />
      <Progress value={65} size="md" />
      <Progress value={65} size="lg" />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-4">
          <LinearProgress value={val} size="sm" label="Small" showValue />
          <LinearProgress value={val} size="md" label="Medium" showValue />
          <LinearProgress value={val} size="lg" label="Large" showValue />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Custom Colors"
        code={`import { Progress } from "~/components/ui/progress"

export function ProgressColors() {
  return (
    <View style={{ gap: 16 }}>
      <Progress value={80} color="#10b981" showValue label="Storage" />
      <Progress value={45} color="#f59e0b" showValue label="CPU" />
      <Progress value={92} color="#ef4444" showValue label="Memory" />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-4">
          <LinearProgress value={80} color="#10b981" showValue label="Storage" />
          <LinearProgress value={45} color="#f59e0b" showValue label="CPU" />
          <LinearProgress value={92} color="#ef4444" showValue label="Memory" />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Indeterminate"
        code={`import { Progress } from "~/components/ui/progress"

export function ProgressIndeterminate() {
  return (
    <View style={{ gap: 16 }}>
      <Progress value={0} indeterminate />
      <Progress value={0} indeterminate color="#10b981" size="lg" />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-4">
          <LinearProgress value={0} indeterminate />
          <LinearProgress value={0} indeterminate color="#10b981" size="lg" />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Circular"
        code={`import { Progress } from "~/components/ui/progress"

export function ProgressCircular() {
  return (
    <View style={{ flexDirection: 'row', gap: 20 }}>
      <Progress value={65} variant="circular" size="sm" showValue />
      <Progress value={65} variant="circular" size="md" showValue />
      <Progress value={65} variant="circular" size="lg" showValue />
      <Progress value={65} variant="circular" size="lg" color="#10b981" showValue />
    </View>
  )
}`}
      >
        <div className="flex items-center gap-5">
          <CircularProgress value={val} size="sm" showValue />
          <CircularProgress value={val} size="md" showValue />
          <CircularProgress value={val} size="lg" showValue />
          <CircularProgress value={val} size="lg" color="#10b981" showValue />
        </div>
      </Preview>
      )}

    </div>
  )
}
