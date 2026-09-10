import { useRef } from 'react'
import {
  LaptopIcon,
  TabletIcon,
  SmartPhone01Icon,
  Search01Icon,
  Folder01Icon,
  Pdf01Icon,
  Passport01Icon,
  Certificate01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { RadialGridBackground } from '../../../components/backgrounds/radial-grid-background'
import { ParallaxLayer } from '../../../components/motion/parallax-layer'
import { Reveal } from '../../../components/motion/reveal'

export function ResponsiveSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="responsive"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Background Radial Grid */}
      <RadialGridBackground className="absolute inset-0 pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-[760px] mx-auto text-center space-y-4 mb-16">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section 10 • Cross-Platform Design
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Built to feel natural on every screen.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              White Card adapts gracefully to your device with tailored navigation paradigms: a full desktop sidebar, compact tablet rail, and ergonomic mobile bottom dock.
            </p>
          </Reveal>
        </div>

        {/* Multi-Device Compositions with Restrained Parallax */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Desktop Frame (7 cols) - Parallax y: 24 -> -24 */}
          <div className="lg:col-span-7">
            <ParallaxLayer
              targetRef={sectionRef}
              speed={0.12}
              distance={24}
              disabledOnMobile
            >
              <div className="rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-xl space-y-3 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <AppIcon icon={LaptopIcon} size={15} className="text-foreground" />
                    <span className="font-semibold text-foreground">Desktop Layout</span>
                  </div>
                  <span className="text-[10px] font-mono">Sidebar + Grid view</span>
                </div>

                {/* Simulated Desktop Interface */}
                <div className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden flex h-52">
                  {/* Left Sidebar */}
                  <div className="w-36 border-r border-border/60 p-3 bg-muted/40 space-y-2 shrink-0">
                    <div className="h-2 w-16 rounded bg-primary/40 mb-3" />
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-primary text-primary-foreground text-[10px] font-semibold">
                      <AppIcon icon={Passport01Icon} size={11} />
                      <span className="truncate">Government</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-muted-foreground text-[10px] font-medium">
                      <AppIcon icon={Certificate01Icon} size={11} />
                      <span className="truncate">Student</span>
                    </div>
                    <div className="h-px bg-border/50 my-2" />
                    <div className="h-1.5 w-12 rounded bg-muted-foreground/30" />
                    <div className="h-1.5 w-20 rounded bg-muted-foreground/30" />
                  </div>

                  {/* Main Grid Area */}
                  <div className="flex-1 p-3 space-y-2 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-24 rounded bg-muted-foreground/40" />
                      <div className="h-5 w-20 rounded bg-muted border border-border/60" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl border border-border/60 bg-card space-y-2 shadow-2xs">
                        <div className="p-1 rounded bg-red-500/10 text-red-500 w-fit">
                          <AppIcon icon={Pdf01Icon} size={12} />
                        </div>
                        <div className="h-1.5 w-16 rounded bg-foreground/60" />
                        <div className="h-1 w-10 rounded bg-muted-foreground/40" />
                      </div>
                      <div className="p-2.5 rounded-xl border border-border/60 bg-card space-y-2 shadow-2xs">
                        <div className="p-1 rounded bg-blue-500/10 text-blue-500 w-fit">
                          <AppIcon icon={Pdf01Icon} size={12} />
                        </div>
                        <div className="h-1.5 w-14 rounded bg-foreground/60" />
                        <div className="h-1 w-8 rounded bg-muted-foreground/40" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ParallaxLayer>
          </div>

          {/* Right Column: Tablet & Mobile Frames (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tablet Frame - Parallax y: 12 -> -12 */}
            <ParallaxLayer
              targetRef={sectionRef}
              speed={0.08}
              distance={12}
              disabledOnMobile
            >
              <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-md space-y-2.5 text-left">
                <div className="flex items-center justify-between pb-1.5 border-b border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <AppIcon icon={TabletIcon} size={14} className="text-foreground" />
                    <span className="font-semibold text-foreground">Tablet Rail</span>
                  </div>
                  <span className="text-[10px] font-mono">768px – 1024px</span>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/20 flex h-24 overflow-hidden">
                  {/* Compact Icon Rail */}
                  <div className="w-10 border-r border-border/60 p-2 bg-muted/40 flex flex-col items-center gap-2 shrink-0">
                    <div className="p-1 rounded bg-primary text-primary-foreground">
                      <AppIcon icon={Passport01Icon} size={12} />
                    </div>
                    <div className="p-1 rounded text-muted-foreground">
                      <AppIcon icon={Certificate01Icon} size={12} />
                    </div>
                  </div>
                  <div className="flex-1 p-2.5 space-y-1.5">
                    <div className="h-1.5 w-20 rounded bg-muted-foreground/40" />
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="h-11 rounded border border-border/50 bg-card p-1.5">
                        <div className="h-1 w-10 rounded bg-foreground/60" />
                      </div>
                      <div className="h-11 rounded border border-border/50 bg-card p-1.5">
                        <div className="h-1 w-8 rounded bg-foreground/60" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ParallaxLayer>

            {/* Mobile Frame - Parallax y: -10 -> 10 */}
            <ParallaxLayer
              targetRef={sectionRef}
              speed={0.06}
              distance={-10}
              disabledOnMobile
            >
              <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-md space-y-2.5 text-left">
                <div className="flex items-center justify-between pb-1.5 border-b border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <AppIcon icon={SmartPhone01Icon} size={14} className="text-foreground" />
                    <span className="font-semibold text-foreground">Mobile Bottom Dock</span>
                  </div>
                  <span className="text-[10px] font-mono">360px – 430px</span>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 space-y-2">
                  <div className="flex items-center justify-between bg-card p-2 rounded-xl border border-border/50 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-red-500/10 text-red-500">
                        <AppIcon icon={Pdf01Icon} size={12} />
                      </div>
                      <div className="h-1.5 w-24 rounded bg-foreground/70" />
                    </div>
                    <div className="h-1 w-6 rounded bg-muted-foreground/50" />
                  </div>

                  {/* Floating Bottom Nav Mockup */}
                  <div className="rounded-full bg-background border border-border/70 p-1.5 flex items-center justify-around shadow-xs">
                    <div className="p-1 rounded-full bg-primary text-primary-foreground">
                      <AppIcon icon={Passport01Icon} size={10} />
                    </div>
                    <div className="p-1 text-muted-foreground">
                      <AppIcon icon={Certificate01Icon} size={10} />
                    </div>
                    <div className="p-1 text-muted-foreground">
                      <AppIcon icon={Search01Icon} size={10} />
                    </div>
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
