'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'
import { PreviewWrapper } from '../../PreviewWrapper'

interface PreviewProps {
  title: string
  code: string
  /** Min height of the preview area in px (default 120) */
  minHeight?: number
  children: React.ReactNode
}

export function Preview({ title, code, minHeight = 120, children }: PreviewProps) {
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
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        {/* Live preview area — rendered via React Native Web */}
        <div
          className="flex items-center justify-center p-8 bg-zinc-950/50"
          style={{ minHeight }}
        >
          <PreviewWrapper>{children}</PreviewWrapper>
        </div>

        {/* Code block */}
        <div className="relative">
          <div className={`bg-zinc-950 overflow-hidden transition-all duration-300 ${expanded ? '' : 'max-h-[100px]'}`}>
            <pre className="!m-0 !bg-transparent !p-5 text-[13px] leading-6">
              <code ref={codeRef} className="language-tsx">{code}</code>
            </pre>
          </div>
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
