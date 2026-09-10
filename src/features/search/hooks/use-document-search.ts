import { useState, useEffect, useMemo } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/auth-provider'
import { searchVaultDocuments } from '../search.api'
import { searchQueryKeys } from '../search.queries'
import type { SearchState, DocumentSearchParams, SearchQueryResult } from '../search.types'
import { SEARCH_PAGE_SIZE } from '../search.constants'

export function useDocumentSearch(state: SearchState) {
  const { user } = useAuth()
  const userId = user?.id || 'anon'

  // Debounce query string by 250ms
  const [debouncedQuery, setDebouncedQuery] = useState(state.q)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(state.q)
    }, 250)

    return () => clearTimeout(handler)
  }, [state.q])

  // Construct search params with debounced query
  const searchParams: DocumentSearchParams = useMemo(() => {
    return {
      q: debouncedQuery,
      space: state.space,
      category: state.category,
      tags: state.tags,
      fileType: state.fileType,
      uploadedFrom: state.uploadedFrom,
      uploadedTo: state.uploadedTo,
      issuedFrom: state.issuedFrom,
      issuedTo: state.issuedTo,
      expires: state.expires,
      sort: state.sort,
      page: state.page,
      pageSize: SEARCH_PAGE_SIZE,
    }
  }, [debouncedQuery, state])

  const queryKey = searchQueryKeys.list(userId, searchParams)

  const query = useQuery<SearchQueryResult>({
    queryKey,
    queryFn: () => searchVaultDocuments(userId, searchParams),
    placeholderData: keepPreviousData,
    staleTime: 15 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const isDebouncing = state.q !== debouncedQuery
  const isSearching = isDebouncing || query.isFetching

  return {
    ...query,
    result: query.data,
    documents: query.data?.documents || [],
    totalCount: query.data?.totalCount ?? 0,
    totalPages: query.data?.totalPages ?? 0,
    currentPage: query.data?.page ?? state.page,
    isSearching,
    debouncedQuery,
  }
}
