'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'

// --- Web Avatar ---

type AvSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type AvStatus = 'online' | 'offline' | 'busy' | 'away'

const sizes: Record<AvSize, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 }
const fontSizes: Record<AvSize, number> = { xs: 9, sm: 11, md: 14, lg: 17, xl: 22 }
const statusSizes: Record<AvSize, number> = { xs: 6, sm: 8, md: 10, lg: 12, xl: 14 }

const statusColors: Record<AvStatus, string> = {
  online:  '#22c55e',
  offline: '#71717a',
  busy:    '#ef4444',
  away:    '#f59e0b',
}

const avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#3b82f6']

function nameToColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function Av({
  src,
  name,
  size = 'md',
  status,
  shape = 'circle',
  color,
}: {
  src?: string
  name?: string
  size?: AvSize
  status?: AvStatus
  shape?: 'circle' | 'square'
  color?: string
}) {
  const [imgError, setImgError] = useState(false)
  const px = sizes[size]
  const fs = fontSizes[size]
  const radius = shape === 'circle' ? '50%' : '8px'
  const bg = color ?? (name ? nameToColor(name) : '#27272a')
  const initials = name ? getInitials(name) : '?'
  const sdot = statusSizes[size]

  return (
    <div style={{ position: 'relative', width: px, height: px, display: 'inline-block' }}>
      <div style={{
        width: px, height: px,
        borderRadius: radius,
        backgroundColor: bg,
        border: '1.5px solid #3f3f46',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        fontSize: fs, fontWeight: 600, color: '#fff', letterSpacing: '0.5px',
      }}>
        {src && !imgError
          ? <img src={src} style={{ width: px, height: px, objectFit: 'cover' }} onError={() => setImgError(true)} />
          : initials
        }
      </div>
      {status && (
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: sdot, height: sdot,
          borderRadius: '50%',
          backgroundColor: statusColors[status],
          border: '1.5px solid #09090b',
        }} />
      )}
    </div>
  )
}

function AvGroup({
  avatars,
  size = 'md',
  max = 4,
}: {
  avatars: { src?: string; name?: string }[]
  size?: AvSize
  max?: number
}) {
  const px = sizes[size]
  const overlap = Math.round(px * 0.35)
  const fs = fontSizes[size]
  const visible = avatars.slice(0, max)
  const overflow = avatars.length - max

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {visible.map((av, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -overlap, zIndex: visible.length - i }}>
          <Av {...av} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div style={{
          marginLeft: -overlap,
          width: px, height: px,
          borderRadius: '50%',
          backgroundColor: '#27272a',
          border: '1.5px solid #3f3f46',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: fs, fontWeight: 600, color: '#71717a',
          zIndex: 0,
        }}>
          +{overflow}
        </div>
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

// --- Avatar Previews ---

export default function AvatarPreview({ part = 'all' }: { part?: 'first' | 'rest' | 'all' } = {}) {
  const first = part === 'all' || part === 'first'
  const rest = part === 'all' || part === 'rest'

  return (
    <div className="space-y-10">

      {first && (
      <Preview
        title="Initials & Auto Color"
        code={`import { Avatar } from "~/components/ui/avatar"

export function AvatarDefault() {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Avatar size="xs" name="John Doe" />
      <Avatar size="sm" name="Jane Smith" />
      <Avatar size="md" name="Alex Ray" />
      <Avatar size="lg" name="Sam Lee" />
      <Avatar size="xl" name="Chris Park" />
    </View>
  )
}`}
      >
        <div className="flex items-center gap-3">
          <Av size="xs" name="John Doe" />
          <Av size="sm" name="Jane Smith" />
          <Av size="md" name="Alex Ray" />
          <Av size="lg" name="Sam Lee" />
          <Av size="xl" name="Chris Park" />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="With Image + Fallback"
        code={`import { Avatar } from "~/components/ui/avatar"

export function AvatarImage() {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Avatar size="lg" src="https://i.pravatar.cc/100?img=1" name="Alice" />
      <Avatar size="lg" src="https://i.pravatar.cc/100?img=2" name="Bob" />
      <Avatar size="lg" src="https://broken.url/img.jpg" name="Broken" />
    </View>
  )
}`}
      >
        <div className="flex items-center gap-3">
          <Av size="lg" src="https://i.pravatar.cc/100?img=1" name="Alice" />
          <Av size="lg" src="https://i.pravatar.cc/100?img=2" name="Bob" />
          <Av size="lg" src="https://i.pravatar.cc/100?img=3" name="Carol" />
          <Av size="lg" src="https://broken.url/img.jpg" name="Broken" />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Status Indicator"
        code={`import { Avatar } from "~/components/ui/avatar"

export function AvatarStatus() {
  return (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <Avatar size="md" name="Online" status="online" />
      <Avatar size="md" name="Busy" status="busy" />
      <Avatar size="md" name="Away" status="away" />
      <Avatar size="md" name="Offline" status="offline" />
    </View>
  )
}`}
      >
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center gap-1.5">
            <Av size="md" name="Online" status="online" />
            <span className="text-xs text-zinc-500">online</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Av size="md" name="Busy" status="busy" />
            <span className="text-xs text-zinc-500">busy</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Av size="md" name="Away" status="away" />
            <span className="text-xs text-zinc-500">away</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Av size="md" name="Offline" status="offline" />
            <span className="text-xs text-zinc-500">offline</span>
          </div>
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Square Shape"
        code={`import { Avatar } from "~/components/ui/avatar"

export function AvatarSquare() {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Avatar size="md" name="A B" shape="square" />
      <Avatar size="md" src="https://i.pravatar.cc/100?img=5" shape="square" />
      <Avatar size="lg" name="C D" shape="square" status="online" />
    </View>
  )
}`}
      >
        <div className="flex items-center gap-3">
          <Av size="md" name="Alpha B" shape="square" />
          <Av size="md" src="https://i.pravatar.cc/100?img=5" shape="square" />
          <Av size="lg" name="Carol D" shape="square" status="online" />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Avatar Group"
        code={`import { Avatar, AvatarGroup } from "~/components/ui/avatar"

export function AvatarGroupExample() {
  return (
    <AvatarGroup
      size="md"
      max={4}
      avatars={[
        { name: 'Alice B' },
        { name: 'Bob C' },
        { name: 'Carol D' },
        { src: 'https://i.pravatar.cc/100?img=4', name: 'Dave E' },
        { name: 'Eve F' },
        { name: 'Frank G' },
      ]}
    />
  )
}`}
      >
        <div className="flex flex-col gap-5">
          <AvGroup
            size="md"
            max={4}
            avatars={[
              { name: 'Alice B' },
              { name: 'Bob C' },
              { name: 'Carol D' },
              { src: 'https://i.pravatar.cc/100?img=4', name: 'Dave E' },
              { name: 'Eve F' },
              { name: 'Frank G' },
            ]}
          />
          <AvGroup
            size="sm"
            max={3}
            avatars={[
              { name: 'User One' },
              { name: 'User Two' },
              { name: 'User Three' },
              { name: 'User Four' },
              { name: 'User Five' },
            ]}
          />
        </div>
      </Preview>
      )}

    </div>
  )
}
