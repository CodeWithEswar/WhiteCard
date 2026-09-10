import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload01Icon,
} from '@hugeicons/core-free-icons'
import { PageShell } from '../components/layout/page-shell'
import { ResponsivePageHeader } from '../components/layout/responsive-page-header'
import { PageHeaderMeta } from '../components/layout/page-header-meta'
import { SpaceCard } from '../features/dashboard/components/space-card'
import { RecentDocuments } from '../features/dashboard/components/recent-documents'
import { ExpiringDocuments } from '../features/dashboard/components/expiring-documents'
import { StorageSummary } from '../features/dashboard/components/storage-summary'
import { UploadDialog } from '../features/upload/components/upload-dialog'
import { ShareDialog } from '../features/sharing/components/share-dialog'
import { AppIcon } from '../components/icons/app-icon'
import { Button } from '../components/ui/button'
import {
  useDocuments,
  useVaultStats,
  useDeleteDocument,
} from '../features/documents/hooks/use-documents'
import type { VaultDocument, DocumentSpace } from '../types/document'
import { PageMeta } from '../components/seo/page-meta'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: documents = [] } = useDocuments()
  const {
    govCount,
    studentCount,
    totalCount,
    totalStorageFormatted,
    expiringDocs,
    recentDocs,
  } = useVaultStats()

  const [uploadOpen, setUploadOpen] = useState(false)
  const [defaultSpace, setDefaultSpace] = useState<DocumentSpace>('government')
  const [shareDoc, setShareDoc] = useState<VaultDocument | null>(null)
  const deleteMutation = useDeleteDocument()

  const govDocs = documents.filter((d) => d.space === 'government')
  const studentDocs = documents.filter((d) => d.space === 'student')

  const handleOpenUploadFor = (space: DocumentSpace) => {
    setDefaultSpace(space)
    setUploadOpen(true)
  }

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
      alert(`Downloading original file: ${doc.originalFilename}`)
    }
  }

  return (
    <PageShell
      maxWidth="wide"
      header={
        <ResponsivePageHeader
          eyebrow="WHITE CARD"
          title="Vault Home"
          description="Your recent documents, spaces, and important records in one place."
          primaryAction={
            <Button
              onClick={() => handleOpenUploadFor('government')}
              className="h-9 px-3.5 rounded-md font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs transition-all active:scale-[0.985]"
            >
              <AppIcon icon={Upload01Icon} size={15} />
              <span>Upload Document</span>
            </Button>
          }
          metadata={
            <PageHeaderMeta
              count={totalCount}
              formattedSize={totalStorageFormatted}
              updatedAt={recentDocs.length > 0 ? 'Updated recently' : undefined}
            />
          }
        />
      }
    >
      <PageMeta
        title="White Card — Vault Home"
        noIndex={true}
        noFollow={true}
      />

      {/* Primary Partition: The Two Spaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <SpaceCard
          space="government"
          count={govCount}
          latestDoc={govDocs[0]}
          documents={govDocs}
          onClick={() => navigate('/app/government')}
        />

        <SpaceCard
          space="student"
          count={studentCount}
          latestDoc={studentDocs[0]}
          documents={studentDocs}
          onClick={() => navigate('/app/student')}
        />
      </div>

      {/* Lower Dashboard Grid: Recent Documents + Alerts & Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Recent Vault Documents */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Recently Added Documents
            </h2>
            <span className="text-xs text-muted-foreground font-mono">
              {recentDocs.length} shown
            </span>
          </div>

          <RecentDocuments
            documents={recentDocs}
            onSelect={(id) => navigate(`/app/documents/${id}`)}
            onShare={(doc) => setShareDoc(doc)}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onUploadClick={() => handleOpenUploadFor('government')}
          />
        </div>

        {/* Right 4 Cols: Alerts & Storage Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Expiring Documents Alert Box (Only shown when documents are expiring soon) */}
          {expiringDocs.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
                Renewal Alerts
              </h3>
              <ExpiringDocuments
                documents={expiringDocs}
                onSelect={(id) => navigate(`/app/documents/${id}`)}
              />
            </div>
          )}

          {/* Storage Breakdown Summary */}
          <StorageSummary
            totalStorageFormatted={totalStorageFormatted}
            govCount={govCount}
            studentCount={studentCount}
            totalCount={totalCount}
          />
        </div>
      </div>

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        defaultSpace={defaultSpace}
      />

      {/* Share Dialog */}
      <ShareDialog
        open={Boolean(shareDoc)}
        onOpenChange={(open) => !open && setShareDoc(null)}
        document={shareDoc}
      />
    </PageShell>
  )
}
