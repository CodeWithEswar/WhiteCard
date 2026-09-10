import type { VaultDocument } from '../../../types/document'
import { DocumentListRow } from '../../documents/components/document-list-row'
import { EmptyState } from '../../../components/feedback/empty-state'

interface RecentDocumentsProps {
  documents: VaultDocument[]
  onSelect: (id: string) => void
  onShare?: (document: VaultDocument) => void
  onDelete?: (document: VaultDocument) => void
  onDownload?: (document: VaultDocument) => void
  onUploadClick?: () => void
}

export function RecentDocuments({
  documents,
  onSelect,
  onShare,
  onDelete,
  onDownload,
  onUploadClick,
}: RecentDocumentsProps) {
  if (documents.length === 0) {
    return (
      <EmptyState
        type="generic"
        title="No recent activity"
        description="Uploaded and modified documents will appear here for fast retrieval."
        onAction={onUploadClick}
      />
    )
  }

  return (
    <div className="rounded-md border border-border/80 bg-surface divide-y divide-border/60 overflow-hidden shadow-xs">
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
