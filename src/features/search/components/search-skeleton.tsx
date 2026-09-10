import { Skeleton } from '@/components/ui/skeleton'

export interface SearchSkeletonProps {
  viewMode?: 'grid' | 'list'
  count?: number
}

export function SearchSkeleton({ viewMode = 'grid', count = 8 }: SearchSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <div className="rounded-2xl border border-border/80 bg-surface divide-y divide-border/60 overflow-hidden shadow-2xs select-none">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3.5 sm:px-4 gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Skeleton className="size-9 rounded-xl shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-3 w-1/4 rounded" />
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-5 shrink-0">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-4 w-14 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 select-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between p-4 rounded-2xl border border-border/80 bg-surface space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="size-9 rounded-xl" />
            <Skeleton className="size-6 rounded-lg" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>

          <div className="pt-3 border-t border-border/50 flex items-center justify-between">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
