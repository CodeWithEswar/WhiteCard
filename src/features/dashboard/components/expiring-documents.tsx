import { Alert02Icon, Calendar03Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import type { VaultDocument } from '../../../types/document'
import { AppIcon } from '../../../components/icons/app-icon'
import { DocumentTypeIcon } from '../../documents/components/document-type-icon'

interface ExpiringDocumentsProps {
  documents: VaultDocument[]
  onSelect: (id: string) => void
}

function getDaysRemaining(expiryDate: string): number {
  return Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24))
}

export function ExpiringDocuments({
  documents,
  onSelect,
}: ExpiringDocumentsProps) {
  if (documents.length === 0) {
    return (
      <div className="p-5 rounded-xl border border-border/80 bg-surface/60 flex items-center gap-3.5">
        <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <AppIcon icon={Calendar03Icon} size={18} />
        </div>
        <div className="text-xs">
          <p className="font-semibold text-foreground">All renewals up to date</p>
          <p className="text-muted-foreground mt-0.5">
            No licences or passports are expiring within the next 30 days.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {documents.map((doc) => {
        const days = doc.expiryDate ? getDaysRemaining(doc.expiryDate) : 0
        return (
          <div
            key={doc.id}
            onClick={() => onSelect(doc.id)}
            role="button"
            tabIndex={0}
            className="flex items-center justify-between p-3.5 px-4 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <DocumentTypeIcon type={doc.fileType} size={16} showBadge={false} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">
                  {doc.title}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {doc.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                <AppIcon icon={Alert02Icon} size={12} />
                {days} days left
              </span>
              <AppIcon icon={ArrowRight01Icon} size={14} className="text-muted-foreground" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
