'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'

// --- Web Radio (mimics native-mate Radio) ---

type RadSize = 'sm' | 'md' | 'lg'

function Rad({
  label,
  description,
  checked = false,
  size = 'md',
  disabled = false,
  card = false,
  color = '#6366f1',
  onClick,
}: {
  label?: string
  description?: string
  checked?: boolean
  size?: RadSize
  disabled?: boolean
  card?: boolean
  color?: string
  onClick?: () => void
}) {
  const outerSizes: Record<RadSize, string> = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }
  const innerSizes: Record<RadSize, string> = { sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3' }

  const outer = (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center ${outerSizes[size]}`}
      style={{
        border: `2px solid ${checked ? color : '#52525b'}`,
        backgroundColor: 'transparent',
        transition: 'border-color 250ms cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <div
        className={`rounded-full ${innerSizes[size]}`}
        style={{
          backgroundColor: color,
          transform: checked ? 'scale(1)' : 'scale(0)',
          opacity: checked ? 1 : 0,
          transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms ease',
        }}
      />
    </div>
  )

  const labelEl = label ? (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className={`text-sm font-medium leading-tight ${disabled ? 'text-zinc-600' : 'text-zinc-100'}`}>{label}</span>
      {description && <span className="text-xs text-zinc-500 leading-snug">{description}</span>}
    </div>
  ) : null

  if (card) {
    return (
      <div
        onClick={!disabled ? onClick : undefined}
        style={{ transition: 'border-color 300ms cubic-bezier(0.34,1.56,0.64,1), background-color 300ms cubic-bezier(0.34,1.56,0.64,1)' }}
        className={`flex items-start gap-3 rounded-xl border p-4 ${
          checked ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-700 bg-transparent'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-zinc-500'}`}
      >
        {outer}
        {labelEl}
      </div>
    )
  }

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`flex items-center gap-3 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {outer}
      {labelEl}
    </div>
  )
}

