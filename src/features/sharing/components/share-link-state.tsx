import { useState } from 'react'
import {
  Copy01Icon,
  Tick02Icon,
  Clock01Icon,
  Link01Icon,
  Delete02Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { ShareExpirySelector } from './share-expiry-selector'
import type { ShareExpiryOption, ShareLinkInfo } from '../sharing.types'

interface ShareLinkStateProps {
  shareInfo: ShareLinkInfo | null
  onCreateLink: (days: ShareExpiryOption) => void
  onRevokeClick: () => void
  isCreating?: boolean
}

export function ShareLinkState({
  shareInfo,
  onCreateLink,
  onRevokeClick,
  isCreating = false,
}: ShareLinkStateProps) {
  const [copied, setCopied] = useState(false)
  const [selectedExpiry, setSelectedExpiry] = useState<ShareExpiryOption>(7)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const shareUrl = shareInfo ? `${origin}/share/${shareInfo.token}` : ''

  const handleCopy = () => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format expiry date cleanly
  const formatExpiry = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return isoString
    }
  }

  const isExpired = shareInfo ? new Date(shareInfo.expiresAt) <= new Date() : false

  // CASE 1: Active Share Link exists and is not expired
  if (shareInfo && !isExpired) {
    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Direct Share Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              onFocus={(e) => e.target.select()}
              className="flex-1 h-10 px-3 text-xs font-mono rounded-xl bg-muted/30 border border-border text-foreground select-all outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              onClick={handleCopy}
              className="h-10 px-4 rounded-xl font-medium text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
            >
              <AppIcon icon={copied ? Tick02Icon : Copy01Icon} size={15} />
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </Button>
          </div>
        </div>

        {/* Link Info banner */}
        <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground min-w-0">
            <AppIcon icon={Clock01Icon} size={16} className="text-foreground shrink-0" />
            <div className="min-w-0 truncate">
              <span className="font-semibold text-foreground">Active Direct Link</span>
              <p className="text-[11px] text-muted-foreground truncate">
                Expires on {formatExpiry(shareInfo.expiresAt)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRevokeClick}
            className="text-xs font-medium text-destructive hover:underline flex items-center gap-1 shrink-0 px-1 py-0.5"
          >
            <AppIcon icon={Delete02Icon} size={13} />
            <span>Revoke</span>
          </button>
        </div>
      </div>
    )
  }

  // CASE 2: No active link, or previous link expired
  return (
    <div className="space-y-5">
      {isExpired && (
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs">
          The previous share link for this document has expired. You can generate a new one below.
        </div>
      )}

      <ShareExpirySelector
        value={selectedExpiry}
        onChange={setSelectedExpiry}
        disabled={isCreating}
      />

      <div className="pt-2">
        <Button
          onClick={() => onCreateLink(selectedExpiry)}
          disabled={isCreating}
          className="w-full h-10 rounded-xl font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
        >
          <AppIcon icon={Link01Icon} size={15} />
          <span>{isCreating ? 'Generating secure link…' : 'Create Direct Link'}</span>
        </Button>
      </div>
    </div>
  )
}
