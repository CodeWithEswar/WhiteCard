import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Upload01Icon } from '@hugeicons/core-free-icons'
import { PageShell } from '../components/layout/page-shell'
import { ResponsivePageHeader } from '../components/layout/responsive-page-header'
import { PageHeaderMeta } from '../components/layout/page-header-meta'
import { DocumentToolbar } from '../features/documents/components/document-toolbar'
import { DocumentGrid } from '../features/documents/components/document-grid'
import { UploadDialog } from '../features/upload/components/upload-dialog'
import { ShareDialog } from '../features/sharing/components/share-dialog'
import { DocumentGridSkeleton, DocumentListSkeleton } from '../components/feedback/page-skeleton'
import { AppIcon } from '../components/icons/app-icon'
import { Button } from '../components/ui/button'
import {
  useDocuments,
  useDeleteDocument,
} from '../features/documents/hooks/use-documents'
import type { DocumentFilterOptions, VaultDocument } from '../types/document'

const VIEW_MODE_KEY = 'whitecard_view_mode'

export function StudentCertsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const tagParam = searchParams.get('tag')
  const sortParam = searchParams.get('sort') as DocumentFilterOptions['sortBy'] | null

  const [viewMode, setViewModeState] = useState<'grid' | 'list'>(() => {
    try {
      const saved = localStorage.getItem(VIEW_MODE_KEY)
      return saved === 'list' ? 'list' : 'grid'
    } catch {
      return 'grid'
    }
  })

  const setViewMode = (mode: 'grid' | 'list') => {
    setViewModeState(mode)
    try {
      localStorage.setItem(VIEW_MODE_KEY, mode)
    } catch {
      // Ignore
    }
  }

  const [filters, setFilters] = useState<DocumentFilterOptions>({
    space: 'student',
    fileType: 'all',
    tags: tagParam ? [tagParam] : [],
    search: categoryParam || '',
    sortBy: sortParam || 'updated_desc',
  })

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: categoryParam || '',
      tags: tagParam ? [tagParam] : prev.tags,
      sortBy: sortParam || prev.sortBy,
    }))
  }, [categoryParam, tagParam, sortParam])

  const [uploadOpen, setUploadOpen] = useState(false)
  const [shareDoc, setShareDoc] = useState<VaultDocument | null>(null)

  const { data: documents = [], isPending } = useDocuments(filters)
  const deleteMutation = useDeleteDocument()

  const handleResetFilters = () => {
    setFilters({
      space: 'student',
      fileType: 'all',
      tags: [],
      search: '',
      sortBy: 'updated_desc',
    })
    setSearchParams({})
  }

  const handleDelete = (doc: VaultDocument) => {
    if (confirm(`Permanently delete "${doc.title}"?`)) {
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

  const isFiltered = Boolean(
    (filters.fileType && filters.fileType !== 'all') ||
      (filters.tags && filters.tags.length > 0) ||
      (filters.search && filters.search.trim() !== '')
  )

  const pageTitle =
    categoryParam === 'degree'
      ? 'Degree Certificates'
      : categoryParam === 'transcript'
      ? 'Transcripts & Marks'
      : 'Student Certificates'

  const pageDescription =
    categoryParam === 'degree'
      ? 'Official degree awards, diplomas, and university graduation credentials.'
      : categoryParam === 'transcript'
      ? 'Semester marksheets, consolidated transcripts, and grade reports.'
      : 'Keep marksheets, certificates, transcripts, degrees, and academic records together.'

  return (
    <PageShell
      maxWidth="wide"
      header={
        <ResponsivePageHeader
          eyebrow="VAULT SPACE"
          title={pageTitle}
          description={pageDescription}
          primaryAction={
            <Button
              onClick={() => setUploadOpen(true)}
              className="h-9 px-3.5 rounded-md font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-2xs active:scale-[0.985]"
            >
              <AppIcon icon={Upload01Icon} size={15} />
              <span>Upload Certificate</span>
            </Button>
          }
          metadata={<PageHeaderMeta count={documents.length} />}
        />
      }
    >
      {/* Search, Filter, Sort & View Mode Toolbar */}
      <DocumentToolbar
        totalCount={documents.length}
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={handleResetFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onUploadClick={() => setUploadOpen(true)}
        showSpaceFilter={false}
        showHeader={false}
      />

      {/* Main Documents Grid / List (Cache-first: render skeleton only if no cache exists) */}
      {isPending && documents.length === 0 ? (
        viewMode === 'list' ? (
          <DocumentListSkeleton count={6} />
        ) : (
          <DocumentGridSkeleton count={6} />
        )
      ) : (
        <DocumentGrid
          documents={documents}
          viewMode={viewMode}
          space="student"
          onSelect={(id) => navigate(`/app/documents/${id}`)}
          onShare={(doc) => setShareDoc(doc)}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onUploadClick={() => setUploadOpen(true)}
          isFiltered={isFiltered}
          onClearFilters={handleResetFilters}
        />
      )}

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        defaultSpace="student"
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
