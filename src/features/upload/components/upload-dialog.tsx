import { useState } from 'react'
import {
  Tick02Icon,
  Upload01Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  CheckmarkBadge01Icon,
} from '@hugeicons/core-free-icons'
import { ResponsiveDialog } from '../../../components/layout/responsive-dialog'
import { UploadDropzone } from './upload-dropzone'
import { UploadQueue } from './upload-queue'
import type { UploadQueueItem } from './upload-item'
import { DocumentMetadataForm, type DocumentMetadataValues } from './document-metadata-form'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'
import { useUploadDocument } from '../../documents/hooks/use-documents'
import type { DocumentSpace } from '../../../types/document'

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultSpace?: DocumentSpace
}

export function UploadDialog({
  open,
  onOpenChange,
  defaultSpace = 'government',
}: UploadDialogProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [queue, setQueue] = useState<UploadQueueItem[]>([])
  const [metadata, setMetadata] = useState<DocumentMetadataValues>({
    space: defaultSpace,
    title: '',
    category: '',
    tags: [],
    expiryDate: '',
    notes: '',
  })

  const uploadMutation = useUploadDocument()

  const resetState = () => {
    setStep(1)
    setQueue([])
    setMetadata({
      space: defaultSpace,
      title: '',
      category: '',
      tags: [],
      expiryDate: '',
      notes: '',
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTimeout(resetState, 200)
    }
    onOpenChange(newOpen)
  }

  const handleFilesSelected = (files: File[]) => {
    const newItems: UploadQueueItem[] = files.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      file: f,
      progress: 0,
      status: 'queued',
    }))

    setQueue((prev) => [...prev, ...newItems])
    // Auto-populate title from first file if blank
    if (!metadata.title && files[0]) {
      const cleanTitle = files[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      setMetadata((prev) => ({ ...prev, title: cleanTitle }))
    }
    setStep(2)
  }

  const handleRemoveItem = (id: string) => {
    const updated = queue.filter((it) => it.id !== id)
    setQueue(updated)
    if (updated.length === 0) {
      setStep(1)
    }
  }

  const handleStartUpload = async () => {
    setStep(4)

    // Simulate animated upload progress for realistic feedback
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i]
      setQueue((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: 'uploading' } : it))
      )

      for (let p = 20; p <= 100; p += 30) {
        setQueue((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, progress: p } : it))
        )
        await new Promise((r) => setTimeout(r, 60))
      }

      await uploadMutation.mutateAsync({
        file: item.file,
        title: queue.length === 1 ? metadata.title : undefined,
        space: metadata.space,
        category: metadata.category,
        tags: metadata.tags,
        expiryDate: metadata.expiryDate ? new Date(metadata.expiryDate).toISOString() : null,
        notes: metadata.notes,
      })

      setQueue((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, status: 'completed', progress: 100 } : it
        )
      )
    }

    setStep(5)
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={
        step === 5
          ? 'Deposit Complete'
          : step === 4
            ? 'Depositing to Vault...'
            : 'Deposit Important Document'
      }
      description={
        step === 1
          ? 'Add files to your personal vault'
          : step === 2
            ? 'Review your selected files'
            : step === 3
              ? 'Configure space and details'
              : step === 4
                ? 'Encrypting and saving original files'
                : 'Your documents are safely stored in White Card'
      }
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Step Indicator */}
        {step <= 3 && (
          <div className="flex items-center justify-between pb-3 border-b border-border/60 text-[11px] text-muted-foreground font-mono">
            <span className={step === 1 ? 'font-bold text-foreground' : ''}>
              1. Choose
            </span>
            <span className="text-border-strong">→</span>
            <span className={step === 2 ? 'font-bold text-foreground' : ''}>
              2. Review ({queue.length})
            </span>
            <span className="text-border-strong">→</span>
            <span className={step === 3 ? 'font-bold text-foreground' : ''}>
              3. Metadata
            </span>
          </div>
        )}

        {/* Step 1: Dropzone */}
        {step === 1 && (
          <UploadDropzone onFilesSelected={handleFilesSelected} />
        )}

        {/* Step 2: Queue Review */}
        {step === 2 && (
          <div className="space-y-4">
            <UploadQueue items={queue} onRemove={handleRemoveItem} />

            <div className="pt-2 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
                className="text-xs h-9 px-3 rounded-xl border-border gap-1.5"
              >
                <AppIcon icon={ArrowLeft01Icon} size={14} />
                <span>Add More</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setStep(3)}
                className="text-xs h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
              >
                <span>Continue</span>
                <AppIcon icon={ArrowRight01Icon} size={14} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Metadata Form */}
        {step === 3 && (
          <div className="space-y-4">
            <DocumentMetadataForm
              values={metadata}
              onChange={setMetadata}
            />

            <div className="pt-4 flex items-center justify-between border-t border-border/60">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(2)}
                className="text-xs h-9 px-3 rounded-xl border-border gap-1.5"
              >
                <AppIcon icon={ArrowLeft01Icon} size={14} />
                <span>Back</span>
              </Button>

              <Button
                size="sm"
                onClick={handleStartUpload}
                className="text-xs h-9 px-5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-xs"
              >
                <AppIcon icon={Upload01Icon} size={15} />
                <span>Deposit Document</span>
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Upload Progress */}
        {step === 4 && (
          <div className="py-6 space-y-4">
            <UploadQueue items={queue} onRemove={() => { }} />
            <p className="text-center text-xs text-muted-foreground animate-pulse">
              Encrypting bytes and verifying checksum integrity...
            </p>
          </div>
        )}

        {/* Step 5: Done Confirmation */}
        {step === 5 && (
          <div className="py-8 text-center space-y-4">
            <div className="size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-sm">
              <AppIcon icon={CheckmarkBadge01Icon} size={32} />
            </div>

            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="text-base font-bold text-foreground tracking-tight">
                Deposit Successful
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {queue.length} file{queue.length > 1 ? 's' : ''} stored securely in your {metadata.space === 'government' ? 'Government' : 'Student'} space.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-2">
              <Button
                onClick={() => handleOpenChange(false)}
                className="h-10 px-6 rounded-xl font-medium text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
              >
                <AppIcon icon={Tick02Icon} size={15} />
                <span>View in Vault</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </ResponsiveDialog>
  )
}
