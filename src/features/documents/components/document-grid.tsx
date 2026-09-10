import type { VaultDocument, DocumentSpace } from '../../../types/document'
import { DocumentCard } from './document-card'
import { DocumentListRow } from './document-list-row'
import { EmptyState } from '../../../components/feedback/empty-state'

interface DocumentGridProps {
  documents: VaultDocument[]
  viewMode: 'grid' | 'list'
  space?: DocumentSpace | 'all'
  onSelect: (id: string) => void
  onShare?: (document: VaultDocument) => void
  onDelete?: (document: VaultDocument) => void
  onDownload?: (document: VaultDocument) => void
  onUploadClick?: () => void
  isFiltered?: boolean
  onClearFilters?: () => void
}

export function DocumentGrid({
  documents,
  viewMode,
  space = 'all',
  onSelect,
  onShare,
  onDelete,
  onDownload,
  onUploadClick,
  isFiltered = false,
  onClearFilters,
}: DocumentGridProps) {
  if (documents.length === 0) {
    if (isFiltered) {
      return (
        <EmptyState
          type="search"
          actionLabel="Clear Filters"
          onAction={onClearFilters}
        />
      )
    }

    const emptyType =
      space === 'government'
        ? 'government'
        : space === 'student'
        ? 'student'
        : 'generic'

    return <EmptyState type={emptyType} onAction={onUploadClick} />
  }

  if (viewMode === 'list') {
    return (
      <div className="rounded-2xl border border-border/80 bg-surface divide-y divide-border/60 overflow-hidden shadow-xs">
        {/* Table header for desktop */}
        <div className="hidden md:flex items-center justify-between p-3 px-4 bg-surface-muted/60 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/70">
          <div className="flex-1">Name & Category</div>
          <div className="flex items-center gap-6">
            <span className="w-24">Tags</span>
            <span className="hidden lg:block w-24 text-right">Space</span>
            <span className="w-24 text-right">Updated</span>
            <span className="w-8 text-right">Action</span>
          </div>
        </div>

        {documents.map((doc) => (
          <DocumentListRow
            key={doc.id}
            document={doc}
            onSelect={onSelect}
            onShare={onShare}
            onDelete={onDelete}
            onDownload={onDownload}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onSelect={onSelect}
          onShare={onShare}
          onDelete={onDelete}
          onDownload={onDownload}
        />
      ))}
    </div>
  )
}
