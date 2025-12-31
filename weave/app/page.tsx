import Link from 'next/link'
import { HeroSection } from '@/components/home/HeroSection'
import { ExampleSnippet } from '@/components/home/ExampleSnippet'
import { InteractiveDemo } from '@/components/home/InteractiveDemo'
import { ValueGrid } from '@/components/home/ValueGrid'
import { Footer } from '@/components/home/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <ExampleSnippet />
      <InteractiveDemo />
      <ValueGrid />
      <Footer />
    </div>
  )
}

