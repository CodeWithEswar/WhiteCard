import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock01Icon,
  ArrowLeft01Icon,
  Upload01Icon,
} from '@hugeicons/core-free-icons'
import { PageContainer } from '../components/layout/page-container'
import { AppIcon } from '../components/icons/app-icon'
import { Button } from '../components/ui/button'
import { DocumentGrid } from '../features/documents/components/document-grid'
import { UploadDialog } from '../features/upload/components/upload-dialog'
import { ShareDialog } from '../features/sharing/components/share-dialog'
import {
  useDocuments,
  useDeleteDocument,
} from '../features/documents/hooks/use-documents'
import type { VaultDocument } from '../types/document'
import { PageMeta } from '../components/seo/page-meta'

export function RecentDocsPage() {
  const navigate = useNavigate()
  const { data: documents = [] } = useDocuments({ sortBy: 'updated_desc' })
  const [uploadOpen, setUploadOpen] = useState(false)
  const [shareDoc, setShareDoc] = useState<VaultDocument | null>(null)
  const deleteMutation = useDeleteDocument()

  const handleDelete = (doc: VaultDocument) => {
    if (confirm(`Are you sure you want to remove "${doc.title}" from your vault?`)) {
      deleteMutation.mutate(doc.id)
    }
  }

  const handleDownload = (doc: VaultDocument) => {
    if (doc.fileUrl && doc.fileUrl !== '#') {
      const a = document.createElement('a')
      a.href = doc.fileUrl
      a.download = doc.originalFilename
      a.click()
    } else {
      alert(`Downloading file: ${doc.originalFilename}`)
    }
  }

  return (
    <PageContainer maxWidth="wide" className="space-y-6">
      <PageMeta
        title="White Card — Recent Documents"
        noIndex={true}
        noFollow={true}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/app')}
              aria-label="Back to vault home"
              className="p-1 -ml-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
            >
              <AppIcon icon={ArrowLeft01Icon} size={18} />
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <span>Recent Documents</span>
              <span className="size-6 rounded-full bg-surface-muted text-foreground border border-border text-xs font-mono font-bold flex items-center justify-center">
                {documents.length}
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            All recently updated, uploaded, and modified files in your personal vault.
          </p>
        </div>

        <Button
          onClick={() => setUploadOpen(true)}
          className="h-9 px-3.5 rounded-md font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
        >
          <AppIcon icon={Upload01Icon} size={15} />
          <span>Upload Document</span>
        </Button>
      </div>

      {/* Content */}
      {documents.length > 0 ? (
        <DocumentGrid
          documents={documents}
          viewMode="grid"
          onSelect={(id) => navigate(`/app/document/${id}`)}
          onShare={(doc) => setShareDoc(doc)}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      ) : (
        <div className="py-16 px-4 rounded-md border border-border/80 bg-surface/40 flex flex-col items-center justify-center text-center space-y-3">
          <div className="size-12 rounded-md bg-muted text-muted-foreground flex items-center justify-center">
            <AppIcon icon={Clock01Icon} size={24} />
          </div>
          <div className="space-y-1 max-w-sm">
            <h2 className="text-sm font-semibold text-foreground">No recent documents</h2>
            <p className="text-xs text-muted-foreground">
              Upload documents or certificates to see them listed here.
            </p>
          </div>
        </div>
      )}

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <ShareDialog
        open={Boolean(shareDoc)}
        onOpenChange={(open) => !open && setShareDoc(null)}
        document={shareDoc}
      />
    </PageContainer>
  )
}
