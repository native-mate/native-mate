'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'

// --- Web Button (mimics native-mate Button) ---

function Btn({
  variant = 'default', size = 'md', rounded = false, iconOnly = false,
  fullWidth = false, disabled = false, loading = false, color,
  children, iconLeft, iconRight,
}: {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean; iconOnly?: boolean; fullWidth?: boolean
  disabled?: boolean; loading?: boolean; color?: string
  children?: React.ReactNode; iconLeft?: React.ReactNode; iconRight?: React.ReactNode
}) {
  const [pressed, setPressed] = useState(false)
  const variants: Record<string, string> = {
    default: 'bg-zinc-50 text-zinc-900',
    outline: 'bg-transparent border border-zinc-700 text-zinc-100',
    ghost: 'bg-transparent text-zinc-100 hover:bg-zinc-800',
    destructive: 'bg-red-500 text-white',
    secondary: 'bg-zinc-800 text-zinc-200',
    link: 'bg-transparent text-zinc-50 underline',
  }
  const sizes: Record<string, string> = {
    sm: iconOnly ? 'w-8 h-8 text-xs' : 'h-8 px-3 text-xs',
    md: iconOnly ? 'w-11 h-11 text-sm' : 'h-11 px-4 text-sm',
    lg: iconOnly ? 'w-[52px] h-[52px] text-base' : 'h-[52px] px-6 text-base',
  }

  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 select-none',
        variants[variant], variant !== 'link' ? sizes[size] : 'text-sm',
        rounded ? 'rounded-full' : variant === 'link' ? '' : 'rounded-[10px]',
        fullWidth ? 'w-full' : '', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        pressed ? 'scale-95 opacity-85' : '',
      ].join(' ')}
      style={color ? { ...(variant === 'default' ? { backgroundColor: color, color: '#fff' } : {}), ...(variant === 'outline' ? { borderColor: color, color } : {}) } : undefined}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : (
        <>{iconLeft}{children != null && !iconOnly && children}{iconRight}</>
      )}
    </button>
  )
}

function BtnGroup({ children, fullWidth = false }: { children: React.ReactNode; fullWidth?: boolean }) {
  const items = React.Children.toArray(children)
  return (
    <div className={`inline-flex overflow-hidden rounded-[10px] border border-zinc-700 ${fullWidth ? 'w-full' : ''}`}>
      {items.map((child, i) => (
        <div key={i} className={`${fullWidth ? 'flex-1' : ''} ${i > 0 ? 'border-l border-zinc-700' : ''} [&>button]:rounded-none [&>button]:border-0 [&>button]:w-full`}>
          {child}
        </div>
      ))}
    </div>
  )
}

// --- Preview Block (shadcn style: preview + code peeking + View Code button) ---

