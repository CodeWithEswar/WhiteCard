import type { VaultDocument, DocumentSpace } from '@/types/document'

export interface SpaceSummary {
  space: DocumentSpace
  count: number
  bytes: number
  expiringCount?: number
  latestDoc?: VaultDocument | null
}

export interface TagSummary {
  id: string
  label: string
  count: number
  colorDot?: string
}

export interface StorageShareItem {
  name: string
  space: DocumentSpace
  bytes: number
  percent: number
  colorVar: string
}

export interface DashboardSummary {
  government: SpaceSummary
  student: SpaceSummary
  recentDocuments: VaultDocument[]
  expiringDocuments: VaultDocument[]
  tags: TagSummary[]
  totalBytes: number
  totalCount: number
}
