import { motion } from 'framer-motion'
import {
  Passport01Icon,
  Certificate01Icon,
  ArrowRight01Icon,
  File01Icon,
} from '@hugeicons/core-free-icons'
import type { DocumentSpace, VaultDocument } from '../../../types/document'
import { AppIcon } from '../../../components/icons/app-icon'
import { useAppReducedMotion } from '../../../lib/motion'

interface SpaceCardProps {
  space: DocumentSpace
  count: number
  latestDoc?: VaultDocument
  documents: VaultDocument[]
  onClick: () => void
}

export function SpaceCard({
  space,
  count,
  latestDoc,
  documents,
  onClick,
}: SpaceCardProps) {
  const reduceMotion = useAppReducedMotion()
  const isGov = space === 'government'

  const title = isGov ? 'Government Documents' : 'Student Certificates'
  const subtitle = isGov
    ? 'Official identity cards, licences, passports & insurance policies'
    : 'Academic degree certificates, marksheets & semester transcripts'
  const icon = isGov ? Passport01Icon : Certificate01Icon

  return (
    <motion.div
      whileHover={reduceMotion ? {} : { y: -2 }}
      whileTap={reduceMotion ? {} : { scale: 0.985 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-md border transition-all text-left select-none cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring overflow-hidden ${
        isGov
          ? 'border-border/90 bg-surface hover:border-border-strong hover:bg-surface-elevated/40'
          : 'border-border/80 bg-surface/90 hover:border-border-strong hover:bg-surface-elevated/40'
      }`}
    >
      {/* Background Micro Grid */}
      <div
        className="absolute inset-0 pointer-events-none pattern-grid-micro mask-radial opacity-30"
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Top bar with Space Icon & Count Pill */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div
            className={`size-12 rounded-md border flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
              isGov
                ? 'border-border bg-surface-muted/90 text-foreground'
                : 'border-border bg-surface-muted/90 text-foreground'
            }`}
          >
            <AppIcon icon={icon} size={24} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-surface-muted border border-border text-muted-foreground">
              {count} {count === 1 ? 'file' : 'files'}
            </span>
            <div className="size-8 rounded-md border border-border/80 bg-surface flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all">
              <AppIcon icon={ArrowRight01Icon} size={15} />
            </div>
          </div>
        </div>

        {/* Space Title & Subtitle */}
        <div className="space-y-1.5">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Mini Document Preview Stack */}
      <div className="relative z-10 pt-6 mt-6 border-t border-border/60">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium text-foreground flex items-center gap-1.5">
            <AppIcon icon={File01Icon} size={14} className="text-muted-foreground" />
            {latestDoc ? latestDoc.title : 'No files stored yet'}
          </span>
          {latestDoc && (
            <span className="font-mono text-[11px] text-muted-foreground/80">
              {latestDoc.sizeFormatted}
            </span>
          )}
        </div>

        {/* Layered preview stack cards or empty helper */}
        {count > 0 ? (
          <div className="mt-3 flex gap-2">
            {documents.slice(0, 3).map((d) => (
              <div
                key={d.id}
                className="flex-1 p-2 rounded-md border border-border/70 bg-surface-muted/50 truncate text-[11px] font-mono text-muted-foreground"
                title={d.title}
              >
                <span className="truncate block font-sans font-medium text-foreground/85">
                  {d.title}
                </span>
              </div>
            ))}
            {count > 3 && (
              <div className="px-2.5 py-2 rounded-md border border-border/60 bg-surface-muted/40 text-[11px] font-mono text-muted-foreground flex items-center justify-center">
                +{count - 3}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-3 py-2 px-3 rounded-md border border-dashed border-border/60 bg-surface-muted/30 text-xs text-muted-foreground">
            Empty space • Click to open and add documents
          </div>
        )}
      </div>
    </motion.div>
  )
}
