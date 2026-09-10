import { Link } from 'react-router-dom'
import { PageMeta } from '../components/seo/page-meta'
import { WhiteCardLogo } from '../components/brand/white-card-logo'
import { RadialGridBackground } from '../components/backgrounds/radial-grid-background'
import { CheckmarkBadge01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../components/icons/app-icon'

export function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col justify-between selection:bg-primary/20">
      <PageMeta
        title="Terms of Service — White Card"
        description="Read the terms governing use of White Card document wallet."
        canonical="/terms"
      />
      <RadialGridBackground />

      {/* Top Header */}
      <header className="border-b border-border/70 backdrop-blur-md bg-background/80 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <WhiteCardLogo size={28} showWordmark={true} />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <AppIcon icon={ArrowLeft01Icon} size={15} />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full space-y-10 text-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <AppIcon icon={CheckmarkBadge01Icon} size={13} />
            <span>User Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: September 2026. Please review the terms of service governing White Card.
          </p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing or using White Card, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the application.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">2. Description of Service</h2>
            <p>
              White Card provides a personal digital wallet interface for organizing, storing, and temporarily sharing Government Documents and Student Certificates.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">3. User Responsibility & Content</h2>
            <p>
              You are solely responsible for the files you deposit into your White Card vault. You represent and warrant that you have lawful authorization to possess and store any personal documents or academic records you upload.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">4. Acceptable Use</h2>
            <p>
              You agree not to use White Card to store, distribute, or transmit any malware, unlawful content, or materials that infringe upon the intellectual property or privacy rights of any third party.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">5. Service Availability & Safeguards</h2>
            <p>
              While White Card incorporates modern database redundancy, cryptographic hashing, and access controls, users are advised to maintain independent backups of critical life records and official identity documents.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/70 py-6 px-6 text-center text-xs text-muted-foreground">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 White Card. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-foreground underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
