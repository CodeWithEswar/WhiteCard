import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import {
  Passport01Icon,
  Certificate01Icon,
  Pdf01Icon,
  Search01Icon,
  Zip01Icon,
  File01Icon,
  Shield01Icon,
  CheckmarkCircle01Icon,
  LockKeyIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { motionEase } from '../../../lib/motion'

export function HeroDocumentStack() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Suggested motion ranges:
  // grid: 20px total travel
  // back visual layer: 30px total travel
  // front document layer: 16px total travel
  const gridY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [10, -10])
  const backLayerY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [15, -15])
  const frontLayerY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [8, -8])

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto mt-8 sm:mt-14 px-1 sm:px-4 select-none"
    >
      {/* Decorative Grid Layer with Parallax */}
      <motion.div
        style={{ y: gridY }}
        className="absolute -inset-4 sm:-inset-6 pointer-events-none rounded-3xl border border-border/30 pattern-grid-micro opacity-40"
        aria-hidden="true"
      />

      {/* Back Visual Atmosphere Layer with Parallax */}
      <motion.div
        style={{ y: backLayerY }}
        className="absolute inset-x-1/4 -top-8 h-44 bg-primary/10 blur-3xl pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* Main Vault Application Frame */}
      <motion.div
        style={{ y: frontLayerY }}
        className="relative rounded-2xl sm:rounded-3xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-xl overflow-hidden text-left"
      >
        {/* Top Product Window Chrome */}
        <div className="flex items-center justify-between border-b border-border/70 px-3 sm:px-6 py-2.5 sm:py-3 bg-muted/40 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="size-2 sm:size-2.5 rounded-full bg-red-500/60" />
            <div className="size-2 sm:size-2.5 rounded-full bg-amber-500/60" />
            <div className="size-2 sm:size-2.5 rounded-full bg-emerald-500/60" />
            <span className="ml-2 text-[11px] font-mono text-muted-foreground hidden sm:inline">
              whitecard-in.vercel.app
            </span>
          </div>

          {/* Responsive Search Field */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-background/80 border border-border/60 rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs text-muted-foreground flex-1 max-w-[190px] sm:max-w-none sm:w-72">
            <AppIcon icon={Search01Icon} size={13} className="text-muted-foreground shrink-0" />
            <span className="truncate hidden sm:inline">Search documents, tags, or dates…</span>
            <span className="truncate sm:hidden">Search documents…</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="size-1.5 sm:size-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline">
              Authenticated
            </span>
          </div>
        </div>

        {/* Space Navigation & Tag Filtering Header */}
        <div className="p-3 sm:p-6 space-y-3.5 sm:space-y-6">
          <div className="flex items-center justify-between gap-2 sm:gap-3 border-b border-border/50 pb-3 sm:pb-4">
            {/* Vault Spaces Switcher (Symmetrical & Responsive on Mobile) */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar max-w-full">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs shrink-0">
                <AppIcon icon={Passport01Icon} size={14} className="shrink-0" />
                <span className="hidden sm:inline">Government Documents</span>
                <span className="sm:hidden">Government</span>
                <span className="ml-0.5 sm:ml-1 px-1.5 py-0.2 rounded-full bg-primary-foreground/20 text-[10px]">
                  5
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground text-xs font-medium transition-colors shrink-0">
                <AppIcon icon={Certificate01Icon} size={14} className="shrink-0" />
                <span className="hidden sm:inline">Student Certificates</span>
                <span className="sm:hidden">Student</span>
                <span className="ml-0.5 sm:ml-1 px-1.5 py-0.2 rounded-full bg-background text-[10px]">
                  3
                </span>
              </div>
            </div>

            {/* Tags with Text (Desktop only) */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
                Identity
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium">
                Academic
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                Vehicle
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                Insurance
              </span>
            </div>
          </div>

          {/* Layered Document Rows Stack */}
          <div className="space-y-2.5 sm:space-y-3">
            {/* Front Layer: Identity Document.pdf */}
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.1, ease: motionEase }}
              className="group p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-border/80 bg-card hover:border-border transition-colors shadow-xs flex items-center justify-between gap-2.5 sm:gap-4"
            >
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                <div className="size-9 sm:size-10 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <AppIcon icon={Pdf01Icon} size={18} className="sm:hidden" />
                  <AppIcon icon={Pdf01Icon} size={20} className="hidden sm:block" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      Identity Document.pdf
                    </h3>
                    <span className="text-[9.5px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.2 rounded bg-muted text-muted-foreground hidden xs:inline">
                      Government
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 font-mono truncate">
                    2.4 MB • Issued 2023 • Expires 2033
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px] font-medium">
                  Identity
                </span>
                <span className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <AppIcon icon={CheckmarkCircle01Icon} size={14} />
                  <span className="hidden xs:inline">Verified</span>
                </span>
              </div>
            </motion.div>

            {/* Middle Layer 1: Degree Certificate.pdf */}
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16, ease: motionEase }}
              className="group p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-border/70 bg-card/90 hover:border-border transition-colors shadow-2xs flex items-center justify-between gap-2.5 sm:gap-4"
            >
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                <div className="size-9 sm:size-10 rounded-lg sm:rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <AppIcon icon={Pdf01Icon} size={18} className="sm:hidden" />
                  <AppIcon icon={Pdf01Icon} size={20} className="hidden sm:block" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      Degree Certificate.pdf
                    </h3>
                    <span className="text-[9.5px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.2 rounded bg-muted text-muted-foreground hidden xs:inline">
                      Student
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 font-mono truncate">
                    <span className="hidden sm:inline">3.8 MB • Bachelor of Technology • 2024</span>
                    <span className="sm:hidden">3.8 MB • B.Tech Degree • 2024</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[11px] font-medium">
                  Academic
                </span>
                <span className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] text-muted-foreground font-mono">
                  <AppIcon icon={LockKeyIcon} size={12} />
                  <span className="hidden xs:inline">Private</span>
                </span>
              </div>
            </motion.div>

            {/* Middle Layer 2: Insurance.pdf */}
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22, ease: motionEase }}
              className="group p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-border/70 bg-card/90 hover:border-border transition-colors shadow-2xs flex items-center justify-between gap-2.5 sm:gap-4"
            >
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                <div className="size-9 sm:size-10 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <AppIcon icon={Shield01Icon} size={18} className="sm:hidden" />
                  <AppIcon icon={Shield01Icon} size={20} className="hidden sm:block" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      Insurance.pdf
                    </h3>
                    <span className="text-[9.5px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.2 rounded bg-muted text-muted-foreground hidden xs:inline">
                      Government
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 font-mono truncate">
                    <span className="hidden sm:inline">1.2 MB • Comprehensive Policy • Active</span>
                    <span className="sm:hidden">1.2 MB • Comprehensive • Active</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
                  Insurance
                </span>
                <span className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] text-muted-foreground font-mono">
                  <AppIcon icon={LockKeyIcon} size={12} />
                  <span className="hidden xs:inline">Private</span>
                </span>
              </div>
            </motion.div>

            {/* Back Layer: Semester Records.zip */}
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.28, ease: motionEase }}
              className="group p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-border/60 bg-card/75 hover:border-border transition-colors shadow-2xs flex items-center justify-between gap-2.5 sm:gap-4"
            >
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                <div className="size-9 sm:size-10 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <AppIcon icon={Zip01Icon} size={18} className="sm:hidden" />
                  <AppIcon icon={Zip01Icon} size={20} className="hidden sm:block" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      Semester Records.zip
                    </h3>
                    <span className="text-[9.5px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.2 rounded bg-muted text-muted-foreground hidden xs:inline">
                      Student
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 font-mono truncate">
                    <span className="hidden sm:inline">14.6 MB • 8 Semesters Marksheets & Transcripts</span>
                    <span className="sm:hidden">14.6 MB • 8 Semesters • Records</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-medium">
                  Archive
                </span>
                <span className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] text-muted-foreground font-mono">
                  <AppIcon icon={LockKeyIcon} size={12} />
                  <span className="hidden xs:inline">Private</span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* Recent Document Status Row */}
          <div className="pt-2 sm:pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <AppIcon icon={File01Icon} size={13} className="shrink-0" />
              <span className="truncate hidden xs:inline">Original binary files preserved</span>
              <span className="truncate xs:hidden">Original files preserved</span>
            </div>
            <span className="font-mono text-[10px] sm:text-[11px] shrink-0 pl-2">4 of 8 items</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
