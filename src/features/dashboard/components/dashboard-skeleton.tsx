import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-label="Loading dashboard" aria-busy="true">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-8 sm:h-9 w-48 sm:w-56 rounded-lg" />
            <Skeleton className="h-4 w-72 sm:w-96 rounded-md" />
          </div>
          <Skeleton className="h-11 w-36 rounded-xl hidden sm:block" />
        </div>
      </div>

      {/* Primary Space Cards Skeleton (2 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Skeleton className="h-56 sm:h-64 rounded-2xl md:rounded-[22px]" />
        <Skeleton className="h-56 sm:h-64 rounded-2xl md:rounded-[22px]" />
      </div>

      {/* Recent Documents Section Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      </div>

      {/* Utility Grid Skeleton: Expiring & Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <div className="lg:col-span-7 space-y-3">
          <Skeleton className="h-6 w-36 rounded-md" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
