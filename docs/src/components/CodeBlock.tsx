'use client'

import { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-typescript'
import '@/styles/prism-dark.css'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}

function FileIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

export function CodeBlock({ code, language = 'tsx', filename, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) Prism.highlightElement(codeRef.current)
  }, [code, language])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const lineCount = code.split('\n').length

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#111111]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-[#161616] px-4 py-2.5">
        <div className="flex items-center gap-2">
          {filename ? (
            <>
              <FileIcon />
              <span className="font-mono text-xs text-zinc-400">{filename}</span>
            </>
          ) : (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">{language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
            copied
              ? 'text-green-400'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {copied ? (
            <>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="flex overflow-x-auto">
        {/* Line numbers */}
        {showLineNumbers && (
          <div
            className="select-none border-r border-zinc-800/60 bg-[#111111] py-5 text-right font-mono text-[12px] leading-[1.7] text-zinc-700"
            style={{ minWidth: lineCount >= 100 ? '3.5rem' : '2.75rem', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1}>{i + 1}</div>
            ))}
          </div>
        )}

        {/* Code content */}
        <div className="flex-1 overflow-x-auto py-5 pl-5 pr-6">
          <pre className="!m-0 !bg-transparent !p-0 font-mono text-[13px] leading-[1.7]">
            <code ref={codeRef} className={`language-${language}`}>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
