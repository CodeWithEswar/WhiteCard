import { useRef } from 'react'
import {
  LaptopIcon,
  TabletIcon,
  SmartPhone01Icon,
  Passport01Icon,
  Certificate01Icon,
  Pdf01Icon,
  Search01Icon,
  Folder01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { ThemeGlow } from '../../../components/backgrounds/theme-glow'
import { ParallaxLayer } from '../../../components/motion/parallax-layer'
import { Reveal } from '../../../components/motion/reveal'

export function ResponsivePreview() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="responsive"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Subtle Radial Glow Atmosphere */}
      <ThemeGlow position="center" opacity="opacity-40" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-[760px] mx-auto text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 10 • Responsive Experience
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Built to feel natural on every screen.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              White Card adapts purposefully to each device form-factor with dedicated ergonomics: an expansive desktop workspace, a focused tablet rail, and an accessible mobile thumb dock.
            </p>
          </Reveal>
        </div>

        {/* Multi-Device Compositions with Restrained Parallax */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Desktop Frame (7 cols) - Parallax y: 20 -> -20 */}
          <div className="lg:col-span-7">
            <ParallaxLayer
              targetRef={sectionRef}
              speed={0.1}
              distance={20}
              disabledOnMobile
            >
              <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-xl space-y-3 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <AppIcon icon={LaptopIcon} size={15} className="text-foreground" />
                    <span className="font-semibold text-foreground">Desktop Layout</span>
                  </div>
                  <span className="hidden sm:inline text-[10px] font-mono">Sidebar + Topbar + Canvas</span>
                </div>

                {/* Simulated Desktop Interface */}
                <div className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden flex h-48 sm:h-52">
                  {/* Left Sidebar */}
                  <div className="w-24 sm:w-36 border-r border-border/60 p-2 sm:p-3 bg-muted/40 space-y-2 shrink-0">
                    <div className="h-2 w-12 sm:w-16 rounded bg-primary/40 mb-2 sm:mb-3" />
                    <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1.5 rounded-xl bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-semibold">
                      <AppIcon icon={Passport01Icon} size={11} className="shrink-0" />
                      <span className="truncate">Government</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1.5 rounded-xl text-muted-foreground text-[9px] sm:text-[10px] font-medium">
                      <AppIcon icon={Certificate01Icon} size={11} className="shrink-0" />
                      <span className="truncate">Student</span>
                    </div>
                    <div className="h-px bg-border/50 my-1.5 sm:my-2" />
                    <div className="h-1.5 w-10 sm:w-12 rounded bg-muted-foreground/30" />
                    <div className="h-1.5 w-14 sm:w-20 rounded bg-muted-foreground/30" />
                  </div>

                  {/* Main Canvas Area */}
                  <div className="flex-1 p-2.5 sm:p-3 space-y-2 overflow-hidden min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-16 sm:w-24 rounded bg-muted-foreground/40" />
                      <div className="h-4 sm:h-5 w-14 sm:w-20 rounded bg-muted border border-border/60" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div className="p-2 sm:p-2.5 rounded-xl border border-border/60 bg-card space-y-1.5 sm:space-y-2 shadow-2xs">
                        <div className="p-1 rounded bg-muted text-foreground w-fit">
                          <AppIcon icon={Pdf01Icon} size={12} />
                        </div>
                        <div className="h-1.5 w-16 rounded bg-foreground/60" />
                        <div className="h-1 w-10 rounded bg-muted-foreground/40" />
                      </div>
                      <div className="hidden sm:block p-2.5 rounded-xl border border-border/60 bg-card space-y-2 shadow-2xs">
                        <div className="p-1 rounded bg-muted text-foreground w-fit">
                          <AppIcon icon={Pdf01Icon} size={12} />
                        </div>
                        <div className="h-1.5 w-20 rounded bg-foreground/60" />
                        <div className="h-1 w-12 rounded bg-muted-foreground/40" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ParallaxLayer>
          </div>

          {/* Right Column: Tablet (y 12 -> -12) + Mobile (y -10 -> 10) (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tablet Mockup - Parallax y: 12 -> -12 */}
            <ParallaxLayer
              targetRef={sectionRef}
              speed={0.06}
              distance={12}
              disabledOnMobile
            >
              <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-lg space-y-2.5 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <AppIcon icon={TabletIcon} size={15} className="text-foreground" />
                    <span className="font-semibold text-foreground">Tablet Layout</span>
                  </div>
                  <span className="text-[10px] font-mono">Compact Icon Rail</span>
                </div>

                {/* Simulated Tablet UI */}
                <div className="rounded-xl border border-border/60 bg-muted/20 flex h-24 overflow-hidden">
                  <div className="w-11 border-r border-border/60 p-2 bg-muted/40 flex flex-col items-center gap-2 shrink-0">
                    <div className="size-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                      <AppIcon icon={Passport01Icon} size={11} />
                    </div>
                    <div className="size-5 rounded-md bg-muted text-muted-foreground flex items-center justify-center">
                      <AppIcon icon={Certificate01Icon} size={11} />
                    </div>
                  </div>
                  <div className="flex-1 p-2.5 space-y-2">
                    <div className="h-1.5 w-16 rounded bg-muted-foreground/40" />
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-card border border-border/60 text-[9px] font-mono">
                        Passport.pdf
                      </div>
                      <div className="p-1 rounded bg-card border border-border/60 text-[9px] font-mono">
                        Degree.pdf
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ParallaxLayer>

            {/* Mobile Mockup - Parallax y: -10 -> 10 */}
            <ParallaxLayer
              targetRef={sectionRef}
              speed={-0.05}
              distance={10}
              disabledOnMobile
            >
              <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-lg space-y-2.5 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <AppIcon icon={SmartPhone01Icon} size={15} className="text-foreground" />
                    <span className="font-semibold text-foreground">Mobile Phone Layout</span>
                  </div>
                  <span className="text-[10px] font-mono">Bottom Thumb Dock</span>
                </div>

                {/* Simulated Mobile UI */}
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-3 space-y-2.5 relative">
                  <div className="flex items-center justify-between">
                    <div className="h-2 w-14 rounded bg-foreground/60" />
                    <div className="size-4 rounded-full bg-muted border border-border/60" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="p-1.5 rounded-lg border border-border/60 bg-card flex items-center justify-between text-[10px]">
                      <span className="font-medium truncate">Identity_Doc.pdf</span>
                      <span className="text-muted-foreground font-mono">2.4 MB</span>
                    </div>
                    <div className="p-1.5 rounded-lg border border-border/60 bg-card flex items-center justify-between text-[10px]">
                      <span className="font-medium truncate">Degree_Cert.pdf</span>
                      <span className="text-muted-foreground font-mono">3.8 MB</span>
                    </div>
                  </div>

                  {/* Mobile Bottom Dock */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-around text-[10px] text-muted-foreground">
                    <span className="text-primary font-bold">Government</span>
                    <span>Student</span>
                    <span>Search</span>
                  </div>
                </div>
              </div>
            </ParallaxLayer>
          </div>
        </div>
      </div>
    </section>
  )
}
