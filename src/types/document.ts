export type DocumentSpace = 'government' | 'student'

export type DocumentFileType = 'pdf' | 'image' | 'zip' | 'doc' | 'sheet' | 'other'

export interface VaultDocument {
  id: string
  title: string
  originalFilename: string
  fileType: DocumentFileType
  mimeType: string
  space: DocumentSpace
  category: string
  viewCount?: number
  clickCount?: number
  sizeBytes: number
  sizeFormatted: string
  createdAt: string
  updatedAt: string
  expiryDate?: string | null
  tags: string[]
  notes?: string
  fileUrl?: string
  previewUrl?: string
  sharedDirectLink?: {
    token: string
    expiresAt: string
    createdAt: string
    viewCount?: number
    clickCount?: number
  } | null
}

export interface DocumentFilterOptions {
  search?: string
  space?: DocumentSpace | 'all'
  fileType?: DocumentFileType | 'all'
  tags?: string[]
  sortBy?: 'updated_desc' | 'updated_asc' | 'name_asc' | 'size_desc'
}

export interface UploadDocumentPayload {
  file: File
  title?: string
  space: DocumentSpace
  category?: string
  tags?: string[]
  expiryDate?: string | null
  notes?: string
}

export const DOCUMENT_SPACES: readonly DocumentSpace[] = ['government', 'student'] as const
export const DOCUMENT_FILE_TYPES: readonly DocumentFileType[] = ['pdf', 'image', 'zip', 'doc', 'sheet', 'other'] as const
