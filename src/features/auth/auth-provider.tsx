import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { fetchUserProfile, type UserProfile } from './hooks/use-profile'

export type SessionState = 'initializing' | 'unauthenticated' | 'authenticated' | 'error'

export interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  sessionState: SessionState
  isAuthenticated: boolean
  isInitializing: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [sessionState, setSessionState] = useState<SessionState>('initializing')

  const refreshProfile = async () => {
    try {
      const p = await fetchUserProfile()
      setProfile(p)
    } catch {
      // Non-fatal
    }
  }

  const signOut = async () => {
    try {
      if (supabase && isSupabaseConfigured) {
        await supabase.auth.signOut()
      }
    } finally {
      setSession(null)
      setUser(null)
      setProfile(null)
      setSessionState('unauthenticated')
    }
  }

  useEffect(() => {
    let isMounted = true

    async function initializeSession() {
      if (!isSupabaseConfigured || !supabase) {
        // Fallback for offline or local preview
        if (isMounted) {
          setSessionState('authenticated')
        }
        return
      }

      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Session initialization error:', error)
          if (isMounted) setSessionState('error')
          return
        }

        if (data.session?.user) {
          if (isMounted) {
            setSession(data.session)
            setUser(data.session.user)
            setSessionState('authenticated')
          }
          const p = await fetchUserProfile()
          if (isMounted) {
            setProfile(p)
          }
        } else {
          if (isMounted) {
            setSession(null)
            setUser(null)
            setProfile(null)
            setSessionState('unauthenticated')
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (isMounted) setSessionState('error')
      }
    }

    initializeSession()

    if (!isSupabaseConfigured || !supabase) return

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return

      if (newSession?.user) {
        setSession(newSession)
        setUser(newSession.user)
        setSessionState('authenticated')
        const p = await fetchUserProfile()
        if (isMounted) setProfile(p)
      } else {
        setSession(null)
        setUser(null)
        setProfile(null)
        setSessionState('unauthenticated')
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
    profile,
    sessionState,
    isAuthenticated: sessionState === 'authenticated',
    isInitializing: sessionState === 'initializing',
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    return {
      session: null,
      user: null,
      profile: null,
      sessionState: 'unauthenticated',
      isAuthenticated: false,
      isInitializing: false,
      signOut: async () => {},
      refreshProfile: async () => {},
    }
  }
  return context
}
