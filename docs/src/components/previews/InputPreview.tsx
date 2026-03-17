'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'

// --- Web Input (mimics native-mate Input) ---

function Inp({
  label, placeholder, error, hint, size = 'md', required = false,
  disabled = false, prefixText, suffixText, prefix, suffix,
  clearable = false, type = 'text', showPasswordToggle = false,
  showCount = false, maxLength, floatingLabel = false, value: valueProp,
}: {
  label?: string; placeholder?: string; error?: string; hint?: string
  size?: 'sm' | 'md' | 'lg'; required?: boolean; disabled?: boolean
  prefixText?: string; suffixText?: string; prefix?: React.ReactNode; suffix?: React.ReactNode
  clearable?: boolean; type?: string; showPasswordToggle?: boolean
  showCount?: boolean; maxLength?: number; floatingLabel?: boolean; value?: string
}) {
  const [val, setVal] = useState(valueProp || '')
  const [focused, setFocused] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [shaking, setShaking] = useState(false)

  const isFloat = floatingLabel
  const floated = focused || val.length > 0

  useEffect(() => {
    if (error) {
      setShaking(true)
      setTimeout(() => setShaking(false), 300)
    }
  }, [error])

  const heights = { sm: 'h-9', md: 'h-11', lg: 'h-[52px]' }
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  const borderColor = error
    ? 'border-red-500'
    : focused
    ? 'border-zinc-100'
    : 'border-zinc-700'

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label */}
      {label && !isFloat && (
        <label className="text-sm font-medium text-zinc-200">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Input row */}
      <div className={`relative flex items-center rounded-[10px] border transition-colors ${borderColor} ${disabled ? 'bg-zinc-900 opacity-50' : 'bg-transparent'} ${shaking ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}>
        {/* Floating label */}
        {isFloat && label && (
          <span className={`absolute left-3 transition-all duration-150 pointer-events-none ${floated
            ? '-top-2.5 text-[11px] bg-zinc-950 px-1.5 text-zinc-400 z-10'
            : 'top-1/2 -translate-y-1/2 text-sm text-zinc-500'
          }`}>
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
          </span>
        )}

        {/* Prefix text */}
        {prefixText && (
          <span className={`${textSizes[size]} text-zinc-500 px-3 border-r border-zinc-700 ${heights[size]} flex items-center shrink-0`}>
            {prefixText}
          </span>
        )}

        {/* Prefix icon */}
        {prefix && <span className="pl-3 text-zinc-500 shrink-0">{prefix}</span>}

        {/* Input */}
        <input
          type={showPasswordToggle && !showPw ? 'password' : type}
          className={`flex-1 bg-transparent ${textSizes[size]} text-zinc-100 px-3 ${heights[size]} outline-none placeholder-zinc-600 w-full min-w-0`}
          placeholder={isFloat && !floated ? '' : placeholder}
          value={val}
          onChange={(e) => setVal(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          maxLength={maxLength}
        />

        {/* Clear button */}
        {clearable && val && (
          <button onClick={() => setVal('')} className="pr-3 cursor-pointer shrink-0">
            <span className="w-5 h-5 rounded-full bg-zinc-700 text-zinc-300 text-xs flex items-center justify-center">×</span>
          </button>
        )}

        {/* Password toggle */}
        {showPasswordToggle && (
          <button onClick={() => setShowPw(!showPw)} className="pr-3 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer shrink-0">
            {showPw ? 'Hide' : 'Show'}
          </button>
        )}

        {/* Suffix icon */}
        {suffix && <span className="pr-3 text-zinc-500 shrink-0">{suffix}</span>}

        {/* Suffix text */}
        {suffixText && (
          <span className={`${textSizes[size]} text-zinc-500 px-3 border-l border-zinc-700 ${heights[size]} flex items-center shrink-0`}>
            {suffixText}
          </span>
        )}
      </div>

      {/* Bottom row */}
      <div className="flex justify-between">
        <div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {!error && hint && <p className="text-xs text-zinc-500">{hint}</p>}
        </div>
        {showCount && (
          <p className="text-xs text-zinc-500">{val.length}{maxLength ? `/${maxLength}` : ''}</p>
        )}
      </div>
    </div>
  )
}

// --- Preview Block ---

function Preview({ title, code, children }: {
  title: string; code: string; children: React.ReactNode
}) {
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
              <button onClick={() => setExpanded(true)} className="mb-4 px-4 py-1.5 rounded-lg bg-zinc-100 text-zinc-900 text-xs font-medium cursor-pointer hover:bg-white transition-colors">
                View Code
              </button>
            </div>
          )}
          {expanded && (
            <div className="flex justify-center gap-3 py-3 bg-zinc-950 border-t border-zinc-800/50">
              <button onClick={handleCopy} className="px-3 py-1 rounded-md text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={() => setExpanded(false)} className="px-3 py-1 rounded-md text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors">
                Collapse
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- Full Input Preview ---

export default function InputPreview() {
  return (
    <div className="space-y-10">

      <Preview
        title="Default"
        code={`import { Input } from "~/components/ui/input"

export function InputDefault() {
  return <Input label="Email" placeholder="you@example.com" />
}`}
      >
        <Inp label="Email" placeholder="you@example.com" />
      </Preview>

      <Preview
        title="Sizes"
        code={`import { Input } from "~/components/ui/input"

export function InputSizes() {
  return (
    <View style={{ gap: 12 }}>
      <Input size="sm" placeholder="Small input" />
      <Input size="md" placeholder="Medium input" />
      <Input size="lg" placeholder="Large input" />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-3">
          <Inp size="sm" placeholder="Small input" />
          <Inp size="md" placeholder="Medium input" />
          <Inp size="lg" placeholder="Large input" />
        </div>
      </Preview>

      <Preview
        title="Required"
        code={`import { Input } from "~/components/ui/input"

export function InputRequired() {
  return <Input label="Full Name" placeholder="John Doe" required />
}`}
      >
        <Inp label="Full Name" placeholder="John Doe" required />
      </Preview>

      <Preview
        title="Prefix & Suffix Text"
        code={`import { Input } from "~/components/ui/input"

export function InputAddons() {
  return (
    <View style={{ gap: 12 }}>
      <Input label="Price" prefixText="$" suffixText="USD" placeholder="0.00" />
      <Input label="Website" prefixText="https://" placeholder="example.com" />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-3">
          <Inp label="Price" prefixText="$" suffixText="USD" placeholder="0.00" />
          <Inp label="Website" prefixText="https://" placeholder="example.com" />
        </div>
      </Preview>

      <Preview
        title="Prefix & Suffix Icons"
        code={`import { Input } from "~/components/ui/input"
import { Search, Check } from "lucide-react-native" // or @expo/vector-icons

export function InputIcons() {
  return (
    <View style={{ gap: 12 }}>
      <Input prefix={<Search size={16} color="#71717a" />} placeholder="Search..." clearable />
      <Input label="Email" suffix={<Check size={16} color="#4ade80" />} placeholder="you@example.com" />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-3">
          <Inp
            prefix={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            }
            placeholder="Search..."
            clearable
          />
          <Inp label="Email" suffix={<span className="text-green-400">✓</span>} placeholder="you@example.com" />
        </div>
      </Preview>

      <Preview
        title="Clearable"
        code={`import { Input } from "~/components/ui/input"

export function InputClearable() {
  return <Input label="Search" placeholder="Type to search..." clearable />
}`}
      >
        <Inp label="Search" placeholder="Type to search..." clearable />
      </Preview>

      <Preview
        title="Password with Toggle"
        code={`import { Input } from "~/components/ui/input"

export function InputPassword() {
  return (
    <Input
      label="Password"
      placeholder="••••••••"
      secureTextEntry
      showPasswordToggle
    />
  )
}`}
      >
        <Inp label="Password" placeholder="••••••••" type="password" showPasswordToggle />
      </Preview>

      <Preview
        title="Character Count"
        code={`import { Input } from "~/components/ui/input"

export function InputCount() {
  return <Input label="Bio" placeholder="Write something..." showCount maxLength={100} />
}`}
      >
        <Inp label="Bio" placeholder="Write something..." showCount maxLength={100} />
      </Preview>

      <Preview
        title="Floating Label"
        code={`import { Input } from "~/components/ui/input"

export function InputFloating() {
  return (
    <View style={{ gap: 16 }}>
      <Input floatingLabel label="Email Address" placeholder="you@example.com" />
      <Input floatingLabel label="Required Field" required />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-4">
          <Inp floatingLabel label="Email Address" placeholder="you@example.com" />
          <Inp floatingLabel label="Required Field" required />
        </div>
      </Preview>

      <Preview
        title="Error (with shake)"
        code={`import { Input } from "~/components/ui/input"

export function InputError() {
  return <Input label="Username" error="Username is already taken" />
}`}
      >
        <Inp label="Username" error="Username is already taken" />
      </Preview>

      <Preview
        title="With Hint"
        code={`import { Input } from "~/components/ui/input"

export function InputHint() {
  return (
    <Input
      label="Username"
      placeholder="johndoe"
      hint="Only letters, numbers, and underscores"
    />
  )
}`}
      >
        <Inp label="Username" placeholder="johndoe" hint="Only letters, numbers, and underscores" />
      </Preview>

      <Preview
        title="Haptic on Focus"
        code={`import { Input } from "~/components/ui/input"

// Triggers a light haptic when the input receives focus
export function InputHaptic() {
  return <Input label="Tap me" placeholder="Feel the tap..." hapticOnFocus />
}`}
      >
        <Inp label="Tap me" placeholder="Feel the tap on device..." />
      </Preview>

      <Preview
        title="Disabled"
        code={`import { Input } from "~/components/ui/input"

export function InputDisabled() {
  return <Input label="Company" value="Acme Inc." disabled />
}`}
      >
        <Inp label="Company" value="Acme Inc." disabled />
      </Preview>

    </div>
  )
}
