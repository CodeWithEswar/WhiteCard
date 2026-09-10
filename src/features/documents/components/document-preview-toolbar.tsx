import {
  ZoomInIcon,
  ZoomOutIcon,
  RefreshIcon,
  Download01Icon,
  MaximizeIcon,
} from '@hugeicons/core-free-icons'
import { AppIcon } from '@/components/icons/app-icon'
import { Button } from '@/components/ui/button'

interface DocumentPreviewToolbarProps {
  zoomLevel: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  onFit: () => void
  onDownload?: () => void
  onFullscreen?: () => void
  isImage?: boolean
}

export function DocumentPreviewToolbar({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFit,
  onDownload,
  onFullscreen,
  isImage = false,
}: DocumentPreviewToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-xs text-xs">
      {/* Zoom Controls (Active primarily for images) */}
      <div className="flex items-center gap-1">
        {isImage && (
          <>
            <button
              type="button"
              onClick={onFit}
              className="px-2.5 py-1.5 rounded-xl border border-border/70 hover:bg-muted font-medium text-xs text-foreground transition-colors min-h-[36px]"
              aria-label="Fit image to screen"
            >
              Fit
            </button>

            <button
              type="button"
              onClick={onZoomOut}
              disabled={zoomLevel <= 0.5}
              aria-label="Zoom out"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <AppIcon icon={ZoomOutIcon} size={15} />
            </button>

            <span className="font-mono text-xs font-semibold px-1.5 min-w-12 text-center text-foreground tabular-nums">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              type="button"
              onClick={onZoomIn}
              disabled={zoomLevel >= 3.5}
              aria-label="Zoom in"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <AppIcon icon={ZoomInIcon} size={15} />
            </button>

            <button
              type="button"
              onClick={onResetZoom}
              aria-label="Reset zoom to 100%"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <AppIcon icon={RefreshIcon} size={14} />
            </button>
          </>
        )}
      </div>

      {/* Secondary & Download Actions */}
      <div className="flex items-center gap-1.5">
        {onFullscreen && (
          <button
            type="button"
            onClick={onFullscreen}
            aria-label="View fullscreen"
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <AppIcon icon={MaximizeIcon} size={15} />
          </button>
        )}

        {onDownload && (
          <Button
            size="sm"
            onClick={onDownload}
            variant="outline"
            className="h-8 px-3 rounded-xl text-xs font-medium gap-1.5 border-border"
          >
            <AppIcon icon={Download01Icon} size={13} />
            <span>Download</span>
          </Button>
        )}
      </div>
    </div>
  )
}
