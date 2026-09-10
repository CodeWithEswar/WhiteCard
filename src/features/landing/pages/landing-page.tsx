import { LandingHeader } from '../components/landing-header'
import { HeroSection } from '../components/hero-section'
import { TrustStrip } from '../components/trust-strip'
import { ProductPurpose } from '../components/product-purpose'
import { SpacesShowcase } from '../components/spaces-showcase'
import { UploadDemo } from '../components/upload-demo'
import { FileTypesShowcase } from '../components/file-types-showcase'
import { OrganizationShowcase } from '../components/organization-showcase'
import { SecuritySection } from '../components/security-section'
import { SharingShowcase } from '../components/sharing-showcase'
import { ThemesShowcase } from '../components/themes-showcase'
import { ResponsivePreview } from '../components/responsive-preview'
import { TransparencySection } from '../components/transparency-section'
import { FaqSection } from '../components/faq-section'
import { FinalCta } from '../components/final-cta'
import { LandingFooter } from '../components/landing-footer'
import { PageMeta } from '../../../components/seo/page-meta'
import { AppThemeBackground } from '../../../components/backgrounds/app-theme-background'

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-page-background text-foreground selection:bg-primary/20 flex flex-col justify-between">
      {/* Theme Atmospheric Background (grid disabled globally, active in Hero only) */}
      <AppThemeBackground variant="landing" grid={false} />

      {/* SEO Metadata */}
      <PageMeta
        title="White Card — Secure Document Storage"
        description="Store government documents and student certificates in one private, organized digital space with White Card."
        canonical="/"
        image="/og-image.png"
      />

      {/* HEADER */}
      <LandingHeader />

      <main className="flex-1">
        {/* HERO */}
        <HeroSection />

        {/* SECTION 01 — TRUST STRIP */}
        <TrustStrip />

        {/* SECTION 02 — PRODUCT PURPOSE */}
        <ProductPurpose />

        {/* SECTION 03 — TWO VAULT SPACES */}
        <SpacesShowcase />

        {/* SECTION 04 — UPLOAD EXPERIENCE */}
        <UploadDemo />

        {/* SECTION 05 — SUPPORTED FILE TYPES */}
        <FileTypesShowcase />

        {/* SECTION 06 — ORGANIZATION & SEARCH */}
        <OrganizationShowcase />

        {/* SECTION 07 — PRIVACY & SECURITY */}
        <SecuritySection />

        {/* SECTION 08 — DIRECT SHARING */}
        <SharingShowcase />

        {/* SECTION 09 — THEMES & PERSONALIZATION */}
        <ThemesShowcase />

        {/* SECTION 10 — RESPONSIVE PRODUCT EXPERIENCE */}
        <ResponsivePreview />

        {/* SECTION 11 — USER CONTROL & TRANSPARENCY */}
        <TransparencySection />

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
