import { Link } from 'react-router-dom'
import { PageMeta } from '../components/seo/page-meta'
import { WhiteCardLogo } from '../components/brand/white-card-logo'
import { RadialGridBackground } from '../components/backgrounds/radial-grid-background'
import { ShieldCheckIcon, ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../components/icons/app-icon'

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col justify-between selection:bg-primary/20">
      <PageMeta
        title="Privacy Policy — White Card"
        description="Learn how White Card handles account information, uploaded documents, sharing links, and user controls."
        canonical="/privacy"
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
            <AppIcon icon={ShieldCheckIcon} size={13} />
            <span>Privacy First Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: September 2026. How White Card protects your documents and identity.
          </p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">1. Zero OCR & No Automated Data Mining</h2>
            <p>
              White Card never executes OCR (Optical Character Recognition), machine learning analysis, or automated text extraction on your documents. Your files are stored exactly as uploaded in private, scoped object storage.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">2. Scoped Private Storage</h2>
            <p>
              All files are stored in private S3-compatible buckets protected by Row-Level Security (RLS). File storage paths are partitioned by your authenticated user ID: <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">/{'{user_id}'}/{'{space}'}/{'{document_id}'}/{'{filename}'}</code>. No other user has read, write, or list permissions on your folder.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">3. Cryptographic Direct Sharing</h2>
            <p>
              When you generate a direct share link for a document:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The secret token is never stored in plain text in our database; only its SHA-256 cryptographic hash is stored.</li>
              <li>Public share links expire automatically after the period you select (1, 7, or 30 days).</li>
              <li>You can revoke any active share link at any time from your vault dashboard.</li>
              <li>Public share links never expose owner identity, email, internal storage paths, or other documents.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">4. Information We Collect</h2>
            <p>
              We collect minimal information required to authenticate and provide your vault:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Authentication credentials provided via Google OAuth (email address, display name, avatar URL).</li>
              <li>Document metadata you enter (title, category, tags, expiry date, notes).</li>
              <li>Basic activity logs (upload timestamps, download events) visible only to you.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">5. Your Data Ownership & Deletion</h2>
            <p>
              You own all intellectual property and rights to your files. When you delete a document from White Card, both the metadata record and the underlying storage file are permanently removed from our storage systems.
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
