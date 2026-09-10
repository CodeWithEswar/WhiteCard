import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight01Icon, GoogleIcon } from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'
import { RadialGridBackground } from '../../../components/backgrounds/radial-grid-background'
import { ThemeGlow } from '../../../components/backgrounds/theme-glow'
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
            {/* Subtle theme-aware atmospheric glow */}
            <ThemeGlow position="top" opacity="opacity-40" />

            <div className="relative z-10 space-y-3 max-w-xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                Keep the documents that matter in one place.
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Create your White Card and organize government documents and student certificates from one account.
              </p>
            </div>

            {/* CTAs: Primary + Secondary */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                render={<Link to="/signup" />}
                className="w-full sm:w-auto h-11 px-7 rounded-xl font-semibold text-sm gap-2 shadow-xs"
              >
                <span>Create your White Card</span>
                <AppIcon icon={ArrowRight01Icon} size={16} />
              </Button>

              <Button
                variant="outline"
                size="lg"
                render={<Link to="/login" />}
                className="w-full sm:w-auto h-11 px-6 rounded-xl font-medium text-sm border-border/80 hover:bg-muted text-foreground"
              >
                <span>Sign in</span>
              </Button>
            </div>

            {/* Factual Trust Line */}
            <div className="relative z-10 pt-2 text-xs text-muted-foreground flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap font-medium text-center">
              <span className="flex items-center gap-1.5">
                <AppIcon icon={GoogleIcon} size={13} />
                Google sign-in
              </span>
              <span className="text-border">•</span>
              <span>No separate White Card password</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
