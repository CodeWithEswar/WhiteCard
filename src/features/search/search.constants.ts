import type {
  SearchSort,
  SearchScope,
  SearchDatePreset,
  SearchExpiryFilter,
} from './search.types'
import type { DocumentFileType } from '@/types/document'

export const SEARCH_SCOPES: { id: SearchScope; label: string; ariaLabel: string }[] = [
  { id: 'all', label: 'All', ariaLabel: 'Search all documents' },
  { id: 'government', label: 'Government', ariaLabel: 'Search Government Documents' },
  { id: 'student', label: 'Student', ariaLabel: 'Search Student Certificates' },
]

export const SEARCH_FILE_TYPES: { id: DocumentFileType; label: string }[] = [
  { id: 'pdf', label: 'PDF' },
  { id: 'image', label: 'Images' },
  { id: 'zip', label: 'ZIP' },
  { id: 'doc', label: 'Documents' },
  { id: 'sheet', label: 'Spreadsheets' },
  { id: 'other', label: 'Other' },
]

export const GOVERNMENT_CATEGORIES = [
  'Identity',
  'Passport',
  'Driving Licence',
  'Vehicle',
  'Insurance',
  'Tax & Finance',
  'Other',
] as const

export const STUDENT_CATEGORIES = [
  'Degree',
  'Academic Transcript',
  'Marksheet',
  'Course Certificate',
  'Student ID',
  'Achievement',
  'Other',
] as const

export const SEARCH_DATE_PRESETS: { id: SearchDatePreset; label: string }[] = [
  { id: 'all', label: 'Any time' },
  { id: 'today', label: 'Today' },
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: 'custom', label: 'Custom range' },
]

export const SEARCH_EXPIRY_OPTIONS: { id: SearchExpiryFilter; label: string }[] = [
  { id: 'all', label: 'All expiry states' },
  { id: '7d', label: 'Expiring within 7 days' },
  { id: '30d', label: 'Expiring within 30 days' },
  { id: 'expired', label: 'Expired' },
  { id: 'none', label: 'No expiry date' },
]

export const SEARCH_SORT_OPTIONS: { id: SearchSort; label: string; shortLabel: string }[] = [
  { id: 'recent', label: 'Recently uploaded', shortLabel: 'Recent' },
  { id: 'oldest', label: 'Oldest uploaded', shortLabel: 'Oldest' },
  { id: 'name_asc', label: 'Name (A to Z)', shortLabel: 'Name A–Z' },
  { id: 'name_desc', label: 'Name (Z to A)', shortLabel: 'Name Z–A' },
  { id: 'size_desc', label: 'Largest file size', shortLabel: 'Largest' },
  { id: 'size_asc', label: 'Smallest file size', shortLabel: 'Smallest' },
  { id: 'expiry_soon', label: 'Expiry soon', shortLabel: 'Expiry soon' },
]

export const DEFAULT_SEARCH_STATE = {
  q: '',
  space: 'all' as const,
  tags: [] as string[],
  sort: 'recent' as const,
  view: 'grid' as const,
  page: 1,
}

export const SEARCH_PAGE_SIZE = 24
export const SEARCH_PAGE_SIZE_MOBILE = 16
export const SEARCH_STORAGE_VIEW_KEY = 'whitecard_search_view_mode'
