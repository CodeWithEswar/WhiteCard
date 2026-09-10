import { useRef } from 'react'
import {
  GoogleIcon,
  ShieldCheckIcon,
  LockKeyIcon,
  Clock01Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  UserCheck01Icon,
  Link01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { RadialGridBackground } from '../../../components/backgrounds/radial-grid-background'
import { ParallaxLayer } from '../../../components/motion/parallax-layer'
import { Reveal } from '../../../components/motion/reveal'

const securityFlow = [
  {
    step: '1',
    title: 'Your Google account',
    desc: 'Direct authentication without a third-party password store',
    icon: GoogleIcon,
  },
  {
    step: '2',
    title: 'Your White Card',
    desc: 'Encrypted user session verifies identity on every request',
    icon: ShieldCheckIcon,
  },
  {
    step: '3',
    title: 'Private document storage',
    desc: 'Files are isolated in scoped private storage buckets',
    icon: LockKeyIcon,
  },
  {
    step: '4',
    title: 'Temporary access when needed',
    desc: 'Expiring pre-signed URLs deliver files without public directory exposure',
    icon: Clock01Icon,
  },
] as const

const securityPillars = [
  {
    title: 'Private storage',
    desc: 'Every file uploaded is stored in protected cloud storage restricted entirely to your authenticated account ID.',
    icon: LockKeyIcon,
  },
  {
    title: 'Authenticated access',
    desc: 'Documents and metadata can only be read by sessions authenticated through verified Google identity tokens.',
    icon: UserCheck01Icon,
  },
  {
    title: 'Temporary preview/download access',
    desc: 'Document downloads utilize short-lived signed URLs rather than permanently open public links.',
    icon: Clock01Icon,
  },
  {
    title: 'Explicit sharing',
    desc: 'No document is publicly accessible unless you explicitly generate an expiring share link from your dashboard.',
    icon: Link01Icon,
  },
] as const

export function SecuritySection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="security"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Subtle Radial Grid Background Parallax */}
      <ParallaxLayer
        targetRef={sectionRef}
        speed={0.12}
        distance={20}
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
              Section 07 • Privacy & Security
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Private by default.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Your document library is tied to your authenticated account. Files are stored privately and are not exposed as public content unless you explicitly choose to share them.
            </p>
          </Reveal>
        </div>

        {/* Security Visual Flow */}
        <div className="max-w-5xl mx-auto mb-14">
          <Reveal delay={0.16}>
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground text-left px-1">
                Access & Protection Flow
              </div>

              {/* 4-Step Flow */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {securityFlow.map((item, idx) => (
                  <div key={item.step} className="relative flex flex-col justify-between">
                    <div className="p-5 rounded-2xl border border-border/70 bg-muted/20 text-left space-y-3 h-full">
                      <div className="flex items-center justify-between">
                        <div className="size-10 rounded-xl bg-card border border-border/80 text-foreground flex items-center justify-center shadow-2xs">
                          <AppIcon icon={item.icon} size={18} />
                        </div>
                        <span className="text-xs font-mono font-bold text-muted-foreground">
                          0{item.step}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-foreground tracking-tight">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Thin Connector Line (Desktop) */}
                    {idx < securityFlow.length - 1 && (
                      <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 text-muted-foreground/40 pointer-events-none">
                        <AppIcon icon={ArrowRight01Icon} size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* 4 Human-Language Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {securityPillars.map((p) => (
            <Reveal key={p.title} delay={0.2}>
              <div className="h-full p-5 rounded-2xl border border-border/70 bg-card text-left space-y-2.5 shadow-2xs hover:border-border transition-colors">
                <div className="p-2 rounded-xl bg-muted text-foreground w-fit">
                  <AppIcon icon={p.icon} size={16} />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground tracking-tight">
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Technical Trust Note */}
        <Reveal delay={0.24} className="max-w-3xl mx-auto mt-12">
          <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-muted/25 text-center text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Technical Architecture Note: </span>
            White Card uses private storage and temporary access URLs rather than permanently public file links. Access is enforced by database row-level security and signed storage tokens.
          </div>
        </Reveal>
      </div>
    </section>
  )
}
