'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'

// --- Web Checkbox (mimics native-mate Checkbox) ---

type ChkSize = 'sm' | 'md' | 'lg'
type ChkState = 'checked' | 'unchecked' | 'indeterminate'

function Chk({
  label,
  description,
  state = 'unchecked',
  size = 'md',
  disabled = false,
  error,
  labelPosition = 'right',
  color = '#6366f1',
  onChange,
}: {
  label?: string
  description?: string
  state?: ChkState
  size?: ChkSize
  disabled?: boolean
  error?: string
  labelPosition?: 'left' | 'right'
  color?: string
  onChange?: (next: ChkState) => void
}) {
  const [internalState, setInternalState] = useState<ChkState>(state)

  useEffect(() => {
    setInternalState(state)
  }, [state])

  const boxSizes: Record<ChkSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }
  const iconSizes: Record<ChkSize, number> = { sm: 10, md: 12, lg: 14 }

  const handleClick = () => {
    if (disabled) return
    const next: ChkState = internalState === 'checked' ? 'unchecked' : 'checked'
    setInternalState(next)
    onChange?.(next)
  }

  const isChecked = internalState === 'checked'
  const isIndet = internalState === 'indeterminate'
  const filled = isChecked || isIndet

  const borderColor = error ? '#ef4444' : filled ? color : '#52525b'

  const boxEl = (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`shrink-0 rounded flex items-center justify-center transition-all duration-150 ${boxSizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{
        backgroundColor: filled ? color : 'transparent',
        border: `2px solid ${borderColor}`,
        outline: 'none',
      }}
    >
      {isIndet && (
        <span style={{ width: iconSizes[size], height: 2, backgroundColor: '#fff', borderRadius: 1, display: 'block' }} />
      )}
      {isChecked && (
        <svg width={iconSizes[size]} height={iconSizes[size]} viewBox="0 0 12 12" fill="none">
          <polyline points="1.5,6 4.5,9 10.5,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )

  const labelEl = label ? (
    <div className="flex flex-col gap-0.5">
      <span className={`text-sm font-medium leading-tight ${disabled ? 'text-zinc-600' : 'text-zinc-100'}`}>{label}</span>
      {description && <span className="text-xs text-zinc-500 leading-snug">{description}</span>}
    </div>
  ) : null

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex items-center gap-3 ${labelPosition === 'left' ? 'flex-row-reverse justify-between' : 'flex-row'}`}
        onClick={!disabled ? handleClick : undefined}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {boxEl}
        {labelEl}
      </div>
      {error && <p className="text-xs text-red-500 ml-0">{error}</p>}
    </div>
  )
}

