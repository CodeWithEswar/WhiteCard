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

export function SharingSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="sharing"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Subtle Dot Background Parallax (-20px to 20px) */}
      <ParallaxLayer
        targetRef={sectionRef}
        speed={0.1}
        distance={20}
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
              Section 07 • Granular Sharing Controls
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Share only when you choose to.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Create a direct document link when you need it, copy it, and revoke it when access is no longer required.
            </p>
          </Reveal>
        </div>

        {/* Static UI Mockup & Principles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Static UI Mockup (6 cols) */}
          <div className="lg:col-span-6">
            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xl space-y-5 text-left">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-primary/10 text-primary">
                      <AppIcon icon={Link01Icon} size={16} />
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      Share Document
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Active Link
                  </span>
                </div>

                {/* Direct Link Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Direct Link
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted/50 border border-border/70 rounded-xl px-3 py-2 text-xs font-mono text-muted-foreground truncate">
                      https://whitecard-in.vercel.app/share/e4f7a912b…
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
                  <p className="text-[11px] text-muted-foreground">
                    Only recipients with this cryptographically signed link can view.
                  </p>
                </div>

                {/* Expiration Selector */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <AppIcon icon={Calendar03Icon} size={13} className="text-muted-foreground" />
                    Expires in
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      className="py-1.5 px-3 rounded-xl border border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted text-center"
                    >
                      24 Hours
                    </button>
                    <button
                      type="button"
                      className="py-1.5 px-3 rounded-xl border border-primary bg-primary/10 text-xs font-semibold text-primary text-center"
                    >
                      7 Days
                    </button>
                    <button
                      type="button"
                      className="py-1.5 px-3 rounded-xl border border-border/60 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted text-center"
                    >
                      30 Days
                    </button>
                  </div>
                </div>

                {/* Revoke Action */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Created today • 0 downloads
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/10 gap-1.5"
                  >
                    <AppIcon icon={Delete02Icon} size={13} />
                    <span>Revoke link</span>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sharing Trust Principles (6 cols) */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <Reveal delay={0.2}>
              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-border/70 bg-card">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <AppIcon icon={ShieldCheckIcon} size={18} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground">
                      Links are strictly explicit
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Files are private by default. Nothing is published or searchable online unless you generate a direct share link.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-border/70 bg-card">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <AppIcon icon={Calendar03Icon} size={18} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground">
                      Automatic expiration windows
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Choose between 24-hour, 7-day, or 30-day lifespans. Expired links immediately reject new download requests.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-border/70 bg-card">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <AppIcon icon={Delete02Icon} size={18} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground">
                      Instant one-click revocation
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Cancel access anytime with immediate effect. The underlying file remains safe in your private space.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
