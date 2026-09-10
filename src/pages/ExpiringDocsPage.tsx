import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert02Icon,
  Calendar03Icon,
  Upload01Icon,
} from '@hugeicons/core-free-icons'
import { PageShell } from '../components/layout/page-shell'
import { ResponsivePageHeader } from '../components/layout/responsive-page-header'
import { PageHeaderMeta } from '../components/layout/page-header-meta'
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
    <PageShell
      maxWidth="wide"
      header={
        <ResponsivePageHeader
          eyebrow="COLLECTION"
          title="Expiring Soon"
          description="Documents with expiry dates approaching within your configured review window."
          icon={Alert02Icon}
          primaryAction={
            <Button
              onClick={() => setUploadOpen(true)}
              className="h-9 px-3.5 rounded-md font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
            >
              <AppIcon icon={Upload01Icon} size={15} />
              <span>Upload Document</span>
            </Button>
          }
          metadata={
            <PageHeaderMeta
              count={expiringDocs.length}
              countLabel="expiring documents"
              badge={
                expiringDocs.length > 0 ? (
                  <span className="size-5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25 text-[10px] font-mono font-bold flex items-center justify-center">
                    {expiringDocs.length}
                  </span>
                ) : undefined
              }
            />
          }
        />
      }
    >
      <PageMeta
        title="White Card — Expiring Documents"
        noIndex={true}
        noFollow={true}
      />

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
        <div className="py-16 px-4 rounded-xl border border-border/80 bg-surface/40 flex flex-col items-center justify-center text-center space-y-3">
          <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
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
    </PageShell>
  )
}
