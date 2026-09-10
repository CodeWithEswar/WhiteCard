import { queryOptions } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getStorageBreakdown } from './storage.api'

export const storageQueries = {
  breakdown: (userId?: string) =>
    queryOptions({
      queryKey: queryKeys.storage.breakdown(userId || 'anon'),
      queryFn: () => getStorageBreakdown(userId),
      enabled: Boolean(userId),
      staleTime: 60_000,
      gcTime: 5 * 60_000,
    }),
}
