import type { NormalizedFileType } from '@/lib/files/file-type'
import type { DocumentSpace } from '@/types/document'

export interface StorageSpaceBreakdown {
  count: number
  bytes: number
  percentage: number
}

export interface StorageFileTypeItem {
  key: NormalizedFileType
  label: string
  count: number
  bytes: number
  percentage: number
}

export interface LargestStorageDocument {
  id: string
  title: string
  originalFilename: string
  mimeType: string
  sizeBytes: number
  space: DocumentSpace
  category?: string | null
  createdAt: string
  relativePercentage: number
}

export interface StorageInsight {
  id: string
  title: string
  value: string
  description?: string
  iconType: 'primary' | 'government' | 'student' | 'archive' | 'warning'
}

export interface StorageBreakdown {
  totalBytes: number
  totalDocuments: number
  totalBytesFormatted: string

  spaces: {
    government: StorageSpaceBreakdown
    student: StorageSpaceBreakdown
  }

  fileTypes: StorageFileTypeItem[]
  largestDocuments: LargestStorageDocument[]
  insights: StorageInsight[]

  // Optional future-proof quota placeholder
  quotaBytes?: number | null
}
