import { useState } from 'react'
import {
  Link01Icon,
  Copy01Icon,
  Tick02Icon,
  LockKeyIcon,
  EyeIcon,
  CursorPointer01Icon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import { DocumentMetadataGroup } from './document-metadata-group'
import type { VaultDocument } from '@/types/document'

interface DocumentSharingStatusProps {
  document: VaultDocument
  onOpenShareDialog: () => void
}

export function DocumentSharingStatus({
  document,
  onOpenShareDialog,
}: DocumentSharingStatusProps) {
  const [copied, setCopied] = useState(false)
  const activeShare = document.sharedDirectLink

  const handleCopyLink = () => {
    if (!activeShare?.token) return
    const shareUrl = `${window.location.origin}/share/${activeShare.token}`
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isExpired = activeShare?.expiresAt && new Date(activeShare.expiresAt) <= new Date()

  return (
    <DocumentMetadataGroup title="Sharing & Direct Access">
      {activeShare && !isExpired ? (
        <div className="p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-foreground">Active Direct Link</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted border border-border/70 text-foreground">
              Expiring
            </span>
          </div>

          <div className="text-[11px] text-muted-foreground font-mono space-y-1">
            <p>
              Expires: {new Date(activeShare.expiresAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <div className="flex items-center gap-3 pt-0.5">
              <span className="flex items-center gap-1">
                <AppIcon icon={EyeIcon} size={12} />
                {activeShare.viewCount ?? 0} views
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <AppIcon icon={CursorPointer01Icon} size={12} />
                {activeShare.clickCount ?? 0} downloads
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleCopyLink}
              className="flex-1 h-8 rounded-xl text-xs gap-1.5"
            >
              <AppIcon icon={copied ? Tick02Icon : Copy01Icon} size={13} />
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onOpenShareDialog}
              className="h-8 px-3 rounded-xl text-xs"
            >
              Manage
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AppIcon icon={LockKeyIcon} size={14} />
              <span className="text-xs font-medium">Private Vault Document</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted border border-border/70 text-muted-foreground">
              Unshared
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            This document is strictly restricted to your authenticated account. No public or shared access links exist.
          </p>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onOpenShareDialog}
            className="w-full h-8 rounded-xl text-xs gap-1.5 border-border/80 hover:bg-muted text-foreground"
          >
            <AppIcon icon={Link01Icon} size={13} />
            <span>Create Expiring Direct Link</span>
          </Button>
        </div>
      )}
    </DocumentMetadataGroup>
  )
}
