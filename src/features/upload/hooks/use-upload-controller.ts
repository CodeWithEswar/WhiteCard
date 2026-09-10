import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/auth-provider'
import { useUploadQueue } from './use-upload-queue'
import { useFileValidation } from './use-file-validation'
import { executeUploadItem } from '../upload.api'
import { queryKeys } from '@/lib/query-keys'
import type { UploadStage, UploadValidationError } from '../upload.types'
import type { DocumentSpace } from '@/types/document'

export function useUploadController(defaultSpace: DocumentSpace = 'government') {
  const { user } = useAuth()
  const userId = user?.id || 'anon'
  const queryClient = useQueryClient()

  const [stage, setStage] = useState<UploadStage>('files')
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<UploadValidationError[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const queue = useUploadQueue(defaultSpace)
  const { filterFiles } = useFileValidation()

  const handleFilesAdded = useCallback(
    (files: File[], space: DocumentSpace = defaultSpace) => {
      const { valid, errors } = filterFiles(files)
      setValidationErrors(errors)

      if (valid.length > 0) {
        const added = queue.addFiles(valid, space)
        if (!selectedFileId && added.length > 0) {
          setSelectedFileId(added[0].id)
        }
      }
    },
    [defaultSpace, filterFiles, queue, selectedFileId]
  )

  const startBatchUpload = useCallback(async () => {
    const queuedItems = queue.items.filter((it) => it.status === 'queued' || it.status === 'failed')
    if (queuedItems.length === 0) return

    setIsSubmitting(true)

    // Execute uploads
    for (const item of queuedItems) {
      try {
        const controller = item.abortController || new AbortController()
        const doc = await executeUploadItem({
          file: item.file,
          metadata: item.metadata,
          userId,
          signal: controller.signal,
          onStageChange: (status, text) => {
            queue.updateItemStatus(item.id, status, { stageText: text })
          },
        })

        queue.updateItemStatus(item.id, 'completed', {
          stageText: 'Complete',
          documentId: doc.id,
        })
      } catch (err: any) {
        const isCancelled = err?.message === 'Upload cancelled' || err?.name === 'AbortError'
        queue.updateItemStatus(item.id, isCancelled ? 'cancelled' : 'failed', {
          stageText: isCancelled ? 'Cancelled' : 'Failed',
          error: err?.message || 'Upload failed. Please try again.',
        })
      }
    }

    setIsSubmitting(false)
    setStage('complete')

    // Invalidate TanStack Query caches so library, dashboard, and spaces update immediately
    queryClient.invalidateQueries({ queryKey: queryKeys.documents.all(userId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary(userId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.vaultStats.summary(userId) })
  }, [queue, userId, queryClient])

  const retrySingle = useCallback(
    async (id: string) => {
      const item = queue.items.find((it) => it.id === id)
      if (!item) return

      queue.retryItem(id)
      const controller = new AbortController()

      try {
        const doc = await executeUploadItem({
          file: item.file,
          metadata: item.metadata,
          userId,
          signal: controller.signal,
          onStageChange: (status, text) => {
            queue.updateItemStatus(id, status, { stageText: text })
          },
        })

        queue.updateItemStatus(id, 'completed', {
          stageText: 'Complete',
          documentId: doc.id,
        })

        queryClient.invalidateQueries({ queryKey: queryKeys.documents.all(userId) })
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary(userId) })
      } catch (err: any) {
        const isCancelled = err?.message === 'Upload cancelled' || err?.name === 'AbortError'
        queue.updateItemStatus(id, isCancelled ? 'cancelled' : 'failed', {
          stageText: isCancelled ? 'Cancelled' : 'Failed',
          error: err?.message || 'Upload failed.',
        })
      }
    },
    [queue, userId, queryClient]
  )

  const resetAll = useCallback(() => {
    queue.resetQueue()
    setStage('files')
    setSelectedFileId(null)
    setValidationErrors([])
    setIsSubmitting(false)
  }, [queue])

  return {
    stage,
    setStage,
    selectedFileId,
    setSelectedFileId,
    validationErrors,
    clearValidationErrors: () => setValidationErrors([]),
    isSubmitting,
    queue,
    handleFilesAdded,
    startBatchUpload,
    retrySingle,
    resetAll,
  }
}
