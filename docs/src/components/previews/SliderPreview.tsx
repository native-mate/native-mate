'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'

// --- Web Slider (mimics native-mate Slider) ---

function Sld({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 40,
  disabled = false,
  fillColor = '#6366f1',
  showValue = true,
  marks,
  label,
}: {
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  disabled?: boolean
  fillColor?: string
  showValue?: boolean
  marks?: number[]
  label?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className={`flex flex-col gap-3 w-full ${disabled ? 'opacity-40' : ''}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm font-medium text-zinc-200">{label}</span>}
          {showValue && <span className="text-sm font-mono text-zinc-400 tabular-nums">{value}</span>}
        </div>
      )}
      <div className="relative flex flex-col gap-1">
        {/* Track container */}
        <div className="relative h-5 flex items-center">
          {/* Background track */}
          <div className="absolute inset-x-0 h-1.5 rounded-full bg-zinc-700" />
          {/* Fill */}
          <div
            className="absolute left-0 h-1.5 rounded-full transition-all duration-75"
            style={{ width: `${pct}%`, backgroundColor: disabled ? '#52525b' : fillColor }}
          />
          {/* Range input (invisible but interactive) */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(e) => setValue(Number(e.target.value))}
            className="absolute inset-x-0 w-full opacity-0 h-5 cursor-pointer disabled:cursor-not-allowed"
            style={{ zIndex: 2 }}
          />
          {/* Thumb */}
          <div
            className="absolute w-5 h-5 rounded-full shadow-md border-2 border-zinc-900 transition-all duration-75 pointer-events-none"
            style={{
              left: `calc(${pct}% - 10px)`,
              backgroundColor: disabled ? '#52525b' : fillColor,
              zIndex: 1,
            }}
          />
        </div>
        {/* Marks */}
        {marks && marks.length > 0 && (
          <div className="relative h-3 mt-0.5">
            {marks.map((mark) => {
              const markPct = ((mark - min) / (max - min)) * 100
              return (
                <div
                  key={mark}
                  className="absolute flex flex-col items-center gap-0.5"
                  style={{ left: `${markPct}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-1 h-1 rounded-full bg-zinc-600" />
                  <span className="text-[10px] text-zinc-600 whitespace-nowrap">{mark}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Static range visual (two-handle range preview)
function RangeSld({
  min = 0,
  max = 1000,
  low = 100,
  high = 500,
  fillColor = '#6366f1',
  label,
  prefix = '',
}: {
  min?: number
  max?: number
  low?: number
  high?: number
  fillColor?: string
  label?: string
  prefix?: string
}) {
  const [lo, setLo] = useState(low)
  const [hi, setHi] = useState(high)

  const loHandleRef = useRef<HTMLInputElement>(null)
  const hiHandleRef = useRef<HTMLInputElement>(null)

  const loPct = ((lo - min) / (max - min)) * 100
  const hiPct = ((hi - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-3 w-full">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-zinc-200">{label}</span>
          <span className="text-sm font-mono text-zinc-400">{prefix}{lo} – {prefix}{hi}</span>
        </div>
      )}
      <div className="relative h-5 flex items-center">
        {/* Background track */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-zinc-700" />
        {/* Fill between handles */}
        <div
          className="absolute h-1.5 rounded-full"
          style={{
            left: `${loPct}%`,
            width: `${hiPct - loPct}%`,
            backgroundColor: fillColor,
          }}
        />
        {/* Low handle input */}
        <input
          ref={loHandleRef}
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), hi - 1)
            setLo(v)
          }}
          className="absolute inset-x-0 w-full opacity-0 h-5 cursor-pointer"
          style={{ zIndex: lo > (max - min) * 0.5 + min ? 3 : 2 }}
        />
        {/* High handle input */}
        <input
          ref={hiHandleRef}
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), lo + 1)
            setHi(v)
          }}
          className="absolute inset-x-0 w-full opacity-0 h-5 cursor-pointer"
          style={{ zIndex: lo > (max - min) * 0.5 + min ? 2 : 3 }}
        />
        {/* Low thumb */}
        <div
          className="absolute w-5 h-5 rounded-full shadow-md border-2 border-zinc-900 pointer-events-none"
          style={{ left: `calc(${loPct}% - 10px)`, backgroundColor: fillColor, zIndex: 1 }}
        />
        {/* High thumb */}
        <div
          className="absolute w-5 h-5 rounded-full shadow-md border-2 border-zinc-900 pointer-events-none"
          style={{ left: `calc(${hiPct}% - 10px)`, backgroundColor: fillColor, zIndex: 1 }}
        />
      </div>
      <div className="flex justify-between text-xs text-zinc-600">
        <span>{prefix}{min}</span>
        <span>{prefix}{max}</span>
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

// --- Slider Previews ---

export default function SliderPreview({ part = 'all' }: { part?: 'first' | 'rest' | 'all' } = {}) {
  const first = part === 'all' || part === 'first'
  const rest = part === 'all' || part === 'rest'
  return (
    <div className="space-y-10">

      {first && (
      <Preview
        title="Default"
        code={`import { Slider } from "~/components/ui/slider"

export function SliderDefault() {
  const [value, setValue] = useState(40)
  return (
    <Slider
      label="Volume"
      value={value}
      onValueChange={setValue}
      min={0}
      max={100}
    />
  )
}`}
      >
        <Sld label="Volume" defaultValue={40} />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Custom Color"
        code={`import { Slider } from "~/components/ui/slider"

export function SliderColors() {
  return (
    <View style={{ gap: 20 }}>
      <Slider label="Emerald" fillColor="#10b981" defaultValue={60} />
      <Slider label="Rose" fillColor="#f43f5e" defaultValue={45} />
      <Slider label="Amber" fillColor="#f59e0b" defaultValue={75} />
    </View>
  )
}`}
      >
        <div className="flex flex-col gap-6">
          <Sld label="Emerald" fillColor="#10b981" defaultValue={60} />
          <Sld label="Rose" fillColor="#f43f5e" defaultValue={45} />
          <Sld label="Amber" fillColor="#f59e0b" defaultValue={75} />
        </div>
      </Preview>
      )}

      {rest && (
      <Preview
        title="Step + Marks"
        code={`import { Slider } from "~/components/ui/slider"

export function SliderStepMarks() {
  const [value, setValue] = useState(50)
  return (
    <Slider
      label="Rating"
      value={value}
      onValueChange={setValue}
      min={0}
      max={100}
      step={25}
      marks={[0, 25, 50, 75, 100]}
    />
  )
}`}
      >
        <Sld label="Rating" defaultValue={50} step={25} marks={[0, 25, 50, 75, 100]} />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Disabled"
        code={`import { Slider } from "~/components/ui/slider"

export function SliderDisabled() {
  return <Slider label="Brightness" value={65} disabled />
}`}
      >
        <Sld label="Brightness" defaultValue={65} disabled />
      </Preview>
      )}

      {rest && (
      <Preview
        title="Range Slider"
        code={`import { RangeSlider } from "~/components/ui/slider"

export function SliderRange() {
  const [range, setRange] = useState({ low: 100, high: 500 })
  return (
    <RangeSlider
      label="Price range"
      value={range}
      onValueChange={setRange}
      min={0}
      max={1000}
      prefix="$"
    />
  )
}`}
      >
        <RangeSld label="Price range" min={0} max={1000} low={100} high={500} prefix="$" />
      </Preview>
      )}

    </div>
  )
}
