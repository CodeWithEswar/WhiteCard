import { useState } from 'react'
import {
  Copy01Icon,
  Tick02Icon,
  Link01Icon,
  Delete02Icon,
  Clock01Icon,
  ShieldCheckIcon,
} from '@hugeicons/core-free-icons'
import type { VaultDocument } from '../../../types/document'
import { ResponsiveDialog } from '../../../components/layout/responsive-dialog'
import { AppIcon } from '../../../components/icons/app-icon'
import { Button } from '../../../components/ui/button'
import { useCreateShareLink, useRevokeShareLink } from '../../documents/hooks/use-documents'

interface ShareDialogProps {
  document: VaultDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareDialog({
  document: doc,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const createShareMutation = useCreateShareLink()
  const revokeShareMutation = useRevokeShareLink()

  if (!doc) return null

  const shareInfo = doc.sharedDirectLink
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const shareUrl = shareInfo
    ? `${origin}/share/${shareInfo.token}`
    : ''

  const handleCopy = () => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCreate = () => {
    createShareMutation.mutate({ id: doc.id, daysValid: 7 })
  }

  const handleRevoke = () => {
    revokeShareMutation.mutate(doc.id)
  }

  const formatExpiry = (isoString: string) => {
    const d = new Date(isoString)
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Share Document"
      description={doc.title}
      maxWidth="md"
    >
      <div className="space-y-5">
        {shareInfo ? (
          <>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Direct Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 h-10 px-3 text-xs font-mono rounded-xl bg-surface-muted/80 border border-border text-foreground select-all outline-none"
                />
                <Button
                  onClick={handleCopy}
                  className="h-10 px-3.5 rounded-xl font-medium text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
                >
                  <AppIcon icon={copied ? Tick02Icon : Copy01Icon} size={15} />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </Button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-border/80 bg-surface-muted/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <AppIcon icon={Clock01Icon} size={16} className="text-foreground" />
                <div>
                  <span className="font-medium text-foreground">Expires in 7 days</span>
                  <p className="text-[11px] text-muted-foreground">Valid until {formatExpiry(shareInfo.expiresAt)}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-border/60">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRevoke}
                disabled={revokeShareMutation.isPending}
                className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 h-9 px-3 rounded-xl"
              >
                <AppIcon icon={Delete02Icon} size={14} />
                <span>Revoke Link</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs h-9 px-4 rounded-xl border-border hover:bg-surface-muted"
              >
                Close
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="size-12 rounded-2xl bg-surface-muted border border-border mx-auto flex items-center justify-center text-foreground">
              <AppIcon icon={ShieldCheckIcon} size={24} />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="text-sm font-semibold text-foreground">
                Create a secure direct link
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct links can be opened by anyone with the URL, expire automatically in 7 days, and can be revoked at any time.
              </p>
            </div>
            <div className="pt-2">
              <Button
                onClick={handleCreate}
                disabled={createShareMutation.isPending}
                className="h-10 px-5 rounded-xl font-medium text-xs gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
              >
                <AppIcon icon={Link01Icon} size={15} />
                <span>Create Direct Link</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </ResponsiveDialog>
  )
}
