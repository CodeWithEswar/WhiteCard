import { LandingHeader } from './components/landing-header'
import { HeroSection } from './components/hero-section'
import { TrustStrip } from './components/trust-strip'
import { SpacesShowcase } from './components/spaces-showcase'
import { UploadShowcase } from './components/upload-showcase'
import { TagsShowcase } from './components/tags-showcase'
import { SecuritySection } from './components/security-section'
import { ResponsiveShowcase } from './components/responsive-showcase'
import { FaqSection } from './components/faq-section'
import { FinalCta } from './components/final-cta'
import { LandingFooter } from './components/landing-footer'
import { GridBackground } from '../../components/backgrounds/grid-background'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary">
      {/* Background Architectural Grid Pattern */}
      <GridBackground
        mask="subtle"
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <LandingHeader />
        <main className="flex-1">
          <HeroSection />
          <TrustStrip />
          <SpacesShowcase />
          <UploadShowcase />
          <TagsShowcase />
          <SecuritySection />
          <ResponsiveShowcase />
          <FaqSection />
          <FinalCta />
        </main>
        <LandingFooter />
      </div>
    </div>
  )
}
