import { useMemo } from 'react'
import { useAuth } from '../auth-provider'
import { useProfileQuery } from '@/features/settings/profile.queries'

export type UserIdentityState = 'bootstrapping' | 'cached' | 'fresh' | 'unavailable'

export interface CurrentUser {
  authUser: ReturnType<typeof useAuth>['user']
  profile: ReturnType<typeof useProfileQuery>['data']
  displayName: string | null
  email: string | null
  avatarUrl: string | null
  initials: string
  identityState: UserIdentityState
  isBootstrapping: boolean
  isRefreshing: boolean
}

export function computeInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0].slice(0, 2).toUpperCase()
  }

  if (email && email.trim().length > 0) {
    return email.trim()[0].toUpperCase()
  }

  return ''
}

export function useCurrentUser(): CurrentUser {
  const { user: authUser, status: authStatus } = useAuth()
  const userId = authUser?.id

  const {
    data: profileData,
    isPending: isProfilePending,
    isFetching: isProfileFetching,
    isStale: isProfileStale,
  } = useProfileQuery(userId)

  return useMemo(() => {
    if (authStatus === 'unauthenticated' || !authUser) {
      return {
        authUser: null,
        profile: null,
        displayName: null,
        email: null,
        avatarUrl: null,
        initials: '',
        identityState: 'unavailable',
        isBootstrapping: false,
        isRefreshing: false,
      }
    }

    // 1. Resolve Display Name (Strictly from real identity)
    const rawProfileName = profileData?.name?.trim()
    const metaFullName = authUser.user_metadata?.full_name?.trim()
    const metaName = authUser.user_metadata?.name?.trim()
    const emailPrefix = authUser.email ? authUser.email.split('@')[0] : null

    const displayName =
      rawProfileName ||
      metaFullName ||
      metaName ||
      emailPrefix ||
      null

    // 2. Resolve Email
    const email = authUser.email || profileData?.email || null

    // 3. Resolve Avatar URL
    const avatarUrl =
      profileData?.avatar ||
      authUser.user_metadata?.avatar_url ||
      authUser.user_metadata?.picture ||
      null

    // 4. Compute Initials from real identity data
    const initials = computeInitials(displayName, email)

    // 5. Determine Identity State
    const hasData = Boolean(profileData || metaFullName || metaName)
    const isBootstrapping = (authStatus === 'initializing' || isProfilePending) && !hasData

    let identityState: UserIdentityState = 'fresh'
    if (isBootstrapping) {
      identityState = 'bootstrapping'
    } else if (isProfileFetching || isProfileStale) {
      identityState = 'cached'
    } else {
      identityState = 'fresh'
    }

    return {
      authUser,
      profile: profileData ?? null,
      displayName,
      email,
      avatarUrl,
      initials,
      identityState,
      isBootstrapping,
      isRefreshing: isProfileFetching,
    }
  }, [authUser, authStatus, profileData, isProfilePending, isProfileFetching, isProfileStale])
}
