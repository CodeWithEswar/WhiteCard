import { Link } from 'react-router-dom'
import { Calendar03Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import type { VaultDocument } from '@/types/document'
import { AppIcon } from '@/components/icons/app-icon'
import { ExpiringDocumentRow } from './expiring-document-row'

interface ExpiringDocumentsSectionProps {
  documents: VaultDocument[]
}

export function ExpiringDocumentsSection({ documents }: ExpiringDocumentsSectionProps) {
  // Section 22 & 54: strictly contextual — omit completely if no expiring documents exist
  if (!documents || documents.length === 0) {
    return null
  }

  return (
    <section aria-label="Expiring Documents" className="space-y-3">
      <div className="flex items-end justify-between gap-4 px-0.5">
        <div>
          <div className="flex items-center gap-2">
            <AppIcon icon={Calendar03Icon} size={16} className="text-amber-600 dark:text-amber-400" />
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Expiring Soon
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review government documents that may need attention.
          </p>
        </div>

        <Link
          to="/app/expiring"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0 py-1"
        >
          <span>View all</span>
          <AppIcon icon={ArrowRight01Icon} size={13} />
        </Link>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <ExpiringDocumentRow key={doc.id} document={doc} />
        ))}
      </div>
    </section>
  )
}
