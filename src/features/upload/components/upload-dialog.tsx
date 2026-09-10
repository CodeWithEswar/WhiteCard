import { useEffect } from 'react'
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Upload01Icon,
  Alert02Icon,
} from '@hugeicons/core-free-icons'
import { ResponsiveDialog } from '@/components/layout/responsive-dialog'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { useUploadController } from '../hooks/use-upload-controller'
import { UploadStageIndicator } from './upload-stage-indicator'
import { UploadDropzone } from './upload-dropzone'
import { UploadQueue } from './upload-queue'
import { UploadMetadataForm } from './upload-metadata-form'
import { UploadCompleteState } from './upload-complete-state'
import { useNavigate } from 'react-router-dom'
import type { DocumentSpace } from '@/types/document'

export interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultSpace?: DocumentSpace
}

export function UploadDialog({
  open,
  onOpenChange,
  defaultSpace = 'government',
}: UploadDialogProps) {
  const navigate = useNavigate()
  const {
    stage,
    setStage,
    selectedFileId,
    setSelectedFileId,
    validationErrors,
    clearValidationErrors,
    isSubmitting,
    queue,
    handleFilesAdded,
    startBatchUpload,
    retrySingle,
    resetAll,
  } = useUploadController(defaultSpace)

  // Reset state when closing dialog
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        resetAll()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [open, resetAll])

  const selectedItem =
    queue.items.find((it) => it.id === selectedFileId) || queue.items[0] || null

  const hasFiles = queue.items.length > 0

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleViewDocuments = () => {
    onOpenChange(false)
    const targetSpace = selectedItem?.metadata.space || defaultSpace
    navigate(`/app/${targetSpace}`)
  }

  const handleUploadMore = () => {
    queue.resetQueue()
    setStage('files')
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!isSubmitting) {
          onOpenChange(newOpen)
        }
      }}
      maxWidth="2xl"
      className="max-w-3xl md:max-w-4xl"
      title={
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              {stage === 'complete' ? 'Upload Summary' : 'Upload Documents'}
            </h2>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider hidden sm:inline">
              Private Document Vault
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-normal">
            {stage === 'files'
              ? 'Select official identity files or certificates to add to your vault.'
              : stage === 'metadata'
              ? 'Review titles, categories, tags, and renewal dates before saving.'
              : 'Your documents have been securely committed to White Card.'}
          </p>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Stage Indicator */}
        <UploadStageIndicator currentStage={stage} />

        {/* Validation Errors Notice if any */}
        {validationErrors.length > 0 && (
          <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive text-xs space-y-1">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5">
                <AppIcon icon={Alert02Icon} size={14} />
                Some files could not be added:
              </span>
              <button
                type="button"
                onClick={clearValidationErrors}
                className="text-[11px] underline hover:opacity-80"
              >
                Dismiss
              </button>
            </div>
            <ul className="list-disc list-inside text-[11px] space-y-0.5 opacity-90 pl-1">
              {validationErrors.map((err, i) => (
                <li key={i}>
                  <span className="font-medium">{err.filename}:</span> {err.reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ================= STAGE 1: FILES ================= */}
        {stage === 'files' && (
          <div className="space-y-4">
            {!hasFiles ? (
              <UploadDropzone
                onFilesSelected={(files) => handleFilesAdded(files, defaultSpace)}
                disabled={isSubmitting}
              />
            ) : (
              <>
                <UploadDropzone
                  onFilesSelected={(files) => handleFilesAdded(files, defaultSpace)}
                  compact
                  disabled={isSubmitting}
                />
                <UploadQueue
                  items={queue.items}
                  onRemove={queue.removeItem}
                  onCancel={queue.cancelItem}
                  onRetry={retrySingle}
                  selectedId={selectedFileId}
                  onSelect={setSelectedFileId}
                />
              </>
            )}

            {/* Stage 1 Footer Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-xs h-9 rounded-xl border-border"
              >
                Cancel
              </Button>

              {hasFiles && (
                <Button
                  size="sm"
                  onClick={() => setStage('metadata')}
                  className="text-xs h-9 px-4 rounded-xl gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  <span>Next: Details</span>
                  <AppIcon icon={ArrowRight01Icon} size={14} />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ================= STAGE 2: METADATA ================= */}
        {stage === 'metadata' && (
          <div className="space-y-4">
            {queue.items.length === 1 && selectedItem ? (
              // Single file metadata form
              <UploadMetadataForm
                metadata={selectedItem.metadata}
                originalFilename={selectedItem.file.name}
                onChange={(updates) => queue.updateItemMetadata(selectedItem.id, updates)}
                disabled={isSubmitting}
              />
            ) : (
              // Multi-file: Desktop split view (Left list, Right form)
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                <div className="md:col-span-5 space-y-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block px-0.5">
                    Select File to Edit ({queue.items.length})
                  </span>
                  <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
                    {queue.items.map((it) => {
                      const isCur = it.id === selectedFileId
                      return (
                        <button
                          key={it.id}
                          type="button"
                          onClick={() => setSelectedFileId(it.id)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${
                            isCur
                              ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-xs ring-1 ring-primary/30'
                              : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40'
                          }`}
                        >
                          <span className="truncate flex-1">{it.metadata.title || it.file.name}</span>
                          <span className="text-[10.5px] font-mono shrink-0 capitalize text-muted-foreground">
                            {it.metadata.space}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="md:col-span-7">
                  {selectedItem ? (
                    <UploadMetadataForm
                      metadata={selectedItem.metadata}
                      originalFilename={selectedItem.file.name}
                      onChange={(updates) => queue.updateItemMetadata(selectedItem.id, updates)}
                      disabled={isSubmitting}
                    />
                  ) : (
                    <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                      Select a file on the left to edit its details.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stage 2 Footer Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStage('files')}
                disabled={isSubmitting}
                className="text-xs h-9 rounded-xl border-border gap-1.5"
              >
                <AppIcon icon={ArrowLeft01Icon} size={14} />
                <span>Back</span>
              </Button>

              <Button
                size="sm"
                onClick={startBatchUpload}
                disabled={isSubmitting || queue.items.length === 0}
                className="text-xs h-9 px-5 rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium"
              >
                <AppIcon icon={Upload01Icon} size={15} />
                <span>
                  {isSubmitting
                    ? 'Saving details…'
                    : queue.items.length === 1
                    ? 'Upload Document'
                    : `Upload ${queue.items.length} Documents`}
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* ================= STAGE 3: COMPLETE ================= */}
        {stage === 'complete' && (
          <UploadCompleteState
            items={queue.items}
            onViewDocuments={handleViewDocuments}
            onUploadMore={handleUploadMore}
            onDone={handleClose}
            onRetryFailed={retrySingle}
          />
        )}
      </div>
    </ResponsiveDialog>
  )
}
