import type { SearchState } from './search.types'

/**
 * Normalizes a search query string:
 * - Trims leading/trailing whitespace
 * - Collapses consecutive whitespace into a single space
 * - Lowercases for matching
 */
export function normalizeSearchQuery(query?: string): string {
  if (!query) return ''
  return query.trim().replace(/\s+/g, ' ').toLowerCase()
}

export interface HighlightSegment {
  text: string
  match: boolean
}

/**
 * Splits text into segments marked with `match: true` for the given search query.
 * Safe against special regex characters.
 */
export function highlightTextMatch(text: string, query?: string): HighlightSegment[] {
  if (!text) return []
  const normalizedQuery = normalizeSearchQuery(query)
  if (!normalizedQuery) {
    return [{ text, match: false }]
  }

  // Escape regex special characters
  const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const parts = text.split(regex)

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      match: part.toLowerCase() === normalizedQuery,
    }))
}

/**
 * Calculates active filters count (excluding search text, default space 'all', sort, and page)
 */
export function getActiveFilterCount(state: Partial<SearchState>): number {
  let count = 0
  if (state.space && state.space !== 'all') count += 1
  if (state.category) count += 1
  if (state.fileType) count += 1
  if (state.tags && state.tags.length > 0) count += state.tags.length
  if (state.datePreset && state.datePreset !== 'all') count += 1
  if (state.uploadedFrom || state.uploadedTo) count += 1
  if (state.expires && state.expires !== 'all') count += 1
  return count
}

/**
 * Formats bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Formats a date to short readable string e.g. "Sep 10, 2026"
 */
export function formatSearchDate(dateString?: string | null): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Calculates days until expiry and label
 */
export function getExpiryStatus(expiresOn?: string | null): {
  isExpiringSoon: boolean
  isExpired: boolean
  daysRemaining: number
  label: string
} | null {
  if (!expiresOn) return null
  const expiryDate = new Date(expiresOn)
  if (isNaN(expiryDate.getTime())) return null

  const now = new Date()
  const diffMs = expiryDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return {
      isExpiringSoon: false,
      isExpired: true,
      daysRemaining: diffDays,
      label: `Expired ${Math.abs(diffDays)}d ago`,
    }
  }

  if (diffDays <= 30) {
    return {
      isExpiringSoon: true,
      isExpired: false,
      daysRemaining: diffDays,
      label: diffDays === 0 ? 'Expires today' : `${diffDays}d remaining`,
    }
  }

  return {
    isExpiringSoon: false,
    isExpired: false,
    daysRemaining: diffDays,
    label: `Expires in ${diffDays}d`,
  }
}
