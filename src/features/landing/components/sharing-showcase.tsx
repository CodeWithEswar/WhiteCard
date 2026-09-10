import { useRef } from 'react'
import {
  Link01Icon,
  Copy01Icon,
  Calendar03Icon,
  Delete02Icon,
  ShieldCheckIcon,
  EyeIcon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { DotBackground } from '../../../components/backgrounds/dot-background'
import { ParallaxLayer } from '../../../components/motion/parallax-layer'
import { Reveal } from '../../../components/motion/reveal'
import { Button } from '../../../components/ui/button'

const trustDetails = [
  {
    title: 'Direct links are explicit',
    desc: 'Nothing is shared unless you purposefully generate a standalone link for a specific document.',
    icon: Link01Icon,
  },
  {
    title: 'Links can expire',
    desc: 'Choose a lifespan of 24 hours, 7 days, or 30 days. Links stop working automatically once expired.',
    icon: Calendar03Icon,
  },
  {
    title: 'Links can be revoked',
    desc: 'Cancel active links at any moment with one click, immediately terminating recipient access.',
    icon: Delete02Icon,
  },
  {
    title: 'Your private library remains separate',
    desc: 'Recipients only see the shared document file — never your other vault documents, tags, or personal account details.',
    icon: ShieldCheckIcon,
  },
] as const

export function SharingShowcase() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="sharing"
      className="relative py-24 sm:py-32 overflow-hidden bg-muted/10 border-y border-border/70"
    >
      {/* Subtle Dot Background Parallax */}
      <ParallaxLayer
        targetRef={sectionRef}
        speed={0.1}
        distance={16}
        className="absolute inset-0 pointer-events-none opacity-40"
        ariaHidden
        disabledOnMobile
      >
        <DotBackground className="w-full h-full" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-[760px] mx-auto text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 08 • Direct Sharing
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Share only when you choose to.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Create a direct document link when access is needed, copy it, choose an expiry, and revoke it later.
            </p>
          </Reveal>
        </div>

        {/* Static UI Preview & 4 Trust Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Static Product UI Preview (6 cols) */}
          <div className="lg:col-span-6">
            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xl space-y-5 text-left">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
                      <AppIcon icon={Link01Icon} size={16} />
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      Share document
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Active link
                  </span>
                </div>

                {/* Direct Link Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Direct link
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1 bg-muted/50 border border-border/70 rounded-xl px-3 py-2 text-xs font-mono text-muted-foreground truncate">
                      whitecard-in.vercel.app/share/e4f7a912b…
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-9 px-3 gap-1.5 rounded-xl text-xs font-medium shrink-0"
                    >
                      <AppIcon icon={Copy01Icon} size={14} />
                      <span>Copy</span>
                    </Button>
                  </div>
                </div>

                {/* Expiry Selector Mock */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Expires in
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-xl border border-border/60 bg-muted/20 text-center text-xs font-medium text-muted-foreground">
                      24 hours
                    </div>
                    <div className="p-2 rounded-xl border border-primary bg-primary/10 text-center text-xs font-semibold text-primary">
                      7 days
                    </div>
                    <div className="p-2 rounded-xl border border-border/60 bg-muted/20 text-center text-xs font-medium text-muted-foreground">
                      30 days
                    </div>
                  </div>
                </div>

                {/* Revoke Action */}
                <div className="pt-2 border-t border-border/60 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground font-mono truncate">
                    Created today • 0 views
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs text-foreground border-border/80 hover:bg-muted rounded-xl gap-1.5 shrink-0"
                  >
                    <AppIcon icon={Delete02Icon} size={13} />
                    <span>Revoke link</span>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* 4 Trust Details (6 cols) */}
          <div className="lg:col-span-6 space-y-3.5 text-left">
            {trustDetails.map((detail, idx) => (
              <Reveal key={detail.title} delay={0.18 + idx * 0.05}>
                <div className="p-4 rounded-2xl border border-border/70 bg-card flex items-start gap-3.5 shadow-2xs hover:border-border transition-colors">
                  <div className="p-2 rounded-xl bg-muted text-foreground shrink-0 mt-0.5">
                    <AppIcon icon={detail.icon} size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground tracking-tight">
                      {detail.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {detail.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
