import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { ComponentShowcase } from '@/components/landing/ComponentShowcase'
import { ThemePresets } from '@/components/landing/ThemePresets'
import { InstallBlock } from '@/components/landing/InstallBlock'
import { Footer } from '@/components/landing/Footer'
import { Nav } from '@/components/Nav'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Nav />
      <main>
        <Hero />
        <Features />
        <ComponentShowcase />
        <ThemePresets />
        <InstallBlock />
      </main>
      <Footer />
    </div>
  )
}
