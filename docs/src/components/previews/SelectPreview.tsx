'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'

// --- Web Select (mimics native-mate Select) ---

type SelOption = {
  value: string
  label: string
  description?: string
  group?: string
}

function Sel({
  options = [],
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  clearable = false,
  searchable = false,
  multi = false,
  maxSelected,
}: {
  options?: SelOption[]
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  clearable?: boolean
  searchable?: boolean
  multi?: boolean
  maxSelected?: number
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [single, setSingle] = useState<string>('')
  const [multiVal, setMultiVal] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = options.filter((o) =>
    search ? o.label.toLowerCase().includes(search.toLowerCase()) : true
  )

  const groups = Array.from(new Set(options.map((o) => o.group).filter(Boolean))) as string[]
  const hasGroups = groups.length > 0

  const selectedLabel = options.find((o) => o.value === single)?.label

  const selectOption = (value: string) => {
    if (multi) {
      setMultiVal((prev) => {
        if (prev.includes(value)) return prev.filter((v) => v !== value)
        if (maxSelected && prev.length >= maxSelected) return prev
        return [...prev, value]
      })
    } else {
      setSingle(value)
      setOpen(false)
      setSearch('')
    }
  }

  const removeChip = (value: string) => {
    setMultiVal((prev) => prev.filter((v) => v !== value))
  }

  const clearAll = () => {
    setSingle('')
    setMultiVal([])
  }

  const borderColor = error ? 'border-red-500' : open ? 'border-zinc-400' : 'border-zinc-700'

  const renderOptions = (opts: SelOption[]) =>
    opts.map((opt) => {
      const isSelected = multi ? multiVal.includes(opt.value) : single === opt.value
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => selectOption(opt.value)}
          className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-start gap-2 ${
            isSelected
              ? 'bg-indigo-500/15 text-indigo-300'
              : 'text-zinc-200 hover:bg-zinc-800'
          } ${multi && maxSelected && multiVal.length >= maxSelected && !isSelected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {multi && (
            <div
              className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600'
              }`}
            >
              {isSelected && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <polyline points="1.5,6 4.5,9 10.5,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="leading-tight">{opt.label}</span>
            {opt.description && (
              <span className="text-xs text-zinc-500 mt-0.5 leading-snug">{opt.description}</span>
            )}
          </div>
        </button>
      )
    })

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5 w-full relative">
      {label && <label className="text-sm font-medium text-zinc-200">{label}</label>}

      {/* Trigger */}
      <div
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`relative flex items-center min-h-[44px] rounded-[10px] border transition-colors px-3 py-2 gap-2 ${borderColor} ${
          disabled ? 'bg-zinc-900 opacity-50 cursor-not-allowed' : 'bg-transparent cursor-pointer hover:border-zinc-500'
        }`}
      >
        {/* Multi chips or single label */}
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {multi && multiVal.length > 0 ? (
            multiVal.map((v) => {
              const opt = options.find((o) => o.value === v)
              return (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 text-xs"
                >
                  {opt?.label}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeChip(v) }}
                    className="text-zinc-500 hover:text-zinc-200 cursor-pointer leading-none"
                  >
                    ×
                  </button>
                </span>
              )
            })
          ) : (
            <span className={`text-sm truncate ${(!multi && selectedLabel) || (multi && multiVal.length > 0) ? 'text-zinc-100' : 'text-zinc-500'}`}>
              {multi ? placeholder : selectedLabel || placeholder}
            </span>
          )}
        </div>

        {/* Clear + Chevron */}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          {clearable && (single || multiVal.length > 0) && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearAll() }}
              className="w-5 h-5 rounded-full bg-zinc-700 text-zinc-300 text-xs flex items-center justify-center hover:bg-zinc-600 cursor-pointer"
            >
              ×
            </button>
          )}
          {maxSelected && multi && (
            <span className="text-xs text-zinc-500">{multiVal.length}/{maxSelected}</span>
          )}
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl overflow-hidden z-50">
          {searchable && (
            <div className="p-2 border-b border-zinc-800">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                autoFocus
                className="w-full bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-600 rounded-lg px-3 py-2 outline-none border border-transparent focus:border-zinc-600"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="max-h-52 overflow-y-auto">
            {hasGroups ? (
              groups.map((group) => {
                const groupOpts = filtered.filter((o) => o.group === group)
                if (groupOpts.length === 0) return null
                return (
                  <div key={group}>
                    <div className="px-3 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-900/80 sticky top-0">
                      {group}
                    </div>
                    {renderOptions(groupOpts)}
                  </div>
                )
              })
            ) : filtered.length === 0 ? (
              <p className="px-3 py-6 text-sm text-zinc-500 text-center">No options found</p>
            ) : (
              renderOptions(filtered)
            )}
          </div>
        </div>
      )}

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

// --- Select Previews ---

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'br', label: 'Brazil' },
]

const TECH_OPTIONS: SelOption[] = [
  { value: 'react', label: 'React', description: 'Meta\'s UI library', group: 'Frontend' },
  { value: 'vue', label: 'Vue', description: 'Progressive framework', group: 'Frontend' },
  { value: 'svelte', label: 'Svelte', description: 'Compile-time framework', group: 'Frontend' },
  { value: 'angular', label: 'Angular', description: 'Google\'s framework', group: 'Frontend' },
  { value: 'rn', label: 'React Native', description: 'Cross-platform mobile', group: 'Mobile' },
  { value: 'expo', label: 'Expo', description: 'React Native toolchain', group: 'Mobile' },
  { value: 'flutter', label: 'Flutter', description: 'Google\'s mobile UI toolkit', group: 'Mobile' },
]

export default function SelectPreview({ part = 'all' }: { part?: 'first' | 'rest' | 'all' } = {}) {
  const first = part === 'all' || part === 'first'
  const rest = part === 'all' || part === 'rest'
  return (
    <div className="space-y-10">

      {first && (
      <Preview
        title="Default"
        code={`import { Select } from "~/components/ui/select"

export function SelectDefault() {
  const [value, setValue] = useState('')
  return (
    <Select
      label="Country"
      placeholder="Select a country"
      value={value}
      onValueChange={setValue}
      options={[
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' },
        { value: 'au', label: 'Australia' },
      ]}
    />
  )
}`}
      >
        <Sel label="Country" placeholder="Select a country" options={COUNTRIES} />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Searchable"
        code={`import { Select } from "~/components/ui/select"

export function SelectSearchable() {
  const [value, setValue] = useState('')
  return (
    <Select
      label="Country"
      placeholder="Search countries..."
      searchable
      value={value}
      onValueChange={setValue}
      options={countries}
    />
  )
}`}
      >
        <Sel label="Country" placeholder="Search countries..." searchable options={COUNTRIES} />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Clearable"
        code={`import { Select } from "~/components/ui/select"

export function SelectClearable() {
  const [value, setValue] = useState('us')
  return (
    <Select
      label="Country"
      clearable
      value={value}
      onValueChange={setValue}
      options={countries}
    />
  )
}`}
      >
        <Sel label="Country" clearable options={COUNTRIES} />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Option Descriptions"
        code={`import { Select } from "~/components/ui/select"

export function SelectDescriptions() {
  return (
    <Select
      label="Framework"
      placeholder="Pick a framework"
      options={[
        { value: 'react', label: 'React', description: "Meta's UI library for building interfaces" },
        { value: 'vue', label: 'Vue', description: 'The progressive JavaScript framework' },
        { value: 'svelte', label: 'Svelte', description: 'Cybernetically enhanced web apps' },
      ]}
    />
  )
}`}
      >
        <Sel
          label="Framework"
          placeholder="Pick a framework"
          options={[
            { value: 'react', label: 'React', description: "Meta's UI library for building interfaces" },
            { value: 'vue', label: 'Vue', description: 'The progressive JavaScript framework' },
            { value: 'svelte', label: 'Svelte', description: 'Cybernetically enhanced web apps' },
          ]}
        />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Grouped Options"
        code={`import { Select } from "~/components/ui/select"

export function SelectGrouped() {
  return (
    <Select
      label="Technology"
      placeholder="Select a technology"
      options={[
        { value: 'react', label: 'React', group: 'Frontend' },
        { value: 'vue', label: 'Vue', group: 'Frontend' },
        { value: 'svelte', label: 'Svelte', group: 'Frontend' },
        { value: 'rn', label: 'React Native', group: 'Mobile' },
        { value: 'expo', label: 'Expo', group: 'Mobile' },
        { value: 'flutter', label: 'Flutter', group: 'Mobile' },
      ]}
    />
  )
}`}
      >
        <Sel label="Technology" placeholder="Select a technology" options={TECH_OPTIONS} />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Multi-select with Chips"
        code={`import { Select } from "~/components/ui/select"

export function SelectMulti() {
  const [values, setValues] = useState<string[]>([])
  return (
    <Select
      label="Skills"
      placeholder="Select skills"
      multi
      value={values}
      onValueChange={setValues}
      options={techOptions}
    />
  )
}`}
      >
        <Sel label="Skills" placeholder="Select skills" multi options={TECH_OPTIONS.filter(o => !o.group || o.group === 'Frontend')} />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Multi-select (max 3)"
        code={`import { Select } from "~/components/ui/select"

export function SelectMultiMax() {
  const [values, setValues] = useState<string[]>([])
  return (
    <Select
      label="Top 3 languages"
      placeholder="Pick up to 3"
      multi
      maxSelected={3}
      value={values}
      onValueChange={setValues}
      options={languageOptions}
    />
  )
}`}
      >
        <Sel
          label="Top 3 languages"
          placeholder="Pick up to 3"
          multi
          maxSelected={3}
          options={[
            { value: 'ts', label: 'TypeScript' },
            { value: 'py', label: 'Python' },
            { value: 'go', label: 'Go' },
            { value: 'rust', label: 'Rust' },
            { value: 'swift', label: 'Swift' },
            { value: 'kotlin', label: 'Kotlin' },
          ]}
        />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Error State"
        code={`import { Select } from "~/components/ui/select"

export function SelectError() {
  return (
    <Select
      label="Role"
      placeholder="Select your role"
      error="Please select a role to continue"
      options={roleOptions}
    />
  )
}`}
      >
        <Sel
          label="Role"
          placeholder="Select your role"
          error="Please select a role to continue"
          options={[
            { value: 'dev', label: 'Developer' },
            { value: 'design', label: 'Designer' },
            { value: 'pm', label: 'Product Manager' },
          ]}
        />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Disabled"
        code={`import { Select } from "~/components/ui/select"

export function SelectDisabled() {
  return (
    <Select
      label="Region"
      placeholder="Not available"
      disabled
      options={regionOptions}
    />
  )
}`}
      >
        <Sel
          label="Region"
          placeholder="Not available"
          disabled
          options={[{ value: 'us-east', label: 'US East' }]}
        />
      </Preview>
      )}

    </div>
  )
}
