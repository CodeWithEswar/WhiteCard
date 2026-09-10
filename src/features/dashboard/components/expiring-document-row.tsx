import { Link } from 'react-router-dom'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import type { VaultDocument } from '@/types/document'
import { DocumentTypeIcon } from '@/features/documents/components/document-type-icon'
import { AppIcon } from '@/components/icons/app-icon'
import { getExpiryStatus, formatDisplayDate } from '../dashboard.utils'

interface ExpiringDocumentRowProps {
  document: VaultDocument
}

export function ExpiringDocumentRow({ document }: ExpiringDocumentRowProps) {
  const expiryStatus = getExpiryStatus(document.expiryDate)
  if (!expiryStatus) return null

  // Semantic visual badge based on Section 25
  const severityStyles = {
    expired: 'bg-destructive/10 text-destructive border-destructive/20',
    urgent: 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/30',
    warning: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20',
    neutral: 'bg-muted text-muted-foreground border-border/80',
  }[expiryStatus.level]

  return (
    <Link
      to={`/app/documents/${document.id}`}
      className="group flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl border border-border/80 bg-card hover:bg-muted/30 hover:border-border transition-all duration-150"
    >
      <div className="flex items-center gap-3 min-w-0">
        <DocumentTypeIcon
          type={document.fileType}
          size={16}
          showBadge={false}
          className="size-8.5 rounded-lg shrink-0"
        />
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {document.title}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
            <span className="truncate">{document.category || 'Official Record'}</span>
            <span>•</span>
            <span>Expires {formatDisplayDate(document.expiryDate!)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium border ${severityStyles}`}
        >
          {expiryStatus.label}
        </span>
        <div className="size-6 rounded-md flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
          <AppIcon icon={ArrowRight01Icon} size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
