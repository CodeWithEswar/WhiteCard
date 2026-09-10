import type { DocumentSearchParams } from './search.types'

/**
 * Normalizes document search params for deterministic TanStack Query keys.
 */
export function normalizeSearchParamsKey(params: DocumentSearchParams = {}) {
  return {
    q: params.q?.trim().toLowerCase() || '',
    space: params.space || 'all',
    category: params.category || '',
    tags: params.tags ? [...params.tags].sort() : [],
    fileType: params.fileType || '',
    uploadedFrom: params.uploadedFrom || '',
    uploadedTo: params.uploadedTo || '',
    issuedFrom: params.issuedFrom || '',
    issuedTo: params.issuedTo || '',
    expires: params.expires || 'all',
    sort: params.sort || 'recent',
    page: params.page || 1,
    pageSize: params.pageSize || 24,
  }
}

export const searchQueryKeys = {
  all: (userId: string) => ['documents', userId, 'search'] as const,
  list: (userId: string, params: DocumentSearchParams = {}) =>
    ['documents', userId, 'search', normalizeSearchParamsKey(params)] as const,
}
