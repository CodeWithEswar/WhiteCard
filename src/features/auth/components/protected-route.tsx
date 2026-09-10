import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth-provider'
import { AppBootstrapSkeleton } from '@/components/feedback/app-bootstrap-skeleton'

export function ProtectedRoute() {
  const { status, isAuthenticated } = useAuth()
  const location = useLocation()

  if (status === 'initializing') {
    return <AppBootstrapSkeleton />
  }

  if (!isAuthenticated) {
    const intendedTarget = location.pathname + location.search
    const redirectParam = encodeURIComponent(intendedTarget)
    return <Navigate to={`/login?redirect=${redirectParam}`} replace />
  }

  return <Outlet />
}
