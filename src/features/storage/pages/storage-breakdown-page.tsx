import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Upload01Icon,
  RefreshIcon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PageShell } from '@/components/layout/page-shell'
import { ResponsivePageHeader } from '@/components/layout/responsive-page-header'
import { PageMeta } from '@/components/seo/page-meta'
import { ErrorState } from '@/components/feedback/error-state'
import { UploadDialog } from '@/features/upload/components/upload-dialog'

import { useStorageBreakdown } from '../hooks/use-storage-breakdown'
import { StorageSummaryHero } from '../components/storage-summary-hero'
import { StorageSpaceBreakdown } from '../components/storage-space-breakdown'
import { StorageFileTypeList } from '../components/storage-file-type-list'
import { StorageLargestFiles } from '../components/storage-largest-files'
import { StorageInsightStrip } from '../components/storage-insight-strip'
import { StorageCleanupPanel } from '../components/storage-cleanup-panel'
import { StorageEmptyState } from '../components/storage-empty-state'
import { StorageSkeleton } from '../components/storage-skeleton'

export function StorageBreakdownPage() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const { data, isInitialLoading, isFetching, error, refetch } = useStorageBreakdown()

  const totalDocuments = data?.totalDocuments || 0
  const formattedBytes = data?.totalBytesFormatted || '0 B'

  // Header Metadata Row
  const headerMeta = data && totalDocuments > 0 ? (
    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
      <span>{totalDocuments} {totalDocuments === 1 ? 'document' : 'documents'}</span>
      <span>•</span>
      <span className="font-semibold text-foreground">{formattedBytes} stored</span>
      {isFetching && (
        <>
          <span>•</span>
          <span className="text-[10.5px] text-muted-foreground/75 flex items-center gap-1 animate-pulse">
            <AppIcon icon={RefreshIcon} size={11} className="animate-spin" />
            Updating
          </span>
        </>
      )}
    </div>
  ) : undefined

  return (
    <>
      <PageMeta
        title="Storage Breakdown — White Card Vault"
        description="Inspect how your documents utilize storage across Government and Student spaces."
      />

      <PageShell
        maxWidth="default"
        header={
          <ResponsivePageHeader
            eyebrow="VAULT INSIGHT"
            title="Storage Breakdown"
            description="Understand how your documents use storage across Government and Student spaces."
            metadata={headerMeta}
            primaryAction={
              <Button
                onClick={() => setUploadOpen(true)}
                className="gap-2 h-9 px-4 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer"
              >
                <AppIcon icon={Upload01Icon} size={15} />
                <span>Upload Document</span>
              </Button>
            }
          />
        }
      >
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="space-y-8"
        >
          {/* Background Refresh Alert with cached data preserved (Section 53) */}
          {error && data && (
            <Alert className="rounded-2xl border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
              <AppIcon icon={AlertCircleIcon} size={16} className="text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-xs">
                Couldn’t refresh latest storage details. Showing your last loaded data.
              </AlertDescription>
            </Alert>
          )}

          {/* 1. Initial Loading Skeleton */}
          {isInitialLoading && <StorageSkeleton />}

          {/* 2. Error State without Cached Data */}
          {!isInitialLoading && error && !data && (
            <ErrorState
              title="Storage details couldn’t be loaded"
              description="We encountered an issue retrieving your vault storage metrics."
              onRetry={() => refetch()}
            />
          )}

          {/* 3. Empty State for 0 Documents */}
          {!isInitialLoading && data && totalDocuments === 0 && (
            <StorageEmptyState onUploadClick={() => setUploadOpen(true)} />
          )}

          {/* 4. Full Storage Breakdown Content */}
          {!isInitialLoading && data && totalDocuments > 0 && (
            <div className="space-y-8">
              {/* Module 1: Storage Summary Hero */}
              <StorageSummaryHero data={data} />

              {/* Module 2: Space Distribution & File Type Breakdown Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                <StorageSpaceBreakdown
                  government={data.spaces.government}
                  student={data.spaces.student}
                />
                <StorageFileTypeList
                  fileTypes={data.fileTypes}
                  totalBytes={data.totalBytes}
                />
              </div>

              {/* Module 3: Largest Documents List */}
              <StorageLargestFiles documents={data.largestDocuments} />

              {/* Module 4: Insights & Storage Audit Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                <StorageInsightStrip insights={data.insights} />
                <StorageCleanupPanel />
              </div>
            </div>
          )}
        </motion.div>
      </PageShell>

      {/* Upload Dialog Modal */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
      />
    </>
  )
}
