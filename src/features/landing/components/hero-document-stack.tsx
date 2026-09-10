import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Pdf01Icon,
  Image01Icon,
  Zip01Icon,
  Shield01Icon,
  Tick02Icon,
  LockKeyIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '../../../components/icons/app-icon'
import { TagChip } from '../../tags/components/tag-chip'
import { useAppReducedMotion } from '../../../lib/motion'

export function HeroDocumentStack() {
  const reduceMotion = useAppReducedMotion()
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMouseOffset({ x: x * 14, y: y * 14 })
  }

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 })
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[540px] mx-auto py-8 sm:py-12 select-none"
    >
      {/* Subtle Glow behind stack */}
      <div
        className="absolute inset-0 -top-10 bg-accent/15 blur-3xl rounded-full opacity-40 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative space-y-3 sm:space-y-4">
        {/* Layer 1: Top Floating Zip Archive */}
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                x: mouseOffset.x * 0.4,
                y: mouseOffset.y * 0.4,
              }
          }
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="ml-auto w-11/12 p-3.5 sm:p-4 rounded-2xl border border-border/80 bg-surface/85 backdrop-blur-xl shadow-md flex items-center justify-between"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-xl bg-surface-muted border border-border flex items-center justify-center text-foreground shrink-0">
              <AppIcon icon={Zip01Icon} size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                Semester-6-Marks-Archive.zip
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">
                14.2 MB • Verified Checksum
              </p>
            </div>
          </div>
          <TagChip label="Education" variant="compact" />
        </motion.div>

        {/* Layer 2: Main Highlight Passport Card (Centerpiece) */}
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                x: mouseOffset.x * 0.8,
                y: mouseOffset.y * 0.8,
              }
          }
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative z-20 w-full p-4 sm:p-5 rounded-2xl border border-border bg-surface shadow-xl flex flex-col gap-3.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                <AppIcon icon={Shield01Icon} size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Government Vault
                </span>
                <h4 className="text-sm font-bold text-foreground">
                  Passport_Republic_of_India.pdf
                </h4>
              </div>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              2.3 MB
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <div className="flex items-center gap-1.5">
              <TagChip label="Identity" variant="compact" />
              <TagChip label="Travel" variant="compact" />
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <AppIcon icon={Tick02Icon} size={13} />
              Encrypted & Ready
            </span>
          </div>
        </motion.div>

        {/* Layer 3: Degree Certificate with Upload Progress Simulator */}
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                x: mouseOffset.x * 0.5,
                y: mouseOffset.y * 0.5,
              }
          }
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-11/12 p-3.5 sm:p-4 rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-xl shadow-md space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-8 rounded-xl bg-surface-muted border border-border flex items-center justify-center text-foreground shrink-0">
                <AppIcon icon={Pdf01Icon} size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  Bachelor_of_Technology_Degree.pdf
                </p>
                <p className="text-[10.5px] text-muted-foreground">
                  Student Certificates • 3.1 MB
                </p>
              </div>
            </div>
            <TagChip label="Education" variant="compact" />
          </div>

          {/* Upload Progress Simulation */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>Syncing to vault</span>
              <span className="text-primary font-bold">100%</span>
            </div>
            <div className="h-1 w-full bg-surface-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-full" />
            </div>
          </div>
        </motion.div>

        {/* Layer 4: National Identification Bottom Tab */}
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                x: mouseOffset.x * 0.25,
                y: mouseOffset.y * 0.25,
              }
          }
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="ml-auto w-10/12 p-3 px-4 rounded-xl border border-border/60 bg-surface-muted/60 text-xs text-muted-foreground flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AppIcon icon={Image01Icon} size={15} />
            <span className="truncate font-medium text-foreground">
              Smart_Card_Driving_Licence.png
            </span>
          </div>
          <span className="flex items-center gap-1 font-mono text-[10px]">
            <AppIcon icon={LockKeyIcon} size={12} />
            Private
          </span>
        </motion.div>
      </div>
    </div>
  )
}
