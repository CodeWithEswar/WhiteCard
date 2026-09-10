import { Skeleton } from '../ui/skeleton'

export function DocumentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/70 bg-surface/50 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="size-9 rounded-xl" />
            <Skeleton className="size-6 rounded-xl" />
          </div>
          <div className="space-y-1.5 pt-1">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
          <div className="flex gap-1.5 pt-2">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <div className="flex justify-between pt-2 border-t border-border/40">
            <Skeleton className="h-3 w-12 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DocumentListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-surface/50 divide-y divide-border/60 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3.5 px-4 gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Skeleton className="size-9 rounded-xl shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-3 w-1/4 rounded" />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-14 rounded" />
          </div>
          <Skeleton className="size-7 rounded-xl shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-48 rounded-xl" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-24 rounded-xl" />
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
    </div>
  )
}
