import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type {
  SearchState,
  SearchScope,
  SearchSort,
  SearchDatePreset,
  SearchExpiryFilter,
} from '../search.types'
import type { DocumentFileType } from '@/types/document'
import { SEARCH_STORAGE_VIEW_KEY } from '../search.constants'

const VALID_SCOPES: SearchScope[] = ['all', 'government', 'student']
const VALID_FILE_TYPES: DocumentFileType[] = ['pdf', 'image', 'zip', 'doc', 'sheet', 'other']
const VALID_SORTS: SearchSort[] = [
  'recent',
  'oldest',
  'name_asc',
  'name_desc',
  'size_desc',
  'size_asc',
  'expiry_soon',
]
const VALID_EXPIRY: SearchExpiryFilter[] = ['all', '7d', '30d', 'expired', 'none']
const VALID_DATE_PRESETS: SearchDatePreset[] = ['all', 'today', '7d', '30d', 'custom']

function getInitialViewMode(): 'grid' | 'list' {
  if (typeof window === 'undefined') return 'grid'
  try {
    const isMobile = window.innerWidth < 640
    const saved = localStorage.getItem(SEARCH_STORAGE_VIEW_KEY)
    if (saved === 'grid' || saved === 'list') {
      return saved
    }
    return isMobile ? 'list' : 'grid'
  } catch {
    return 'grid'
  }
}

