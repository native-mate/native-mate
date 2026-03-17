'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'

// --- Web Textarea (mimics native-mate Textarea) ---

function Txa({
  label, placeholder, error, hint, required = false, disabled = false,
  readOnly = false, minRows = 3, maxRows = 10, showCount = false,
  countWarnAt = 0.8, maxLength, floatingLabel = false,
  submitOnEnter = false, onSubmit, onMention, voiceInput = false,
  value: valueProp,
}: {
  label?: string; placeholder?: string; error?: string; hint?: string
  required?: boolean; disabled?: boolean; readOnly?: boolean
  minRows?: number; maxRows?: number; showCount?: boolean
  countWarnAt?: number; maxLength?: number; floatingLabel?: boolean
  submitOnEnter?: boolean; onSubmit?: (v: string) => void
  onMention?: (q: string) => void; voiceInput?: boolean; value?: string
}) {
  const [val, setVal] = useState(valueProp || '')
  const [focused, setFocused] = useState(false)
  const [shaking, setShaking] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isFloat = floatingLabel
  const floated = focused || val.length > 0
  const charCount = val.length
  const isNearLimit = maxLength ? charCount / maxLength >= countWarnAt : false
  const isAtLimit = maxLength ? charCount >= maxLength : false

  const countColor = isAtLimit ? 'text-red-500' : isNearLimit ? 'text-amber-400' : 'text-zinc-500'

  useEffect(() => {
    if (error) {
      setShaking(true)
      setTimeout(() => setShaking(false), 300)
    }
  }, [error])

  // Auto-resize
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const lineH = 22
    const min = minRows * lineH + 16
    const max = maxRows * lineH + 16
    el.style.height = `${Math.min(Math.max(el.scrollHeight, min), max)}px`
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden'
  }, [val, minRows, maxRows])

  const borderColor = error
    ? 'border-red-500'
    : focused
    ? 'border-zinc-100'
    : 'border-zinc-700'

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = maxLength ? e.target.value.slice(0, maxLength) : e.target.value
    setVal(text)
    if (onMention) {
      const atIdx = text.lastIndexOf('@')
      if (atIdx !== -1) {
        const query = text.slice(atIdx + 1)
        if (!query.includes(' ')) onMention(query)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (submitOnEnter && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit?.(val)
    }
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && !isFloat && (
        <label className="text-sm font-medium text-zinc-200">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className={`relative rounded-[10px] border transition-colors ${borderColor} ${disabled || readOnly ? 'bg-zinc-900 opacity-60' : 'bg-transparent'} ${shaking ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}>
        {isFloat && label && (
          <span className={`absolute left-3 transition-all duration-[250ms] pointer-events-none ${floated
            ? '-top-2.5 text-[11px] bg-zinc-950 px-1.5 text-zinc-400 z-10'
            : 'top-3 text-sm text-zinc-500'
          }`}>
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
          </span>
        )}

        <div className="flex items-start gap-2 px-3 py-2.5">
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder-zinc-600 resize-none w-full min-w-0 leading-[22px]"
            placeholder={isFloat && !floated ? '' : placeholder}
            value={val}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled || readOnly}
            maxLength={maxLength}
            style={{ minHeight: `${minRows * 22 + 16}px` }}
          />
          {voiceInput && (
            <button className="mt-0.5 w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 hover:bg-zinc-700 transition-colors cursor-pointer">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                <rect x="9" y="2" width="6" height="12" rx="3"/>
                <path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {!error && hint && <p className="text-xs text-zinc-500">{hint}</p>}
        </div>
        {showCount && (
          <p className={`text-xs ${countColor}`}>{charCount}{maxLength ? `/${maxLength}` : ''}</p>
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

// --- Full Textarea Preview ---

export default function TextareaPreview() {
  const [mentionQuery, setMentionQuery] = useState('')
  const [chatMessages, setChatMessages] = useState<string[]>([])
  const [chatVal, setChatVal] = useState('')

  return (
    <div className="space-y-10">

      <Preview
        title="Default"
        code={`import { Textarea } from "~/components/ui/textarea"

export function TextareaDefault() {
  return <Textarea label="Bio" placeholder="Tell us about yourself..." />
}`}
      >
        <Txa label="Bio" placeholder="Tell us about yourself..." />
      </Preview>

      <Preview
        title="Required"
        code={`import { Textarea } from "~/components/ui/textarea"

export function TextareaRequired() {
  return <Textarea label="Description" placeholder="Write a short description..." required />
}`}
      >
        <Txa label="Description" placeholder="Write a short description..." required />
      </Preview>

      <Preview
        title="Min & Max Rows"
        code={`import { Textarea } from "~/components/ui/textarea"

export function TextareaRows() {
  return (
    <Textarea
      label="Message"
      placeholder="Grows from 2 to 6 rows..."
      minRows={2}
      maxRows={6}
    />
  )
}`}
      >
        <Txa label="Message" placeholder="Grows from 2 to 6 rows then scrolls..." minRows={2} maxRows={6} />
      </Preview>

      <Preview
        title="Character Count (warning at 80%)"
        code={`import { Textarea } from "~/components/ui/textarea"

export function TextareaCount() {
  return (
    <Textarea
      label="Tweet"
      placeholder="What's on your mind?"
      showCount
      maxLength={280}
      countWarnAt={0.8}
    />
  )
}`}
      >
        <Txa label="Tweet" placeholder="What's on your mind?" showCount maxLength={280} countWarnAt={0.8} />
      </Preview>

      <Preview
        title="Floating Label"
        code={`import { Textarea } from "~/components/ui/textarea"

export function TextareaFloating() {
  return <Textarea floatingLabel label="Notes" placeholder="Add notes..." />
}`}
      >
        <Txa floatingLabel label="Notes" placeholder="Add notes..." />
      </Preview>

      <Preview
        title="Submit on Enter (Slack-style)"
        code={`import { Textarea } from "~/components/ui/textarea"

export function TextareaChat() {
  const [messages, setMessages] = useState<string[]>([])
  const [val, setVal] = useState('')

  return (
    <Textarea
      label="Send a message"
      placeholder="Press Enter to send, Shift+Enter for newline"
      submitOnEnter
      onSubmit={(text) => {
        setMessages(prev => [...prev, text])
        setVal('')
      }}
      value={val}
      onChangeText={setVal}
      minRows={1}
      maxRows={4}
    />
  )
}`}
      >
        <div className="space-y-3">
          <Txa
            label="Send a message"
            placeholder="Press Enter to send, Shift+Enter for newline"
            submitOnEnter
            onSubmit={(v) => {
              if (v.trim()) { setChatMessages(p => [...p, v]); setChatVal('') }
            }}
            value={chatVal}
            minRows={1}
            maxRows={4}
          />
          {chatMessages.length > 0 && (
            <div className="space-y-1">
              {chatMessages.slice(-3).map((m, i) => (
                <p key={i} className="text-xs text-zinc-500">→ {m}</p>
              ))}
            </div>
          )}
        </div>
      </Preview>

      <Preview
        title="Mention Detection (@)"
        code={`import { Textarea } from "~/components/ui/textarea"

export function TextareaMention() {
  const [query, setQuery] = useState('')

  return (
    <>
      <Textarea
        label="Comment"
        placeholder="Type @ to mention someone..."
        onMention={(q) => setQuery(q)}
        minRows={2}
      />
      {query && <Text>Suggesting: @{query}</Text>}
    </>
  )
}`}
      >
        <div className="space-y-2">
          <Txa
            label="Comment"
            placeholder="Type @ to mention someone..."
            onMention={setMentionQuery}
            minRows={2}
          />
          {mentionQuery && (
            <p className="text-xs text-zinc-400">Mention query: <span className="text-zinc-200">@{mentionQuery}</span></p>
          )}
        </div>
      </Preview>

      <Preview
        title="Voice Input"
        code={`import { Textarea } from "~/components/ui/textarea"

// Tap 🎙 to trigger speech-to-text (wire to expo-speech or your STT lib)
export function TextareaVoice() {
  return (
    <Textarea
      label="Voice note"
      placeholder="Tap the mic to dictate..."
      voiceInput
      onVoicePress={() => {
        // e.g. Speech.start({ onResult: (text) => onChangeText(text) })
      }}
    />
  )
}`}
      >
        <Txa label="Voice note" placeholder="Tap the mic button to dictate..." voiceInput />
      </Preview>

      <Preview
        title="Read-only"
        code={`import { Textarea } from "~/components/ui/textarea"

export function TextareaReadOnly() {
  return (
    <Textarea
      label="Terms"
      value="By using native-mate you agree to the terms of service."
      readOnly
    />
  )
}`}
      >
        <Txa label="Terms" value="By using native-mate you agree to the terms of service and privacy policy." readOnly />
      </Preview>

      <Preview
        title="Error (with shake)"
        code={`import { Textarea } from "~/components/ui/textarea"

export function TextareaError() {
  return <Textarea label="Review" error="Review cannot be empty" />
}`}
      >
        <Txa label="Review" error="Review cannot be empty" />
      </Preview>

      <Preview
        title="With Hint"
        code={`import { Textarea } from "~/components/ui/textarea"

export function TextareaHint() {
  return (
    <Textarea
      label="Bio"
      placeholder="Tell us about yourself..."
      hint="Keep it under 160 characters"
      showCount
      maxLength={160}
    />
  )
}`}
      >
        <Txa label="Bio" placeholder="Tell us about yourself..." hint="Keep it under 160 characters" showCount maxLength={160} />
      </Preview>

      <Preview
        title="Disabled"
        code={`import { Textarea } from "~/components/ui/textarea"

export function TextareaDisabled() {
  return <Textarea label="System Notes" value="Auto-generated by system." disabled />
}`}
      >
        <Txa label="System Notes" value="Auto-generated by system." disabled />
      </Preview>

    </div>
  )
}
