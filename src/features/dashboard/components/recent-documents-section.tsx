import { Link } from 'react-router-dom'
import { ArrowRight01Icon, Upload01Icon, Clock01Icon } from '@hugeicons/core-free-icons'
import type { VaultDocument } from '@/types/document'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { RecentDocumentCard } from './recent-document-card'

interface RecentDocumentsSectionProps {
  documents: VaultDocument[]
  onDownload?: (doc: VaultDocument) => void
  onShare?: (doc: VaultDocument) => void
  onUploadClick?: () => void
}

export function RecentDocumentsSection({
  documents,
  onDownload,
  onShare,
  onUploadClick,
}: RecentDocumentsSectionProps) {
  return (
    <section aria-label="Recent Documents" className="space-y-3.5">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-4 px-0.5">
        <div>
          <div className="flex items-center gap-2">
            <AppIcon icon={Clock01Icon} size={16} className="text-muted-foreground" />
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              Recent Documents
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your latest files across both spaces.
          </p>
        </div>

        {documents.length > 0 && (
          <Link
            to="/app/recent"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0 py-1"
          >
            <span>View all</span>
            <AppIcon icon={ArrowRight01Icon} size={13} />
          </Link>
        )}
      </div>

      {/* Content Grid or Onboarding Empty State */}
      {documents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center flex flex-col items-center justify-center min-h-[180px]">
          <div className="size-10 rounded-xl bg-muted/50 border border-border/80 flex items-center justify-center text-muted-foreground mb-3">
            <AppIcon icon={Clock01Icon} size={20} />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Your White Card is empty
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
            Upload a government document or student certificate to get started.
          </p>
          {onUploadClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onUploadClick}
              className="gap-2 text-xs font-medium h-9 rounded-xl border-border"
            >
              <AppIcon icon={Upload01Icon} size={14} />
              <span>Upload Document</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
          {documents.map((doc) => (
            <RecentDocumentCard
              key={doc.id}
              document={doc}
              onDownload={onDownload}
              onShare={onShare}
            />
          ))}
        </div>
      )}
    </section>
  )
}
