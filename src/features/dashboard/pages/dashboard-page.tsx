import { useState } from 'react'
import { motion } from 'framer-motion'
import { Alert02Icon, RefreshIcon } from '@hugeicons/core-free-icons'
import { PageShell } from '@/components/layout/page-shell'
import { PageMeta } from '@/components/seo/page-meta'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { useDashboardSummary } from '../dashboard.queries'
import { DashboardHeader } from '../components/dashboard-header'
import { DashboardSpaceGrid } from '../components/dashboard-space-grid'
import { RecentDocumentsSection } from '../components/recent-documents-section'
import { ExpiringDocumentsSection } from '../components/expiring-documents-section'
import { StorageOverview } from '../components/storage-overview'
import { TagShortcuts } from '../components/tag-shortcuts'
import { DashboardSkeleton } from '../components/dashboard-skeleton'
import { DashboardEmptyState } from '../components/dashboard-empty-state'
import { UploadDialog } from '@/features/upload/components/upload-dialog'
import { ShareDialog } from '@/features/sharing/components/share-dialog'
import { useAppReducedMotion } from '@/lib/motion'
import type { VaultDocument, DocumentSpace } from '@/types/document'

export function DashboardPage() {
  const reduceMotion = useAppReducedMotion()
  const { data, isPending, isError, error, refetch, isFetching } = useDashboardSummary()

  const [uploadOpen, setUploadOpen] = useState(false)
  const [defaultSpace, setDefaultSpace] = useState<DocumentSpace>('government')
  const [shareDoc, setShareDoc] = useState<VaultDocument | null>(null)

  const handleOpenUpload = (space: DocumentSpace = 'government') => {
    setDefaultSpace(space)
    setUploadOpen(true)
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

  // Section 60 & 61: Skeleton ONLY on initial cold load when no cached data exists
  if (isPending && !data) {
    return (
      <PageShell maxWidth="wide">
        <PageMeta title="White Card — Vault Home" noIndex noFollow />
        <DashboardSkeleton />
      </PageShell>
    )
  }

  // Section 64: Full error state only when no cached data exists
  if (isError && !data) {
    return (
      <PageShell maxWidth="wide">
        <PageMeta title="White Card — Vault Home" noIndex noFollow />
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
          <div className="size-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
            <AppIcon icon={Alert02Icon} size={24} />
          </div>
          <div className="space-y-1 max-w-sm">
            <h2 className="text-lg font-semibold text-foreground">
              We couldn't load your dashboard
            </h2>
            <p className="text-xs text-muted-foreground">
              {error instanceof Error ? error.message : 'Please check your connection and try again.'}
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="gap-2 text-xs font-medium h-9 rounded-xl"
          >
            <AppIcon icon={RefreshIcon} size={14} />
            <span>Try again</span>
          </Button>
        </div>
      </PageShell>
    )
  }

  const summary = data!
  const hasExpiring = summary.expiringDocuments.length > 0
  const isEmptyVault = summary.totalCount === 0

  return (
    <PageShell
      maxWidth="wide"
      header={
        <DashboardHeader
          totalCount={summary.totalCount}
          totalBytes={summary.totalBytes}
          hasRecentActivity={summary.recentDocuments.length > 0}
          onUploadClick={() => handleOpenUpload('government')}
        />
      }
    >
      <PageMeta title="White Card — Vault Home" noIndex noFollow />

      {/* Section 63: Background refresh subtle warning banner if refresh fails with cached data */}
      {isError && data && (
        <div className="mb-4 px-3.5 py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <AppIcon icon={Alert02Icon} size={14} />
            Couldn't refresh. Showing your last loaded data.
          </span>
          <button
            onClick={() => refetch()}
            className="underline text-[11px] font-semibold hover:opacity-80"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content Layout with restrained entrance motion */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="space-y-8 sm:space-y-10"
      >
        {/* New user empty banner if completely blank */}
        {isEmptyVault && (
          <DashboardEmptyState onUploadClick={() => handleOpenUpload('government')} />
        )}

        {/* 1. PRIMARY: Government Documents & Student Certificates */}
        <DashboardSpaceGrid
          government={summary.government}
          student={summary.student}
        />

        {/* 2. SECONDARY: Recent Documents */}
        <RecentDocumentsSection
          documents={summary.recentDocuments}
          onDownload={handleDownload}
          onShare={(doc) => setShareDoc(doc)}
          onUploadClick={() => handleOpenUpload('government')}
        />

        {/* 3. CONTEXTUAL & UTILITY ROW: Expiring Soon (if real) & Storage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {hasExpiring ? (
            <>
              <div className="lg:col-span-7">
                <ExpiringDocumentsSection documents={summary.expiringDocuments} />
              </div>
              <div className="lg:col-span-5">
                <StorageOverview
                  governmentBytes={summary.government.bytes}
                  studentBytes={summary.student.bytes}
                  totalBytes={summary.totalBytes}
                  totalCount={summary.totalCount}
                  onUploadClick={() => handleOpenUpload('government')}
                />
              </div>
            </>
          ) : (
            <div className="lg:col-span-12">
              <StorageOverview
                governmentBytes={summary.government.bytes}
                studentBytes={summary.student.bytes}
                totalBytes={summary.totalBytes}
                totalCount={summary.totalCount}
                onUploadClick={() => handleOpenUpload('government')}
              />
            </div>
          )}
        </div>

        {/* 4. UTILITY: Tag Shortcuts */}
        <TagShortcuts tags={summary.tags} />
      </motion.div>

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
