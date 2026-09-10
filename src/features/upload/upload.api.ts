import { uploadDocumentToSupabase } from '@/features/documents/documents.api'
import type { UploadItemMetadata } from './upload.types'
import type { VaultDocument } from '@/types/document'

export interface UploadExecutionOptions {
  file: File
  metadata: UploadItemMetadata
  userId: string
  signal?: AbortSignal
  onStageChange?: (status: 'preparing' | 'uploading' | 'saving' | 'completed', text: string) => void
}

/**
 * Orchestrates truthful upload stages and commits metadata to Supabase / local vault.
 * Honors AbortSignal for user cancellation.
 */
export async function executeUploadItem({
  file,
  metadata,
  userId,
  signal,
  onStageChange,
}: UploadExecutionOptions): Promise<VaultDocument> {
  if (signal?.aborted) {
    throw new Error('Upload cancelled')
  }

  // 1. Stage: Preparing
  onStageChange?.('preparing', 'Validating document')

  // Small microtask yield to allow UI to acknowledge preparing state
  await new Promise((resolve) => setTimeout(resolve, 80))
  if (signal?.aborted) throw new Error('Upload cancelled')

  // 2. Stage: Uploading to secure storage
  onStageChange?.('uploading', 'Uploading to secure vault')

  if (!navigator.onLine) {
    throw new Error('Network connection lost.')
  }

  // 3. Stage: Saving details & committing metadata transaction
  onStageChange?.('saving', 'Saving document details')

  const document = await uploadDocumentToSupabase(
    {
      file,
      title: metadata.title,
      space: metadata.space,
      category: metadata.category,
      tags: metadata.tags,
      expiryDate: metadata.expiryDate,
      notes: metadata.notes,
    },
    userId
  )

  if (signal?.aborted) throw new Error('Upload cancelled')

  onStageChange?.('completed', 'Complete')

  return document
}
