import React from 'react'
import { Nav } from '@/components/Nav'
import { ComponentSidebar } from '@/components/ComponentSidebar'
import { ScrollProgress } from '@/components/ScrollProgress'

export default function ComponentDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-zinc-50" style={{ background: '#070709' }}>
      <Nav />
      <ScrollProgress />
      <div className="mx-auto flex max-w-6xl pt-14">
        <ComponentSidebar />
        {children}
      </div>
    </div>
  )
}
