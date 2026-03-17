'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'

// --- Web OTP Input (mimics native-mate OtpInput) ---

type OtpVariant = 'box' | 'underline' | 'rounded'
type OtpStatus = 'default' | 'error' | 'success'

const SHAKE_CSS = `
@keyframes otp-shake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-6px); }
  30% { transform: translateX(6px); }
  45% { transform: translateX(-4px); }
  60% { transform: translateX(4px); }
  75% { transform: translateX(-2px); }
  90% { transform: translateX(2px); }
}
@keyframes otp-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`

let styleInjected = false
function injectStyles() {
  if (styleInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.textContent = SHAKE_CSS
  document.head.appendChild(el)
  styleInjected = true
}

function Otp({
  length = 6,
  variant = 'box',
  status = 'default',
  secure = false,
  alphanumeric = false,
  label,
  hint,
  autoFocus = false,
  onComplete,
}: {
  length?: number
  variant?: OtpVariant
  status?: OtpStatus
  secure?: boolean
  alphanumeric?: boolean
  label?: string
  hint?: string
  autoFocus?: boolean
  onComplete?: (value: string) => void
}) {
  useEffect(() => { injectStyles() }, [])

  const [digits, setDigits] = useState<string[]>(Array(length).fill(''))
  const [activeIndex, setActiveIndex] = useState<number | null>(autoFocus ? 0 : null)
  const [shaking, setShaking] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hiddenRef = useRef<HTMLInputElement>(null)

  // Trigger shake when status becomes error
  const prevStatus = useRef(status)
  useEffect(() => {
    if (status === 'error' && prevStatus.current !== 'error') {
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
    }
    prevStatus.current = status
  }, [status])

  const focusHidden = (idx: number) => {
    setActiveIndex(idx)
    hiddenRef.current?.focus()
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (activeIndex === null) return
      const idx = activeIndex

      if (e.key === 'Backspace') {
        e.preventDefault()
        const next = [...digits]
        if (next[idx]) {
          next[idx] = ''
          setDigits(next)
        } else if (idx > 0) {
          next[idx - 1] = ''
          setDigits(next)
          setActiveIndex(idx - 1)
        }
        return
      }

      if (e.key === 'ArrowLeft' && idx > 0) {
        setActiveIndex(idx - 1)
        return
      }
      if (e.key === 'ArrowRight' && idx < length - 1) {
        setActiveIndex(idx + 1)
        return
      }

      const isValidChar = alphanumeric
        ? /^[a-zA-Z0-9]$/.test(e.key)
        : /^[0-9]$/.test(e.key)

      if (isValidChar) {
        e.preventDefault()
        const next = [...digits]
        next[idx] = e.key.toUpperCase()
        setDigits(next)
        const nextIdx = idx < length - 1 ? idx + 1 : idx
        setActiveIndex(nextIdx)
        if (next.every((d) => d !== '')) {
          onComplete?.(next.join(''))
        }
      }
    },
    [activeIndex, digits, length, alphanumeric, onComplete]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const text = e.clipboardData.getData('text').slice(0, length)
      const next = [...digits]
      let lastFilled = activeIndex ?? 0
      for (let i = 0; i < text.length; i++) {
        const ch = alphanumeric ? text[i].toUpperCase() : text[i]
        const isValid = alphanumeric ? /^[a-zA-Z0-9]$/.test(ch) : /^[0-9]$/.test(ch)
        const pos = (activeIndex ?? 0) + i
        if (isValid && pos < length) {
          next[pos] = ch
          lastFilled = pos
        }
      }
      setDigits(next)
      setActiveIndex(Math.min(lastFilled + 1, length - 1))
      if (next.every((d) => d !== '')) onComplete?.(next.join(''))
    },
    [activeIndex, digits, length, alphanumeric, onComplete]
  )

  const cellBase = 'relative flex items-center justify-center select-none transition-all duration-150 font-mono text-lg font-semibold text-zinc-100'

  const getCellStyle = (idx: number) => {
    const isFocused = activeIndex === idx
    const hasVal = !!digits[idx]

    let borderColor = '#3f3f46' // zinc-700
    if (status === 'error') borderColor = '#ef4444'
    else if (status === 'success') borderColor = '#22c55e'
    else if (isFocused) borderColor = '#6366f1'

    if (variant === 'box') {
      return {
        width: 44,
        height: 52,
        borderRadius: 10,
        border: `2px solid ${borderColor}`,
        backgroundColor: isFocused ? 'rgba(99,102,241,0.06)' : 'transparent',
      }
    }
    if (variant === 'rounded') {
      return {
        width: 48,
        height: 52,
        borderRadius: 26,
        border: `2px solid ${borderColor}`,
        backgroundColor: isFocused ? 'rgba(99,102,241,0.06)' : 'rgba(39,39,42,0.5)',
      }
    }
    // underline
    return {
      width: 40,
      height: 52,
      borderBottom: `2px solid ${borderColor}`,
      backgroundColor: 'transparent',
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-zinc-200">{label}</label>}
      <div
        ref={containerRef}
        className="flex gap-2 items-center"
        style={{
          animation: shaking ? 'otp-shake 0.6s ease-in-out' : 'none',
        }}
      >
        {digits.map((digit, idx) => (
          <div
            key={idx}
            className={cellBase}
            style={getCellStyle(idx)}
            onClick={() => focusHidden(idx)}
          >
            {/* Cursor blink */}
            {activeIndex === idx && !digit && (
              <span
                className="absolute w-px h-5 bg-indigo-400"
                style={{ animation: 'otp-blink 1s step-end infinite' }}
              />
            )}
            {digit && (
              <span>{secure ? '●' : digit}</span>
            )}
          </div>
        ))}
        {/* Hidden input to capture keyboard events */}
        <input
          ref={hiddenRef}
          type={alphanumeric ? 'text' : 'tel'}
          inputMode={alphanumeric ? 'text' : 'numeric'}
          className="absolute opacity-0 w-0 h-0 pointer-events-none"
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => setActiveIndex(null)}
          readOnly
        />
      </div>
      {hint && (
        <p className={`text-xs ${status === 'error' ? 'text-red-500' : status === 'success' ? 'text-green-500' : 'text-zinc-500'}`}>
          {hint}
        </p>
      )}
    </div>
  )
}

