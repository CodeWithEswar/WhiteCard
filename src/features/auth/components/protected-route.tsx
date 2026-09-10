import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth-provider'

function AppShellSkeleton() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden select-none">
      {/* Sidebar Skeleton (Desktop/Tablet) */}
      <aside className="hidden md:flex flex-col w-[256px] border-r border-sidebar-border/80 bg-sidebar p-4 space-y-6 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="size-7 rounded-md bg-muted animate-pulse shrink-0" />
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        </div>

        {/* Section 1 */}
        <div className="space-y-2 pt-2">
          <div className="h-3 w-20 rounded bg-muted/60 animate-pulse px-2" />
          <div className="space-y-1">
            <div className="h-8 w-full rounded-md bg-muted/40 animate-pulse" />
            <div className="h-8 w-full rounded-md bg-muted/30 animate-pulse pl-6" />
            <div className="h-8 w-full rounded-md bg-muted/40 animate-pulse" />
            <div className="h-8 w-full rounded-md bg-muted/40 animate-pulse" />
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-2 pt-4">
          <div className="h-3 w-28 rounded bg-muted/60 animate-pulse px-2" />
          <div className="space-y-1">
            <div className="h-8 w-full rounded-md bg-muted/40 animate-pulse" />
            <div className="h-8 w-full rounded-md bg-muted/40 animate-pulse" />
            <div className="h-8 w-full rounded-md bg-muted/40 animate-pulse" />
          </div>
        </div>

        {/* Bottom User Area */}
        <div className="mt-auto flex items-center gap-2.5 p-2 rounded-md bg-muted/30 animate-pulse">
          <div className="size-7 rounded-md bg-muted shrink-0" />
          <div className="space-y-1 flex-1">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-2.5 w-28 rounded bg-muted/70" />
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Skeleton */}
        <header className="h-14 px-6 border-b border-border/80 bg-surface/60 backdrop-blur-md flex items-center justify-between">
          <div className="h-4 w-32 rounded bg-muted/60 animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-20 rounded-md bg-muted/50 animate-pulse" />
            <div className="size-8 rounded-md bg-muted/50 animate-pulse" />
          </div>
        </header>

        {/* Content Skeleton */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <div className="h-6 w-48 rounded bg-muted/70 animate-pulse" />
            <div className="h-4 w-72 rounded bg-muted/40 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-40 rounded-md border border-border/80 bg-surface/40 animate-pulse p-4" />
            <div className="h-40 rounded-md border border-border/80 bg-surface/40 animate-pulse p-4" />
            <div className="h-40 rounded-md border border-border/80 bg-surface/40 animate-pulse p-4" />
          </div>

          <div className="h-64 rounded-md border border-border/80 bg-surface/40 animate-pulse p-4" />
        </main>
      </div>
    </div>
  )
}

export function ProtectedRoute() {
  const { sessionState, isAuthenticated } = useAuth()
  const location = useLocation()

  if (sessionState === 'initializing') {
    return <AppShellSkeleton />
  }

  if (!isAuthenticated) {
    const intendedTarget = location.pathname + location.search
    const redirectParam = encodeURIComponent(intendedTarget)
    return <Navigate to={`/login?redirect=${redirectParam}`} replace />
  }

  return <Outlet />
}
