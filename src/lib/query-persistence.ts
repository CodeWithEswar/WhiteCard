import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import type { DehydrateOptions } from '@tanstack/react-query'
import { isPersistableQuery } from './query-security'

export const QUERY_CACHE_STORAGE_KEY = 'white-card-query-cache'
export const QUERY_CACHE_BUSTER = 'white-card-cache-v1'
export const QUERY_CACHE_MAX_AGE = 1000 * 60 * 60 * 12 // 12 hours

/**
 * Synchronous local storage persister for TanStack Query.
 */
const memoryStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: () => null,
  removeItem: () => {},
  setItem: () => {},
}

/**
 * Synchronous local storage persister for TanStack Query.
 */
export const syncStoragePersister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : memoryStorage,
  key: QUERY_CACHE_STORAGE_KEY,
})

/**
 * Filter to strictly dehydrate only safe, non-sensitive queries.
 */
export const persistDehydrateOptions: DehydrateOptions = {
  shouldDehydrateQuery: (query) => {
    // Only persist successful, valid queries that pass the security check
    if (query.state.status !== 'success') {
      return false
    }
    return isPersistableQuery(query.queryKey)
  },
}

/**
 * Completely purges persisted query cache from disk to guarantee
 * no stale or cross-user data leakage.
 */
export function purgePersistedQueryCache() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(QUERY_CACHE_STORAGE_KEY)
  } catch (err) {
    console.warn('Failed to clear persisted query cache:', err)
  }
}
