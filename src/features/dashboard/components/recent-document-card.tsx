import { Link } from 'react-router-dom'
import {
  Download01Icon,
  Share01Icon,
  Passport01Icon,
  Certificate01Icon,
} from '@hugeicons/core-free-icons'
import type { VaultDocument } from '@/types/document'
import { DocumentTypeIcon } from '@/features/documents/components/document-type-icon'
import { AppIcon } from '@/components/icons/app-icon'
import { formatBytes } from '@/lib/files/format-bytes'
import { formatRelativeDate } from '../dashboard.utils'

interface RecentDocumentCardProps {
  document: VaultDocument
  onDownload?: (doc: VaultDocument) => void
  onShare?: (doc: VaultDocument) => void
}

export function RecentDocumentCard({
  document,
  onDownload,
  onShare,
}: RecentDocumentCardProps) {
  const isGov = document.space === 'government'
  const spaceLabel = isGov ? 'Government' : 'Student'
  const spaceIcon = isGov ? Passport01Icon : Certificate01Icon

  return (
    <div className="group relative flex flex-col justify-between p-4 sm:p-4.5 rounded-xl border border-border bg-card hover:bg-muted/30 hover:border-border/90 hover:shadow-xs transition-all duration-150">
      {/* Top row: Type icon + Space badge + Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <DocumentTypeIcon
            type={document.fileType}
            size={18}
            showBadge={false}
            className="size-10 rounded-xl"
          />
          <div className="min-w-0 flex-1">
            <Link
              to={`/app/documents/${document.id}`}
              className="font-medium text-xs sm:text-sm text-foreground hover:text-primary transition-colors line-clamp-1 break-words focus-visible:outline-hidden focus-visible:underline"
              title={document.title}
            >
              {document.title}
            </Link>
            <p className="text-[11px] text-muted-foreground truncate" title={document.originalFilename}>
              {document.category || document.originalFilename}
            </p>
          </div>
        </div>

        {/* Quick action icons */}
        <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {onShare && (
            <button
              type="button"
              aria-label={`Share ${document.title}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onShare(document)
              }}
              className="size-7.5 rounded-lg border border-border/80 bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            >
              <AppIcon icon={Share01Icon} size={13} />
            </button>
          )}

          {onDownload && (
            <button
              type="button"
              aria-label={`Download ${document.title}`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDownload(document)
              }}
              className="size-7.5 rounded-lg border border-border/80 bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            >
              <AppIcon icon={Download01Icon} size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Space tag, size, date */}
      <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5 font-medium">
          <AppIcon icon={spaceIcon} size={12} className="text-muted-foreground/80" />
          <span className="truncate">{spaceLabel}</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10.5px]">
          <span>{formatBytes(document.sizeBytes)}</span>
          <span className="text-muted-foreground/50">•</span>
          <span className="font-sans text-[11px] text-muted-foreground/80">
            {formatRelativeDate(document.updatedAt || document.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}
