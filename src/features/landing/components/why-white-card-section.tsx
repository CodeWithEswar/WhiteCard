import { useRef } from 'react'
import {
  GoogleIcon,
  Folder01Icon,
  Upload01Icon,
  Tag01Icon,
  CheckmarkBadge01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { DotBackground } from '../../../components/backgrounds/dot-background'
import { ParallaxLayer } from '../../../components/motion/parallax-layer'
import { Reveal } from '../../../components/motion/reveal'

const steps = [
  {
    num: '01',
    title: 'Sign in',
    desc: 'Instant Google sign-in without creating a new password',
    icon: GoogleIcon,
  },
  {
    num: '02',
    title: 'Choose a space',
    desc: 'Keep Government and Student files isolated',
    icon: Folder01Icon,
  },
  {
    num: '03',
    title: 'Upload',
    desc: 'Store original PDFs, images, archives and spreadsheets',
    icon: Upload01Icon,
  },
  {
    num: '04',
    title: 'Organize',
    desc: 'Assign color tags, expiration dates and metadata',
    icon: Tag01Icon,
  },
  {
    num: '05',
    title: 'Access',
    desc: 'Search, preview, download or create direct share links',
    icon: CheckmarkBadge01Icon,
  },
] as const

export function WhyWhiteCardSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="product"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background Parallax Layer: Soft Dot Background (y: 20 -> -20) */}
      <ParallaxLayer
        targetRef={sectionRef}
        speed={0.12}
        distance={20}
        className="absolute inset-0 pointer-events-none opacity-50"
        ariaHidden
        disabledOnMobile
      >
        <DotBackground className="w-full h-full" />
      </ParallaxLayer>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Stationary Readable Copy Header */}
        <div className="max-w-[760px] mx-auto text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Why White Card
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Important documents should not be scattered everywhere.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              White Card creates one organized place for the documents you need to keep, access, and share without turning document management into a complex system.
            </p>
          </Reveal>
        </div>

        {/* 5-Step Clear Sequence (Stationary content, clean reveal) */}
        <Reveal delay={0.18}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((step, idx) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-border/70 bg-card p-5 shadow-xs flex flex-col justify-between hover:border-border transition-colors text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      {step.num}
                    </span>
                    <div className="p-2 rounded-md bg-muted text-foreground">
                      <AppIcon icon={step.icon} size={16} />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-foreground tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-muted-foreground/40 pointer-events-none">
                    <AppIcon icon={ArrowRight01Icon} size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