function ChkGroup({
  label,
  items,
  horizontal = false,
  error,
}: {
  label?: string
  items: { label: string; description?: string; disabled?: boolean; defaultChecked?: boolean }[]
  horizontal?: boolean
  error?: string
}) {
  const [values, setValues] = useState<boolean[]>(items.map((i) => !!i.defaultChecked))

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-zinc-200 mb-1">{label}</span>}
      <div className={`flex ${horizontal ? 'flex-row flex-wrap gap-x-6 gap-y-3' : 'flex-col gap-3'}`}>
        {items.map((item, idx) => (
          <Chk
            key={idx}
            label={item.label}
            description={item.description}
            state={values[idx] ? 'checked' : 'unchecked'}
            disabled={item.disabled}
            onChange={(s) => {
              const next = [...values]
              next[idx] = s === 'checked'
              setValues(next)
            }}
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
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

// --- Checkbox Previews ---

function DefaultPreview() {
  const [s1, setS1] = useState<'checked' | 'unchecked' | 'indeterminate'>('checked')
  const [s2, setS2] = useState<'checked' | 'unchecked' | 'indeterminate'>('unchecked')
  return (
    <div className="flex flex-col gap-4">
      <Chk label="Checked" state={s1} onChange={setS1} />
      <Chk label="Unchecked" state={s2} onChange={setS2} />
    </div>
  )
}

export default function CheckboxPreview({ part = 'all' }: { part?: 'first' | 'rest' | 'all' } = {}) {
  const first = part === 'all' || part === 'first'
  const rest = part === 'all' || part === 'rest'
  return (
    <div className="space-y-10">

      {first && (
      <Preview
        title="Default"
        code={`import { Checkbox } from "~/components/ui/checkbox"

export function CheckboxDefault() {
  const [checked, setChecked] = useState(true)
  return (
    <View style={{ gap: 12 }}>
      <Checkbox label="Checked" checked={checked} onChange={setChecked} />
      <Checkbox label="Unchecked" checked={false} onChange={setChecked} />
    </View>
  )
}`}
      >
        <DefaultPreview />
      </Preview>
      )}

      {rest && (
      <Preview
        title="With Description"
        code={`import { Checkbox } from "~/components/ui/checkbox"

export function CheckboxDescription() {
  return (
    <View style={{ gap: 12 }}>
      <Checkbox
        label="Marketing emails"
        description="Receive emails about new products and features."
        defaultChecked
      />
      <Checkbox
        label="Security alerts"
        description="Get notified about sign-ins from new devices."
      />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-4">
          <Chk label="Marketing emails" description="Receive emails about new products and features." state="checked" />
          <Chk label="Security alerts" description="Get notified about sign-ins from new devices." state="unchecked" />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Indeterminate"
        code={`import { Checkbox } from "~/components/ui/checkbox"

export function CheckboxIndeterminate() {
  const allItems = ['React', 'Vue', 'Angular']
  const [selected, setSelected] = useState(['React'])
  const allChecked = selected.length === allItems.length
  const indeterminate = selected.length > 0 && !allChecked

  return (
    <View style={{ gap: 8 }}>
      <Checkbox
        label="Select All"
        checked={allChecked}
        indeterminate={indeterminate}
        onChange={(v) => setSelected(v ? allItems : [])}
      />
      {allItems.map((item) => (
        <Checkbox
          key={item}
          label={item}
          checked={selected.includes(item)}
          onChange={(v) =>
            setSelected((prev) =>
              v ? [...prev, item] : prev.filter((i) => i !== item)
            )
          }
        />
      ))}
    </View>
  )
}`}
      >
        <IndeterminatePreview />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Sizes"
        code={`import { Checkbox } from "~/components/ui/checkbox"

export function CheckboxSizes() {
  return (
    <View style={{ gap: 12 }}>
      <Checkbox size="sm" label="Small (16px)" defaultChecked />
      <Checkbox size="md" label="Medium (20px)" defaultChecked />
      <Checkbox size="lg" label="Large (24px)" defaultChecked />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-4">
          <Chk size="sm" label="Small (16px)" state="checked" />
          <Chk size="md" label="Medium (20px)" state="checked" />
          <Chk size="lg" label="Large (24px)" state="checked" />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Custom Colors"
        code={`import { Checkbox } from "~/components/ui/checkbox"

export function CheckboxColors() {
  return (
    <View style={{ gap: 12 }}>
      <Checkbox label="Emerald" color="#10b981" defaultChecked />
      <Checkbox label="Rose" color="#f43f5e" defaultChecked />
      <Checkbox label="Violet" color="#7c3aed" defaultChecked />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-4">
          <Chk label="Emerald" color="#10b981" state="checked" />
          <Chk label="Rose" color="#f43f5e" state="checked" />
          <Chk label="Violet" color="#7c3aed" state="checked" />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Label on Left"
        code={`import { Checkbox } from "~/components/ui/checkbox"

export function CheckboxLabelLeft() {
  return (
    <View style={{ gap: 12 }}>
      <Checkbox label="Enable notifications" labelPosition="left" defaultChecked />
      <Checkbox label="Dark mode" labelPosition="left" />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-4">
          <Chk label="Enable notifications" labelPosition="left" state="checked" />
          <Chk label="Dark mode" labelPosition="left" state="unchecked" />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Error State"
        code={`import { Checkbox } from "~/components/ui/checkbox"

export function CheckboxError() {
  return (
    <Checkbox
      label="I agree to the terms and conditions"
      error="You must accept the terms to continue"
    />
  )
}`}
      >
        <Chk label="I agree to the terms and conditions" error="You must accept the terms to continue" />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Checkbox Group"
        code={`import { CheckboxGroup } from "~/components/ui/checkbox"

export function CheckboxGroupExample() {
  const [values, setValues] = useState<string[]>([])
  return (
    <CheckboxGroup
      label="Favorite frameworks"
      options={[
        { value: 'react', label: 'React', description: 'A JavaScript library for building UIs' },
        { value: 'vue', label: 'Vue', description: 'The progressive JavaScript framework' },
        { value: 'svelte', label: 'Svelte', description: 'Cybernetically enhanced web apps' },
        { value: 'solid', label: 'Solid', description: 'Simple and performant reactivity' },
      ]}
      value={values}
      onChange={setValues}
    />
  )
}`}
      >
        <ChkGroup
          label="Favorite frameworks"
          items={[
            { label: 'React', description: 'A JavaScript library for building UIs' },
            { label: 'Vue', description: 'The progressive JavaScript framework' },
            { label: 'Svelte', description: 'Cybernetically enhanced web apps' },
            { label: 'Solid', description: 'Simple and performant reactivity', defaultChecked: true },
          ]}
        />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Horizontal Group"
        code={`import { CheckboxGroup } from "~/components/ui/checkbox"

export function CheckboxHorizontalGroup() {
  return (
    <CheckboxGroup
      label="Notify me about"
      direction="horizontal"
      options={[
        { value: 'comments', label: 'Comments' },
        { value: 'mentions', label: 'Mentions' },
        { value: 'follows', label: 'Follows' },
        { value: 'likes', label: 'Likes' },
      ]}
    />
  )
}`}
      >
        <ChkGroup
          label="Notify me about"
          horizontal
          items={[
            { label: 'Comments', defaultChecked: true },
            { label: 'Mentions', defaultChecked: true },
            { label: 'Follows' },
            { label: 'Likes' },
          ]}
        />
      </Preview>
      )}

    </div>
  )
}

// --- Indeterminate preview helper ---

function IndeterminatePreview() {
  const allItems = ['React', 'Vue', 'Angular']
  const [selected, setSelected] = useState<string[]>(['React'])
  const allChecked = selected.length === allItems.length
  const indeterminate = selected.length > 0 && !allChecked

  const parentState = allChecked ? 'checked' : indeterminate ? 'indeterminate' : 'unchecked'

  return (
    <div className="flex flex-col gap-3">
      <Chk
        label="Select All"
        state={parentState}
        onChange={(s) => setSelected(s === 'checked' ? [...allItems] : [])}
      />
      <div className="pl-6 flex flex-col gap-3 border-l border-zinc-800">
        {allItems.map((item) => (
          <Chk
            key={item}
            label={item}
            state={selected.includes(item) ? 'checked' : 'unchecked'}
            onChange={(s) =>
              setSelected((prev) =>
                s === 'checked' ? [...prev, item] : prev.filter((i) => i !== item)
              )
            }
          />
        ))}
      </div>
    </div>
  )
}
