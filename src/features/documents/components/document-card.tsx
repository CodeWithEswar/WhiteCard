import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MoreHorizontalIcon,
  Download01Icon,
  Share03Icon,
  Delete02Icon,
  Calendar03Icon,
  Alert02Icon,
} from '@hugeicons/core-free-icons'
import type { VaultDocument } from '../../../types/document'
import { DocumentTypeIcon } from './document-type-icon'
import { TagChip } from '../../tags/components/tag-chip'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { useAppReducedMotion } from '../../../lib/motion'

interface DocumentCardProps {
  document: VaultDocument
  onSelect: (id: string) => void
  onShare?: (document: VaultDocument) => void
  onDelete?: (document: VaultDocument) => void
  onDownload?: (document: VaultDocument) => void
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const diffDays = Math.round((Date.now() - date.getTime()) / (1000 * 3600 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function DocumentCard({
  document: doc,
  onSelect,
  onShare,
  onDelete,
  onDownload,
}: DocumentCardProps) {
  const reduceMotion = useAppReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)

  const isExpiringSoon = Boolean(
    doc.expiryDate &&
    new Date(doc.expiryDate).getTime() - Date.now() < 30 * 24 * 3600 * 1000 &&
    new Date(doc.expiryDate).getTime() > Date.now()
  )

  return (
    <motion.div
      whileHover={reduceMotion ? {} : { y: -2 }}
      whileTap={reduceMotion ? {} : { scale: 0.985 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={() => onSelect(doc.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(doc.id)
        }
      }}
      className="group relative flex flex-col justify-between p-4 rounded-xl border border-border/80 bg-surface hover:border-border-strong/90 hover:bg-surface-elevated/40 hover:shadow-sm transition-colors text-left select-none cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div>
        {/* Card Header: Type Icon & More Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <DocumentTypeIcon type={doc.fileType} size={18} />

          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {isExpiringSoon && (
              <span
                title="Expires within 30 days"
                className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-xl border border-amber-500/20"
              >
                <AppIcon icon={Alert02Icon} size={11} />
                Expiring
              </span>
            )}

            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="size-7 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors opacity-70 group-hover:opacity-100"
                    aria-label="Document options"
                  />
                }
              >
                <AppIcon icon={MoreHorizontalIcon} size={15} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl">
                {onDownload && (
                  <DropdownMenuItem
                    onClick={() => onDownload(doc)}
                    className="gap-2 text-xs"
                  >
                    <AppIcon icon={Download01Icon} size={14} />
                    Download File
                  </DropdownMenuItem>
                )}
                {onShare && (
                  <DropdownMenuItem
                    onClick={() => onShare(doc)}
                    className="gap-2 text-xs"
                  >
                    <AppIcon icon={Share03Icon} size={14} />
                    Direct Share Link
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(doc)}
                      className="gap-2 text-xs text-destructive hover:text-destructive focus:text-destructive"
                    >
                      <AppIcon icon={Delete02Icon} size={14} />
                      Delete Document
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title and Category */}
        <div className="space-y-1">
          <h4
            title={doc.title}
            className="font-medium text-sm text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors"
          >
            {doc.title}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {doc.category}
          </p>
        </div>

        {/* Tags Row */}
        {doc.tags && doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {doc.tags.slice(0, 2).map((tag) => (
              <TagChip key={tag} label={tag} variant="compact" />
            ))}
            {doc.tags.length > 2 && (
              <span className="text-[10px] text-muted-foreground/80 px-1 py-0.5 rounded border border-border/60 bg-surface-muted">
                +{doc.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: File Size, Views & Update Date */}
      <div className="flex items-center justify-between pt-3 mt-4 border-t border-border/50 text-[11px] text-muted-foreground/90 font-mono">
        <div className="flex items-center gap-2">
          <span>{doc.sizeFormatted}</span>
          {(doc.viewCount !== undefined || doc.clickCount !== undefined) && (
            <>
              <span className="text-border-strong">•</span>
              <span className="flex items-center gap-1 font-sans text-[10px] text-muted-foreground" title={`${doc.viewCount ?? 0} views, ${doc.clickCount ?? 0} clicks`}>
                {doc.viewCount ?? 0} views
              </span>
            </>
          )}
        </div>
        <span className="flex items-center gap-1 font-sans">
          <AppIcon icon={Calendar03Icon} size={11} className="opacity-70" />
          {formatRelativeTime(doc.updatedAt)}
        </span>
      </div>
    </motion.div>
  )
}
