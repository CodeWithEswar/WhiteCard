import { cn } from 'cn'

interface ProfileIdentitySkeletonProps {
  compact?: boolean
  className?: string
}

export function ProfileIdentitySkeleton({ compact = false, className }: ProfileIdentitySkeletonProps) {
  if (compact) {
    return (
      <div
        className={cn('size-8 rounded-md bg-muted/70 animate-pulse shrink-0', className)}
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      className={cn('flex items-center gap-2.5 p-1 w-full select-none', className)}
      aria-hidden="true"
    >
      {/* 32px rounded-md avatar placeholder */}
      <div className="size-8 rounded-md bg-muted/70 animate-pulse shrink-0" />

      {/* Name and email text lines with exact vertical rhythm */}
      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="h-3 w-24 rounded bg-muted/80 animate-pulse" />
        <div className="h-2.5 w-32 rounded bg-muted/50 animate-pulse" />
      </div>
    </div>
  )
}
