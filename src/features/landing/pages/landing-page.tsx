import { LandingHeader } from '../components/landing-header'
import { HeroSection } from '../components/hero-section'
import { TrustStrip } from '../components/trust-strip'
import { WhyWhiteCardSection } from '../components/why-white-card-section'
import { SpacesSection } from '../components/spaces-section'
import { FileTypesSection } from '../components/file-types-section'
import { PrivacySection } from '../components/privacy-section'
import { GoogleAuthSection } from '../components/google-auth-section'
import { SharingSection } from '../components/sharing-section'
import { OrganizationSection } from '../components/organization-section'
import { ThemesSection } from '../components/themes-section'
import { ResponsiveSection } from '../components/responsive-section'
import { ControlTransparencySection } from '../components/control-transparency-section'
import { FaqSection } from '../components/faq-section'
import { FinalCta } from '../components/final-cta'
import { LandingFooter } from '../components/landing-footer'
import { PageMeta } from '../../../components/seo/page-meta'
import { AppThemeBackground } from '../../../components/backgrounds/app-theme-background'

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-page-background text-foreground selection:bg-primary/20 flex flex-col justify-between">
      {/* Theme Atmospheric Background */}
      <AppThemeBackground variant="landing" />
      <PageMeta
        title="White Card — Secure Document Storage"
        description="Store government documents and student certificates in one private, organized digital space with White Card."
        canonical="/"
        image="/og-image.png"
      />

      {/* Floating Sticky Header */}
      <LandingHeader />

      <main className="flex-1">
        {/* HERO */}
        <HeroSection />

        {/* SECTION 01 — TRUST STRIP */}
        <TrustStrip />

        {/* SECTION 02 — WHY WHITE CARD */}
        <WhyWhiteCardSection />

        {/* SECTION 03 — TWO DOCUMENT SPACES */}
        <SpacesSection />

        {/* SECTION 04 — SUPPORTED FILE TYPES */}
        <FileTypesSection />

        {/* SECTION 05 — PRIVATE BY DEFAULT */}
        <PrivacySection />

        {/* SECTION 06 — GOOGLE SIGN-IN */}
        <GoogleAuthSection />

        {/* SECTION 07 — DIRECT SHARING */}
        <SharingSection />

        {/* SECTION 08 — SEARCH, TAGS & ORGANIZATION */}
        <OrganizationSection />

        {/* SECTION 09 — THEMES & PERSONALIZATION */}
        <ThemesSection />

        {/* SECTION 10 — RESPONSIVE EXPERIENCE */}
        <ResponsiveSection />

        {/* SECTION 11 — USER CONTROL & TRANSPARENCY */}
        <ControlTransparencySection />

        {/* SECTION 12 — FAQ */}
        <FaqSection />

        {/* FINAL CTA */}
        <FinalCta />
      </main>

      {/* FOOTER */}
      <LandingFooter />
    </div>
  )
}
