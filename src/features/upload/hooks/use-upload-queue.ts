import { useState, useCallback, useMemo } from 'react'
import type { UploadQueueItem, UploadItemStatus, UploadItemMetadata } from '../upload.types'
import { sanitizeSuggestedTitle } from '../upload.utils'
import type { DocumentSpace } from '@/types/document'

export function useUploadQueue(defaultSpace: DocumentSpace = 'government') {
  const [items, setItems] = useState<UploadQueueItem[]>([])

  const addFiles = useCallback(
    (files: File[], space: DocumentSpace = defaultSpace) => {
      const newItems: UploadQueueItem[] = files.map((file, idx) => ({
        id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        status: 'queued',
        stageText: 'Queued',
        bytesTotal: file.size,
        bytesUploaded: 0,
        metadata: {
          title: sanitizeSuggestedTitle(file.name),
          space,
          category: space === 'government' ? 'Identity' : 'Degree',
          tags: [],
          notes: '',
        },
        abortController: new AbortController(),
      }))

      setItems((prev) => [...prev, ...newItems])
      return newItems
    },
    [defaultSpace]
  )

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((it) => it.id === id)
      if (item && item.status === 'uploading' && item.abortController) {
        item.abortController.abort()
      }
      return prev.filter((it) => it.id !== id)
    })
  }, [])

  const cancelItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          if (it.abortController) {
            it.abortController.abort()
          }
          return {
            ...it,
            status: 'cancelled',
            stageText: 'Cancelled',
            error: 'Upload cancelled by user',
          }
        }
        return it
      })
    )
  }, [])

  const retryItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          return {
            ...it,
            status: 'queued',
            stageText: 'Ready to retry',
            error: undefined,
            abortController: new AbortController(),
          }
        }
        return it
      })
    )
  }, [])

  const updateItemStatus = useCallback(
    (
      id: string,
      status: UploadItemStatus,
      updates?: {
        stageText?: string
        percent?: number
        bytesUploaded?: number
        error?: string
        documentId?: string
      }
    ) => {
      setItems((prev) =>
        prev.map((it) => {
          if (it.id === id) {
            return {
              ...it,
              status,
              ...(updates || {}),
            }
          }
          return it
        })
      )
    },
    []
  )

  const updateItemMetadata = useCallback(
    (id: string, updates: Partial<UploadItemMetadata>) => {
      setItems((prev) =>
        prev.map((it) => {
          if (it.id === id) {
            return {
              ...it,
              metadata: {
                ...it.metadata,
                ...updates,
              },
            }
          }
          return it
        })
      )
    },
    []
  )

  const clearCompleted = useCallback(() => {
    setItems((prev) => prev.filter((it) => it.status !== 'completed'))
  }, [])

  const resetQueue = useCallback(() => {
    items.forEach((it) => {
      if (it.status === 'uploading' && it.abortController) {
        it.abortController.abort()
      }
    })
    setItems([])
  }, [items])

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalCount = items.length
    const completedCount = items.filter((it) => it.status === 'completed').length
    const failedCount = items.filter((it) => it.status === 'failed' || it.status === 'cancelled').length
    const activeCount = items.filter((it) => it.status === 'uploading' || it.status === 'preparing' || it.status === 'saving').length
    const totalBytes = items.reduce((acc, it) => acc + it.bytesTotal, 0)
    const totalUploadedBytes = items.reduce((acc, it) => acc + (it.bytesUploaded || 0), 0)
    const hasAnyUploaded = items.some((it) => it.status === 'completed')
    const allCompleted = totalCount > 0 && completedCount === totalCount

    return {
      totalCount,
      completedCount,
      failedCount,
      activeCount,
      totalBytes,
      totalUploadedBytes,
      hasAnyUploaded,
      allCompleted,
    }
  }, [items])

  return {
    items,
    addFiles,
    removeItem,
    cancelItem,
    retryItem,
    updateItemStatus,
    updateItemMetadata,
    clearCompleted,
    resetQueue,
    metrics,
  }
}
