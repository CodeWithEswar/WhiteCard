import { useQuery } from '@tanstack/react-query'
import { useSession } from '@/features/auth/hooks/use-session'
import { storageQueries } from '../storage.queries'
import type { StorageBreakdown } from '../storage.types'

export function useStorageBreakdown() {
  const { user } = useSession()
  const userId = user?.id || 'anon'

  const query = useQuery(storageQueries.breakdown(userId))

  return {
    data: query.data as StorageBreakdown | undefined,
    // Only show full skeleton on initial empty load, never during background refetch
    isInitialLoading: query.isPending && !query.data,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}
