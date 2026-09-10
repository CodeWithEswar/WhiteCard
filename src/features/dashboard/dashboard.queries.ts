import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/features/auth/auth-provider'
import { fetchDashboardSummary } from './dashboard.api'
import type { DashboardSummary } from './dashboard.types'

export function useDashboardSummary() {
  const { user } = useAuth()
  const userId = user?.id || 'anon'

  return useQuery<DashboardSummary>({
    queryKey: queryKeys.dashboard.summary(userId),
    queryFn: () => fetchDashboardSummary(userId),
    staleTime: 1000 * 60, // 1 minute fresh window
    gcTime: 1000 * 60 * 60 * 24, // 24-hour persistence in cache
  })
}
