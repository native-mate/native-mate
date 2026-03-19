import { Hero } from '@/components/landing/Hero'
import { HomeShowcase } from '@/components/landing/HomeShowcase'
import { ComponentShowcase } from '@/components/landing/ComponentShowcase'
import { Footer } from '@/components/landing/Footer'
import { Nav } from '@/components/Nav'

export default function HomePage() {
  return (
    <div className="min-h-screen text-zinc-50" style={{ background: '#070709' }}>
      <Nav />
      <main className="pt-14">
        <Hero />
        <HomeShowcase />
        <ComponentShowcase />
      </main>
      <Footer />
    </div>
  )
}
