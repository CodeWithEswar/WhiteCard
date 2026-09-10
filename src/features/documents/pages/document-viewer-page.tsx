import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageMeta } from '@/components/seo/page-meta'
import { ErrorState } from '@/components/feedback/error-state'
import { ShareDialog } from '@/features/sharing/components/share-dialog'
import { resolvePreviewStrategy, getPreviewCapabilities } from '@/config/document-preview'
import {
  useDocument,
  useUpdateDocument,
  useDeleteDocument,
  useRecordDocumentView,
  useDocumentDownload,
} from '../hooks/use-documents'
import { useDocumentPreview } from '../hooks/use-document-preview'
import { useDocumentZoom } from '../hooks/use-document-zoom'
import { useDocumentViewer } from '../hooks/use-document-viewer'
import { useDocumentKeyboardShortcuts } from '../hooks/use-document-keyboard-shortcuts'
import { DocumentViewerShell } from '../components/viewer/document-viewer-shell'
import { DocumentViewerHeader } from '../components/viewer/document-viewer-header'
import { DocumentViewerCanvas } from '../components/viewer/document-viewer-canvas'
import { DocumentViewerToolbar } from '../components/viewer/document-viewer-toolbar'
import { DocumentDetailsSheet } from '../components/viewer/document-details-sheet'
import { DocumentViewerSkeleton } from '../components/viewer/document-viewer-skeleton'
import { DocumentPreviewError } from '../components/viewer/document-preview-error'
import { PreviewRouter } from '../components/previews/preview-router'

export function DocumentViewerPage() {
  const { id, documentId } = useParams<{ id?: string; documentId?: string }>()
  const targetId = documentId || id
  const navigate = useNavigate()

  // Primary Queries & Mutations
  const { data: document, isLoading, error: queryError } = useDocument(targetId)
  const updateMutation = useUpdateDocument()
  const deleteMutation = useDeleteDocument()
  const recordView = useRecordDocumentView()
  const { download } = useDocumentDownload()

  // Track view once per document load
  const viewedDocRef = useRef<string | null>(null)
  useEffect(() => {
    if (targetId && viewedDocRef.current !== targetId) {
      viewedDocRef.current = targetId
      recordView.mutate(targetId)
    }
  }, [targetId])

  // Viewer UI State & Hooks
  const viewer = useDocumentViewer()
  const zoom = useDocumentZoom()
  const preview = useDocumentPreview(document || null)

  // Share Dialog state
  const [shareOpen, setShareOpen] = useState(false)

  // Strategy & Capabilities
  const strategy = resolvePreviewStrategy({
    mimeType: document?.mimeType,
    filename: document?.originalFilename,
  })
  const capabilities = getPreviewCapabilities(strategy)

  // Actions
  const handleDownload = () => {
    if (document) download(document)
  }

  const handleDelete = () => {
    if (!document) return
    deleteMutation.mutate(document.id, {
      onSuccess: () => {
        viewer.closeDetails()
        navigate(`/app/${document.space}`)
      },
    })
  }

  const handleSaveUpdates = async (updates: {
    title: string
    category: string
    notes: string
    expiryDate: string | null
  }) => {
    if (!document) return
    await updateMutation.mutateAsync({
      id: document.id,
      updates,
    })
  }

  // Keyboard Shortcuts Hook
  useDocumentKeyboardShortcuts({
    onToggleDetails: viewer.toggleDetails,
    onCloseDetails: viewer.closeDetails,
    onDownload: handleDownload,
    onZoomIn: zoom.zoomIn,
    onZoomOut: zoom.zoomOut,
    onResetZoom: zoom.resetZoom,
    onToggleFocus: viewer.toggleFocusMode,
    enabled: Boolean(document),
  })

  // Cold loading state
  if (isLoading && !document) {
    return (
      <DocumentViewerShell isFocusMode={false}>
        <PageMeta title="White Card — Loading Document" noIndex noFollow />
        <DocumentViewerSkeleton />
      </DocumentViewerShell>
    )
  }

  // Not found or inaccessible error state
  if (!document || queryError) {
    return (
      <DocumentViewerShell isFocusMode={false}>
        <PageMeta title="White Card — Document Unavailable" noIndex noFollow />
        <div className="h-full w-full flex items-center justify-center p-8">
          <ErrorState
            title="Document Unavailable"
            description="This document may have been relocated or removed from your vault."
            retryLabel="Back to Vault"
            onRetry={() => navigate('/app')}
          />
        </div>
      </DocumentViewerShell>
    )
  }

  return (
    <DocumentViewerShell isFocusMode={viewer.isFocusMode}>
      <PageMeta
        title={`White Card — ${document.title}`}
        description={`Original file: ${document.originalFilename}`}
        noIndex
        noFollow
      />

      {/* 1. Immersive Restrained Header (64-72px) */}
      <DocumentViewerHeader
        document={document}
        isDetailsOpen={viewer.isDetailsOpen}
        isFocusMode={viewer.isFocusMode}
        onToggleDetails={viewer.toggleDetails}
        onToggleFocusMode={viewer.toggleFocusMode}
        onOpenEdit={() => {
          viewer.openDetails()
          viewer.setIsEditingDetails(true)
        }}
        onShare={() => setShareOpen(true)}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

      {/* 2. Full-Screen Viewing Canvas */}
      <DocumentViewerCanvas>
        {preview.error ? (
          <DocumentPreviewError
            onRetry={preview.refreshUrl}
            onDownload={handleDownload}
          />
        ) : (
          <PreviewRouter
            document={document}
            fileUrl={preview.signedUrl}
            rawContent={preview.rawContent}
            arrayBuffer={preview.arrayBuffer}
            isLoadingBytes={preview.isLoadingBytes}
            lineWrap={viewer.lineWrap}
            zoom={zoom}
            onFetchContent={preview.fetchContent}
            onDownload={handleDownload}
          />
        )}

        {/* 3. Contextual Floating Toolbar */}
        <DocumentViewerToolbar
          strategy={strategy}
          capabilities={capabilities}
          zoom={zoom}
          lineWrap={viewer.lineWrap}
          isFocusMode={viewer.isFocusMode}
          onToggleLineWrap={viewer.toggleLineWrap}
          onToggleFocusMode={viewer.toggleFocusMode}
        />
      </DocumentViewerCanvas>

      {/* 4. Responsive Details Sheet (Right on desktop, Bottom on mobile) */}
      <DocumentDetailsSheet
        document={document}
        open={viewer.isDetailsOpen}
        onOpenChange={(open) => {
          if (!open) viewer.closeDetails()
          else viewer.openDetails()
        }}
        isEditing={viewer.isEditingDetails}
        onToggleEdit={viewer.setIsEditingDetails}
        onSaveUpdates={handleSaveUpdates}
        onOpenShare={() => setShareOpen(true)}
        onDownload={handleDownload}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />

      {/* 5. Existing Cryptographic Direct Sharing Dialog */}
      <ShareDialog
        document={document}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </DocumentViewerShell>
  )
}
