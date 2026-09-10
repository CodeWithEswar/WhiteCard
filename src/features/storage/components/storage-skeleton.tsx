import { Skeleton } from '@/components/ui/skeleton'

export function StorageSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* 1. Hero Skeleton */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-4 flex-1 w-full max-w-md">
          <Skeleton className="h-3 w-28 rounded-md" />
          <Skeleton className="h-12 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-md" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </div>
        <div className="size-48 sm:size-56 rounded-full border-8 border-muted flex items-center justify-center shrink-0 mx-auto md:mx-0">
          <Skeleton className="size-24 rounded-full" />
        </div>
      </div>

      {/* 2. Analysis Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-5 w-40 rounded-md" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-5 w-44 rounded-md" />
          <Skeleton className="h-40 rounded-xl" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-8 rounded-lg" />
            <Skeleton className="h-8 rounded-lg" />
            <Skeleton className="h-8 rounded-lg" />
          </div>
        </div>
      </div>

      {/* 3. Largest Documents Skeleton */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-44 rounded-md" />
        <div className="space-y-2.5">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
