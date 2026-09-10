import { useMemo } from 'react'
import { Upload01Icon } from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ResponsivePageHeader } from '@/components/layout/responsive-page-header'
import { PageHeaderMeta } from '@/components/layout/page-header-meta'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { getTimeOfDayGreeting } from '../dashboard.utils'
import { formatBytes } from '@/lib/files/format-bytes'

interface DashboardHeaderProps {
  totalCount: number
  totalBytes: number
  hasRecentActivity: boolean
  onUploadClick: () => void
}

export function DashboardHeader({
  totalCount,
  totalBytes,
  hasRecentActivity,
  onUploadClick,
}: DashboardHeaderProps) {
  const { displayName, isBootstrapping } = useCurrentUser()

  const firstName = useMemo(() => {
    if (!displayName) return null
    const parts = displayName.trim().split(/\s+/)
    return parts[0] || null
  }, [displayName])

  const greetingTime = useMemo(() => getTimeOfDayGreeting(), [])

  // Section 05 & 06:
  // Personal only when real user data exists. Never show "Hello, User" or "John Doe".
  const greetingContent = useMemo(() => {
    if (isBootstrapping) {
      return (
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="h-3.5 w-28 rounded-md" />
        </div>
      )
    }

    if (firstName) {
      return (
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {greetingTime}, {firstName}
        </span>
      )
    }

    return (
      <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        WHITE CARD
      </span>
    )
  }, [isBootstrapping, firstName, greetingTime])

  const formattedStorage = useMemo(() => formatBytes(totalBytes), [totalBytes])

  return (
    <ResponsivePageHeader
      eyebrow={greetingContent as unknown as string}
      title="Vault Home"
      description="Your recent documents, spaces, and important records in one place."
      primaryAction={
        <Button
          onClick={onUploadClick}
          className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl font-medium text-xs sm:text-sm gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-150 active:scale-[0.985] w-full sm:w-auto"
        >
          <AppIcon icon={Upload01Icon} size={17} />
          <span>Upload Document</span>
        </Button>
      }
      metadata={
        <PageHeaderMeta
          count={totalCount}
          formattedSize={formattedStorage}
          updatedAt={hasRecentActivity ? 'Updated recently' : undefined}
        />
      }
    />
  )
}
