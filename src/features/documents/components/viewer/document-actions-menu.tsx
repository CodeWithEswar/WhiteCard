import {
  MoreHorizontalIcon,
  Edit01Icon,
  Download01Icon,
  Link01Icon,
  FullScreenIcon,
  MinimizeScreenIcon,
  Delete02Icon,
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
import type { VaultDocument } from '@/types/document'

interface DocumentActionsMenuProps {
  document: VaultDocument
  isFocusMode: boolean
  onEdit: () => void
  onDownload?: () => void
  onShare: () => void
  onToggleFocusMode: () => void
  onDelete: () => void
}

export function DocumentActionsMenu({
  isFocusMode,
  onEdit,
  onDownload,
  onShare,
  onToggleFocusMode,
  onDelete,
}: DocumentActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="More document actions"
            className="size-9 rounded-xl border-border/70 bg-card/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          />
        }
      >
        <AppIcon icon={MoreHorizontalIcon} size={18} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 rounded-xl text-xs">
        <DropdownMenuItem onClick={onEdit} className="gap-2 text-xs">
          <AppIcon icon={Edit01Icon} size={14} className="text-muted-foreground" />
          <span>Edit Details</span>
        </DropdownMenuItem>

        {onDownload && (
          <DropdownMenuItem onClick={onDownload} className="gap-2 text-xs">
            <AppIcon icon={Download01Icon} size={14} className="text-muted-foreground" />
            <span>Download Original</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={onShare} className="gap-2 text-xs">
          <AppIcon icon={Link01Icon} size={14} className="text-muted-foreground" />
          <span>Share Document</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onToggleFocusMode} className="gap-2 text-xs">
          <AppIcon icon={isFocusMode ? MinimizeScreenIcon : FullScreenIcon} size={14} className="text-muted-foreground" />
          <span>{isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onDelete}
          className="gap-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <AppIcon icon={Delete02Icon} size={14} />
          <span>Delete Document</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
