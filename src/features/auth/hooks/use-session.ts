import { useAuth } from '../auth-provider'

export function useSession() {
  const auth = useAuth()
  return {
    session: auth.session,
    user: auth.user,
    status: auth.status,
    sessionState: auth.sessionState,
    isAuthenticated: auth.isAuthenticated,
    isInitializing: auth.isInitializing,
    signOut: auth.signOut,
  }
}
