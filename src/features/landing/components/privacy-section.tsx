import { useRef } from 'react'
import {
  ShieldCheckIcon,
  LockKeyIcon,
  UserCheck01Icon,
  Share01Icon,
  Clock01Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { RadialGridBackground } from '../../../components/backgrounds/radial-grid-background'
import { ParallaxLayer } from '../../../components/motion/parallax-layer'
import { Reveal } from '../../../components/motion/reveal'

export function PrivacySection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="privacy"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Subtle Radial Grid Background Parallax (-25px to 25px) */}
      <ParallaxLayer
        targetRef={sectionRef}
        speed={0.14}
        distance={25}
        className="absolute inset-0 pointer-events-none opacity-40"
        ariaHidden
        disabledOnMobile
      >
        <RadialGridBackground className="w-full h-full" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-[760px] mx-auto text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 05 • Security Architecture
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Private by default.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Your document library is associated with your authenticated account. Files are not exposed as public content unless you explicitly create a share link.
            </p>
          </Reveal>
        </div>

        {/* Editorial Security Architecture Diagram (Stationary) */}
        <div className="max-w-4xl mx-auto">
          <Reveal delay={0.16}>
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm space-y-8">
              {/* Architecture Flow */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Step 1: Authenticated Identity */}
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 flex flex-col justify-between text-left space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-background border border-border/60 text-foreground w-fit shadow-2xs">
                      <AppIcon icon={UserCheck01Icon} size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      1. Your Account
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Authenticated session via Google OAuth. Identity token is checked on every query.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border/50 text-[10px] font-mono text-muted-foreground">
                    RLS owner enforcement
                  </div>
                </div>

                {/* Arrow Connector (Desktop) */}
                <div className="hidden md:flex items-center justify-center -mx-4 z-20 text-muted-foreground/40 pointer-events-none">
                  <div className="w-full border-t border-dashed border-border" />
                </div>

                {/* Step 2: Scoped Private Storage */}
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 flex flex-col justify-between text-left space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-background border border-border/60 text-foreground w-fit shadow-2xs">
                      <AppIcon icon={LockKeyIcon} size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      2. Scoped Storage Space
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Objects are partitioned by user ID. No cross-tenant access or global public listings exist.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border/50 text-[10px] font-mono text-muted-foreground">
                    user_id/{'{space}'}/{'{id}'}
                  </div>
                </div>

                {/* Arrow Connector (Desktop) */}
                <div className="hidden md:flex items-center justify-center -mx-4 z-20 text-muted-foreground/40 pointer-events-none">
                  <div className="w-full border-t border-dashed border-border" />
                </div>

                {/* Step 3: Temporary Access */}
                <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 flex flex-col justify-between text-left space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-background border border-border/60 text-foreground w-fit shadow-2xs">
                      <AppIcon icon={Clock01Icon} size={20} />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      3. Temporary File Access
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Files are delivered through short-lived signed URLs. Raw storage URLs are never exposed.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border/50 text-[10px] font-mono text-muted-foreground">
                    5-minute time-bound signatures
                  </div>
                </div>
              </div>

              {/* 4 Architectural Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/60">
                <div className="text-left space-y-1">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <AppIcon icon={ShieldCheckIcon} size={14} className="text-emerald-500" />
                    Private Storage
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Zero public buckets. Bucket access rejected by default.
                  </p>
                </div>
                <div className="text-left space-y-1">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <AppIcon icon={UserCheck01Icon} size={14} className="text-emerald-500" />
                    Authenticated Access
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Every database record guarded by Row-Level Security policies.
                  </p>
                </div>
                <div className="text-left space-y-1">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <AppIcon icon={Clock01Icon} size={14} className="text-emerald-500" />
                    Temporary Signatures
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    File download links expire automatically after retrieval.
                  </p>
                </div>
                <div className="text-left space-y-1">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <AppIcon icon={Share01Icon} size={14} className="text-emerald-500" />
                    Explicit Sharing
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    A file is only shared when you create an expiring direct link.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
