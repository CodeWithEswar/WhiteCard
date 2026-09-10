import { Link } from 'react-router-dom'
import { ArrowRight01Icon, Folder01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { useDeleteDocument, useDocumentDownload } from '@/features/documents/hooks/use-documents'
import { StorageLargestFileRow } from './storage-largest-file-row'
import type { LargestStorageDocument } from '../storage.types'

interface StorageLargestFilesProps {
  documents: LargestStorageDocument[]
}

export function StorageLargestFiles({ documents }: StorageLargestFilesProps) {
  const deleteMutation = useDeleteDocument()
  const { download } = useDocumentDownload()

  if (!documents.length) {
    return null
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-border/60">
        <div className="space-y-0.5">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Heavyweight
          </div>
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            Largest Documents
          </h3>
          <p className="text-xs text-muted-foreground">
            The documents currently consuming the most space in your vault.
          </p>
        </div>

        <Link
          to="/app/search?sortBy=size_desc"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline shrink-0 pt-1 sm:pt-0"
        >
          <span>View all sorted by size</span>
          <AppIcon icon={ArrowRight01Icon} size={13} />
        </Link>
      </div>

      {/* Rows List */}
      <div className="space-y-2">
        {documents.map((doc) => (
          <StorageLargestFileRow
            key={doc.id}
            document={doc}
            onDelete={(id) => deleteMutation.mutate(id)}
            onDownload={(item) => download(item)}
            isDeleting={deleteMutation.isPending}
          />
        ))}
      </div>
    </div>
  )
}
