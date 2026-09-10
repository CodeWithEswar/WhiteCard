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

export interface FileTypeDistributionItem {
  type: string
  label: string
  count: number
  color: string
}

export interface VaultHealthSummary {
  validCount: number
  expiringCount: number
  expiredCount: number
  healthPercentage: number
}

export interface VaultTimelineItem {
  month: string
  count: number
  cumulative: number
}

export interface DashboardSummary {
  government: SpaceSummary
  student: SpaceSummary
  recentDocuments: VaultDocument[]
  expiringDocuments: VaultDocument[]
  tags: TagSummary[]
  totalBytes: number
  totalCount: number
  fileTypes: FileTypeDistributionItem[]
  health: VaultHealthSummary
  timeline: VaultTimelineItem[]
}
