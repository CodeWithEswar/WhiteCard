import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getMyProfile, updateMyProfile, type UserProfileData } from './profile.api'

export function useProfileQuery(userId?: string) {
  return useQuery({
    queryKey: userId ? queryKeys.profile.me(userId) : queryKeys.profile.all,
    queryFn: () => getMyProfile(userId),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
    gcTime: 24 * 60 * 60 * 1000, // 24 hours in cache
  })
}

export function useUpdateProfileMutation(userId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: { display_name?: string; avatar_url?: string }) => {
      if (!userId) throw new Error('Cannot update profile without userId')
      return updateMyProfile(userId, updates)
    },
    onSuccess: (_, updates) => {
      if (userId) {
        // Immediate optimistic cache update
        queryClient.setQueryData(
          queryKeys.profile.me(userId),
          (prev: UserProfileData | null | undefined) => {
            if (!prev) return prev
            return {
              ...prev,
              name: updates.display_name !== undefined ? updates.display_name : prev.name,
              avatar: updates.avatar_url !== undefined ? updates.avatar_url : prev.avatar,
            }
          }
        )
        // Background invalidate
        queryClient.invalidateQueries({ queryKey: queryKeys.profile.me(userId) })
      }
    },
  })
}
