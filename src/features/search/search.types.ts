import type { DocumentFileType, DocumentSpace } from '@/types/document'

export type SearchSort =
  | 'recent'
  | 'oldest'
  | 'name_asc'
  | 'name_desc'
  | 'size_desc'
  | 'size_asc'
  | 'expiry_soon'

export type SearchScope = 'all' | DocumentSpace

export type SearchDatePreset = 'all' | 'today' | '7d' | '30d' | 'custom'

export type SearchExpiryFilter = 'all' | '7d' | '30d' | 'expired' | 'none'

export interface TagSummary {
  id?: string
  name: string
  colorKey?: string
}

export interface SearchDocumentResult {
  id: string
  title: string
  originalFilename: string
  space: DocumentSpace
  category: string | null
  mimeType: string
  fileType: DocumentFileType
  sizeBytes: number
  sizeFormatted: string
  createdAt: string
  updatedAt: string
  issuedOn?: string | null
  expiresOn?: string | null
  expiryDate?: string | null
  tags: string[]
  tagSummaries?: TagSummary[]
  notes?: string
  viewCount?: number
  clickCount?: number
}

export interface SearchState {
  q: string
  space: SearchScope
  category?: string
  tags: string[]
  fileType?: DocumentFileType
  datePreset?: SearchDatePreset
  uploadedFrom?: string
  uploadedTo?: string
  issuedFrom?: string
  issuedTo?: string
  expires?: SearchExpiryFilter
  sort: SearchSort
  view: 'grid' | 'list'
  page: number
}

export interface DocumentSearchParams {
  q?: string
  space?: SearchScope
  category?: string
  tagIds?: string[]
  tags?: string[]
  fileType?: DocumentFileType
  uploadedFrom?: string
  uploadedTo?: string
  issuedFrom?: string
  issuedTo?: string
  expires?: SearchExpiryFilter
  sort?: SearchSort
  page?: number
  pageSize?: number
}

export interface SearchQueryResult {
  documents: SearchDocumentResult[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasMore: boolean
}
