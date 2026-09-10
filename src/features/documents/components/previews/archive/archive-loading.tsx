import { Skeleton } from '@/components/ui/skeleton'

export function ArchiveLoading() {
  return (
    <div className="w-full h-full flex flex-col bg-surface overflow-hidden select-none">
      {/* Header Skeleton */}
      <div className="p-4 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-3 w-56 rounded" />
          </div>
        </div>
        <Skeleton className="h-8 w-28 rounded-xl hidden sm:block" />
      </div>

      {/* Toolbar Skeleton */}
      <div className="px-4 py-2.5 border-b border-border/70 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Skeleton className="h-7 w-16 rounded-xl" />
          <Skeleton className="h-4 w-48 rounded" />
        </div>
        <Skeleton className="h-8 w-44 rounded-xl" />
      </div>

      {/* Rows Skeleton */}
      <div className="flex-1 p-4 space-y-3">
        <div className="flex items-center justify-center py-4 text-xs font-mono text-muted-foreground gap-2">
          <div className="size-4 rounded-full border-2 border-border border-t-primary animate-spin" />
          <span>Inspecting archive…</span>
        </div>

        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border/40">
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="size-5 rounded" />
              <Skeleton className="h-3.5 w-1/3 rounded" />
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <Skeleton className="h-3.5 w-16 rounded" />
              <Skeleton className="h-3.5 w-12 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
