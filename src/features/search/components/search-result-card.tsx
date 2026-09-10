import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MoreHorizontalIcon,
  ViewIcon,
  Share03Icon,
  Download01Icon,
  Delete02Icon,
  Alert02Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DocumentTypeIcon } from '@/features/documents/components/document-type-icon'
import type { SearchDocumentResult } from '../search.types'
import { highlightTextMatch, formatSearchDate, getExpiryStatus } from '../search.utils'
import { resolveTagColor } from '@/config/tag-colors'
import { useAppReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface SearchResultCardProps {
  document: SearchDocumentResult
  searchQuery?: string
  onSelect: (id: string) => void
  onShare?: (doc: SearchDocumentResult) => void
  onDownload?: (doc: SearchDocumentResult) => void
  onDelete?: (doc: SearchDocumentResult) => void
  className?: string
}

export function SearchResultCard({
  document: doc,
  searchQuery,
  onSelect,
  onShare,
  onDownload,
  onDelete,
  className,
}: SearchResultCardProps) {
  const reduceMotion = useAppReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)

  const expiry = getExpiryStatus(doc.expiresOn)
  const titleSegments = highlightTextMatch(doc.title, searchQuery)

  const visibleTags = doc.tags.slice(0, 2)
  const remainingTagsCount = Math.max(0, doc.tags.length - 2)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(doc.id)
    }
  }

  return (
    <motion.div
      whileHover={reduceMotion ? {} : { y: -2 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      onClick={() => onSelect(doc.id)}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`Open document ${doc.title}`}
      className={cn(
        'group relative flex flex-col justify-between p-4 rounded-2xl border border-border/80 bg-surface text-left cursor-pointer select-none transition-all duration-150',
        'hover:border-border-strong hover:bg-surface-elevated/40 hover:shadow-sm',
        'outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring',
        className
      )}
    >
      <div className="space-y-3">
        {/* Card Header: Type Icon & Dropdown Menu */}
        <div className="flex items-center justify-between gap-2">
          <DocumentTypeIcon type={doc.fileType} size={18} />

          <div
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {expiry && (expiry.isExpiringSoon || expiry.isExpired) && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-lg border',
                  expiry.isExpired
                    ? 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                    : 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                )}
                title={expiry.label}
              >
                <AppIcon icon={Alert02Icon} size={11} />
                <span>{expiry.isExpired ? 'Expired' : 'Expiring'}</span>
              </span>
            )}

            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors opacity-70 group-hover:opacity-100"
                    aria-label={`Actions for ${doc.title}`}
                  >
                    <AppIcon icon={MoreHorizontalIcon} size={15} />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-44 p-1 rounded-xl border border-border shadow-md">
                <DropdownMenuItem
                  onClick={() => onSelect(doc.id)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer"
                >
                  <AppIcon icon={ViewIcon} size={13} className="text-muted-foreground" />
                  <span>Open Document</span>
                </DropdownMenuItem>

                {onShare && (
                  <DropdownMenuItem
                    onClick={() => onShare(doc)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer"
                  >
                    <AppIcon icon={Share03Icon} size={13} className="text-muted-foreground" />
                    <span>Share Link</span>
                  </DropdownMenuItem>
                )}

                {onDownload && (
                  <DropdownMenuItem
                    onClick={() => onDownload(doc)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer"
                  >
                    <AppIcon icon={Download01Icon} size={13} className="text-muted-foreground" />
                    <span>Download</span>
                  </DropdownMenuItem>
                )}

                {onDelete && (
                  <>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={() => onDelete(doc)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <AppIcon icon={Delete02Icon} size={13} />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title with Subtle Highlight */}
        <div>
          <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {titleSegments.map((seg, idx) =>
              seg.match ? (
                <mark
                  key={idx}
                  className="bg-primary/15 text-foreground font-semibold px-0.5 rounded-xs"
                >
                  {seg.text}
                </mark>
              ) : (
                <span key={idx}>{seg.text}</span>
              )
            )}
          </h3>

          {/* Space • Category */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <span className="capitalize">{doc.space}</span>
            <span className="text-border-strong">•</span>
            <span className="truncate">{doc.category || 'General'}</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Metadata and Tags */}
      <div className="pt-3 mt-3 border-t border-border/50 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span className="uppercase">{doc.fileType} • {doc.sizeFormatted}</span>
          <span>{formatSearchDate(doc.createdAt)}</span>
        </div>

        {/* Tags with monochrome neutral label & tiny color dot */}
        {visibleTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {visibleTags.map((tag) => {
              const colorConfig = resolveTagColor(tag)
              return (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md border border-border/70 bg-surface-muted/50 text-foreground/85"
                >
                  <span className={`size-1.5 rounded-full ${colorConfig.dot}`} />
                  <span>{tag}</span>
                </span>
              )
            })}
            {remainingTagsCount > 0 && (
              <span className="text-[10px] text-muted-foreground font-medium px-1">
                +{remainingTagsCount}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