function OtpWithResend({
  length = 6,
  initialSeconds = 30,
}: {
  length?: number
  initialSeconds?: number
}) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (seconds <= 0) return
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds])

  const resend = () => {
    setSeconds(initialSeconds)
    setKey((k) => k + 1)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-400">Enter the 6-digit code sent to <span className="text-zinc-200 font-medium">+1 (555) 000-1234</span></p>
      <Otp key={key} length={length} />
      <div className="flex items-center gap-2">
        {seconds > 0 ? (
          <span className="text-sm text-zinc-500">Resend code in <span className="text-zinc-300 font-mono tabular-nums">{seconds}s</span></span>
        ) : (
          <button
            onClick={resend}
            className="text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors font-medium"
          >
            Resend code
          </button>
        )}
      </div>
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

// --- Error demo (toggles error state on button press) ---
function ErrorDemo() {
  const [status, setStatus] = useState<OtpStatus>('default')
  return (
    <div className="flex flex-col gap-4">
      <Otp
        length={6}
        status={status}
        hint={status === 'error' ? 'Invalid code. Please try again.' : undefined}
      />
      <button
        onClick={() => setStatus((s) => s === 'error' ? 'default' : 'error')}
        className="self-start px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20 hover:bg-red-500/20 cursor-pointer transition-colors"
      >
        {status === 'error' ? 'Reset' : 'Trigger Error + Shake'}
      </button>
    </div>
  )
}

// --- OTP Previews ---

export default function OtpInputPreview({ part = 'all' }: { part?: 'first' | 'rest' | 'all' } = {}) {
  const first = part === 'all' || part === 'first'
  const rest = part === 'all' || part === 'rest'
  return (
    <div className="space-y-10">

      {first && (
      <Preview
        title="Default (6-digit)"
        code={`import { OtpInput } from "~/components/ui/otp-input"

export function OtpDefault() {
  const [value, setValue] = useState('')
  return (
    <OtpInput
      length={6}
      value={value}
      onChangeText={setValue}
      onComplete={(code) => console.log('Complete:', code)}
    />
  )
}`}
      >
        <Otp length={6} label="Verification code" />
      </Preview>
      )}

      {rest && (
      <Preview
        title="4-digit PIN"
        code={`import { OtpInput } from "~/components/ui/otp-input"

export function OtpPin() {
  const [value, setValue] = useState('')
  return (
    <OtpInput
      length={4}
      label="Enter PIN"
      value={value}
      onChangeText={setValue}
    />
  )
}`}
      >
        <Otp length={4} label="Enter PIN" />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Secure (masked)"
        code={`import { OtpInput } from "~/components/ui/otp-input"

export function OtpSecure() {
  return (
    <OtpInput
      length={6}
      label="Enter passcode"
      secure
    />
  )
}`}
      >
        <Otp length={6} label="Enter passcode" secure />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Underline Variant"
        code={`import { OtpInput } from "~/components/ui/otp-input"

export function OtpUnderline() {
  return (
    <OtpInput
      length={6}
      variant="underline"
      label="Verification code"
    />
  )
}`}
      >
        <Otp length={6} variant="underline" label="Verification code" />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Rounded Variant"
        code={`import { OtpInput } from "~/components/ui/otp-input"

export function OtpRounded() {
  return (
    <OtpInput
      length={6}
      variant="rounded"
      label="Enter code"
    />
  )
}`}
      >
        <Otp length={6} variant="rounded" label="Enter code" />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Alphanumeric"
        code={`import { OtpInput } from "~/components/ui/otp-input"

export function OtpAlphanumeric() {
  return (
    <OtpInput
      length={6}
      alphanumeric
      label="Invite code"
      hint="Letters and numbers only"
    />
  )
}`}
      >
        <Otp length={6} alphanumeric label="Invite code" hint="Letters and numbers only" />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Error (with shake)"
        code={`import { OtpInput } from "~/components/ui/otp-input"

export function OtpError() {
  const [status, setStatus] = useState<'default' | 'error'>('error')
  return (
    <OtpInput
      length={6}
      status={status}
      hint="Invalid code. Please try again."
      onComplete={(code) => {
        if (code !== '123456') setStatus('error')
        else setStatus('default')
      }}
    />
  )
}`}
      >
        <ErrorDemo />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Success"
        code={`import { OtpInput } from "~/components/ui/otp-input"

export function OtpSuccess() {
  return (
    <OtpInput
      length={6}
      status="success"
      hint="Code verified successfully!"
    />
  )
}`}
      >
        <Otp length={6} status="success" hint="Code verified successfully!" />
      </Preview>
      )}

      {rest && (
      <Preview
        title="With Resend Timer"
        code={`import { OtpInput } from "~/components/ui/otp-input"

export function OtpResend() {
  const [seconds, setSeconds] = useState(30)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  return (
    <View style={{ gap: 16 }}>
      <Text style={{ color: '#a1a1aa', fontSize: 14 }}>
        Enter the code sent to{' '}
        <Text style={{ color: '#f4f4f5', fontWeight: '600' }}>
          +1 (555) 000-1234
        </Text>
      </Text>
      <OtpInput length={6} />
      {seconds > 0 ? (
        <Text style={{ color: '#71717a', fontSize: 14 }}>
          Resend code in <Text style={{ fontVariant: ['tabular-nums'] }}>{seconds}s</Text>
        </Text>
      ) : (
        <Pressable onPress={() => setSeconds(30)}>
          <Text style={{ color: '#818cf8', fontSize: 14, fontWeight: '600' }}>
            Resend code
          </Text>
        </Pressable>
      )}
    </View>
  )
}`}
      >
        <OtpWithResend length={6} initialSeconds={30} />
      </Preview>
      )}

    </div>
  )
}
