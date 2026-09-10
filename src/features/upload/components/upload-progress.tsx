import { useAppReducedMotion } from '@/lib/motion'

interface UploadProgressProps {
  percent?: number
  isIndeterminate?: boolean
  className?: string
}

export function UploadProgress({
  percent,
  isIndeterminate = false,
  className = '',
}: UploadProgressProps) {
  const reduceMotion = useAppReducedMotion()

  const hasDeterminateValue = typeof percent === 'number' && !isIndeterminate

  return (
    <div
      role="progressbar"
      aria-label="Upload progress"
      aria-valuemin={hasDeterminateValue ? 0 : undefined}
      aria-valuemax={hasDeterminateValue ? 100 : undefined}
      aria-valuenow={hasDeterminateValue ? Math.round(percent!) : undefined}
      className={`relative h-1.5 w-full rounded-full bg-muted/80 overflow-hidden ${className}`}
    >
      {hasDeterminateValue ? (
        <div
          style={{ width: `${Math.min(100, Math.max(0, percent!))}%` }}
          className="h-full bg-primary transition-all duration-200 ease-out"
        />
      ) : isIndeterminate ? (
        reduceMotion ? (
          <div className="h-full w-2/3 bg-primary/70" />
        ) : (
          <div className="h-full w-1/3 bg-primary rounded-full animate-progress-indeterminate" />
        )
      ) : (
        <div className="h-full w-0 bg-primary" />
      )}
    </div>
  )
}
