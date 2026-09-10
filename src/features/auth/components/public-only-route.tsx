import { Navigate, Outlet, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth-provider'

export function PublicOnlyRoute() {
  const { sessionState, isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()

  if (sessionState === 'initializing') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="size-8 rounded-md bg-muted animate-pulse" />
      </div>
    )
  }

  if (isAuthenticated) {
    const redirectTo = searchParams.get('redirect') || '/app'
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
