import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { executeSignOut } from './sign-out.service'
import { queryClient } from '@/lib/query-client'
import { queryKeys } from '@/lib/query-keys'
import type { UserProfileData } from '@/features/settings/profile.api'

export type AuthStatus = 'initializing' | 'unauthenticated' | 'authenticated' | 'error'
export type SessionState = AuthStatus

export interface AuthContextValue {
  session: Session | null
  user: User | null
  status: AuthStatus
  sessionState: SessionState
  isAuthenticated: boolean
  isInitializing: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function seedOptimisticProfile(user: User) {
  const metaFullName = user.user_metadata?.full_name?.trim()
  const metaName = user.user_metadata?.name?.trim()
  const fallbackName = metaFullName || metaName || (user.email ? user.email.split('@')[0] : '')
  const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined

  queryClient.setQueryData(
    queryKeys.profile.me(user.id),
    (current: UserProfileData | null | undefined) =>
      current ?? {
        id: user.id,
        email: user.email || '',
        name: fallbackName,
        avatar,
      }
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('initializing')

  const signOut = async () => {
    try {
      await executeSignOut()
    } finally {
      setSession(null)
      setUser(null)
      setStatus('unauthenticated')
    }
  }

  useEffect(() => {
    let isMounted = true

    async function initializeSession() {
      if (!isSupabaseConfigured || !supabase) {
        // Fallback for offline or local preview
        if (isMounted) {
          setStatus('authenticated')
        }
        return
      }

      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Session initialization error:', error)
          if (isMounted) setStatus('error')
          return
        }

        if (data.session?.user) {
          if (isMounted) {
            setSession(data.session)
            setUser(data.session.user)
            setStatus('authenticated')
          }
          seedOptimisticProfile(data.session.user)
        } else {
          if (isMounted) {
            setSession(null)
            setUser(null)
            setStatus('unauthenticated')
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (isMounted) setStatus('error')
      }
    }

    initializeSession()

    if (!isSupabaseConfigured || !supabase) return

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return

      if (newSession?.user) {
        setSession(newSession)
        setUser(newSession.user)
        setStatus('authenticated')
        seedOptimisticProfile(newSession.user)
      } else {
        setSession(null)
        setUser(null)
        setStatus('unauthenticated')
      }
    })

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextValue = {
    session,
    user,
    status,
    sessionState: status,
    isAuthenticated: status === 'authenticated',
    isInitializing: status === 'initializing',
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    return {
      session: null,
      user: null,
      status: 'unauthenticated',
      sessionState: 'unauthenticated',
      isAuthenticated: false,
      isInitializing: false,
      signOut: async () => {},
    }
  }
  return context
}
