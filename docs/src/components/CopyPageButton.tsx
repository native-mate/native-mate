'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  componentName: string
  slug: string
  description: string
  installCommand: string
  usageCode: string
}

function buildMarkdown(name: string, description: string, installCommand: string, usageCode: string, url: string) {
  return `# ${name} — native-mate React Native component

${description}

## Installation
\`\`\`bash
${installCommand}
\`\`\`

## Usage
\`\`\`tsx
${usageCode}
\`\`\`

Docs: ${url}`
}

const AI_TOOLS = [
  {
    key: 'markdown',
    label: 'View as Markdown',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.27 19.385H1.73C.775 19.385 0 18.61 0 17.655V6.345c0-.955.775-1.73 1.73-1.73h20.54c.955 0 1.73.775 1.73 1.73v11.31c0 .955-.775 1.73-1.73 1.73zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.077h-2.308l-2.307 2.885-2.308-2.885H3.46v7.846h2.309zm11.539 0l3.461-4.038h-2.308V8.077H16.15v3.808h-2.308l3.461 4.038z" />
      </svg>
    ),
  },
  {
    key: 'v0',
    label: 'Open in v0',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 40 20" fill="currentColor">
        <path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 5.24286 34.6718 3.91385 32.9188 3.91385H23.3919L23.3919 0Z" />
        <path d="M13.5986 0L23.3919 0V3.91385H13.5986C11.8456 3.91385 10.5168 5.24286 10.5168 6.99475C10.5168 8.74664 11.8456 10.0757 13.5986 10.0757H20.0031C23.8661 10.0757 26.9978 13.2073 26.9978 17.0704V20H23.0848V17.0704C23.0848 15.3185 21.756 13.9895 20.0031 13.9895H13.5986C9.73547 13.9895 6.60376 10.8578 6.60376 6.99475C6.60376 3.13165 9.73547 0 13.5986 0Z" />
        <path d="M6.60376 6.99475L10.5168 6.99475C10.5168 8.74664 11.8456 10.0757 13.5986 10.0757H6.60376C2.74077 10.0757 -0.390869 6.94399 0.0323538 3.08089L3.93545 3.04479C3.75356 4.71995 4.90366 6.11769 6.60376 6.11769L6.60376 6.99475Z" opacity="0.5" />
      </svg>
    ),
  },
  {
    key: 'chatgpt',
    label: 'Open in ChatGPT',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.886zm16.597 3.855l-5.833-3.387 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.411-.663zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
      </svg>
    ),
  },
  {
    key: 'claude',
    label: 'Open in Claude',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-1.8-.122-.87-.097L.243 12.37l-.243-.2.243-.202.66-.122.87-.073 1.8-.097 2.34-.122 2.697-.073.79-.049h.23l.048-.127-.048-.097-.08-.202-4.72-2.672-.571-.372-.388-.323-.122-.2.122-.202.61-.122.998.024.705.265 4.28 2.818.073-.049v-.146l.024-3.786.073-2.817.122-1.702.073-1.117.097-.388.2-.146.202.146.097.388.073 1.117.122 1.702.073 2.817.024 3.786v.146l.073.049 4.28-2.818.705-.265.998-.024.61.122.122.202-.122.2-.388.323-.57.372-4.72 2.672-.08.097.047.127h.23l.79.049 2.698.073 2.34.122 1.8.097.87.073.66.122.243.202-.243.2-.87.097-1.8.122-2.34.097-2.697.073-.79.048H9.43l-.08.128.08.23 4.72 2.647.57.372.34.299.073.17-.073.17-.34.098-.57.024-.998-.317-4.28-3.102-.073.049-.024 3.762-.073 2.818-.122 1.677-.073 1.117-.097.389-.2.146-.202-.146-.097-.389-.073-1.117-.122-1.677-.073-2.818-.024-3.762-.073-.049-4.28 3.102-.998.317-.57-.024-.34-.098-.073-.17.073-.17.34-.299.57-.372z" />
      </svg>
    ),
  },
  {
    key: 'scira',
    label: 'Open in Scira',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 1 1 0 16A8 8 0 0 1 12 4zm0 2a6 6 0 1 0 0 12A6 6 0 0 0 12 6zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      </svg>
    ),
  },
]

export function CopyPageButton({ componentName, slug, description, installCommand, usageCode }: Props) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const getAiUrl = (key: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const md = buildMarkdown(componentName, description, installCommand, usageCode, url)
    const prompt = `I'm looking at this native-mate React Native documentation. Help me understand how to use it.\n\n${md}`
    const encoded = encodeURIComponent(prompt)

    switch (key) {
      case 'v0':
        return `https://v0.dev/chat?q=${encoded}`
      case 'chatgpt':
        return `https://chatgpt.com/?q=${encoded}`
      case 'claude':
        return `https://claude.ai/new?q=${encoded}`
      case 'scira':
        return `https://scira.ai/search?q=${encodeURIComponent(`native-mate ${componentName} React Native`)}`
      default:
        return ''
    }
  }

  return (
    <div ref={containerRef} className="relative flex">
      {/* Main copy button */}
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(window.location.href)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }}
        className="flex items-center gap-1.5 rounded-l-lg border border-r-0 border-zinc-700/80 bg-zinc-800/80 px-3 py-1.5 text-xs text-zinc-400"
      >
        {copied ? (
          <>
            <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-400">Copied</span>
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Page
          </>
        )}
      </button>

      {/* Chevron */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center rounded-r-lg border border-zinc-700/80 bg-zinc-800/80 px-2 py-1.5 text-zinc-400 transition-colors ${open ? 'text-zinc-200' : ''}`}
      >
        <svg
          className={`h-3 w-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-52 overflow-hidden rounded-xl border border-zinc-700/80 bg-zinc-900 shadow-2xl shadow-black/60">
          <div className="py-1">
            {/* View as Markdown — opens /raw page in new tab */}
            <a
              href={`/components/${slug}/raw`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-zinc-100"
            >
              <span className="text-zinc-500">{AI_TOOLS[0].icon}</span>
              {AI_TOOLS[0].label}
            </a>

            <div className="mx-4 my-1 border-t border-zinc-800" />

            {/* AI tool links */}
            {AI_TOOLS.slice(1).map((tool) => (
              <a
                key={tool.key}
                href={getAiUrl(tool.key)}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-zinc-100"
              >
                <span className="text-zinc-500">{tool.icon}</span>
                {tool.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
