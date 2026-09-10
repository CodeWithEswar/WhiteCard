import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/page-container'
import { DocumentToolbar } from '../features/documents/components/document-toolbar'
import { DocumentGrid } from '../features/documents/components/document-grid'
import { UploadDialog } from '../features/upload/components/upload-dialog'
import { ShareDialog } from '../features/sharing/components/share-dialog'
import {
  useDocuments,
  useDeleteDocument,
} from '../features/documents/hooks/use-documents'
import type { DocumentFilterOptions, VaultDocument } from '../types/document'

export function GovernmentDocsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<DocumentFilterOptions>({
    space: 'government',
    fileType: 'all',
    tags: [],
    search: categoryParam || '',
    sortBy: 'updated_desc',
  })

  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, search: categoryParam }))
    } else {
      setFilters((prev) => ({ ...prev, search: '' }))
    }
  }, [categoryParam])

  const [uploadOpen, setUploadOpen] = useState(false)
  const [shareDoc, setShareDoc] = useState<VaultDocument | null>(null)
  const deleteMutation = useDeleteDocument()

  const { data: documents = [] } = useDocuments(filters)

  const handleResetFilters = () => {
    setFilters({
      space: 'government',
      fileType: 'all',
      tags: [],
      search: '',
      sortBy: 'updated_desc',
    })
  }

  const handleDelete = (doc: VaultDocument) => {
    if (confirm(`Remove "${doc.title}" from your Government Documents?`)) {
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

  return (
    <PageContainer maxWidth="wide">
      {/* Toolbar with title, count, filters, search, sort, grid/list toggle */}
      <DocumentToolbar
        title="Government Documents"
        totalCount={documents.length}
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={handleResetFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onUploadClick={() => setUploadOpen(true)}
        showSpaceFilter={false}
      />

      {/* Main Documents Grid / List */}
      <DocumentGrid
        documents={documents}
        viewMode={viewMode}
        space="government"
        onSelect={(id) => navigate(`/app/documents/${id}`)}
        onShare={(doc) => setShareDoc(doc)}
        onDelete={handleDelete}
        onDownload={handleDownload}
        onUploadClick={() => setUploadOpen(true)}
        isFiltered={isFiltered}
        onClearFilters={handleResetFilters}
      />

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        defaultSpace="government"
      />

      {/* Share Dialog */}
      <ShareDialog
        open={Boolean(shareDoc)}
        onOpenChange={(open) => !open && setShareDoc(null)}
        document={shareDoc}
      />
    </PageContainer>
  )
}
