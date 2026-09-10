import { useState, useEffect } from 'react'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { ProfileIdentitySkeleton } from '../layout/profile-identity-skeleton'
import { cn } from 'cn'

export interface UserIdentityProps {
  compact?: boolean
  showEmail?: boolean
  showAvatar?: boolean
  className?: string
}

export function UserIdentity({
  compact = false,
  showEmail = true,
  showAvatar = true,
  className,
}: UserIdentityProps) {
  const {
    displayName,
    email,
    avatarUrl,
    initials,
    isBootstrapping,
  } = useCurrentUser()

  const [imageError, setImageError] = useState(false)

  // Reset image error state if the avatar URL changes
  useEffect(() => {
    setImageError(false)
  }, [avatarUrl])

  if (isBootstrapping || (!displayName && !email)) {
    return <ProfileIdentitySkeleton compact={compact} className={className} />
  }

  // Derived strictly from authenticated identity
  const renderedName = displayName || (email ? email.split('@')[0] : '')
  const renderedEmail = email || ''

  const avatarElement = showAvatar && (
    <div className="size-8 rounded-xl bg-muted/80 border border-border/80 flex items-center justify-center font-bold text-xs text-foreground shrink-0 overflow-hidden select-none">
      {avatarUrl && !imageError ? (
        <img
          src={avatarUrl}
          alt={renderedName}
          onError={() => setImageError(true)}
          className="size-full object-cover rounded-xl transition-opacity duration-150"
        />
      ) : (
        <span className="font-mono text-[11px] tracking-tight">{initials || '•'}</span>
      )}
    </div>
  )

  if (compact) {
    return avatarElement
  }

  return (
    <div className={cn('flex items-center gap-2.5 min-w-0 text-left select-none', className)}>
      {avatarElement}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-foreground truncate leading-tight">
          {renderedName}
        </p>
        {showEmail && renderedEmail && (
          <p className="text-[10.5px] text-muted-foreground font-mono truncate leading-tight mt-0.5">
            {renderedEmail}
          </p>
        )}
      </div>
    </div>
  )
}