function Preview({ title, code, children }: {
  title: string; code: string; children: React.ReactNode
}) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
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
        {/* Preview area */}
        <div className="flex items-center justify-center min-h-[200px] p-10 bg-zinc-950/50">
          {children}
        </div>

        {/* Code peek area — always visible, faded */}
        <div className="relative">
          <div className={`bg-zinc-950 overflow-hidden transition-all duration-300 ${expanded ? '' : 'max-h-[100px]'}`}>
            <pre className="!m-0 !bg-transparent !p-5 text-[13px] leading-6">
              <code ref={codeRef} className="language-tsx">
                {code}
              </code>
            </pre>
          </div>

          {/* Fade overlay + View Code button (when collapsed) */}
          {!expanded && (
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent">
              <button
                onClick={() => setExpanded(true)}
                className="mb-4 px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-medium cursor-pointer hover:bg-white transition-colors"
              >
                View Code
              </button>
            </div>
          )}

          {/* Copy + Collapse (when expanded) */}
          {expanded && (
            <div className="flex justify-center gap-3 py-3 bg-zinc-950 border-t border-zinc-800/50">
              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded-md text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => setExpanded(false)}
                className="px-3 py-1 rounded-md text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors"
              >
                Collapse
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Full Button Preview ---

export default function ButtonPreview() {
  return (
    <div className="space-y-10">

      <Preview
        title="Default"
        code={`import { Button } from "~/components/ui/button"

export function ButtonDefault() {
  return <Button>Button</Button>
}`}
      >
        <Btn>Button</Btn>
      </Preview>

      <Preview
        title="Variants"
        code={`import { Button } from "~/components/ui/button"

export function ButtonVariants() {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="link">Link</Button>
    </View>
  )
}`}
      >
        <div className="flex flex-wrap gap-3 items-center">
          <Btn variant="default">Default</Btn>
          <Btn variant="outline">Outline</Btn>
          <Btn variant="ghost">Ghost</Btn>
          <Btn variant="destructive">Destructive</Btn>
          <Btn variant="secondary">Secondary</Btn>
          <Btn variant="link">Link</Btn>
        </div>
      </Preview>

      <Preview
        title="Sizes"
        code={`import { Button } from "~/components/ui/button"

export function ButtonSizes() {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-end' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </View>
  )
}`}
      >
        <div className="flex items-end gap-3">
          <Btn size="sm">Small</Btn>
          <Btn size="md">Medium</Btn>
          <Btn size="lg">Large</Btn>
        </div>
      </Preview>

      <Preview
        title="Rounded"
        code={`import { Button } from "~/components/ui/button"

export function ButtonRounded() {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button rounded>Rounded</Button>
      <Button rounded variant="outline">Pill Outline</Button>
      <Button rounded variant="destructive">Pill Delete</Button>
    </View>
  )
}`}
      >
        <div className="flex gap-3">
          <Btn rounded>Rounded</Btn>
          <Btn rounded variant="outline">Pill Outline</Btn>
          <Btn rounded variant="destructive">Pill Delete</Btn>
        </div>
      </Preview>

      <Preview
        title="Icon Only"
        code={`import { Button } from "~/components/ui/button"

export function ButtonIconOnly() {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button iconOnly iconLeft={<PlusIcon />} />
      <Button iconOnly variant="outline" iconLeft={<CloseIcon />} />
      <Button iconOnly rounded iconLeft={<HeartIcon />} />
      <Button iconOnly rounded variant="destructive" iconLeft={<HeartIcon />} />
    </View>
  )
}`}
      >
        <div className="flex gap-3">
          <Btn iconOnly iconLeft={<span className="text-lg font-bold">+</span>} />
          <Btn iconOnly variant="outline" iconLeft={<span>✕</span>} />
          <Btn iconOnly rounded iconLeft={<span>♥</span>} />
          <Btn iconOnly rounded variant="destructive" iconLeft={<span>♥</span>} />
        </div>
      </Preview>

      <Preview
        title="With Icons"
        code={`import { Button } from "~/components/ui/button"

export function ButtonWithIcons() {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button iconLeft={<PlusIcon />}>Add Item</Button>
      <Button variant="outline" iconRight={<ArrowIcon />}>Next</Button>
    </View>
  )
}`}
      >
        <div className="flex gap-3">
          <Btn iconLeft={<span className="font-bold">+</span>}>Add Item</Btn>
          <Btn variant="outline" iconRight={<span>→</span>}>Next</Btn>
        </div>
      </Preview>

      <Preview
        title="Custom Colors"
        code={`import { Button } from "~/components/ui/button"

export function ButtonCustomColors() {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button color="#6366f1">Indigo</Button>
      <Button color="#10b981">Emerald</Button>
      <Button color="#f59e0b" variant="outline">Amber</Button>
    </View>
  )
}`}
      >
        <div className="flex gap-3">
          <Btn color="#6366f1">Indigo</Btn>
          <Btn color="#10b981">Emerald</Btn>
          <Btn color="#f59e0b" variant="outline">Amber</Btn>
        </div>
      </Preview>

      <Preview
        title="Button Group"
        code={`import { Button, ButtonGroup } from "~/components/ui/button"

export function ButtonGroupExample() {
  return (
    <View style={{ gap: 16 }}>
      <ButtonGroup fullWidth variant="outline">
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
        <Button>Year</Button>
      </ButtonGroup>
      <ButtonGroup fullWidth>
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </ButtonGroup>
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <BtnGroup fullWidth>
            <Btn variant="ghost">Day</Btn>
            <Btn variant="ghost">Week</Btn>
            <Btn variant="ghost">Month</Btn>
            <Btn variant="ghost">Year</Btn>
          </BtnGroup>
          <BtnGroup fullWidth>
            <Btn variant="ghost">Cancel</Btn>
            <Btn variant="default">Confirm</Btn>
          </BtnGroup>
        </div>
      </Preview>

      <Preview
        title="Full Width"
        code={`import { Button } from "~/components/ui/button"

export function ButtonFullWidth() {
  return (
    <View style={{ gap: 12 }}>
      <Button fullWidth>Full Width Button</Button>
      <Button fullWidth variant="outline">Full Width Outline</Button>
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Btn fullWidth>Full Width Button</Btn>
          <Btn fullWidth variant="outline">Full Width Outline</Btn>
        </div>
      </Preview>

      <Preview
        title="Haptic Feedback"
        code={`import { Button } from "~/components/ui/button"

// Haptic feedback on press (requires expo-haptics, optional)
<Button haptic="light">Light (default)</Button>
<Button haptic="medium">Medium</Button>
<Button haptic="heavy">Heavy</Button>
<Button haptic="none">No Haptic</Button>`}
      >
        <div className="flex flex-wrap gap-3">
          <Btn>Light</Btn>
          <Btn variant="outline">Medium</Btn>
          <Btn variant="secondary">Heavy</Btn>
          <Btn variant="ghost">None</Btn>
        </div>
      </Preview>

      <Preview
        title="Loading"
        code={`import { Button } from "~/components/ui/button"

export function ButtonLoading() {
  return <Button loading>Saving...</Button>
}`}
      >
        <Btn loading>Saving...</Btn>
      </Preview>

      <Preview
        title="Disabled"
        code={`import { Button } from "~/components/ui/button"

export function ButtonDisabled() {
  return <Button disabled>Disabled</Button>
}`}
      >
        <Btn disabled>Disabled</Btn>
      </Preview>

    </div>
  )
}
