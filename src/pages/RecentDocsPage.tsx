import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Clock01Icon,
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
  useDocumentDownload,
} from '../features/documents/hooks/use-documents'
import type { VaultDocument } from '../types/document'
import { PageMeta } from '../components/seo/page-meta'

export function RecentDocsPage() {
  const navigate = useNavigate()
  const { data: documents = [] } = useDocuments({ sortBy: 'updated_desc' })
  const [uploadOpen, setUploadOpen] = useState(false)
  const [shareDoc, setShareDoc] = useState<VaultDocument | null>(null)
  const deleteMutation = useDeleteDocument()
  const { download } = useDocumentDownload()

  const handleDelete = (doc: VaultDocument) => {
    if (confirm(`Are you sure you want to remove "${doc.title}" from your vault?`)) {
      deleteMutation.mutate(doc.id)
    }
  }

  const handleDownload = (doc: VaultDocument) => {
    download(doc)
  }

  return (
    <PageShell
      maxWidth="wide"
      header={
        <ResponsivePageHeader
          eyebrow="COLLECTION"
          title="Recent Documents"
          description="All documents recently added, updated, or viewed in your personal vault."
          icon={Clock01Icon}
          primaryAction={
            <Button
              onClick={() => setUploadOpen(true)}
              className="h-9 px-3.5 rounded-md font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
            >
              <AppIcon icon={Upload01Icon} size={15} />
              <span>Upload Document</span>
            </Button>
          }
          metadata={<PageHeaderMeta count={documents.length} />}
        />
      }
    >
      <PageMeta
        title="White Card — Recent Documents"
        noIndex={true}
        noFollow={true}
      />

      <DocumentGrid
        documents={documents}
        viewMode="grid"
        onSelect={(id) => navigate(`/app/document/${id}`)}
        onShare={(doc) => setShareDoc(doc)}
        onDelete={handleDelete}
        onDownload={handleDownload}
      />

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <ShareDialog
        open={Boolean(shareDoc)}
        onOpenChange={(open) => !open && setShareDoc(null)}
        document={shareDoc}
      />
    </PageShell>
  )
}