function RadGroup({
  label,
  options,
  defaultValue,
  horizontal = false,
  card = false,
  size = 'md',
  error,
  disabled = false,
}: {
  label?: string
  options: { value: string; label: string; description?: string; disabled?: boolean }[]
  defaultValue?: string
  horizontal?: boolean
  card?: boolean
  size?: RadSize
  error?: string
  disabled?: boolean
}) {
  const [selected, setSelected] = useState(defaultValue ?? '')

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-zinc-200 mb-1">{label}</span>}
      <div className={`flex ${horizontal ? 'flex-row flex-wrap gap-x-6 gap-y-3' : 'flex-col gap-3'} ${card ? 'gap-3' : ''}`}>
        {options.map((opt) => (
          <Rad
            key={opt.value}
            label={opt.label}
            description={opt.description}
            checked={selected === opt.value}
            size={size}
            disabled={disabled || !!opt.disabled}
            card={card}
            onClick={() => setSelected(opt.value)}
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
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

// --- Radio Previews ---

export default function RadioPreview({ part = 'all' }: { part?: 'first' | 'rest' | 'all' } = {}) {
  const first = part === 'all' || part === 'first'
  const rest = part === 'all' || part === 'rest'
  return (
    <div className="space-y-10">

      {first && (
      <Preview
        title="Default Group"
        code={`import { RadioGroup, RadioItem } from "~/components/ui/radio"

export function RadioDefault() {
  const [value, setValue] = useState('email')
  return (
    <RadioGroup value={value} onChange={setValue} label="Contact preference">
      <RadioItem value="email" label="Email" description="We'll send updates to your inbox" />
      <RadioItem value="sms" label="SMS" description="Receive a text message" />
      <RadioItem value="push" label="Push notification" description="Via the mobile app" />
      <RadioItem value="none" label="None" description="No notifications" disabled />
    </RadioGroup>
  )
}`}
      >
        <RadGroup
          label="Contact preference"
          defaultValue="email"
          options={[
            { value: 'email', label: 'Email', description: "We'll send updates to your inbox" },
            { value: 'sms', label: 'SMS', description: 'Receive a text message' },
            { value: 'push', label: 'Push notification', description: 'Via the mobile app' },
            { value: 'none', label: 'None', description: 'No notifications', disabled: true },
          ]}
        />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Card Style"
        code={`import { RadioGroup, RadioItem } from "~/components/ui/radio"

export function RadioCards() {
  const [plan, setPlan] = useState('pro')
  return (
    <RadioGroup value={plan} onChange={setPlan} card label="Select a plan">
      <RadioItem
        value="free"
        label="Free"
        description="Up to 3 projects, community support"
        card
      />
      <RadioItem
        value="pro"
        label="Pro — $12/mo"
        description="Unlimited projects, priority support"
        card
      />
      <RadioItem
        value="team"
        label="Team — $49/mo"
        description="Everything in Pro plus team collaboration"
        card
      />
    </RadioGroup>
  )
}`}
      >
        <RadGroup
          label="Select a plan"
          defaultValue="pro"
          card
          options={[
            { value: 'free', label: 'Free', description: 'Up to 3 projects, community support' },
            { value: 'pro', label: 'Pro — $12/mo', description: 'Unlimited projects, priority support' },
            { value: 'team', label: 'Team — $49/mo', description: 'Everything in Pro plus team collaboration' },
          ]}
        />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Horizontal Layout"
        code={`import { RadioGroup, RadioItem } from "~/components/ui/radio"

export function RadioHorizontal() {
  const [value, setValue] = useState('week')
  return (
    <RadioGroup value={value} onChange={setValue} direction="horizontal">
      <RadioItem value="day" label="Day" />
      <RadioItem value="week" label="Week" />
      <RadioItem value="month" label="Month" />
      <RadioItem value="year" label="Year" />
    </RadioGroup>
  )
}`}
      >
        <RadGroup
          horizontal
          defaultValue="week"
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
        />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Sizes"
        code={`import { RadioGroup, RadioItem } from "~/components/ui/radio"

export function RadioSizes() {
  return (
    <View style={{ gap: 16 }}>
      <RadioItem size="sm" label="Small" checked />
      <RadioItem size="md" label="Medium" checked />
      <RadioItem size="lg" label="Large" checked />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-4">
          <Rad size="sm" label="Small (16px)" checked />
          <Rad size="md" label="Medium (20px)" checked />
          <Rad size="lg" label="Large (24px)" checked />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Error State"
        code={`import { RadioGroup, RadioItem } from "~/components/ui/radio"

export function RadioError() {
  const [value, setValue] = useState('')
  return (
    <RadioGroup
      value={value}
      onChange={setValue}
      label="Shipping method"
      error="Please select a shipping method to continue"
    >
      <RadioItem value="standard" label="Standard (5-7 days)" />
      <RadioItem value="express" label="Express (2-3 days)" />
      <RadioItem value="overnight" label="Overnight" />
    </RadioGroup>
  )
}`}
      >
        <RadGroup
          label="Shipping method"
          error="Please select a shipping method to continue"
          options={[
            { value: 'standard', label: 'Standard (5–7 days)' },
            { value: 'express', label: 'Express (2–3 days)' },
            { value: 'overnight', label: 'Overnight' },
          ]}
        />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Disabled"
        code={`import { RadioGroup, RadioItem } from "~/components/ui/radio"

export function RadioDisabled() {
  return (
    <RadioGroup value="pro" disabled label="Current plan (read-only)">
      <RadioItem value="free" label="Free" />
      <RadioItem value="pro" label="Pro" />
      <RadioItem value="team" label="Team" />
    </RadioGroup>
  )
}`}
      >
        <RadGroup
          label="Current plan (read-only)"
          defaultValue="pro"
          disabled
          options={[
            { value: 'free', label: 'Free' },
            { value: 'pro', label: 'Pro' },
            { value: 'team', label: 'Team' },
          ]}
        />
      </Preview>
      )}

    </div>
  )
}
