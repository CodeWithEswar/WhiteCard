import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert02Icon,
  Calendar03Icon,
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

export function ExpiringDocsPage() {
  const navigate = useNavigate()
  const { data: documents = [] } = useDocuments()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [shareDoc, setShareDoc] = useState<VaultDocument | null>(null)
  const deleteMutation = useDeleteDocument()

  const now = Date.now()
  const thirtyDaysMs = 30 * 24 * 3600 * 1000

  // Filter documents expiring within next 30 days and sort nearest expiry first
  const expiringDocs = documents
    .filter((doc) => {
      if (!doc.expiryDate) return false
      const expiryTime = new Date(doc.expiryDate).getTime()
      return expiryTime > now && expiryTime - now < thirtyDaysMs
    })
    .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime())

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
        title="White Card — Expiring Documents"
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
              <span>Expiring Soon</span>
              {expiringDocs.length > 0 && (
                <span className="size-6 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25 text-xs font-mono font-bold flex items-center justify-center">
                  {expiringDocs.length}
                </span>
              )}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Vault items requiring renewal or attention within the next 30 days.
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

      {/* Content: List or Truthful Empty State */}
      {expiringDocs.length > 0 ? (
        <DocumentGrid
          documents={expiringDocs}
          viewMode="grid"
          onSelect={(id) => navigate(`/app/document/${id}`)}
          onShare={(doc) => setShareDoc(doc)}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      ) : (
        <div className="py-16 px-4 rounded-md border border-border/80 bg-surface/40 flex flex-col items-center justify-center text-center space-y-3">
          <div className="size-12 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <AppIcon icon={Calendar03Icon} size={24} />
          </div>
          <div className="space-y-1 max-w-sm">
            <h2 className="text-sm font-semibold text-foreground">No documents expiring soon</h2>
            <p className="text-xs text-muted-foreground">
              All your passports, licences, and certificates are currently up to date with no renewals due in the next 30 days.
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
