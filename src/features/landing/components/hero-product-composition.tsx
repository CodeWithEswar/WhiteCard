import { useRef } from 'react'
import {
  Passport01Icon,
  Certificate01Icon,
  Pdf01Icon,
  Search01Icon,
  Share01Icon,
  Download01Icon,
  Tick02Icon,
  File02Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { ParallaxLayer } from '../../../components/motion/parallax-layer'

export function HeroProductComposition() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto mt-12 sm:mt-16 px-2 sm:px-4"
    >
      {/* Background ambient glow behind composition */}
      <div className="absolute inset-x-1/4 -top-8 h-48 bg-primary/10 blur-3xl pointer-events-none rounded-full" />

      {/* Parallax Layer 1: Ambient micro-grid frame (speed 0.10) */}
      <ParallaxLayer
        targetRef={containerRef}
        speed={0.1}
        distance={20}
        className="absolute inset-0 pointer-events-none rounded-3xl border border-border/40 pattern-grid-micro opacity-40"
        ariaHidden
        disabledOnMobile
      />

      {/* Main Composition Surface */}
      <div className="relative rounded-2xl border border-border/80 bg-background/90 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Top Product Chrome */}
        <div className="flex items-center justify-between border-b border-border/70 px-4 sm:px-6 py-3 bg-muted/40">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-red-500/60" />
            <div className="size-3 rounded-full bg-amber-500/60" />
            <div className="size-3 rounded-full bg-emerald-500/60" />
            <span className="ml-3 text-[11px] font-mono text-muted-foreground hidden sm:inline">
              whitecard-in.vercel.app
            </span>
          </div>

          {/* Search Bar Simulation */}
          <div className="flex items-center gap-2 bg-background/80 border border-border/60 rounded-xl px-3 py-1.5 text-xs text-muted-foreground w-44 sm:w-64">
            <AppIcon icon={Search01Icon} size={14} />
            <span className="truncate">Search documents or tags…</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
              Authenticated
            </span>
          </div>
        </div>

        {/* Space Tabs & Tag Pills */}
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
            {/* Space selector pills */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs">
                <AppIcon icon={Passport01Icon} size={15} />
                <span>Government Documents</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-primary-foreground/20 text-[10px]">
                  6
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground text-xs font-medium transition-colors">
                <AppIcon icon={Certificate01Icon} size={15} />
                <span className="hidden xs:inline">Student Certificates</span>
                <span className="xs:hidden">Student</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-background text-[10px]">
                  4
                </span>
              </div>
            </div>

            {/* Tag Pills */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Identity
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                Academic
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Travel
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Vehicle
              </span>
            </div>
          </div>

          {/* Parallax Layer 2: Grid of Document Cards (speed 0.08) */}
          <ParallaxLayer
            targetRef={containerRef}
            speed={0.08}
            distance={16}
            disabledOnMobile
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1: Identity Document */}
              <div className="group rounded-xl border border-border/70 bg-card p-4 hover:border-border transition-all shadow-xs space-y-3 text-left">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                    <AppIcon icon={Pdf01Icon} size={20} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    PDF • 1.8 MB
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground truncate">
                    Identity Document.pdf
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Government Space • Verified
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    <AppIcon icon={Tick02Icon} size={12} className="text-emerald-500" />
                    Original
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AppIcon icon={Download01Icon} size={13} />
                    <AppIcon icon={Share01Icon} size={13} />
                  </div>
                </div>
              </div>

              {/* Card 2: Degree Certificate */}
              <div className="group rounded-xl border border-border/70 bg-card p-4 hover:border-border transition-all shadow-xs space-y-3 text-left">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                    <AppIcon icon={Pdf01Icon} size={20} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    PDF • 3.2 MB
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground truncate">
                    Degree Certificate.pdf
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Student Space • Academic
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    <AppIcon icon={Tick02Icon} size={12} className="text-emerald-500" />
                    Original
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AppIcon icon={Download01Icon} size={13} />
                    <AppIcon icon={Share01Icon} size={13} />
                  </div>
                </div>
              </div>

              {/* Card 3: Insurance Record */}
              <div className="group rounded-xl border border-border/70 bg-card p-4 hover:border-border transition-all shadow-xs space-y-3 text-left">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                    <AppIcon icon={Pdf01Icon} size={20} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    PDF • 840 KB
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground truncate">
                    Insurance.pdf
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Government Space • Vehicle
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    <AppIcon icon={Tick02Icon} size={12} className="text-emerald-500" />
                    Original
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AppIcon icon={Download01Icon} size={13} />
                    <AppIcon icon={Share01Icon} size={13} />
                  </div>
                </div>
              </div>

              {/* Card 4: Semester Records.zip */}
              <div className="group rounded-xl border border-border/70 bg-card p-4 hover:border-border transition-all shadow-xs space-y-3 text-left">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <AppIcon icon={File02Icon} size={20} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    ZIP • 14.6 MB
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground truncate">
                    Semester Records.zip
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Student Space • Archive
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px]">
                  <span className="text-muted-foreground inline-flex items-center gap-1">
                    <AppIcon icon={Tick02Icon} size={12} className="text-emerald-500" />
                    Archive
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AppIcon icon={Download01Icon} size={13} />
                    <AppIcon icon={Share01Icon} size={13} />
                  </div>
                </div>
              </div>
            </div>
          </ParallaxLayer>

          {/* Parallax Layer 3: Foreground Trust Bar (speed 0.04) */}
          <ParallaxLayer
            targetRef={containerRef}
            speed={0.04}
            distance={8}
            disabledOnMobile
          >
            <div className="rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Original files preserved without modification
              </span>
              <span className="font-mono">
                No OCR extraction • Scoped storage
              </span>
            </div>
          </ParallaxLayer>
        </div>
      </div>
    </div>
  )
}
