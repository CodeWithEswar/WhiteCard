import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Download01Icon,
  Delete02Icon,
  MoreHorizontalIcon,
  EyeIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatBytes } from '@/lib/files/format-bytes'
import { normalizeFileType, FILE_TYPE_CONFIG } from '@/lib/files/file-type'
import type { LargestStorageDocument } from '../storage.types'

interface StorageLargestFileRowProps {
  document: LargestStorageDocument
  onDelete: (id: string) => void
  onDownload: (doc: any) => void
  isDeleting?: boolean
}

export function StorageLargestFileRow({
  document: doc,
  onDelete,
  onDownload,
  isDeleting = false,
}: StorageLargestFileRowProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  const fileTypeKey = normalizeFileType(doc.originalFilename, doc.mimeType)
  const typeConfig = FILE_TYPE_CONFIG[fileTypeKey]
  const isGov = doc.space === 'government'

  const formattedDate = new Date(doc.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <>
      <div className="relative group overflow-hidden rounded-xl border border-border/60 bg-card hover:bg-muted/30 hover:border-border transition-all">
        {/* Relative Proportional Size Bar (Section 30) */}
        <div
          className="absolute inset-y-0 left-0 bg-primary/[0.04] dark:bg-primary/[0.08] pointer-events-none transition-all duration-300"
          style={{ width: `${doc.relativePercentage}%` }}
          aria-hidden="true"
        />

        <div className="relative z-10 px-3.5 py-3 flex items-center justify-between gap-3">
          {/* File Icon & Identity */}
          <Link
            to={`/app/document/${doc.id}`}
            className="flex items-center gap-3 min-w-0 flex-1 outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
          >
            <div className="size-9 rounded-xl bg-muted/50 border border-border/70 flex items-center justify-center text-foreground shrink-0 group-hover:border-border transition-colors">
              <AppIcon icon={typeConfig.icon} size={18} />
            </div>

            <div className="min-w-0 truncate space-y-0.5">
              <div className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {doc.title}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
                <span
                  className={`size-1.5 rounded-full shrink-0 ${
                    isGov ? 'bg-blue-500' : 'bg-purple-500'
                  }`}
                />
                <span className="capitalize">{doc.space}</span>
                {doc.category && (
                  <>
                    <span>•</span>
                    <span className="truncate">{doc.category}</span>
                  </>
                )}
              </div>
            </div>
          </Link>

          {/* Size, Date, Actions */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-foreground">
                {formatBytes(doc.sizeBytes)}
              </div>
              <div className="text-[10.5px] font-mono text-muted-foreground hidden sm:block">
                {formattedDate}
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="size-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    aria-label={`Options for ${doc.title}`}
                  />
                }
              >
                <AppIcon icon={MoreHorizontalIcon} size={15} />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44 rounded-xl p-1 shadow-md">
                <DropdownMenuItem
                  render={
                    <Link
                      to={`/app/document/${doc.id}`}
                      className="gap-2 text-xs cursor-pointer rounded-lg py-1.5 flex items-center"
                    />
                  }
                >
                  <AppIcon icon={EyeIcon} size={14} className="text-muted-foreground" />
                  <span>Open Document</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onDownload(doc)}
                  className="gap-2 text-xs cursor-pointer rounded-lg py-1.5"
                >
                  <AppIcon icon={Download01Icon} size={14} className="text-muted-foreground" />
                  <span>Download</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1" />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                  className="gap-2 text-xs font-medium text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-500/10 dark:focus:bg-red-500/15 cursor-pointer rounded-lg py-1.5 transition-colors"
                >
                  <AppIcon icon={Delete02Icon} size={14} className="text-red-600 dark:text-red-400 shrink-0" />
                  <span>Delete Document</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold text-foreground">
              Delete this document?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              This will delete <strong className="font-semibold text-foreground">"{doc.title}"</strong> ({formatBytes(doc.sizeBytes)}) from your White Card vault and free up storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2 pt-2">
            <AlertDialogCancel className="h-8.5 rounded-xl text-xs border-border">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(doc.id)
                setDeleteOpen(false)
              }}
              disabled={isDeleting}
              className="h-8.5 rounded-xl text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all font-medium"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
