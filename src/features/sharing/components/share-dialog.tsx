import { useState } from 'react'
import { ResponsiveDialog } from '@/components/layout/responsive-dialog'
import { ShareLinkState } from './share-link-state'
import { ShareRevokeDialog } from './share-revoke-dialog'
import { useCreateShareLink, useRevokeShareLink } from '@/features/documents/hooks/use-documents'
import type { VaultDocument } from '@/types/document'
import type { ShareExpiryOption } from '../sharing.types'

export interface ShareDialogProps {
  document: VaultDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareDialog({
  document: doc,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [revokeOpen, setRevokeOpen] = useState(false)
  const createShareMutation = useCreateShareLink()
  const revokeShareMutation = useRevokeShareLink()

  if (!doc) return null

  const handleCreate = (days: ShareExpiryOption) => {
    createShareMutation.mutate({ id: doc.id, daysValid: days })
  }

  const handleConfirmRevoke = () => {
    revokeShareMutation.mutate(doc.id, {
      onSuccess: () => {
        setRevokeOpen(false)
      },
    })
  }

  return (
    <>
      <ResponsiveDialog
        open={open}
        onOpenChange={onOpenChange}
        maxWidth="md"
        title="Share Document"
        description="Create a temporary, private direct link with expiration."
      >
        <div className="space-y-4 pt-1">
          <div className="p-3 rounded-xl border border-border/80 bg-muted/20 text-xs">
            <p className="font-semibold text-foreground truncate">{doc.title}</p>
            <p className="text-[11px] text-muted-foreground truncate">{doc.originalFilename}</p>
          </div>

          <ShareLinkState
            shareInfo={doc.sharedDirectLink || null}
            onCreateLink={handleCreate}
            onRevokeClick={() => setRevokeOpen(true)}
            isCreating={createShareMutation.isPending}
          />
        </div>
      </ResponsiveDialog>

      <ShareRevokeDialog
        open={revokeOpen}
        onOpenChange={setRevokeOpen}
        onConfirm={handleConfirmRevoke}
        isRevoking={revokeShareMutation.isPending}
      />
    </>
  )
}
