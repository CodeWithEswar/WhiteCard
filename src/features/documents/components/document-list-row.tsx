import { useState } from 'react'
import {
  MoreHorizontalIcon,
  Download01Icon,
  Share03Icon,
  Delete02Icon,
  Alert02Icon,
  ViewIcon,
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

interface DocumentListRowProps {
  document: VaultDocument
  onSelect: (id: string) => void
  onShare?: (document: VaultDocument) => void
  onDelete?: (document: VaultDocument) => void
  onDownload?: (document: VaultDocument) => void
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function DocumentListRow({
  document: doc,
  onSelect,
  onShare,
  onDelete,
  onDownload,
}: DocumentListRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const isExpiringSoon = Boolean(
    doc.expiryDate &&
    new Date(doc.expiryDate).getTime() - Date.now() < 30 * 24 * 3600 * 1000 &&
    new Date(doc.expiryDate).getTime() > Date.now()
  )

  return (
    <div
      onClick={() => onSelect(doc.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(doc.id)
        }
      }}
      className="group flex flex-col md:flex-row md:items-center justify-between p-3.5 px-4 gap-3 bg-surface hover:bg-surface-elevated/50 transition-colors border-b border-border/50 select-none cursor-pointer focus-visible:outline-hidden focus-visible:bg-surface-muted"
    >
      {/* Primary: Icon & Title info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <DocumentTypeIcon type={doc.fileType} size={18} showBadge={false} />

        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <h4
              title={doc.title}
              className="font-medium text-xs sm:text-sm text-foreground truncate group-hover:text-primary transition-colors"
            >
              {doc.title}
            </h4>
            {isExpiringSoon && (
              <span
                title="Expires within 30 days"
                className="shrink-0 inline-flex items-center gap-1 text-[9px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20"
              >
                <AppIcon icon={Alert02Icon} size={10} />
                Expiring
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
            <span>{doc.category}</span>
            <span className="text-border-strong">•</span>
            <span className="font-mono">{doc.sizeFormatted}</span>
            <span className="text-border-strong">•</span>
            <span className="flex items-center gap-1 font-sans text-[10px]" title={`${doc.viewCount ?? 0} views`}>
              <AppIcon icon={ViewIcon} size={11} className="opacity-70" />
              {doc.viewCount ?? 0}
            </span>
            <span className="text-border-strong/60">•</span>
            <span className="flex items-center gap-1 font-sans text-[10px]" title={`${doc.clickCount ?? 0} downloads`}>
              <AppIcon icon={Download01Icon} size={11} className="opacity-70" />
              {doc.clickCount ?? 0}
            </span>
            <span className="md:hidden text-border-strong">•</span>
            <span className="md:hidden">{formatDate(doc.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Secondary desktop / tablet columns */}
      <div className="flex items-center justify-between md:justify-end gap-3 md:gap-6 shrink-0 pl-11 md:pl-0">
        {/* Tags */}
        <div className="flex items-center gap-1">
          {doc.tags.slice(0, 2).map((t) => (
            <TagChip key={t} label={t} variant="compact" />
          ))}
          {doc.tags.length > 2 && (
            <span className="text-[10px] text-muted-foreground px-1 py-0.5 rounded border border-border/50 bg-surface-muted">
              +{doc.tags.length - 2}
            </span>
          )}
        </div>

        {/* Space indicator (Desktop only) */}
        <div className="hidden lg:block w-24 text-right">
          <span className="text-[11px] text-muted-foreground uppercase font-mono tracking-wider">
            {doc.space}
          </span>
        </div>

        {/* Updated Date (Tablet & Desktop) */}
        <div className="hidden sm:block w-24 text-right text-xs text-muted-foreground font-mono">
          {formatDate(doc.updatedAt)}
        </div>

        {/* Row Actions Menu */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1"
        >
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="size-7 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-muted"
                  aria-label="More options"
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
    </div>
  )
}
