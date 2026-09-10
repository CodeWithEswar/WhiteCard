import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight01Icon, ShieldCheckIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'
import { RadialGridBackground } from '../../../components/backgrounds/radial-grid-background'
import { ParallaxLayer } from '../../../components/motion/parallax-layer'
import { Reveal } from '../../../components/motion/reveal'

export function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Subtle Background Parallax */}
      <ParallaxLayer
        targetRef={sectionRef}
        speed={0.1}
        distance={20}
        className="absolute inset-0 pointer-events-none opacity-40"
        ariaHidden
        disabledOnMobile
      >
        <RadialGridBackground className="w-full h-full" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-xl">
            {/* Subtle glow */}
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 size-72 rounded-full bg-primary/15 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 space-y-3 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/50 text-xs font-medium text-muted-foreground">
                <AppIcon icon={ShieldCheckIcon} size={14} className="text-foreground" />
                <span>Private • Authenticated • Original Files</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                Keep the documents that matter in one place.
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Create your White Card and organize your government documents and student certificates from one account.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-center pt-2">
              <Button
                size="lg"
                render={<Link to="/auth" />}
                className="w-full sm:w-auto h-11 px-7 rounded-xl font-semibold text-sm gap-2 shadow-xs"
              >
                <span>Get Started with Google</span>
                <AppIcon icon={ArrowRight01Icon} size={16} />
              </Button>
            </div>

            <div className="pt-2 text-[11px] text-muted-foreground">
              Zero OCR extraction • Scoped object storage • Free personal vault
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
