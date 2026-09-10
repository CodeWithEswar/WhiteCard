import type { DocumentSpace } from '@/types/document'

export type UploadItemStatus =
  | 'queued'
  | 'preparing'
  | 'uploading'
  | 'metadata'
  | 'saving'
  | 'completed'
  | 'failed'
  | 'cancelled'

export type UploadStage = 'files' | 'metadata' | 'complete'

export interface UploadItemMetadata {
  title: string
  space: DocumentSpace
  category: string
  tags: string[]
  issuedDate?: string
  expiryDate?: string
  notes?: string
}

export interface UploadQueueItem {
  id: string
  file: File
  status: UploadItemStatus
  stageText?: string
  bytesUploaded?: number
  bytesTotal: number
  percent?: number // strictly when real byte-level progress is reported
  error?: string
  metadata: UploadItemMetadata
  documentId?: string
  abortController?: AbortController
}

export interface UploadValidationError {
  filename: string
  reason: string
}
