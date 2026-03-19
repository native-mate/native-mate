'use client'

import React, { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import '@/styles/prism-dark.css'
import { PreviewWrapper } from '../../PreviewWrapper'
import { useThemeCustomizer } from '../../ThemeCustomizerContext'

interface PreviewProps {
  title: string
  code: string
  /** Min height of the preview area in px (default 120) */
  minHeight?: number
  children: React.ReactNode
}

/** Returns an appropriate background + border for the preview area based on active theme */
function usePreviewColors() {
  const customizer = useThemeCustomizer()
  if (!customizer) return { bg: 'rgb(9 9 11 / 0.5)', border: '#1e1e21' }

  const { resolvedTheme } = customizer
  const bg = resolvedTheme.colors.background
  const border = resolvedTheme.colors.border
  return { bg, border }
}

export function Preview({ title, code, minHeight = 120, children }: PreviewProps) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)
  const { bg, border } = usePreviewColors()

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
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: border }}>
        {/* Live preview area — rendered via React Native Web */}
        <div
          className="flex items-center justify-center p-8 transition-colors duration-200"
          style={{ minHeight, background: bg }}
        >
          <PreviewWrapper>{children}</PreviewWrapper>
        </div>

        {/* Code block */}
        <div className="relative">
          <div className={`overflow-hidden transition-all duration-300 ${expanded ? '' : 'max-h-[100px]'}`}
               style={{ background: '#0d0d0f' }}>
            {/* Header strip with copy */}
            {expanded && (
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2"
                   style={{ background: '#161616' }}>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">tsx</span>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${copied ? 'text-green-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {copied ? (
                    <><svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="20 6 9 17 4 12" /></svg>Copied</>
                  ) : (
                    <><svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>Copy</>
                  )}
                </button>
              </div>
            )}
            <pre className="!m-0 !bg-transparent !p-5 font-mono text-[13px] leading-[1.7]">
              <code ref={codeRef} className="language-tsx">{code}</code>
            </pre>
          </div>
          {!expanded && (
            <div className="absolute inset-0 flex items-end justify-center"
                 style={{ background: 'linear-gradient(to top, #111111 30%, transparent)' }}>
              <button
                onClick={() => setExpanded(true)}
                className="mb-4 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:text-zinc-100 cursor-pointer"
              >
                View code
              </button>
            </div>
          )}
          {expanded && (
            <div className="flex justify-center py-2 border-t border-zinc-800/60"
                 style={{ background: '#0d0d0f' }}>
              <button
                onClick={() => setExpanded(false)}
                className="px-3 py-1 rounded-md text-xs text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors"
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
