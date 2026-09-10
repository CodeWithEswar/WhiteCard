import React, { useState } from 'react'
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
import { cn } from '@/lib/utils'

export interface SearchResultRowProps {
  document: SearchDocumentResult
  searchQuery?: string
  onSelect: (id: string) => void
  onShare?: (doc: SearchDocumentResult) => void
  onDownload?: (doc: SearchDocumentResult) => void
  onDelete?: (doc: SearchDocumentResult) => void
  className?: string
}

export function SearchResultRow({
  document: doc,
  searchQuery,
  onSelect,
  onShare,
  onDownload,
  onDelete,
  className,
}: SearchResultRowProps) {
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
    <div
      onClick={() => onSelect(doc.id)}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`Open document ${doc.title}`}
      className={cn(
        'group relative flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:px-4 gap-3 bg-surface hover:bg-surface-elevated/40 border-b border-border/60 transition-colors select-none cursor-pointer outline-hidden focus-visible:bg-surface-muted/80',
        className
      )}
    >
      {/* Left: Icon, Title & Space/Category */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <DocumentTypeIcon type={doc.fileType} size={18} showBadge={false} />

        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-xs sm:text-sm text-foreground truncate group-hover:text-primary transition-colors">
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
            </h4>

            {expiry && (expiry.isExpiringSoon || expiry.isExpired) && (
              <span
                className={cn(
                  'shrink-0 inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-md border',
                  expiry.isExpired
                    ? 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                    : 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                )}
                title={expiry.label}
              >
                <AppIcon icon={Alert02Icon} size={10} />
                <span>{expiry.isExpired ? 'Expired' : 'Expiring'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
            <span className="capitalize">{doc.space}</span>
            <span className="text-border-strong">•</span>
            <span className="truncate">{doc.category || 'General'}</span>
            <span className="sm:hidden text-border-strong">•</span>
            <span className="sm:hidden font-mono uppercase">{doc.fileType} • {doc.sizeFormatted}</span>
          </div>
        </div>
      </div>

      {/* Middle Desktop Columns: Tags, Format, Size, Date */}
      <div className="hidden sm:flex items-center gap-5 shrink-0 text-xs text-muted-foreground">
        {/* Tags */}
        <div className="w-36 flex items-center gap-1.5 overflow-hidden">
          {visibleTags.map((tag) => {
            const colorConfig = resolveTagColor(tag)
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md border border-border/70 bg-surface-muted/50 text-foreground/85 shrink-0"
              >
                <span className={`size-1.5 rounded-full ${colorConfig.dot}`} />
                <span className="truncate max-w-16">{tag}</span>
              </span>
            )
          })}
          {remainingTagsCount > 0 && (
            <span className="text-[10px] text-muted-foreground font-medium">
              +{remainingTagsCount}
            </span>
          )}
        </div>

        {/* Format */}
        <div className="w-12 font-mono uppercase text-right">
          {doc.fileType}
        </div>

        {/* Size */}
        <div className="w-18 font-mono text-right">
          {doc.sizeFormatted}
        </div>

        {/* Date */}
        <div className="w-24 font-mono text-right text-[11px]">
          {formatSearchDate(doc.createdAt)}
        </div>
      </div>

      {/* Mobile Tags Row */}
      {visibleTags.length > 0 && (
        <div className="sm:hidden flex items-center gap-1.5 pt-0.5">
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
            <span className="text-[10px] text-muted-foreground font-medium">
              +{remainingTagsCount}
            </span>
          )}
        </div>
      )}

      {/* Right: Actions Dropdown Menu */}
      <div
        className="flex items-center self-end sm:self-center"
        onClick={(e) => e.stopPropagation()}
      >
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
  )
}
