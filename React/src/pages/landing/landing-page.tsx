import { Navbar } from '@/features/landing/components/navbar'
import { Hero } from '@/features/landing/components/hero'
import { HowItWorks } from '@/features/landing/components/how-it-works'
import { ForWho } from '@/features/landing/components/for-who'
import { FinalCTA } from '@/features/landing/components/final-cta'
import { Footer } from '@/features/landing/components/footer'
import { MockupSection } from '@/features/landing/components/mockups/mockup-section'
import { FeaturesGrid } from '@/features/landing/components/features/features-grid'
import { CourtTypesSection } from '@/features/landing/components/courts/court-types-section'
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <Hero />
      <CourtTypesSection />
      <MockupSection />
      <FeaturesGrid />
      <HowItWorks />
      <ForWho />
      <FinalCTA />
      <Footer />
    </main>
  )
}