export function useSearchParamsState() {
  const [searchParams, setSearchParams] = useSearchParams()

  // 1. Parse current URLSearchParams into typed SearchState
  const state: SearchState = useMemo(() => {
    const q = searchParams.get('q') || ''

    const rawSpace = searchParams.get('space') as SearchScope | null
    const space: SearchScope = rawSpace && VALID_SCOPES.includes(rawSpace) ? rawSpace : 'all'

    const category = searchParams.get('category') || undefined

    // Collect tags: can be ?tag=foo&tag=bar or ?tags=foo,bar
    const tagsFromParam = searchParams.getAll('tag')
    const commaTags = searchParams.get('tags') ? searchParams.get('tags')!.split(',') : []
    const rawTags = [...tagsFromParam, ...commaTags].map((t) => t.trim()).filter(Boolean)
    const tags = Array.from(new Set(rawTags))

    const rawFileType = searchParams.get('type') as DocumentFileType | null
    const fileType =
      rawFileType && VALID_FILE_TYPES.includes(rawFileType) ? rawFileType : undefined

    const rawDatePreset = searchParams.get('datePreset') as SearchDatePreset | null
    const datePreset =
      rawDatePreset && VALID_DATE_PRESETS.includes(rawDatePreset) ? rawDatePreset : 'all'

    const uploadedFrom = searchParams.get('uploadedFrom') || undefined
    const uploadedTo = searchParams.get('uploadedTo') || undefined
    const issuedFrom = searchParams.get('issuedFrom') || undefined
    const issuedTo = searchParams.get('issuedTo') || undefined

    const rawExpires = searchParams.get('expires') as SearchExpiryFilter | null
    const expires =
      rawExpires && VALID_EXPIRY.includes(rawExpires) ? rawExpires : 'all'

    const rawSort = searchParams.get('sort') as SearchSort | null
    const sort: SearchSort = rawSort && VALID_SORTS.includes(rawSort) ? rawSort : 'recent'

    const rawView = searchParams.get('view') as 'grid' | 'list' | null
    const view = rawView === 'grid' || rawView === 'list' ? rawView : getInitialViewMode()

    const rawPage = parseInt(searchParams.get('page') || '1', 10)
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage

    return {
      q,
      space,
      category,
      tags,
      fileType,
      datePreset,
      uploadedFrom,
      uploadedTo,
      issuedFrom,
      issuedTo,
      expires,
      sort,
      view,
      page,
    }
  }, [searchParams])

  // 2. Commit helper to write updated state to URLSearchParams (cleanly without redundant defaults)
  const commitState = useCallback(
    (updater: (prev: SearchState) => SearchState) => {
      const next = updater(state)
      const nextParams = new URLSearchParams()

      if (next.q && next.q.trim() !== '') {
        nextParams.set('q', next.q.trim())
      }

      if (next.space && next.space !== 'all') {
        nextParams.set('space', next.space)
      }

      if (next.category && next.category.trim() !== '') {
        nextParams.set('category', next.category.trim())
      }

      if (next.fileType) {
        nextParams.set('type', next.fileType)
      }

      if (next.tags && next.tags.length > 0) {
        next.tags.forEach((t) => nextParams.append('tag', t))
      }

      if (next.datePreset && next.datePreset !== 'all') {
        nextParams.set('datePreset', next.datePreset)
      }

      if (next.uploadedFrom) {
        nextParams.set('uploadedFrom', next.uploadedFrom)
      }
      if (next.uploadedTo) {
        nextParams.set('uploadedTo', next.uploadedTo)
      }

      if (next.expires && next.expires !== 'all') {
        nextParams.set('expires', next.expires)
      }

      if (next.sort && next.sort !== 'recent') {
        nextParams.set('sort', next.sort)
      }

      if (next.view) {
        // Only set view if different from default or explicitly in URL
        nextParams.set('view', next.view)
        try {
          localStorage.setItem(SEARCH_STORAGE_VIEW_KEY, next.view)
        } catch {
          // ignore
        }
      }

      if (next.page && next.page > 1) {
        nextParams.set('page', next.page.toString())
      }

      setSearchParams(nextParams, { replace: true })
    },
    [state, setSearchParams]
  )

  // 3. Granular mutation helpers
  const setQuery = useCallback(
    (q: string) => {
      commitState((prev) => ({ ...prev, q, page: 1 }))
    },
    [commitState]
  )

  const setSpace = useCallback(
    (space: SearchScope) => {
      commitState((prev) => ({ ...prev, space, page: 1 }))
    },
    [commitState]
  )

  const setCategory = useCallback(
    (category?: string) => {
      commitState((prev) => ({ ...prev, category, page: 1 }))
    },
    [commitState]
  )

  const setFileType = useCallback(
    (fileType?: DocumentFileType) => {
      commitState((prev) => ({ ...prev, fileType, page: 1 }))
    },
    [commitState]
  )

  const setTags = useCallback(
    (tags: string[]) => {
      commitState((prev) => ({ ...prev, tags, page: 1 }))
    },
    [commitState]
  )

  const toggleTag = useCallback(
    (tag: string) => {
      commitState((prev) => {
        const exists = prev.tags.includes(tag)
        const nextTags = exists
          ? prev.tags.filter((t) => t !== tag)
          : [...prev.tags, tag]
        return { ...prev, tags: nextTags, page: 1 }
      })
    },
    [commitState]
  )

  const setDatePreset = useCallback(
    (datePreset: SearchDatePreset, uploadedFrom?: string, uploadedTo?: string) => {
      commitState((prev) => ({
        ...prev,
        datePreset,
        uploadedFrom,
        uploadedTo,
        page: 1,
      }))
    },
    [commitState]
  )

  const setExpires = useCallback(
    (expires: SearchExpiryFilter) => {
      commitState((prev) => ({ ...prev, expires, page: 1 }))
    },
    [commitState]
  )

  const setSort = useCallback(
    (sort: SearchSort) => {
      commitState((prev) => ({ ...prev, sort }))
    },
    [commitState]
  )

  const setView = useCallback(
    (view: 'grid' | 'list') => {
      commitState((prev) => ({ ...prev, view }))
    },
    [commitState]
  )

  const setPage = useCallback(
    (page: number) => {
      commitState((prev) => ({ ...prev, page }))
    },
    [commitState]
  )

  const clearAllFilters = useCallback(() => {
    commitState((prev) => ({
      ...prev,
      q: '',
      space: 'all',
      category: undefined,
      tags: [],
      fileType: undefined,
      datePreset: 'all',
      uploadedFrom: undefined,
      uploadedTo: undefined,
      expires: 'all',
      sort: 'recent',
      page: 1,
    }))
  }, [commitState])

  return {
    state,
    setQuery,
    setSpace,
    setCategory,
    setFileType,
    setTags,
    toggleTag,
    setDatePreset,
    setExpires,
    setSort,
    setView,
    setPage,
    clearAllFilters,
  }
}
