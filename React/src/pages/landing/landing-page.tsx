import { Navbar } from './navbar'
import { Hero } from './hero'
import { HowItWorks } from './how-it-works'
import { ForWho } from './for-who'
import { FinalCTA } from './final-cta'
import { Footer } from './footer'
import { MockupSection } from './mockups/mockup-section'
import { FeaturesGrid } from './features/features-grid'
import { CourtTypesSection } from './courts/court-types-section'
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
