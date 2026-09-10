import { useRef } from 'react'
import {
  Passport01Icon,
  Certificate01Icon,
  CheckmarkCircle01Icon,
  File01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { ParallaxLayer } from '../../../components/motion/parallax-layer'
import { Reveal } from '../../../components/motion/reveal'
import { Link } from 'react-router-dom'

const governmentExamples = [
  'Identity records & National IDs',
  'Passport & Travel documentation',
  'Driving licence & Permits',
  'Vehicle registration & Titles',
  'Insurance policies & Health cards',
  'Tax filings & Revenue receipts',
]

const studentExamples = [
  'Marksheets & Term grade cards',
  'Undergraduate & Postgraduate degrees',
  'Official university transcripts',
  'Professional course certificates',
  'Student ID cards & Enrollments',
  'Achievement certificates & Awards',
]

export function SpacesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="spaces"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-[760px] mx-auto text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 03 • Dual Vault Architecture
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Two dedicated document spaces.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Organize your personal library into two clean, purpose-built spaces without clutter or category crossover.
            </p>
          </Reveal>
        </div>

        {/* Two Large Surfaces (Desktop 2 cols, Tablet 2 cols, Mobile stacked) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Surface 1: Government Documents */}
          <Reveal delay={0.15}>
            <div className="relative rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs flex flex-col justify-between h-full overflow-hidden">
              {/* Subtle top accent line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500/60 via-indigo-500/60 to-transparent" />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <AppIcon icon={Passport01Icon} size={24} />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                    Vault Space 01
                  </span>
                </div>

                <div className="space-y-2 text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                    Government Documents
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Keep official records together without mixing them with academic files.
                  </p>
                </div>

                {/* Parallax Decorative Preview (y: 18 -> -18) */}
                <ParallaxLayer
                  targetRef={sectionRef}
                  speed={0.1}
                  distance={18}
                  disabledOnMobile
                  className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-2.5 text-left"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border/50 text-xs font-semibold text-foreground">
                    <span>Included Document Types</span>
                    <span className="text-[10px] font-mono text-muted-foreground">Encrypted Storage</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    {governmentExamples.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <AppIcon icon={CheckmarkCircle01Icon} size={14} className="text-blue-500 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </ParallaxLayer>
              </div>

              <div className="pt-6 border-t border-border/60 mt-6 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Original PDFs, scans & images
                </span>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span>Explore Space</span>
                  <AppIcon icon={ArrowRight01Icon} size={14} />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Surface 2: Student Certificates */}
          <Reveal delay={0.22}>
            <div className="relative rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs flex flex-col justify-between h-full overflow-hidden">
              {/* Subtle top accent line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/60 via-teal-500/60 to-transparent" />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <AppIcon icon={Certificate01Icon} size={24} />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                    Vault Space 02
                  </span>
                </div>

                <div className="space-y-2 text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                    Student Certificates
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Keep academic documents and certificates organized throughout your education.
                  </p>
                </div>

                {/* Parallax Decorative Preview (y: -14 -> 14) */}
                <ParallaxLayer
                  targetRef={sectionRef}
                  speed={0.08}
                  distance={-14}
                  disabledOnMobile
                  className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-2.5 text-left"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border/50 text-xs font-semibold text-foreground">
                    <span>Academic Records</span>
                    <span className="text-[10px] font-mono text-muted-foreground">Encrypted Storage</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    {studentExamples.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <AppIcon icon={CheckmarkCircle01Icon} size={14} className="text-emerald-500 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </ParallaxLayer>
              </div>

              <div className="pt-6 border-t border-border/60 mt-6 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Degrees, marksheets & ZIP archives
                </span>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span>Explore Space</span>
                  <AppIcon icon={ArrowRight01Icon} size={14} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
