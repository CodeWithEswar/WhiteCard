import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

interface ShareRevokeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isRevoking?: boolean
}

export function ShareRevokeDialog({
  open,
  onOpenChange,
  onConfirm,
  isRevoking = false,
}: ShareRevokeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border border-border bg-card p-6 shadow-xl max-w-sm">
        <AlertDialogHeader className="space-y-1.5 text-left">
          <AlertDialogTitle className="text-base font-bold text-foreground tracking-tight">
            Revoke this link?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Anyone using this link will immediately lose access to this document. You can create a new temporary link at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="pt-3 flex items-center justify-end gap-2">
          <AlertDialogCancel
            disabled={isRevoking}
            className="text-xs h-9 rounded-xl border-border"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isRevoking}
            className="text-xs h-9 px-4 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all font-medium"
          >
            {isRevoking ? 'Revoking…' : 'Revoke Link'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
