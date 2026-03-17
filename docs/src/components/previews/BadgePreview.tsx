'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'

// --- Web Badge ---

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
type BadgeSize = 'sm' | 'md' | 'lg'

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border?: string }> = {
  default:     { bg: '#6366f1', text: '#fff' },
  secondary:   { bg: '#27272a', text: '#a1a1aa' },
  destructive: { bg: '#ef4444', text: '#fff' },
  outline:     { bg: 'transparent', text: '#e4e4e7', border: '1px solid #3f3f46' },
  success:     { bg: '#22c55e', text: '#fff' },
  warning:     { bg: '#f59e0b', text: '#fff' },
}

const sizeStyles: Record<BadgeSize, { py: string; px: string; fontSize: string }> = {
  sm: { py: '1px', px: '6px', fontSize: '10px' },
  md: { py: '2px', px: '8px', fontSize: '11px' },
  lg: { py: '3px', px: '10px', fontSize: '13px' },
}

function Bdg({
  variant = 'default',
  size = 'md',
  dot = false,
  count,
  maxCount = 99,
  onDismiss,
  children,
}: {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  count?: number
  maxCount?: number
  onDismiss?: () => void
  children?: React.ReactNode
}) {
  const vc = variantStyles[variant]
  const sz = sizeStyles[size]
  const label = count !== undefined ? (count > maxCount ? `${maxCount}+` : String(count)) : children

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      backgroundColor: vc.bg, color: vc.text,
      paddingTop: sz.py, paddingBottom: sz.py,
      paddingLeft: sz.px, paddingRight: sz.px,
      borderRadius: 999,
      fontSize: sz.fontSize, fontWeight: 600,
      border: vc.border ?? 'none',
      lineHeight: '1.4',
    }}>
      {dot && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: vc.text, opacity: 0.85, display: 'inline-block' }} />
      )}
      {label}
      {onDismiss && (
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: vc.text, opacity: 0.7, fontSize: '12px', fontWeight: 700, padding: 0, lineHeight: 1 }}>×</button>
      )}
    </span>
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

// --- Badge Previews ---

export default function BadgePreview({ part = 'all' }: { part?: 'first' | 'rest' | 'all' } = {}) {
  const first = part === 'all' || part === 'first'
  const rest = part === 'all' || part === 'rest'
  const [tags, setTags] = useState(['React Native', 'TypeScript', 'Expo'])

  return (
    <div className="space-y-10">

      {first && (
      <Preview
        title="Variants"
        code={`import { Badge } from "~/components/ui/badge"

export function BadgeVariants() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="warning">Warning</Badge>
    </View>
  )
}`}
      >
        <div className="flex flex-wrap gap-2">
          <Bdg variant="default">Default</Bdg>
          <Bdg variant="secondary">Secondary</Bdg>
          <Bdg variant="outline">Outline</Bdg>
          <Bdg variant="success">Success</Bdg>
          <Bdg variant="destructive">Destructive</Bdg>
          <Bdg variant="warning">Warning</Bdg>
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Sizes"
        code={`import { Badge } from "~/components/ui/badge"

export function BadgeSizes() {
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </View>
  )
}`}
      >
        <div className="flex items-center gap-2">
          <Bdg variant="default" size="sm">Small</Bdg>
          <Bdg variant="default" size="md">Medium</Bdg>
          <Bdg variant="default" size="lg">Large</Bdg>
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="With Dot Indicator"
        code={`import { Badge } from "~/components/ui/badge"

export function BadgeDot() {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Badge variant="success" dot>Active</Badge>
      <Badge variant="destructive" dot>Error</Badge>
      <Badge variant="warning" dot>Pending</Badge>
    </View>
  )
}`}
      >
        <div className="flex flex-wrap gap-2">
          <Bdg variant="success" dot>Active</Bdg>
          <Bdg variant="destructive" dot>Error</Bdg>
          <Bdg variant="warning" dot>Pending</Bdg>
          <Bdg variant="secondary" dot>Inactive</Bdg>
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Count / Notification"
        code={`import { Badge } from "~/components/ui/badge"

export function BadgeCount() {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Badge variant="destructive" count={3} />
      <Badge variant="default" count={12} />
      <Badge variant="secondary" count={150} maxCount={99} />
    </View>
  )
}`}
      >
        <div className="flex items-center gap-3">
          <Bdg variant="destructive" count={3} />
          <Bdg variant="default" count={12} />
          <Bdg variant="secondary" count={150} maxCount={99} />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Dismissible"
        code={`import { Badge } from "~/components/ui/badge"

export function BadgeDismissible() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Expo'])
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {tags.map((t) => (
        <Badge
          key={t}
          variant="secondary"
          onDismiss={() => setTags((p) => p.filter((x) => x !== t))}
        >
          {t}
        </Badge>
      ))}
    </View>
  )
}`}
      >
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Bdg key={t} variant="secondary" onDismiss={() => setTags((p) => p.filter((x) => x !== t))}>
              {t}
            </Bdg>
          ))}
          {tags.length === 0 && <span className="text-xs text-zinc-500">All dismissed</span>}
        </div>
      </Preview>
      )}

    </div>
  )
}
