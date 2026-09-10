export function AppBootstrapSkeleton() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden select-none">
      {/* Desktop Sidebar Skeleton (>=1024px) */}
      <aside className="hidden lg:flex flex-col w-[256px] border-r border-sidebar-border/80 bg-sidebar p-4 space-y-6 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 h-16 border-b border-sidebar-border/70 -mx-4 px-4">
          <div className="size-7 rounded-md bg-muted/80 animate-pulse shrink-0" />
          <div className="h-4 w-24 rounded bg-muted/80 animate-pulse" />
        </div>

        {/* Navigation Section 1: VAULT SPACES */}
        <div className="space-y-2 pt-2">
          <div className="h-3 w-20 rounded bg-muted/60 animate-pulse px-2" />
          <div className="space-y-1">
            <div className="h-9 w-full rounded-md bg-muted/40 animate-pulse" />
            <div className="h-8 w-full rounded-md bg-muted/30 animate-pulse pl-6" />
            <div className="h-9 w-full rounded-md bg-muted/40 animate-pulse" />
            <div className="h-9 w-full rounded-md bg-muted/40 animate-pulse" />
          </div>
        </div>

        {/* Navigation Section 2: COLLECTIONS & ALERTS */}
        <div className="space-y-2 pt-4">
          <div className="h-3 w-28 rounded bg-muted/60 animate-pulse px-2" />
          <div className="space-y-1">
            <div className="h-9 w-full rounded-md bg-muted/40 animate-pulse" />
            <div className="h-9 w-full rounded-md bg-muted/40 animate-pulse" />
            <div className="h-9 w-full rounded-md bg-muted/40 animate-pulse" />
          </div>
        </div>

        {/* Bottom User Area */}
        <div className="mt-auto flex items-center gap-2.5 p-2 rounded-md bg-muted/30 animate-pulse">
          <div className="size-8 rounded-md bg-muted/70 shrink-0" />
          <div className="space-y-1 flex-1">
            <div className="h-3 w-24 rounded bg-muted/80" />
            <div className="h-2.5 w-32 rounded bg-muted/50" />
          </div>
        </div>
      </aside>

      {/* Tablet Compact Rail Skeleton (768px-1023px) */}
      <aside className="hidden md:flex lg:hidden flex-col w-[72px] items-center py-3 border-r border-sidebar-border/80 bg-sidebar shrink-0 space-y-4">
        <div className="size-8 rounded-md bg-muted/80 animate-pulse" />
        <div className="w-8 h-px bg-border/60" />
        <div className="space-y-2">
          <div className="size-10 rounded-md bg-muted/40 animate-pulse" />
          <div className="size-10 rounded-md bg-muted/40 animate-pulse" />
          <div className="size-10 rounded-md bg-muted/40 animate-pulse" />
        </div>
      </aside>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Topbar Skeleton */}
        <header className="h-16 px-6 border-b border-border/80 bg-surface/85 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-md bg-muted/50 animate-pulse" />
            <div className="h-4 w-32 rounded bg-muted/60 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-36 rounded-md bg-muted/50 animate-pulse hidden sm:block" />
            <div className="h-9 w-24 rounded-md bg-muted/60 animate-pulse" />
            <div className="size-9 rounded-md bg-muted/60 animate-pulse" />
          </div>
        </header>

        {/* Content Skeleton */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="space-y-2 max-w-sm">
            <div className="h-6 w-48 rounded bg-muted/70 animate-pulse" />
            <div className="h-4 w-72 rounded bg-muted/40 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="h-36 rounded-md border border-border/70 bg-surface/40 animate-pulse p-4" />
            <div className="h-36 rounded-md border border-border/70 bg-surface/40 animate-pulse p-4" />
          </div>

          <div className="h-64 rounded-md border border-border/70 bg-surface/40 animate-pulse p-4" />
        </main>
      </div>
    </div>
  )
}
