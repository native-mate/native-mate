'use client'

import { useEffect, useRef, useState } from 'react'

interface TocItem {
  id: string
  label: string
}

interface Props {
  items: TocItem[]
}

export function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Build a map of element -> id for quick lookup
    const elementMap = new Map<Element, string>()
    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) elementMap.set(el, id)
    })

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          const id = elementMap.get(visible[0].target)
          if (id) setActiveId(id)
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      },
    )

    elementMap.forEach((_, el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-44 flex-shrink-0 overflow-y-auto py-10 xl:block">
      <p className="mb-3 pl-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
        On This Page
      </p>
      <ul className="border-l border-zinc-800 space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                setActiveId(item.id)
              }}
              className={`block border-l py-1 pl-3 text-xs transition-all duration-150 -ml-px ${
                activeId === item.id
                  ? 'border-zinc-400 font-medium text-zinc-100'
                  : 'border-transparent text-zinc-600 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
