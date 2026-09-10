import {
  GoogleIcon,
  ShieldCheckIcon,
  Folder01Icon,
  ArrowRight01Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { Reveal } from '../../../components/motion/reveal'
import { WhiteCardLogo } from '../../../components/brand/white-card-logo'

export function GoogleAuthSection() {
  return (
    <section id="authentication" className="relative py-24 sm:py-32 overflow-hidden bg-muted/20 border-y border-border/70">
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-[760px] mx-auto text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 06 • Frictionless Authentication
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Sign in without another password to remember.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              White Card uses Google sign-in so you can access your account without creating a separate password for the app.
            </p>
          </Reveal>
        </div>

        {/* Static Authentication Flow Visual */}
        <div className="max-w-4xl mx-auto">
          <Reveal delay={0.16}>
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Step 1: Google OAuth */}
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 text-left space-y-3">
                  <div className="size-11 rounded-xl bg-background border border-border/60 flex items-center justify-center shadow-2xs">
                    <AppIcon icon={GoogleIcon} size={22} className="text-foreground" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    1. Google Sign-In
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Authenticate directly via standard Google OAuth. Your Google credentials never touch our app.
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                    <AppIcon icon={Tick02Icon} size={12} className="text-emerald-500" />
                    Standard OAuth 2.0 PKCE
                  </div>
                </div>

                {/* Step 2: White Card Account */}
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-left space-y-3 relative">
                  <div className="size-11 rounded-md bg-background border border-border/60 flex items-center justify-center shadow-2xs">
                    <WhiteCardLogo size={24} showWordmark={false} />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    2. White Card Account
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your unique user ID isolates your database rows and storage folders.
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-primary flex items-center gap-1">
                    <AppIcon icon={ShieldCheckIcon} size={12} />
                    Auto-provisioned vault
                  </div>
                </div>

                {/* Step 3: Private Spaces */}
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 text-left space-y-3">
                  <div className="size-11 rounded-xl bg-background border border-border/60 flex items-center justify-center shadow-2xs">
                    <AppIcon icon={Folder01Icon} size={22} className="text-foreground" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    3. Your Private Spaces
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Instant access to your Government and Student document collections.
                  </p>
                  <div className="pt-2 text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                    <AppIcon icon={Tick02Icon} size={12} className="text-emerald-500" />
                    Zero password fatigue
                  </div>
                </div>
              </div>

              {/* Privacy boundary statement */}
              <div className="mt-8 pt-6 border-t border-border/60 text-xs text-muted-foreground text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="leading-relaxed">
                  <strong>Scope Transparency:</strong> White Card only requests basic account identity (name, email, avatar). We never request access to Google Drive, Gmail, or contacts.
                </span>
                <span className="text-[11px] font-mono bg-muted px-2.5 py-1 rounded shrink-0">
                  profile + email scope only
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
